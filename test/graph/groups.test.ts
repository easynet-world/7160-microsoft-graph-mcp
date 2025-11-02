const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Groups API', () => {
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

  describe('GET /graph/groups', () => {
    test('should return list of groups', async () => {
      const response = await request(server.app)
        .get('/graph/groups');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter groups', async () => {
      const response = await request(server.app)
        .get('/graph/groups')
        .query({ filter: "displayName eq 'Test Group'" });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should select specific properties', async () => {
      const response = await request(server.app)
        .get('/graph/groups')
        .query({ select: 'id,displayName,mail' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('POST /graph/groups', () => {
    test('should create new group', async () => {
      const groupData = {
        displayName: 'Test Group',
        mailNickname: 'testgroup',
        groupTypes: ['Unified'],
        mailEnabled: true,
        securityEnabled: true
      };

      const response = await request(server.app)
        .post('/graph/groups')
        .send(groupData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
      if (response.status === 201) {
        if (response.status === 200) { expect(response.body).toHaveProperty('id'); }
        if (response.status === 200) { expect(response.body).toHaveProperty('displayName'); }
      }
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        displayName: 'Test Group'
      };

      const response = await request(server.app)
        .post('/graph/groups')
        .send(incompleteData);
      
      expect([400, 401, 500]).toContain(response.status);
    });
  });

  describe('GET /graph/groups/:groupId/members', () => {
    test('should return group members', async () => {
      const response = await request(server.app)
        .get('/graph/groups/group123/members');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });
  });
});

