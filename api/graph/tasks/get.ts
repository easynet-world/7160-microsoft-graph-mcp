import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting tasks')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('List ID (optional, gets all lists if not specified)')
  listId?: string;
  
  // @description('OData filter expression')
  filter?: string;
  
  // @description('Maximum number of results to return')
  top?: number;
}

// @description('Task from Microsoft Graph')
class Task {
  // @description('Task ID')
  id: string;
  
  // @description('Task title')
  title: string;
  
  // @description('Task body')
  body?: {
    contentType: string;
    content: string;
  };
  
  // @description('Due date time')
  dueDateTime?: {
    dateTime: string;
    timeZone: string;
  };
  
  // @description('Is completed')
  status: 'notStarted' | 'inProgress' | 'completed' | 'waitingOnOthers' | 'deferred';
  
  // @description('Importance')
  importance: 'low' | 'normal' | 'high';
  
  // @description('Created date time')
  createdDateTime: string;
}

// @description('Response containing tasks')
class Response {
  // @description('Array of tasks')
  value: Task[];
}

// @description('Retrieves tasks from Microsoft Graph API')
// @summary('Get tasks')
// @tags('microsoft-graph', 'tasks')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, listId, filter, top } = req.query;
      const graphClient = new GraphClient();
      let endpoint = userId ? `/users/${userId}` : '/me';
      if (listId) {
        endpoint += `/todo/lists/${listId}/tasks`;
      } else {
        endpoint += '/todo/tasks';
      }
      const params: Record<string, string> = {};
      if (filter) params.$filter = filter;
      if (top) params.$top = top.toString();
      const result = await graphClient.get(endpoint, params);
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve tasks'
      });
    }
  })();
}

module.exports = handler;

