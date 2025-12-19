import { useEffect, useState, type FormEvent } from 'react'
import { useLogin } from '../model/useLogin'
import { Input, Button, Alert, Stack, Text, useToast } from '@/shared/ui'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useLogin()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (error) {
      showToast({ type: 'error', title: 'Login failed', message: error })
    }
  }, [error, showToast])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const user = await login({ email, password })

    if (user) {
      setUser(user)
      onSuccess?.()
      const dashboardPath = user.role === 'freelancer'
        ? '/dashboard/freelancer'
        : '/dashboard/client'
      navigate(dashboardPath, { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Stack spacing={4}>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />

        <Text size="sm" color="muted">
          Use training-safe credentials only. This environment intentionally contains vulnerabilities.
        </Text>

        <Button type="submit" fullWidth disabled={isLoading} loading={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Stack>
    </form>
  )
}
