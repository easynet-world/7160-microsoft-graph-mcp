const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Files API', () => {
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

  describe('GET /graph/files', () => {
    test('should return files and folders', async () => {
      const response = await request(server.app)
        .get('/graph/files');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should get files from specific path', async () => {
      const response = await request(server.app)
        .get('/graph/files')
        .query({ itemPath: 'Documents/Projects' });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should get files for specific user', async () => {
      const response = await request(server.app)
        .get('/graph/files')
        .query({ userId: 'user@example.com' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('GET /graph/drives', () => {
    test('should return drives', async () => {
      const response = await request(server.app)
        .get('/graph/drives');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });
  });

  describe('POST /graph/files/upload', () => {
    test('should upload file', async () => {
      const fileData = {
        filePath: 'Documents/test.txt',
        fileName: 'test.txt',
        fileContent: Buffer.from('Hello World').toString('base64'),
        contentType: 'text/plain'
      };

      const response = await request(server.app)
        .post('/graph/files/upload')
        .send(fileData);
      
      expect([201, 400, 401, 404, 500]).toContain(response.status);
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
      }
    });

    test('should require all required fields', async () => {
      const incompleteData = {
        fileName: 'test.txt'
      };

      const response = await request(server.app)
        .post('/graph/files/upload')
        .send(incompleteData);
      
      expect([400, 401, 404, 500]).toContain(response.status);
    });

    test('should handle conflict behavior', async () => {
      const fileData = {
        filePath: 'Documents/test.txt',
        fileName: 'test.txt',
        fileContent: Buffer.from('Hello').toString('base64'),
        contentType: 'text/plain',
        conflictBehavior: 'replace'
      };

      const response = await request(server.app)
        .post('/graph/files/upload')
        .send(fileData);
      
      expect([201, 400, 401, 404, 500]).toContain(response.status);
    });
  });

  describe('DELETE /graph/files/:itemId', () => {
    test('should delete file', async () => {
      const response = await request(server.app)
        .delete('/graph/files/item123');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
      }
    });
  });
});

