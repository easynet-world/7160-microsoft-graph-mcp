import { GraphClient } from '../../../lib/graph-client';

// @description('Subscription from Microsoft Graph')
class Subscription {
  // @description('Subscription ID')
  id: string;
  
  // @description('Resource to monitor')
  resource: string;
  
  // @description('Change type')
  changeType: string;
  
  // @description('Notification URL')
  notificationUrl: string;
  
  // @description('Expiration date time')
  expirationDateTime: string;
  
  // @description('Client state')
  clientState?: string;
  
  // @description('Notification query options')
  notificationQueryOptions?: string;
}

// @description('Response containing subscriptions')
class Response {
  // @description('Array of subscriptions')
  value: Subscription[];
}

// @description('Retrieves webhook subscriptions from Microsoft Graph API')
// @summary('Get subscriptions')
// @tags('microsoft-graph', 'subscriptions')
function handler(req: any, res: any) {
  (async () => {
    try {
      const graphClient = new GraphClient();
      const result = await graphClient.get('/subscriptions');
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve subscriptions'
      });
    }
  })();
}

module.exports = handler;

