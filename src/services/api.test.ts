import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiService } from './api'

describe('apiService', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  describe('get', () => {
    it('应该发送 GET 请求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: 1 } }),
      })

      const result = await apiService.get('/users/1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'GET',
        })
      )
      expect(result.data).toEqual({ id: 1 })
    })

    it('应该处理查询参数', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      })

      await apiService.get('/users', { page: 1, limit: 10 })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/users?page=1&limit=10'), expect.any(Object))
    })
  })

  describe('post', () => {
    it('应该发送 POST 请求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: 1 } }),
      })

      const userData = { name: '张三', email: 'zhang@example.com' }
      const result = await apiService.post('/users', userData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
        })
      )
      expect(result.data).toEqual({ id: 1 })
    })
  })

  describe('put', () => {
    it('应该发送 PUT 请求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: 1 } }),
      })

      const userData = { name: '张三更新' }
      await apiService.put('/users/1', userData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(userData),
        })
      )
    })
  })

  describe('patch', () => {
    it('应该发送 PATCH 请求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: 1 } }),
      })

      const patchData = { status: 'active' }
      await apiService.patch('/users/1', patchData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(patchData),
        })
      )
    })
  })

  describe('delete', () => {
    it('应该发送 DELETE 请求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      await apiService.delete('/users/1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })

  describe('错误处理', () => {
    it('应该处理 HTTP 错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: '用户不存在' }),
      })

      await expect(apiService.get('/users/999')).rejects.toThrow('用户不存在')
    })

    it('应该处理无 JSON 响应的错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      await expect(apiService.get('/error')).rejects.toThrow('HTTP 500: Internal Server Error')
    })

    it('应该处理请求超时', async () => {
      mockFetch.mockImplementationOnce(() => {
        const error = new Error('Aborted')
        error.name = 'AbortError'
        return Promise.reject(error)
      })

      await expect(apiService.get('/slow')).rejects.toThrow('请求超时，请稍后重试')
    })
  })

  describe('认证', () => {
    it('应该在请求中包含认证 token', async () => {
      localStorage.setItem('halolight_solid_token', JSON.stringify({ accessToken: 'test-token' }))

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      })

      await apiService.get('/protected')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
    })

    it('没有 token 时不应该包含 Authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      })

      await apiService.get('/public')

      const callArgs = mockFetch.mock.calls[0][1]
      expect(callArgs.headers['Authorization']).toBeUndefined()
    })
  })
})
