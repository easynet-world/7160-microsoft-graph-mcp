import { GraphClient } from '../../../lib/graph-client';

// @description('Request parameters for getting drive files')
class Request {
  // @description('User ID or principal name (optional, defaults to current user)')
  userId?: string;
  
  // @description('Path to specific folder (optional, defaults to root)')
  itemPath?: string;
}

// @description('Drive item from Microsoft Graph')
class DriveItem {
  // @description('Item ID')
  id: string;
  
  // @description('Item name')
  name: string;
  
  // @description('Is folder')
  folder?: {
    childCount: number;
  };
  
  // @description('Is file')
  file?: {
    mimeType: string;
    hashes: {
      sha1Hash: string;
    };
  };
  
  // @description('Item size in bytes')
  size: number;
  
  // @description('Created date time')
  createdDateTime: string;
  
  // @description('Last modified date time')
  lastModifiedDateTime: string;
  
  // @description('Web URL')
  webUrl: string;
}

// @description('Response containing drive items')
class Response {
  // @description('Array of drive items')
  value: DriveItem[];
  
  // @description('OData context')
  '@odata.context': string;
}

// @description('Retrieves files and folders from Microsoft Graph OneDrive API. Supports browsing specific paths.')
// @summary('Get drive files')
// @tags('microsoft-graph', 'files')
function handler(req: any, res: any) {
  (async () => {
    try {
      const { userId, itemPath } = req.query;
      
      const graphClient = new GraphClient();
      const result = await graphClient.getDriveItems(
        userId || null, 
        itemPath || null
      );
      
      res.json(result);
    } catch (error: any) {
      console.error('Graph API error:', error);
      const statusCode = error.message.includes('401') || error.message.includes('Authentication') ? 401 : 500;
      res.status(statusCode).json({
        error: error.message || 'Failed to retrieve drive items'
      });
    }
  })();
}

module.exports = handler;
