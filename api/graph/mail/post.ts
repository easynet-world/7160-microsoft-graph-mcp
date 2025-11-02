import { GraphClient } from '../../../lib/graph-client';

// @description('Email message request body')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Email subject')
  subject: string;
  
  // @description('Email body content')
  body: string;
  
  // @description('Email body content type (text or html)')
  bodyContentType: 'text' | 'html';
  
  // @description('Recipient email addresses')
  toRecipients: string[];
  
  // @description('CC recipient email addresses (optional)')
  ccRecipients?: string[];
}

// @description('Send email response')
class Response {
  // @description('Success status')
  success: boolean;
  
  // @description('Response message')
  message: string;
}

// @description('Sends an email message using Microsoft Graph Mail API. Supports HTML and plain text content.')
// @summary('Send email message')
// @tags('microsoft-graph', 'mail')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, subject, body, bodyContentType, toRecipients, ccRecipients } = req.body;

      if (!subject || !body || !bodyContentType || !toRecipients || toRecipients.length === 0) {
        return res.status(400).json({
          error: 'Missing required fields: subject, body, bodyContentType, and toRecipients are required'
        });
      }

      const graphClient = new GraphClient();

      const message = {
        subject,
        body: {
          contentType: bodyContentType === 'html' ? 'HTML' : 'Text',
          content: body
        },
        toRecipients: toRecipients.map((email: string) => ({
          emailAddress: {
            address: email
          }
        })),
        ...(ccRecipients && ccRecipients.length > 0 && {
          ccRecipients: ccRecipients.map((email: string) => ({
            emailAddress: {
              address: email
            }
          }))
        })
      };

      await graphClient.sendMail(message, userId || null);

      res.json({
        success: true,
        message: 'Email sent successfully'
      });
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to send email'
      });
    }
  })();
}

module.exports = handler;
