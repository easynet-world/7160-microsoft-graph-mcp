import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting contacts')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Contact from Microsoft Graph')
class Contact {
  // @description('Contact ID')
  id: string;
  
  // @description('Given name')
  givenName?: string;
  
  // @description('Surname')
  surname?: string;
  
  // @description('Display name')
  displayName?: string;
  
  // @description('Email addresses')
  emailAddresses?: Array<{
    address: string;
    name?: string;
  }>;
  
  // @description('Business phones')
  businessPhones?: string[];
  
  // @description('Mobile phone')
  mobilePhone?: string;
}

// @description('Response containing contacts')
class Response {
  // @description('Array of contacts')
  value: Contact[];
}

// @description('Retrieves contacts from Microsoft Graph API')
// @summary('Get contacts')
// @tags('microsoft-graph', 'contacts')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, filter, top } = req.query;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/contacts` : '/me/contacts';
      const params: Record<string, string> = {};
      if (filter) params.$filter = filter;
      if (top) params.$top = top.toString();
      const result = await graphClient.get(endpoint, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve contacts'
      });
    }
  })();
}

module.exports = handler;

