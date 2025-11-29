import type { ApiResponse, ApiError } from '~/types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000
const ENABLE_MOCK = import.meta.env.VITE_MOCK === 'true'

class ApiService {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = API_BASE_URL
    this.timeout = API_TIMEOUT
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    // 添加认证token
    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // 设置默认headers
    headers['Content-Type'] = 'application/json'

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await this.handleError(response)
        throw error
      }

      const result: ApiResponse<T> = await response.json()
      return result
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时，请稍后重试')
      }
      throw error
    }
  }

  private async handleError(response: Response): Promise<Error> {
    try {
      const errorData: ApiError = await response.json()
      return new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    } catch {
      return new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null

    try {
      const tokenData = localStorage.getItem('halolight_solid_token')
      if (tokenData) {
        const { accessToken } = JSON.parse(tokenData)
        return accessToken
      }
    } catch (error) {
      console.error('Error reading token:', error)
    }
    return null
  }

  // HTTP方法封装
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? new URLSearchParams(params).toString() : ''
    const fullUrl = queryString ? `${url}?${queryString}` : url
    return this.request<T>('GET', fullUrl)
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data)
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data)
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data)
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url)
  }

  // 文件上传
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        })
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response: ApiResponse<T> = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (error) {
            reject(new Error('Invalid response format'))
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'))
      })

      xhr.open('POST', `${this.baseURL}${url}`)

      // 添加认证token
      const token = this.getToken()
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.timeout = this.timeout
      xhr.send(formData)
    })
  }
}

export const apiService = new ApiService()
