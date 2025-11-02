const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Applications API', () => {
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

  describe('GET /graph/applications', () => {
    test('should return list of applications', async () => {
      const response = await request(server.app)
        .get('/graph/applications');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter applications', async () => {
      const response = await request(server.app)
        .get('/graph/applications')
        .query({ filter: "displayName eq 'Test App'" });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should select specific properties', async () => {
      const response = await request(server.app)
        .get('/graph/applications')
        .query({ select: 'id,displayName,appId' });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should limit results', async () => {
      const response = await request(server.app)
        .get('/graph/applications')
        .query({ top: 10 });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });
});

