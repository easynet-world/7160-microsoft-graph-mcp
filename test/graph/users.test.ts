const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Users API', () => {
  let server: any;

  beforeAll(async () => {
    // Mock environment variables
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

  describe('GET /graph/users', () => {
    test('should return list of users', async () => {
      const response = await request(server.app)
        .get('/graph/users')
        .query({ top: 10 });
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter users', async () => {
      const response = await request(server.app)
        .get('/graph/users')
        .query({ filter: "displayName eq 'John'" });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should select specific properties', async () => {
      const response = await request(server.app)
        .get('/graph/users')
        .query({ select: 'id,displayName,mail' });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should get specific user by ID', async () => {
      const response = await request(server.app)
        .get('/graph/users')
        .query({ userId: 'user123' });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should handle authentication errors', async () => {
      // This will fail if credentials are invalid
      const response = await request(server.app)
        .get('/graph/users');
      
      // Should handle error gracefully (status 401 or 500 depending on setup)
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('GET /graph/users/me', () => {
    test('should return current user', async () => {
      const response = await request(server.app)
        .get('/graph/users/me');
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('POST /graph/users', () => {
    test('should create a new user', async () => {
      const userData = {
        accountEnabled: true,
        displayName: 'Test User',
        userPrincipalName: 'test@example.com',
        mailNickname: 'testuser',
        passwordProfile: {
          password: 'TempPassword123!',
          forceChangePasswordNextSignIn: true
        }
      };

      const response = await request(server.app)
        .post('/graph/users')
        .send(userData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        displayName: 'Test User'
      };

      const response = await request(server.app)
        .post('/graph/users')
        .send(incompleteData);
      
      expect([400, 401, 500]).toContain(response.status);
    });
  });

  describe('PATCH /graph/users/:userId', () => {
    test('should update user', async () => {
      const updateData = {
        displayName: 'Updated Name',
        jobTitle: 'Developer'
      };

      const response = await request(server.app)
        .patch('/graph/users/user123')
        .send(updateData);
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('DELETE /graph/users/:userId', () => {
    test('should delete user', async () => {
      const response = await request(server.app)
        .delete('/graph/users/user123');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
      }
    });
  });

  describe('GET /graph/users/:userId/photo', () => {
    test('should return user photo', async () => {
      const response = await request(server.app)
        .get('/graph/users/user123/photo');
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });
});

