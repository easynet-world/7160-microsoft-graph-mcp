import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting directory objects')
class Request {
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Directory object from Microsoft Graph')
class DirectoryObject {
  // @description('Object ID')
  id: string;
  
  // @description('ODatatype')
  '@odata.type': string;
  
  // @description('Deleted date time')
  deletedDateTime?: string;
}

// @description('Response containing directory objects')
class Response {
  // @description('Array of directory objects')
  value: DirectoryObject[];
}

// @description('Retrieves directory objects from Microsoft Graph API')
// @summary('Get directory objects')
// @tags('microsoft-graph', 'directory')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { filter, top } = req.query;
      const graphClient = new GraphClient();
      const params: Record<string, string> = {};
      if (filter) params.$filter = filter;
      if (top) params.$top = top.toString();
      const result = await graphClient.get('/directoryObjects', params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve directory objects'
      });
    }
  })();
}

module.exports = handler;

