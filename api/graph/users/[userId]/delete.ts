import { GraphClient } from '../../../../lib/graph-client';

// @description('Delete user response')
class Response {
  // @description('Success status')
  success: boolean;
  
  // @description('Response message')
  message: string;
}

// @description('Deletes a user from Microsoft Graph')
// @summary('Delete user')
// @tags('microsoft-graph', 'users')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId } = req.params;
      const graphClient = new GraphClient();
      await graphClient.delete(`/users/${userId}`);
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to delete user'
      });
    }
  })();
}

module.exports = handler;

