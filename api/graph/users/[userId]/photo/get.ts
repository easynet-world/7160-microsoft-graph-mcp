import { GraphClient } from '../../../../../lib/graph-client';

// @description('User photo response')
class Response {
  // @description('Photo value (base64 encoded)')
  value: string;
}

// @description('Retrieves the photo of a user from Microsoft Graph')
// @summary('Get user photo')
// @tags('microsoft-graph', 'users')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId } = req.params;
      const graphClient = new GraphClient();
      const result = await graphClient.get(`/users/${userId}/photo/$value`);
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(Buffer.from(result, 'base64'));
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('404') || error.message.includes('Not found') ? 404 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve user photo'
      });
    }
  })();
}

module.exports = handler;

