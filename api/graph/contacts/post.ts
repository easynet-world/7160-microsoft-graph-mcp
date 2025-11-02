import { GraphClient } from '../../../lib/graph-client';

// @description('Request body for creating a contact')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Given name')
  givenName: string;
  
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
  
  // @description('Company name')
  companyName?: string;
  
  // @description('Job title')
  jobTitle?: string;
}

// @description('Created contact response')
class Response {
  // @description('Contact ID')
  id: string;
  
  // @description('Display name')
  displayName?: string;
  
  // @description('Given name')
  givenName: string;
}

// @description('Creates a new contact in Microsoft Graph')
// @summary('Create contact')
// @tags('microsoft-graph', 'contacts')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, ...contactData } = req.body;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/contacts` : '/me/contacts';
      const result = await graphClient.post(endpoint, contactData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to create contact'
      });
    }
  })();
}

module.exports = handler;

