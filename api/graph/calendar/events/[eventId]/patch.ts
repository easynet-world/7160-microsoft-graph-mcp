import { GraphClient } from '../../../../lib/graph-client';

// @description('Request body for updating a calendar event')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Event subject')
  subject?: string;
  
  // @description('Event body')
  body?: {
    contentType: 'text' | 'html';
    content: string;
  };
  
  // @description('Event start time')
  start?: {
    dateTime: string;
    timeZone: string;
  };
  
  // @description('Event end time')
  end?: {
    dateTime: string;
    timeZone: string;
  };
  
  // @description('Event location')
  location?: {
    displayName: string;
  };
}

// @description('Updated calendar event response')
class Response {
  // @description('Event ID')
  id: string;
  
  // @description('Event subject')
  subject: string;
}

// @description('Updates an existing calendar event in Microsoft Graph')
// @summary('Update calendar event')
// @tags('microsoft-graph', 'calendar')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { eventId } = req.params;
      const { userId, ...updateData } = req.body;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/calendar/events/${eventId}` : `/me/calendar/events/${eventId}`;
      const result = await graphClient.patch(endpoint, updateData);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to update calendar event'
      });
    }
  })();
}

module.exports = handler;

