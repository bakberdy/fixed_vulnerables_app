export type RegisterRole = 'client' | 'freelancer'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  full_name: string
  role: RegisterRole
  bio?: string
  hourly_rate?: number
  location?: string
}
