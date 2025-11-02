import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting calendars')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Calendar from Microsoft Graph')
class Calendar {
  // @description('Calendar ID')
  id: string;
  
  // @description('Calendar name')
  name: string;
  
  // @description('Calendar color')
  color: string;
  
  // @description('Can share')
  canShare: boolean;
  
  // @description('Can view private items')
  canViewPrivateItems: boolean;
  
  // @description('Can edit')
  canEdit: boolean;
  
  // @description('Owner email')
  owner?: {
    name: string;
    address: string;
  };
}

// @description('Response containing calendars')
class Response {
  // @description('Array of calendars')
  value: Calendar[];
}

// @description('Retrieves calendars from Microsoft Graph Calendar API')
// @summary('Get calendars')
// @tags('microsoft-graph', 'calendar')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, top } = req.query;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/calendars` : '/me/calendars';
      const params: Record<string, string> = {};
      if (top) params.$top = top.toString();
      const result = await graphClient.get(endpoint, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve calendars'
      });
    }
  })();
}

module.exports = handler;

