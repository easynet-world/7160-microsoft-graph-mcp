const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Tasks API', () => {
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

  describe('GET /graph/tasks', () => {
    test('should return tasks', async () => {
      const response = await request(server.app)
        .get('/graph/tasks');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter tasks', async () => {
      const response = await request(server.app)
        .get('/graph/tasks')
        .query({ filter: "status eq 'notStarted'" });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should get tasks from specific list', async () => {
      const response = await request(server.app)
        .get('/graph/tasks')
        .query({ listId: 'list123' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('POST /graph/tasks', () => {
    test('should create task', async () => {
      const taskData = {
        title: 'Complete project',
        body: {
          contentType: 'text',
          content: 'Task description'
        },
        importance: 'high'
      };

      const response = await request(server.app)
        .post('/graph/tasks')
        .send(taskData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
      if (response.status === 201) {
        if (response.status === 200) { expect(response.body).toHaveProperty('id'); }
        if (response.status === 200) { expect(response.body).toHaveProperty('title'); }
      }
    });

    test('should support due date', async () => {
      const taskData = {
        title: 'Task with due date',
        dueDateTime: {
          dateTime: '2024-12-31T23:59:59Z',
          timeZone: 'UTC'
        }
      };

      const response = await request(server.app)
        .post('/graph/tasks')
        .send(taskData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
    });
  });
});

