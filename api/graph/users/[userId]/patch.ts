import { GraphClient } from '../../../../lib/graph-client';

// @description('Request body for updating a user')
class Request {
  // @description('Display name')
  displayName?: string;
  
  // @description('Given name')
  givenName?: string;
  
  // @description('Surname')
  surname?: string;
  
  // @description('Job title')
  jobTitle?: string;
  
  // @description('Department')
  department?: string;
  
  // @description('Office location')
  officeLocation?: string;
  
  // @description('Account enabled status')
  accountEnabled?: boolean;
  
  // @description('Business phones')
  businessPhones?: string[];
  
  // @description('Mobile phone')
  mobilePhone?: string;
}

// @description('Updated user response')
class Response {
  // @description('User ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('User principal name')
  userPrincipalName: string;
}

// @description('Updates an existing user in Microsoft Graph')
// @summary('Update user')
// @tags('microsoft-graph', 'users')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const graphClient = new GraphClient();
      const result = await graphClient.patch(`/users/${userId}`, updateData);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to update user'
      });
    }
  })();
}

module.exports = handler;

