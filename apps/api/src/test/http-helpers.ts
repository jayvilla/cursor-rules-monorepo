/**
 * Phase 0 HTTP Test Helpers
 * 
 * Provides utilities for making HTTP requests in tests:
 * - requestWithAgent: Supertest agent with cookie persistence
 * - requestWithCsrf: Fetches CSRF token and attaches to requests
 */

import { INestApplication } from '@nestjs/common';
import { SuperTest, Test } from 'supertest';
import { getTestAgent } from './test-app.factory';

/**
 * Get a Supertest agent with cookie persistence
 * 
 * Use this for requests that need to maintain session state.
 * 
 * @param app - NestJS application instance
 */
export function requestWithAgent(app: INestApplication): SuperTest<Test> {
  return getTestAgent(app);
}

/**
 * Get CSRF token using a supertest agent
 */
export async function getCsrfToken(agent: SuperTest<Test>): Promise<string> {
  const response = await agent.get('/api/auth/csrf').expect(200);
  return response.body.token;
}

/**
 * Perform a mutating request with CSRF protection
 * 
 * Fetches CSRF token first, then performs the request with token + cookies.
 * Returns the Test object for chaining .expect() calls.
 * 
 * @param agent - Supertest agent (from requestWithAgent)
 * @param method - HTTP method
 * @param path - Request path
 * @param data - Request body (optional)
 */
export async function requestWithCsrf(
  agent: SuperTest<Test>,
  method: 'post' | 'patch' | 'put' | 'delete',
  path: string,
  data?: any,
): Promise<Test> {
  const csrfToken = await getCsrfToken(agent);
  const req = agent[method](path).set('x-csrf-token', csrfToken);
  
  // If data is provided, call send() which returns a Test object (chainable, lazy)
  // Type assertion needed: Supertest's send() can return Response in types but Test in practice
  if (data !== undefined && data !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return req.send(data) as any as Test;
  }
  
  return req as Test;
}

/**
 * Re-export getTestAgent for convenience
 */
export { getTestAgent } from './test-app.factory';

