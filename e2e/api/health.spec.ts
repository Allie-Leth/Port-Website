import { test, expect } from '../fixtures/test-utils'

test.describe('API Health', () => {
  test('returns healthy status', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.ok()).toBe(true)
    const data = await response.json()
    expect(data.status).toBe('healthy')
  })
})
