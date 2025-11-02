import { GraphClient } from '../../../../lib/graph-client';

// @description('Request parameters for getting a specific message')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
}

// @description('Email message from Microsoft Graph')
class Message {
  // @description('Message ID')
  id: string;
  
  // @description('Email subject')
  subject: string;
  
  // @description('Sender information')
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  
  // @description('Message body')
  body: {
    contentType: string;
    content: string;
  };
  
  // @description('Received date time')
  receivedDateTime: string;
  
  // @description('Is message read')
  isRead: boolean;
  
  // @description('Has attachments')
  hasAttachments: boolean;
}

// @description('Response containing email message')
class Response {
  // @description('Message details')
  value: Message;
}

// @description('Retrieves a specific email message by ID from Microsoft Graph')
// @summary('Get email message by ID')
// @tags('microsoft-graph', 'mail')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { messageId } = req.params;
      const { userId } = req.query;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/messages/${messageId}` : `/me/messages/${messageId}`;
      const result = await graphClient.get(endpoint);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve message'
      });
    }
  })();
}

module.exports = handler;

