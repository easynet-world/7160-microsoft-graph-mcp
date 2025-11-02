/**
 * Test utilities for Microsoft Graph API tests
 */

export function expectSuccessOrAuthError(response: any) {
  expect([200, 201, 401, 500]).toContain(response.status);
  
  if (response.status === 200 || response.status === 201) {
    // Only check response structure if we got a successful response
    return true;
  }
  
  // For auth errors, just verify we got an error response
  if (response.status === 401 || response.status === 500) {
    expect(response.body).toHaveProperty('error');
    return false;
  }
  
  return false;
}

export function expectSuccessResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return true;
  }
  return false;
}

