import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting people')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
  
  // @description('Search query')
  search?: string;
}

// @description('Person from Microsoft Graph')
class Person {
  // @description('Person ID')
  id: string;
  
  // @description('Display name')
  displayName: string;
  
  // @description('Given name')
  givenName?: string;
  
  // @description('Surname')
  surname?: string;
  
  // @description('Job title')
  jobTitle?: string;
  
  // @description('Company name')
  companyName?: string;
  
  // @description('Email addresses')
  emails?: string[];
  
  // @description('Business phones')
  phones?: Array<{
    type: string;
    number: string;
  }>;
  
  // @description('Office location')
  officeLocation?: string;
}

// @description('Response containing people')
class Response {
  // @description('Array of people')
  value: Person[];
}

// @description('Retrieves people (colleagues and contacts) from Microsoft Graph API')
// @summary('Get people')
// @tags('microsoft-graph', 'people')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, filter, top, search } = req.query;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/people` : '/me/people';
      const params: Record<string, string> = {};
      if (filter) params.$filter = filter;
      if (top) params.$top = top.toString();
      if (search) params.$search = search;
      const result = await graphClient.get(endpoint, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve people'
      });
    }
  })();
}

module.exports = handler;

