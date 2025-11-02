import { GraphClient } from '../../../lib/graph-client';

// @description('Request body for creating a new user')
class Request {
  // @description('Account enabled status')
  accountEnabled: boolean;
  
  // @description('Display name')
  displayName: string;
  
  // @description('User principal name (email)')
  userPrincipalName: string;
  
  // @description('Mail nickname')
  mailNickname: string;
  
  // @description('Password profile')
  passwordProfile: {
    password: string;
    forceChangePasswordNextSignIn?: boolean;
  };
  
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
}

// @description('Created user response')
class Response {
  // @description('User ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('User principal name')
  userPrincipalName: string;
  
  // @description('Account enabled')
  accountEnabled: boolean;
  
  // @description('Mail')
  mail: string;
}

// @description('Creates a new user in Microsoft Graph. Requires appropriate permissions.')
// @summary('Create user')
// @tags('microsoft-graph', 'users')
function handler(req: any, res: any) {
  (async () => {
    try {
      const userData = req.body;
      const graphClient = new GraphClient();
      const result = await graphClient.post('/users', userData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to create user'
      });
    }
  })();
}

module.exports = handler;

