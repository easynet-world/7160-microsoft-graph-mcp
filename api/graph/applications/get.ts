import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting applications')
class Request {
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
  
  // @description('Comma-separated list of properties to select')
  select?: string;
}

// @description('Application from Microsoft Graph')
class Application {
  // @description('Application ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Application ID (client ID)')
  appId: string;
  
  // @description('Application identifier URIs')
  identifierUris?: string[];
  
  // @description('Sign in audience')
  signInAudience?: string;
  
  // @description('Created date time')
  createdDateTime: string;
}

// @description('Response containing applications')
class Response {
  // @description('Array of applications')
  value: Application[];
  
  // @description('OData context')
  '@odata.context': string;
}

// @description('Retrieves a list of applications from Microsoft Graph API')
// @summary('Get applications')
// @tags('microsoft-graph', 'applications')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { filter, top, select } = req.query;
      const graphClient = new GraphClient();
      const params: Record<string, string> = {};
      if (filter) params.$filter = filter;
      if (top) params.$top = top.toString();
      if (select) params.$select = select;
      const result = await graphClient.get('/applications', params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve applications'
      });
    }
  })();
}

module.exports = handler;

