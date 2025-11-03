import { GraphClient } from '../../../../lib/graph-client';

// @description('Request body for uploading a file')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('File path in OneDrive (e.g., "Documents/file.txt")')
  filePath: string;
  
  // @description('File content as base64 string')
  fileContent: string;
  
  // @description('File name')
  fileName: string;
  
  // @description('Content type (e.g., "text/plain", "image/jpeg")')
  contentType: string;
  
  // @description('Conflict resolution behavior')
  conflictBehavior?: 'rename' | 'replace' | 'fail';
}

// @description('Uploaded file response')
class Response {
  // @description('File ID')
  id: string;
  
  // @description('File name')
  name: string;
  
  // @description('File size')
  size: number;
  
  // @description('File web URL')
  webUrl: string;
}

// @description('Uploads a file to OneDrive in Microsoft Graph')
// @summary('Upload file to OneDrive')
// @tags('microsoft-graph', 'files')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, filePath, fileContent, fileName, contentType, conflictBehavior } = req.body;
      
      if (!filePath || !fileContent || !fileName || !contentType) {
        return res.status(400).json({
          error: 'Missing required fields: filePath, fileContent, fileName, and contentType are required'
        });
      }

      const graphClient = new GraphClient();
      
      // Construct the endpoint for file upload
      let endpoint = userId ? `/users/${userId}/drive/root:` : '/me/drive/root:';
      endpoint += `/${filePath}:/content`;
      
      const params: Record<string, string> = {};
      if (conflictBehavior) {
        params['@microsoft.graph.conflictBehavior'] = conflictBehavior;
      }
      
      // Convert base64 to buffer
      const fileBuffer = Buffer.from(fileContent, 'base64');
      
      const result = await graphClient.request('PUT', endpoint, fileBuffer, {
        'Content-Type': contentType
      });
      
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 :
                        error.message.includes('400') || error.message.includes('Bad') ? 400 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to upload file'
      });
    }
  })();
}

module.exports = handler;

