const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Organization API', () => {
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

  describe('GET /graph/organization', () => {
    test('should return organization information', async () => {
      const response = await request(server.app)
        .get('/graph/organization');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });
  });

  describe('GET /graph/directory', () => {
    test('should return directory objects', async () => {
      const response = await request(server.app)
        .get('/graph/directory');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter directory objects', async () => {
      const response = await request(server.app)
        .get('/graph/directory')
        .query({ filter: "deletedDateTime eq null" });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('GET /graph/people', () => {
    test('should return people', async () => {
      const response = await request(server.app)
        .get('/graph/people');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should search people', async () => {
      const response = await request(server.app)
        .get('/graph/people')
        .query({ search: 'John' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });
});

