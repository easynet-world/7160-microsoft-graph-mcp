import { GraphClient } from '../../../lib/graph-client';

// @description('Organization from Microsoft Graph')
class Organization {
  // @description('Organization ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Verified domains')
  verifiedDomains: Array<{
    name: string;
    type: string;
    isDefault: boolean;
  }>;
  
  // @description('Business phones')
  businessPhones: string[];
  
  // @description('City')
  city?: string;
  
  // @description('Country')
  country?: string;
  
  // @description('Postal code')
  postalCode?: string;
}

// @description('Response containing organizations')
class Response {
  // @description('Array of organizations')
  value: Organization[];
}

// @description('Retrieves organization information from Microsoft Graph API')
// @summary('Get organization')
// @tags('microsoft-graph', 'organization')
function handler(req: any, res: any) {
  (async () => {
    try {
      const graphClient = new GraphClient();
      const result = await graphClient.get('/organization');
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve organization'
      });
    }
  })();
}

module.exports = handler;

