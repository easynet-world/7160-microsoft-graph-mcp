import { GraphClient } from '../../../../../lib/graph-client';

// @description('Request parameters')
class Request {
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Team channel from Microsoft Graph')
class Channel {
  // @description('Channel ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Channel description')
  description?: string;
  
  // @description('Is channel by default')
  isFavoriteByDefault?: boolean;
  
  // @description('Email')
  email?: string;
  
  // @description('Web URL')
  webUrl?: string;
  
  // @description('Membership type')
  membershipType?: 'standard' | 'private' | 'shared';
}

// @description('Response containing team channels')
class Response {
  // @description('Array of channels')
  value: Channel[];
}

// @description('Retrieves channels of a team from Microsoft Graph')
// @summary('Get team channels')
// @tags('microsoft-graph', 'teams')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { teamId } = req.params;
      const { top } = req.query;
      const graphClient = new GraphClient();
      const params: Record<string, string> = {};
      if (top) params.$top = top.toString();
      const result = await graphClient.get(`/teams/${teamId}/channels`, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve team channels'
      });
    }
  })();
}

module.exports = handler;

