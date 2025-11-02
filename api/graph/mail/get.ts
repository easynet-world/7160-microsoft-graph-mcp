import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting email messages')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
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
  
  // @description('Received date time')
  receivedDateTime: string;
  
  // @description('Is message read')
  isRead: boolean;
  
  // @description('Has attachments')
  hasAttachments: boolean;
  
  // @description('Body preview')
  bodyPreview: string;
}

// @description('Response containing email messages')
class Response {
  // @description('Array of messages')
  value: Message[];
  
  // @description('OData context')
  '@odata.context': string;
}

// @description('Retrieves email messages from Microsoft Graph Mail API. Supports filtering and pagination.')
// @summary('Get email messages')
// @tags('microsoft-graph', 'mail')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, filter, top } = req.query;
      
      const graphClient = new GraphClient();
      const result = await graphClient.getMessages(
        userId || null, 
        filter || null, 
        top ? parseInt(top as string) : null
      );
      
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve messages'
      });
    }
  })();
}

module.exports = handler;
