import { GraphClient } from '../../../../lib/graph-client';

// @description('Request parameters')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
}

// @description('Delete message response')
class Response {
  // @description('Success status')
  success: boolean;
  
  // @description('Response message')
  message: string;
}

// @description('Deletes an email message from Microsoft Graph')
// @summary('Delete email message')
// @tags('microsoft-graph', 'mail')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { messageId } = req.params;
      const { userId } = req.query;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/messages/${messageId}` : `/me/messages/${messageId}`;
      await graphClient.delete(endpoint);
      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to delete message'
      });
    }
  })();
}

module.exports = handler;

