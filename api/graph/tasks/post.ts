import { GraphClient } from '../../../lib/graph-client';

// @description('Request body for creating a task')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('List ID (optional)')
  listId?: string;
  
  // @description('Task title')
  title: string;
  
  // @description('Task body')
  body?: {
    contentType: 'text' | 'html';
    content: string;
  };
  
  // @description('Due date time')
  dueDateTime?: {
    dateTime: string;
    timeZone: string;
  };
  
  // @description('Importance')
  importance?: 'low' | 'normal' | 'high';
  
  // @description('Reminder date time')
  reminderDateTime?: {
    dateTime: string;
    timeZone: string;
  };
}

// @description('Created task response')
class Response {
  // @description('Task ID')
  id: string;
  
  // @description('Task title')
  title: string;
  
  // @description('Task status')
  status: string;
}

// @description('Creates a new task in Microsoft Graph')
// @summary('Create task')
// @tags('microsoft-graph', 'tasks')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, listId, ...taskData } = req.body;
      const graphClient = new GraphClient();
      let endpoint = userId ? `/users/${userId}` : '/me';
      if (listId) {
        endpoint += `/todo/lists/${listId}/tasks`;
      } else {
        endpoint += '/todo/tasks';
      }
      const result = await graphClient.post(endpoint, taskData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to create task'
      });
    }
  })();
}

module.exports = handler;

