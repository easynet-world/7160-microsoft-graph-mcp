/**
 * Microsoft Graph API Client
 * 
 * Handles authentication and API requests to Microsoft Graph
 * Uses MSAL (Microsoft Authentication Library) for OAuth2 authentication
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import axios, { AxiosRequestConfig } from 'axios';
import { ConfidentialClientApplication, AuthenticationResult } from '@azure/msal-node';

interface GraphClientConfig {
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  scope?: string[];
}

interface EmailMessage {
  message: {
    subject: string;
    body: {
      contentType: string;
      content: string;
    };
    toRecipients: Array<{
      emailAddress: {
        address: string;
        name?: string;
      };
    }>;
    ccRecipients?: Array<{
      emailAddress: {
        address: string;
        name?: string;
      };
    }>;
    attachments?: any[];
  };
}

export class GraphClient {
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;
  private scope: string[];
  private apiBaseUrl: string;
  private clientApp: ConfidentialClientApplication;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(config: GraphClientConfig = {}) {
    // Load from config parameter, then environment variables, then empty string
    this.clientId = config.clientId || process.env.AZURE_CLIENT_ID || '';
    this.clientSecret = config.clientSecret || process.env.AZURE_CLIENT_SECRET || '';
    this.tenantId = config.tenantId || process.env.AZURE_TENANT_ID || '';
    
    // Handle scope - can be a string from env or array
    const scopeEnv = process.env.AZURE_SCOPE;
    if (config.scope) {
      this.scope = config.scope;
    } else if (scopeEnv) {
      // If scope is a comma-separated string, split it; otherwise use as single scope
      this.scope = scopeEnv.includes(',') ? scopeEnv.split(',').map(s => s.trim()) : [scopeEnv];
    } else {
      this.scope = ['https://graph.microsoft.com/.default'];
    }
    
    this.apiBaseUrl = 'https://graph.microsoft.com/v1.0';
    
    // Validate required credentials
    if (!this.clientId || !this.clientSecret || !this.tenantId) {
      const missingVars = [];
      if (!this.clientId) missingVars.push('AZURE_CLIENT_ID');
      if (!this.clientSecret) missingVars.push('AZURE_CLIENT_SECRET');
      if (!this.tenantId) missingVars.push('AZURE_TENANT_ID');
      
      throw new Error(
        `Missing required Azure credentials: ${missingVars.join(', ')}\n` +
        `Please set these in your .env file or as environment variables.\n` +
        `See .env.example for configuration template.`
      );
    }

    // Initialize MSAL
    const msalConfig = {
      auth: {
        clientId: this.clientId,
        authority: `https://login.microsoftonline.com/${this.tenantId}`,
        clientSecret: this.clientSecret,
      },
    };

    this.clientApp = new ConfidentialClientApplication(msalConfig);
  }

  /**
   * Get access token (with caching)
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    try {
      const tokenRequest = {
        scopes: this.scope,
      };

      const response: AuthenticationResult | null = await this.clientApp.acquireTokenByClientCredential(tokenRequest);
      
      if (!response || !response.accessToken) {
        throw new Error('Failed to acquire access token');
      }

      this.accessToken = response.accessToken;
      // Set expiry time (subtract 5 minutes for safety)
      // expiresOn is a Date object
      if (response.expiresOn) {
        this.tokenExpiresAt = response.expiresOn.getTime() - 300000; // Refresh 5 minutes early
      } else {
        // Default to 1 hour if expiresOn is not available
        this.tokenExpiresAt = Date.now() + (3600 * 1000) - 300000;
      }
      
      return this.accessToken;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Make a request to Microsoft Graph API
   */
  async request(method: string, endpoint: string, data: any = null, headers: Record<string, string> = {}): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const url = endpoint.startsWith('http') ? endpoint : `${this.apiBaseUrl}${endpoint}`;
      
      const config: AxiosRequestConfig = {
        method,
        url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Graph API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * GET request
   */
  async get(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request('GET', url);
  }

  /**
   * POST request
   */
  async post(endpoint: string, data: any): Promise<any> {
    return this.request('POST', endpoint, data);
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data: any): Promise<any> {
    return this.request('PATCH', endpoint, data);
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data: any): Promise<any> {
    return this.request('PUT', endpoint, data);
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string): Promise<any> {
    return this.request('DELETE', endpoint);
  }

  // Convenience methods for common Graph operations

  /**
   * Get users
   */
  async getUsers(filter: string | null = null, top: number | null = null, select: string | null = null): Promise<any> {
    const params: Record<string, string> = {};
    if (filter) params.$filter = filter;
    if (top) params.$top = top.toString();
    if (select) params.$select = select;
    return this.get('/users', params);
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<any> {
    return this.get(`/users/${userId}`);
  }

  /**
   * Get current user
   */
  async getMe(): Promise<any> {
    return this.get('/me');
  }

  /**
   * Get user's messages
   */
  async getMessages(userId: string | null = null, filter: string | null = null, top: number | null = null): Promise<any> {
    const endpoint = userId ? `/users/${userId}/messages` : '/me/messages';
    const params: Record<string, string> = {};
    if (filter) params.$filter = filter;
    if (top) params.$top = top.toString();
    return this.get(endpoint, params);
  }

  /**
   * Get user's calendar events
   */
  async getCalendarEvents(userId: string | null = null, filter: string | null = null, top: number | null = null): Promise<any> {
    const endpoint = userId ? `/users/${userId}/calendar/events` : '/me/calendar/events';
    const params: Record<string, string> = {};
    if (filter) params.$filter = filter;
    if (top) params.$top = top.toString();
    return this.get(endpoint, params);
  }

  /**
   * Get user's drive/files
   */
  async getDriveItems(userId: string | null = null, itemPath: string | null = null): Promise<any> {
    let endpoint = userId ? `/users/${userId}/drive/root` : '/me/drive/root';
    if (itemPath) {
      endpoint += `:/${itemPath}:`;
    }
    endpoint += '/children';
    return this.get(endpoint);
  }

  /**
   * Send an email
   */
  async sendMail(message: EmailMessage['message'], userId: string | null = null): Promise<any> {
    const endpoint = userId ? `/users/${userId}/sendMail` : '/me/sendMail';
    return this.post(endpoint, { message });
  }
}

