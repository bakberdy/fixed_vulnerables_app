import { RegisterForm } from '@/features/auth'
import { Card, Alert, Container, Heading, Text, Stack, Flex } from '@/shared/ui'
import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden xl:flex xl:w-2/5 bg-gradient-to-br from-primary-700 via-purple-700 to-primary-600 text-white">
        <Container className="flex flex-col justify-center h-full py-16">
          <Stack spacing={6} className="max-w-xl">
            <Heading level={1} className="text-white text-4xl font-bold leading-tight">
              Build your freelance profile in minutes
            </Heading>
            <Text size="lg" color="muted" className="text-white/90">
              Create a client or freelancer account and explore real-world flows inside a safe, intentionally vulnerable lab.
            </Text>
            <Stack spacing={3}>
              <Flex align="center" gap={3}>
                <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                <Text className="text-white">Role-aware onboarding for clients and freelancers</Text>
              </Flex>
              <Flex align="center" gap={3}>
                <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                <Text className="text-white">Hands-on security scenarios with documented vulnerabilities</Text>
              </Flex>
              <Flex align="center" gap={3}>
                <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                <Text className="text-white">Messaging, orders, and profiles in a single workspace</Text>
              </Flex>
            </Stack>
            <Flex gap={6} wrap className="pt-2">
              <Stack spacing={1} className="min-w-[180px]">
                <Text className="text-white/70" size="sm">Teams using this lab</Text>
                <Heading level={3} className="text-white text-3xl">120+</Heading>
                <Text className="text-white/80" size="sm">Security crews training every week</Text>
              </Stack>
              <Stack spacing={1} className="min-w-[180px]">
                <Text className="text-white/70" size="sm">Average setup time</Text>
                <Heading level={3} className="text-white text-3xl">3 min</Heading>
                <Text className="text-white/80" size="sm">Guided steps to go live</Text>
              </Stack>
            </Flex>
          </Stack>
        </Container>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8 lg:px-12">
        <Container className="w-full max-w-3xl">
          <Card className="shadow-2xl border border-gray-100">
            <Stack spacing={4}>
              <Stack spacing={2} className="text-left">
                <Heading level={2}>Create your account</Heading>
                <Text color="muted">Pick your role, add profile details, and start exploring the platform.</Text>
              </Stack>

              <Alert variant="info">
                <Text size="sm">
                  This environment is for training only. Avoid using real credentials or sensitive data.
                </Text>
              </Alert>

              <RegisterForm />

              <Text color="muted" className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Login
                </Link>
              </Text>
            </Stack>
          </Card>
        </Container>
      </div>
    </div>
  )
}
