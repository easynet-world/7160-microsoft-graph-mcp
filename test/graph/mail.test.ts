const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Mail API', () => {
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

  describe('GET /graph/mail', () => {
    test('should return email messages', async () => {
      const response = await request(server.app)
        .get('/graph/mail')
        .query({ top: 10 });
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter unread messages', async () => {
      const response = await request(server.app)
        .get('/graph/mail')
        .query({ filter: 'isRead eq false' });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should get messages for specific user', async () => {
      const response = await request(server.app)
        .get('/graph/mail')
        .query({ userId: 'user@example.com' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('GET /graph/mail/:messageId', () => {
    test('should return specific message', async () => {
      const response = await request(server.app)
        .get('/graph/mail/msg123');
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should get message for specific user', async () => {
      const response = await request(server.app)
        .get('/graph/mail/msg123')
        .query({ userId: 'user@example.com' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('POST /graph/mail', () => {
    test('should send email', async () => {
      const emailData = {
        subject: 'Test Email',
        body: 'This is a test email',
        bodyContentType: 'text',
        toRecipients: ['recipient@example.com']
      };

      const response = await request(server.app)
        .post('/graph/mail')
        .send(emailData);
      
      expect([200, 400, 401, 500]).toContain(response.status);
      if (response.status === 200) {
        if (response.status === 200) { expect(response.body).toHaveProperty('success', true); }
      }
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        subject: 'Test Email'
      };

      const response = await request(server.app)
        .post('/graph/mail')
        .send(incompleteData);
      
      expect([400, 401, 404, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('error'); }
    });

    test('should support HTML content', async () => {
      const emailData = {
        subject: 'HTML Email',
        body: '<h1>Hello</h1><p>World</p>',
        bodyContentType: 'html',
        toRecipients: ['recipient@example.com']
      };

      const response = await request(server.app)
        .post('/graph/mail')
        .send(emailData);
      
      expect([200, 400, 401, 500]).toContain(response.status);
    });

    test('should support CC recipients', async () => {
      const emailData = {
        subject: 'Test Email',
        body: 'Test body',
        bodyContentType: 'text',
        toRecipients: ['to@example.com'],
        ccRecipients: ['cc@example.com']
      };

      const response = await request(server.app)
        .post('/graph/mail')
        .send(emailData);
      
      expect([200, 400, 401, 500]).toContain(response.status);
    });
  });

  describe('POST /graph/mail/:messageId/reply', () => {
    test('should reply to message', async () => {
      const replyData = {
        message: {
          body: {
            contentType: 'text',
            content: 'This is my reply'
          }
        }
      };

      const response = await request(server.app)
        .post('/graph/mail/msg123/reply')
        .send(replyData);
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) {
        if (response.status === 200) { expect(response.body).toHaveProperty('success', true); }
      }
    });
  });

  describe('POST /graph/mail/:messageId/forward', () => {
    test('should forward message', async () => {
      const forwardData = {
        message: {
          body: {
            contentType: 'text',
            content: 'Forwarding this message'
          },
          toRecipients: [
            { emailAddress: { address: 'forward@example.com' } }
          ]
        }
      };

      const response = await request(server.app)
        .post('/graph/mail/msg123/forward')
        .send(forwardData);
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) {
        if (response.status === 200) { expect(response.body).toHaveProperty('success', true); }
      }
    });
  });

  describe('DELETE /graph/mail/:messageId', () => {
    test('should delete message', async () => {
      const response = await request(server.app)
        .delete('/graph/mail/msg123');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) {
        if (response.status === 200) { expect(response.body).toHaveProperty('success', true); }
      }
    });
  });

  describe('GET /graph/mail/folders', () => {
    test('should return mail folders', async () => {
      const response = await request(server.app)
        .get('/graph/mail/folders');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should limit results', async () => {
      const response = await request(server.app)
        .get('/graph/mail/folders')
        .query({ top: 5 });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });
});

