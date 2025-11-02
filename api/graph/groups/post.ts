import { GraphClient } from '../../../lib/graph-client';

// @description('Request body for creating a group')
class Request {
  // @description('Display name')
  displayName: string;
  
  // @description('Group description')
  description?: string;
  
  // @description('Mail nickname')
  mailNickname: string;
  
  // @description('Group types')
  groupTypes: string[];
  
  // @description('Mail enabled')
  mailEnabled: boolean;
  
  // @description('Security enabled')
  securityEnabled: boolean;
  
  // @description('Owners (user IDs)')
  owners?: string[];
  
  // @description('Members (user IDs)')
  members?: string[];
}

// @description('Created group response')
class Response {
  // @description('Group ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Mail')
  mail: string;
  
  // @description('Mail enabled')
  mailEnabled: boolean;
  
  // @description('Security enabled')
  securityEnabled: boolean;
}

// @description('Creates a new group in Microsoft Graph')
// @summary('Create group')
// @tags('microsoft-graph', 'groups')
function handler(req: any, res: any) {
  (async () => {
    try {
      const groupData = req.body;
      const graphClient = new GraphClient();
      const result = await graphClient.post('/groups', groupData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to create group'
      });
    }
  })();
}

module.exports = handler;

