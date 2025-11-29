const STORAGE_PREFIX = 'halolight_solid_'

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  set(key: string, value: any): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  getWithExpiry<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      if (!item) return null

      const data = JSON.parse(item)
      if (data.expiry && Date.now() > data.expiry) {
        this.remove(key)
        return null
      }

      return data.value
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  setWithExpiry(key: string, value: any, expiryMinutes: number): void {
    try {
      const data = {
        value,
        expiry: Date.now() + expiryMinutes * 60 * 1000,
      }
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
}
