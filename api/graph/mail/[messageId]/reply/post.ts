import { GraphClient } from '../../../../../lib/graph-client';

// @description('Request body for replying to a message')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Reply message content')
  message: {
    // @description('Reply body')
    body: {
      contentType: 'text' | 'html';
      content: string;
    };
    // @description('Additional recipients (optional)')
    toRecipients?: Array<{
      emailAddress: {
        address: string;
        name?: string;
      };
    }>;
  };
  // @description('Comment to include in reply (optional)')
  comment?: string;
}

// @description('Reply message response')
class Response {
  // @description('Success status')
  success: boolean;
  
  // @description('Response message')
  message: string;
}

// @description('Replies to an email message in Microsoft Graph')
// @summary('Reply to email message')
// @tags('microsoft-graph', 'mail')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { messageId } = req.params;
      const { userId, message, comment } = req.body;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/messages/${messageId}/reply` : `/me/messages/${messageId}/reply`;
      await graphClient.post(endpoint, { message, comment });
      res.json({
        success: true,
        message: 'Reply sent successfully'
      });
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to send reply'
      });
    }
  })();
}

module.exports = handler;

