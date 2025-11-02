import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting groups')
class Request {
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
  
  // @description('Comma-separated list of properties to select')
  select?: string;
}

// @description('Group from Microsoft Graph')
class Group {
  // @description('Group ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Group description')
  description?: string;
  
  // @description('Group email')
  mail: string;
  
  // @description('Group type')
  groupTypes: string[];
  
  // @description('Mail enabled')
  mailEnabled: boolean;
  
  // @description('Security enabled')
  securityEnabled: boolean;
}

// @description('Response containing groups')
class Response {
  // @description('Array of groups')
  value: Group[];
  
  // @description('OData context')
  '@odata.context': string;
}

// @description('Retrieves a list of groups from Microsoft Graph API')
// @summary('Get Microsoft Graph groups')
// @tags('microsoft-graph', 'groups')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { filter, top, select } = req.query;
      const graphClient = new GraphClient();
      const params: Record<string, string> = {};
      if (filter) params.$filter = filter;
      if (top) params.$top = top.toString();
      if (select) params.$select = select;
      const result = await graphClient.get('/groups', params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve groups'
      });
    }
  })();
}

module.exports = handler;

