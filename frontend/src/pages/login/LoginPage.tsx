import { LoginForm } from '@/features/auth'
import { Card, Container, Heading, Text, Checkbox, Flex, Stack } from '@/shared/ui'
import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-purple-700 text-white">
        <Container className="flex flex-col justify-center h-full py-16">
          <Stack spacing={6} className="max-w-xl">
            <Heading level={1} className="text-white text-4xl font-bold leading-tight">
              Find the perfect freelance services for your business
            </Heading>
            <Text size="lg" color="muted" className="text-white/90">
              Hire top talent, collaborate securely, and ship projects faster with our marketplace.
            </Text>
            <Stack spacing={3}>
              <Flex align="center" gap={2}>
                <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                <Text className="text-white">Curated freelancers across design, development, and marketing</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                <Text className="text-white">Secure messaging, orders, and milestones in one place</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                <Text className="text-white">Built-in vulnerability demos for training and testing</Text>
              </Flex>
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container className="max-w-xl">
          <Card className="shadow-xl">
            <Stack spacing={3} className="mb-2 text-center">
              <Heading level={2}>Welcome back</Heading>
              <Text color="muted">Login to access your account</Text>
            </Stack>

            <Stack spacing={4}>
              <LoginForm />

              <Flex align="center" justify="between">
                <Checkbox label="Remember me" />
              </Flex>

              <Text color="muted" className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Register
                </Link>
              </Text>
            </Stack>
          </Card>
        </Container>
      </div>
    </div>
  )
}
