import { GraphClient } from '../../../lib/graph-client';

// @description('Request body for creating a subscription')
class Request {
  // @description('Resource to monitor (e.g., "/me/messages")')
  resource: string;
  
  // @description('Change types to monitor')
  changeType: string;
  
  // @description('Notification URL (webhook endpoint)')
  notificationUrl: string;
  
  // @description('Expiration date time (ISO 8601 format)')
  expirationDateTime: string;
  
  // @description('Client state (optional, for verification)')
  clientState?: string;
  
  // @description('Notification query options (optional)')
  notificationQueryOptions?: string;
}

// @description('Created subscription response')
class Response {
  // @description('Subscription ID')
  id: string;
  
  // @description('Resource')
  resource: string;
  
  // @description('Change type')
  changeType: string;
  
  // @description('Notification URL')
  notificationUrl: string;
  
  // @description('Expiration date time')
  expirationDateTime: string;
}

// @description('Creates a webhook subscription in Microsoft Graph for change notifications')
// @summary('Create subscription')
// @tags('microsoft-graph', 'subscriptions')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { resource, changeType, notificationUrl, expirationDateTime, clientState, notificationQueryOptions } = req.body;
      
      if (!resource || !changeType || !notificationUrl || !expirationDateTime) {
        return res.status(400).json({
          error: 'Missing required fields: resource, changeType, notificationUrl, and expirationDateTime are required'
        });
      }

      const graphClient = new GraphClient();
      const subscriptionData: any = {
        resource,
        changeType,
        notificationUrl,
        expirationDateTime
      };
      if (clientState) subscriptionData.clientState = clientState;
      if (notificationQueryOptions) subscriptionData.notificationQueryOptions = notificationQueryOptions;
      
      const result = await graphClient.post('/subscriptions', subscriptionData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to create subscription'
      });
    }
  })();
}

module.exports = handler;

