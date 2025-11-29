import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { storage } from './storage'

const STORAGE_PREFIX = 'halolight_solid_'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('get', () => {
    it('应该返回存储的值', () => {
      localStorage.setItem(STORAGE_PREFIX + 'test', JSON.stringify({ name: 'test' }))
      const result = storage.get<{ name: string }>('test')
      expect(result).toEqual({ name: 'test' })
    })

    it('键不存在时应该返回 null', () => {
      const result = storage.get('nonexistent')
      expect(result).toBeNull()
    })

    it('JSON 解析失败时应该返回 null', () => {
      localStorage.setItem(STORAGE_PREFIX + 'invalid', 'invalid json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = storage.get('invalid')
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('set', () => {
    it('应该正确存储值', () => {
      storage.set('test', { name: 'test' })
      const stored = localStorage.getItem(STORAGE_PREFIX + 'test')
      expect(JSON.parse(stored!)).toEqual({ name: 'test' })
    })

    it('应该能存储各种类型的值', () => {
      storage.set('string', 'hello')
      storage.set('number', 42)
      storage.set('boolean', true)
      storage.set('array', [1, 2, 3])

      expect(storage.get('string')).toBe('hello')
      expect(storage.get('number')).toBe(42)
      expect(storage.get('boolean')).toBe(true)
      expect(storage.get('array')).toEqual([1, 2, 3])
    })
  })

  describe('remove', () => {
    it('应该删除指定的键', () => {
      storage.set('test', 'value')
      expect(storage.get('test')).toBe('value')

      storage.remove('test')
      expect(storage.get('test')).toBeNull()
    })

    it('删除不存在的键不应该抛出错误', () => {
      expect(() => storage.remove('nonexistent')).not.toThrow()
    })
  })

  describe('clear', () => {
    it('应该清除所有存储', () => {
      storage.set('key1', 'value1')
      storage.set('key2', 'value2')

      storage.clear()

      expect(storage.get('key1')).toBeNull()
      expect(storage.get('key2')).toBeNull()
    })
  })

  describe('setWithExpiry', () => {
    it('应该正确存储带过期时间的值', () => {
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      storage.setWithExpiry('test', 'value', 5)

      const stored = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'test')!)
      expect(stored.value).toBe('value')
      expect(stored.expiry).toBe(now + 5 * 60 * 1000)

      vi.useRealTimers()
    })
  })

  describe('getWithExpiry', () => {
    it('应该返回未过期的值', () => {
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      storage.setWithExpiry('test', 'value', 5)
      const result = storage.getWithExpiry('test')

      expect(result).toBe('value')
      vi.useRealTimers()
    })

    it('应该返回 null 并删除过期的值', () => {
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      storage.setWithExpiry('test', 'value', 5)

      // 前进 6 分钟
      vi.setSystemTime(now + 6 * 60 * 1000)

      const result = storage.getWithExpiry('test')
      expect(result).toBeNull()
      expect(localStorage.getItem(STORAGE_PREFIX + 'test')).toBeNull()

      vi.useRealTimers()
    })

    it('键不存在时应该返回 null', () => {
      const result = storage.getWithExpiry('nonexistent')
      expect(result).toBeNull()
    })
  })
})
