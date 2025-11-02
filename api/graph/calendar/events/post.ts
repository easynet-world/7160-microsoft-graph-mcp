import { GraphClient } from '../../../lib/graph-client';

// @description('Request body for creating a calendar event')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Event subject')
  subject: string;
  
  // @description('Event body')
  body: {
    contentType: 'text' | 'html';
    content: string;
  };
  
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
    address?: {
      street?: string;
      city?: string;
      state?: string;
      countryOrRegion?: string;
      postalCode?: string;
    };
  };
  
  // @description('Attendees')
  attendees?: Array<{
    emailAddress: {
      address: string;
      name?: string;
    };
    type: 'required' | 'optional' | 'resource';
  }>;
  
  // @description('Is all day event')
  isAllDay?: boolean;
  
  // @description('Is reminder on')
  isReminderOn?: boolean;
  
  // @description('Reminder minutes before start')
  reminderMinutesBeforeStart?: number;
}

// @description('Created calendar event response')
class Response {
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
}

// @description('Creates a new calendar event in Microsoft Graph')
// @summary('Create calendar event')
// @tags('microsoft-graph', 'calendar')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, ...eventData } = req.body;
      const graphClient = new GraphClient();
      const endpoint = userId ? `/users/${userId}/calendar/events` : '/me/calendar/events';
      const result = await graphClient.post(endpoint, eventData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to create calendar event'
      });
    }
  })();
}

module.exports = handler;

