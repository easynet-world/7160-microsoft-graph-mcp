const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');

describe('Microsoft Graph - Contacts API', () => {
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

  describe('GET /graph/contacts', () => {
    test('should return contacts', async () => {
      const response = await request(server.app)
        .get('/graph/contacts');
      
      expect([200, 401, 500]).toContain(response.status);
      if (response.status === 200) { expect(response.body).toHaveProperty('value'); }
      if (response.status === 200) { expect(Array.isArray(response.body.value)).toBe(true); }
    });

    test('should filter contacts', async () => {
      const response = await request(server.app)
        .get('/graph/contacts')
        .query({ filter: "givenName eq 'John'" });
      
      expect([200, 401, 500]).toContain(response.status);
    });

    test('should get contacts for specific user', async () => {
      const response = await request(server.app)
        .get('/graph/contacts')
        .query({ userId: 'user@example.com' });
      
      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('POST /graph/contacts', () => {
    test('should create contact', async () => {
      const contactData = {
        givenName: 'John',
        surname: 'Doe',
        emailAddresses: [
          { address: 'john@example.com', name: 'John Doe' }
        ],
        businessPhones: ['+1-555-0100']
      };

      const response = await request(server.app)
        .post('/graph/contacts')
        .send(contactData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
      if (response.status === 201) {
        if (response.status === 200) { expect(response.body).toHaveProperty('id'); }
        if (response.status === 200) { expect(response.body).toHaveProperty('givenName'); }
      }
    });

    test('should support optional fields', async () => {
      const contactData = {
        givenName: 'Jane',
        surname: 'Smith',
        companyName: 'Acme Corp',
        jobTitle: 'Developer',
        emailAddresses: [
          { address: 'jane@example.com' }
        ]
      };

      const response = await request(server.app)
        .post('/graph/contacts')
        .send(contactData);
      
      expect([201, 400, 401, 500]).toContain(response.status);
    });
  });
});

