export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
  settings?: UserSettings
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
}

export interface UserUpdate {
  name?: string
  avatarUrl?: string
  settings?: Partial<UserSettings>
}
