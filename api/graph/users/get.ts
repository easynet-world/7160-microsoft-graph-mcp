import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting users')
class Request {
  // @description('OData filter expression (e.g., "displayName eq \'John\'")')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
  
  // @description('Comma-separated list of properties to select')
  select?: string;
  
  // @description('Specific user ID to retrieve (optional, returns single user)')
  userId?: string;
}

// @description('Microsoft Graph user object')
class User {
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
}

// @description('Response containing users list')
class Response {
  // @description('Array of users')
  value: User[];
  
  // @description('OData context')
  '@odata.context': string;
}

// @description('Retrieves a list of users from Microsoft Graph API. Supports filtering, pagination, and property selection.')
// @summary('Get Microsoft Graph users')
// @tags('microsoft-graph', 'users')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { filter, top, select, userId } = req.query;
      
      const graphClient = new GraphClient();

      let result;
      if (userId) {
        // Get specific user
        result = await graphClient.getUser(userId as string);
      } else {
        // Get users list
        result = await graphClient.getUsers(
          filter || null, 
          top ? parseInt(top as string) : null, 
          select || null
        );
      }

      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve users'
      });
    }
  })();
}

module.exports = handler;
