import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting teams')
class Request {
  // @description('Maximum number of results to return')
  top?: number;
  
  // @description('OData filter expression')
  filter?: string;
}

// @description('Team from Microsoft Graph')
class Team {
  // @description('Team ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Team description')
  description?: string;
  
  // @description('Internal ID')
  internalId?: string;
  
  // @description('Classification')
  classification?: string;
  
  // @description('Visibility')
  visibility?: 'private' | 'public';
}

// @description('Response containing teams')
class Response {
  // @description('Array of teams')
  value: Team[];
}

// @description('Retrieves a list of teams from Microsoft Graph API')
// @summary('Get Microsoft Teams')
// @tags('microsoft-graph', 'teams')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { top, filter } = req.query;
      const graphClient = new GraphClient();
      const params: Record<string, string> = {};
      if (top) params.$top = top.toString();
      if (filter) params.$filter = filter;
      const result = await graphClient.get('/teams', params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve teams'
      });
    }
  })();
}

module.exports = handler;

