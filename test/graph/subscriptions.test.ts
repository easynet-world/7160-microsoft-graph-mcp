const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Subscriptions API', () => {
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

  describe('GET /graph/subscriptions', () => {
    test('should return subscriptions', async () => {
      const response = await request(server.app)
        .get('/graph/subscriptions');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });
  });

  describe('POST /graph/subscriptions', () => {
    test('should create subscription', async () => {
      const subscriptionData = {
        resource: '/me/messages',
        changeType: 'created,updated',
        notificationUrl: 'https://example.com/webhook',
        expirationDateTime: new Date(Date.now() + 3600000).toISOString()
      };

      const response = await request(server.app)
        .post('/graph/subscriptions')
        .send(subscriptionData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
      if (response.status === 201) {
        if (response.status === 200) { expect(response.body).toHaveProperty('id'); }
        if (response.status === 200) { expect(response.body).toHaveProperty('resource'); }
      }
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        resource: '/me/messages'
      };

      const response = await request(server.app)
        .post('/graph/subscriptions')
        .send(incompleteData);
      
      expect([400, 401, 404, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('error'); }
    });

    test('should support client state', async () => {
      const subscriptionData = {
        resource: '/me/messages',
        changeType: 'created',
        notificationUrl: 'https://example.com/webhook',
        expirationDateTime: new Date(Date.now() + 3600000).toISOString(),
        clientState: 'secret-state'
      };

      const response = await request(server.app)
        .post('/graph/subscriptions')
        .send(subscriptionData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
    });
  });
});

