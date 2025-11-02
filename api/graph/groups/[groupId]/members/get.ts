import { GraphClient } from '../../../../../lib/graph-client';

// @description('Request parameters')
class Request {
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Group member (user or group)')
class Member {
  // @description('Member ID')
  id: string;
  
  // @description('Display name')
  displayName?: string;
  
  // @description('User principal name')
  userPrincipalName?: string;
  
  // @description('ODatatype')
  '@odata.type': string;
}

// @description('Response containing group members')
class Response {
  // @description('Array of members')
  value: Member[];
}

// @description('Retrieves members of a group from Microsoft Graph')
// @summary('Get group members')
// @tags('microsoft-graph', 'groups')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { groupId } = req.params;
      const { top } = req.query;
      const graphClient = new GraphClient();
      const params: Record<string, string> = {};
      if (top) params.$top = top.toString();
      const result = await graphClient.get(`/groups/${groupId}/members`, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve group members'
      });
    }
  })();
}

module.exports = handler;

