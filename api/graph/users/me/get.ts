import { GraphClient } from '../../../../lib/graph-client';

// @description('Current user information')
class Response {
  // @description('User ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Email address')
  mail: string;
  
  // @description('User principal name')
  userPrincipalName: string;
  
  // @description('Job title')
  jobTitle?: string;
  
  // @description('Office location')
  officeLocation?: string;
  
  // @description('Department')
  department?: string;
}

// @description('Retrieves information about the currently authenticated user from Microsoft Graph API')
// @summary('Get current user')
// @tags('microsoft-graph', 'users')
function handler(req: any, res: any) {
  (async () => {
    try {
      const graphClient = new GraphClient();
      const result = await graphClient.getMe();
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve current user'
      });
    }
  })();
}

module.exports = handler;
