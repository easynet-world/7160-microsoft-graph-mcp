/**
 * Mock GraphClient for testing
 */

export class MockGraphClient {
  private mockData: Map<string, any> = new Map();

  constructor() {
    this.setupDefaultMocks();
  }

  setupDefaultMocks() {
    // Users mocks
    this.mockData.set('GET /users', {
      value: [
        { id: '1', displayName: 'John Doe', mail: 'john@example.com' },
        { id: '2', displayName: 'Jane Smith', mail: 'jane@example.com' }
      ]
    });
    this.mockData.set('GET /users/1', {
      id: '1',
      displayName: 'John Doe',
      mail: 'john@example.com',
      userPrincipalName: 'john@example.com'
    });
    this.mockData.set('GET /me', {
      id: 'me',
      displayName: 'Current User',
      mail: 'user@example.com'
    });

    // Mail mocks
    this.mockData.set('GET /me/messages', {
      value: [
        {
          id: 'msg1',
          subject: 'Test Email',
          from: { emailAddress: { name: 'Sender', address: 'sender@example.com' } },
          receivedDateTime: '2024-01-01T00:00:00Z',
          isRead: false
        }
      ]
    });

    // Calendar mocks
    this.mockData.set('GET /me/calendar/events', {
      value: [
        {
          id: 'event1',
          subject: 'Meeting',
          start: { dateTime: '2024-01-01T10:00:00Z', timeZone: 'UTC' },
          end: { dateTime: '2024-01-01T11:00:00Z', timeZone: 'UTC' }
        }
      ]
    });

    // Files mocks
    this.mockData.set('GET /me/drive/root/children', {
      value: [
        { id: 'file1', name: 'document.pdf', size: 1024 }
      ]
    });
  }

  async get(endpoint: string, params?: Record<string, any>): Promise<any> {
    const key = `GET ${endpoint}`;
    if (this.mockData.has(key)) {
      return this.mockData.get(key);
    }
    return { value: [] };
  }

  async post(endpoint: string, data: any): Promise<any> {
    const key = `POST ${endpoint}`;
    if (this.mockData.has(key)) {
      return this.mockData.get(key);
    }
    return { id: 'new-id', ...data };
  }

  async patch(endpoint: string, data: any): Promise<any> {
    const key = `PATCH ${endpoint}`;
    return { id: endpoint.split('/').pop(), ...data };
  }

  async delete(endpoint: string): Promise<any> {
    const key = `DELETE ${endpoint}`;
    return { success: true };
  }

  async request(method: string, endpoint: string, data?: any): Promise<any> {
    const key = `${method} ${endpoint}`;
    if (this.mockData.has(key)) {
      return this.mockData.get(key);
    }
    return { success: true };
  }

  setMock(key: string, value: any) {
    this.mockData.set(key, value);
  }
}

