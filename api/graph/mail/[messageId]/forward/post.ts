import { GraphClient } from '../../../../../lib/graph-client';

// @description('Request body for forwarding a message')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Forward message content')
  message: {
    // @description('Forward body')
    body: {
      contentType: 'text' | 'html';
      content: string;
    };
    // @description('Recipients to forward to')
    toRecipients: Array<{
      emailAddress: {
        address: string;
        name?: string;
      };
    }>;
    // @description('Additional recipients (optional)')
    ccRecipients?: Array<{
      emailAddress: {
        address: string;
        name?: string;
      };
    }>;
  };
  // @description('Comment to include in forward (optional)')
  comment?: string;
}

// @description('Forward message response')
class Response {
  // @description('Success status')
  success: boolean;
  
  // @description('Response message')
  message: string;
}

// @description('Forwards an email message in Microsoft Graph')
// @summary('Forward email message')
// @tags('microsoft-graph', 'mail')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { messageId } = req.params;
      const { userId, message, comment } = req.body;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/messages/${messageId}/forward` : `/me/messages/${messageId}/forward`;
      await graphClient.post(endpoint, { message, comment });
      res.json({
        success: true,
        message: 'Message forwarded successfully'
      });
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to forward message'
      });
    }
  })();
}

module.exports = handler;

