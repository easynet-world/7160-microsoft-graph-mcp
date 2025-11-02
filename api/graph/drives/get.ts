import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting drives')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Drive from Microsoft Graph')
class Drive {
  // @description('Drive ID')
  id: string;
  
  // @description('Drive type')
  driveType: string;
  
  // @description('Drive name')
  name: string;
  
  // @description('Owner information')
  owner?: {
    user: {
      displayName: string;
      id: string;
    };
  };
  
  // @description('Web URL')
  webUrl: string;
  
  // @description('Quota information')
  quota?: {
    total: number;
    used: number;
    remaining: number;
    deleted: number;
    state: string;
  };
}

// @description('Response containing drives')
class Response {
  // @description('Array of drives')
  value: Drive[];
}

// @description('Retrieves drives (OneDrive and SharePoint document libraries) from Microsoft Graph')
// @summary('Get drives')
// @tags('microsoft-graph', 'files')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, top } = req.query;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/drives` : '/me/drives';
      const params: Record<string, string> = {};
      if (top) params.$top = top.toString();
      const result = await graphClient.get(endpoint, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve drives'
      });
    }
  })();
}

module.exports = handler;

