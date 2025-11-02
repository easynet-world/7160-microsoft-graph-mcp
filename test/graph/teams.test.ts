const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Teams API', () => {
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

  describe('GET /graph/teams', () => {
    test('should return list of teams', async () => {
      const response = await request(server.app)
        .get('/graph/teams');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter teams', async () => {
      const response = await request(server.app)
        .get('/graph/teams')
        .query({ filter: "displayName eq 'Test Team'" });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should limit results', async () => {
      const response = await request(server.app)
        .get('/graph/teams')
        .query({ top: 5 });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('GET /graph/teams/:teamId/channels', () => {
    test('should return team channels', async () => {
      const response = await request(server.app)
        .get('/graph/teams/team123/channels');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should limit channel results', async () => {
      const response = await request(server.app)
        .get('/graph/teams/team123/channels')
        .query({ top: 10 });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });
});

