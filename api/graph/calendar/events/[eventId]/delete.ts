import { GraphClient } from '../../../../lib/graph-client';

// @description('Request parameters for deleting an event')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
}

// @description('Delete event response')
class Response {
  // @description('Success status')
  success: boolean;
  
  // @description('Response message')
  message: string;
}

// @description('Deletes a calendar event from Microsoft Graph')
// @summary('Delete calendar event')
// @tags('microsoft-graph', 'calendar')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { eventId } = req.params;
      const { userId } = req.query; // Changed from req.body to req.query
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/calendar/events/${eventId}` : `/me/calendar/events/${eventId}`;
      await graphClient.delete(endpoint);
      res.json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to delete calendar event'
      });
    }
  })();
}

module.exports = handler;

