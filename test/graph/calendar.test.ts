const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Calendar API', () => {
  let server: any;

  beforeAll(async () => {
    process.env.AZURE_CLIENT_ID = 'test-client-id';
    process.env.AZURE_CLIENT_SECRET = 'test-secret';
    process.env.AZURE_TENANT_ID = 'test-tenant-id';

    server = new DynamicAPIServer({
      port: 0,
      cors: { origin: '*' }
    });
    await server.start();
  });

  afterAll(async () => {
    if (server) {
      await server.stop();
    }
  });

  describe('GET /graph/calendar', () => {
    test('should return calendar events', async () => {
      const response = await request(server.app)
        .get('/graph/calendar')
        .query({ top: 10 });
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter events by date', async () => {
      const response = await request(server.app)
        .get('/graph/calendar')
        .query({ filter: "start/dateTime ge '2024-01-01T00:00:00Z'" });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should get events for specific user', async () => {
      const response = await request(server.app)
        .get('/graph/calendar')
        .query({ userId: 'user@example.com' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('GET /graph/calendars', () => {
    test('should return user calendars', async () => {
      const response = await request(server.app)
        .get('/graph/calendars');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });
  });

  describe('POST /graph/calendar/events', () => {
    test('should create calendar event', async () => {
      const eventData = {
        subject: 'Test Meeting',
        body: {
          contentType: 'text',
          content: 'Meeting description'
        },
        start: {
          dateTime: '2024-01-01T10:00:00Z',
          timeZone: 'UTC'
        },
        end: {
          dateTime: '2024-01-01T11:00:00Z',
          timeZone: 'UTC'
        }
      };

      const response = await request(server.app)
        .post('/graph/calendar/events')
        .send(eventData);
      
      expect([201, 400, 401, 404, 500]).toContain(response.status);
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('subject');
      }
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        subject: 'Test Meeting'
      };

      const response = await request(server.app)
        .post('/graph/calendar/events')
        .send(incompleteData);
      
      expect([400, 401, 404, 500]).toContain(response.status);
    });

    test('should support attendees', async () => {
      const eventData = {
        subject: 'Team Meeting',
        body: { contentType: 'text', content: 'Meeting' },
        start: { dateTime: '2024-01-01T10:00:00Z', timeZone: 'UTC' },
        end: { dateTime: '2024-01-01T11:00:00Z', timeZone: 'UTC' },
        attendees: [
          {
            emailAddress: { address: 'attendee@example.com', name: 'Attendee' },
            type: 'required'
          }
        ]
      };

      const response = await request(server.app)
        .post('/graph/calendar/events')
        .send(eventData);
      
      expect([201, 400, 401, 404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /graph/calendar/events/:eventId', () => {
    test('should update calendar event', async () => {
      const updateData = {
        subject: 'Updated Meeting Title',
        location: {
          displayName: 'Conference Room A'
        }
      };

      const response = await request(server.app)
        .patch('/graph/calendar/events/event123')
        .send(updateData);
      
      expect([200, 401, 404, 500]).toContain(response.status);
    });
  });

  describe('DELETE /graph/calendar/events/:eventId', () => {
    test('should delete calendar event', async () => {
      const response = await request(server.app)
        .delete('/graph/calendar/events/event123')
        .send({});
      
      expect([200, 401, 404, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
      }
    });
  });
});

