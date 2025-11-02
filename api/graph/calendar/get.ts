import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting calendar events')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Calendar event from Microsoft Graph')
class CalendarEvent {
  // @description('Event ID')
  id: string;
  
  // @description('Event subject')
  subject: string;
  
  // @description('Event start time')
  start: {
    dateTime: string;
    timeZone: string;
  };
  
  // @description('Event end time')
  end: {
    dateTime: string;
    timeZone: string;
  };
  
  // @description('Event location')
  location?: {
    displayName: string;
  };
  
  // @description('Is all day event')
  isAllDay: boolean;
  
  // @description('Event body preview')
  bodyPreview: string;
}

// @description('Response containing calendar events')
class Response {
  // @description('Array of calendar events')
  value: CalendarEvent[];
  
  // @description('OData context')
  '@odata.context': string;
}

// @description('Retrieves calendar events from Microsoft Graph Calendar API. Supports filtering and pagination.')
// @summary('Get calendar events')
// @tags('microsoft-graph', 'calendar')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, filter, top } = req.query;
      
      const graphClient = new GraphClient();
      const result = await graphClient.getCalendarEvents(
        userId || null, 
        filter || null, 
        top ? parseInt(top as string) : null
      );
      
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve calendar events'
      });
    }
  })();
}

module.exports = handler;
