import { GET } from '@/app/api/health/route'
import { NextResponse } from 'next/server'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      status: init?.status || 200,
      headers: new Headers(),
    })),
  },
}))

describe('Health API Route', () => {
  const originalEnv = process.env
  const originalNodeEnv = process.env.NODE_ENV
  const originalVersion = process.env.npm_package_version

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock environment variables
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      configurable: true,
    })
    Object.defineProperty(process.env, 'npm_package_version', {
      value: '1.2.3',
      configurable: true,
    })
  })

  afterEach(() => {
    // Restore original environment
    if (originalNodeEnv !== undefined) {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        configurable: true,
      })
    } else {
      delete (process.env as any).NODE_ENV
    }
    if (originalVersion !== undefined) {
      Object.defineProperty(process.env, 'npm_package_version', {
        value: originalVersion,
        configurable: true,
      })
    } else {
      delete (process.env as any).npm_package_version
    }
  })

  it('returns a 200 status code', async () => {
    const response = await GET()

    expect(NextResponse.json).toHaveBeenCalledWith(expect.any(Object), {
      status: 200,
    })
  })

  it('returns correct health status', async () => {
    await GET()

    const [[responseBody]] = (NextResponse.json as jest.Mock).mock.calls
    expect(responseBody.status).toBe('healthy')
  })

  it('includes a valid ISO timestamp', async () => {
    const beforeCall = new Date().toISOString()
    await GET()
    const afterCall = new Date().toISOString()

    const [[responseBody]] = (NextResponse.json as jest.Mock).mock.calls
    expect(responseBody.timestamp).toBeDefined()
    expect(new Date(responseBody.timestamp).toISOString()).toBe(
      responseBody.timestamp
    )

    // Verify timestamp is within reasonable range
    expect(responseBody.timestamp >= beforeCall).toBe(true)
    expect(responseBody.timestamp <= afterCall).toBe(true)
  })

  it('returns the correct version from package.json', async () => {
    await GET()

    const [[responseBody]] = (NextResponse.json as jest.Mock).mock.calls
    expect(responseBody.version).toBe('1.2.3')
  })

  it('returns default version when npm_package_version is not set', async () => {
    delete (process.env as any).npm_package_version

    await GET()

    const [[responseBody]] = (NextResponse.json as jest.Mock).mock.calls
    expect(responseBody.version).toBe('1.0.0')
  })

  it('returns the correct environment', async () => {
    await GET()

    const [[responseBody]] = (NextResponse.json as jest.Mock).mock.calls
    expect(responseBody.environment).toBe('test')
  })

  it('returns default environment when NODE_ENV is not set', async () => {
    delete (process.env as any).NODE_ENV

    await GET()

    const [[responseBody]] = (NextResponse.json as jest.Mock).mock.calls
    expect(responseBody.environment).toBe('development')
  })

  it('returns all required fields', async () => {
    await GET()

    const [[responseBody]] = (NextResponse.json as jest.Mock).mock.calls
    const requiredFields = ['status', 'timestamp', 'version', 'environment']

    requiredFields.forEach((field) => {
      expect(responseBody).toHaveProperty(field)
    })
  })
})
