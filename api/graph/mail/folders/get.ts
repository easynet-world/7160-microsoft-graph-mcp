import { GraphClient } from '../../../../lib/graph-client';

// @description('Request parameters for getting mail folders')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Mail folder from Microsoft Graph')
class MailFolder {
  // @description('Folder ID')
  id: string;
  
  // @description('Folder display name')
  displayName: string;
  
  // @description('Total item count')
  totalItemCount: number;
  
  // @description('Unread item count')
  unreadItemCount: number;
  
  // @description('Child folder count')
  childFolderCount: number;
}

// @description('Response containing mail folders')
class Response {
  // @description('Array of mail folders')
  value: MailFolder[];
}

// @description('Retrieves mail folders from Microsoft Graph Mail API')
// @summary('Get mail folders')
// @tags('microsoft-graph', 'mail')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, top } = req.query;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/mailFolders` : '/me/mailFolders';
      const params: Record<string, string> = {};
      if (top) params.$top = top.toString();
      const result = await graphClient.get(endpoint, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve mail folders'
      });
    }
  })();
}

module.exports = handler;

