import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Input,
  Stack,
  Text,
} from '@/shared/ui'

interface CategoryCard {
  title: string
  description: string
  gigs: number
  icon: string
}

interface FeaturedGig {
  id: number
  title: string
  seller: string
  price: number
  deliveryDays: number
  rating: number
  badges: string[]
}

interface StepItem {
  title: string
  description: string
  icon: string
}

interface Testimonial {
  name: string
  role: string
  quote: string
}

export function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const categories: CategoryCard[] = [
    {
      title: 'Design & Creative',
      description: 'Branding, UI/UX, illustration',
      gigs: 184,
      icon: '🎨',
    },
    {
      title: 'Development',
      description: 'Web, mobile, backend, DevOps',
      gigs: 246,
      icon: '💻',
    },
    {
      title: 'Marketing',
      description: 'SEO, content, social ads',
      gigs: 132,
      icon: '📈',
    },
    {
      title: 'Writing',
      description: 'Copywriting, blogs, scripts',
      gigs: 118,
      icon: '✍️',
    },
    {
      title: 'Video & Animation',
      description: 'Explainers, editing, motion',
      gigs: 94,
      icon: '🎬',
    },
    {
      title: 'Data & AI',
      description: 'Dashboards, ML models, analytics',
      gigs: 88,
      icon: '🧠',
    },
  ]

  const featuredGigs: FeaturedGig[] = [
    {
      id: 1,
      title: 'Modern landing page in React + Tailwind',
      seller: 'Lena K.',
      price: 380,
      deliveryDays: 5,
      rating: 4.9,
      badges: ['Top Rated', 'Fast Delivery'],
    },
    {
      id: 2,
      title: 'Full-stack API with NestJS + SQLite',
      seller: 'Marcus V.',
      price: 520,
      deliveryDays: 7,
      rating: 4.8,
      badges: ['Backend', 'Secure'],
    },
    {
      id: 3,
      title: 'Brand identity kit with logo + guidelines',
      seller: 'Aisha R.',
      price: 460,
      deliveryDays: 6,
      rating: 5,
      badges: ['Design', 'Premium'],
    },
    {
      id: 4,
      title: 'SEO content strategy and 5 articles',
      seller: 'Noah C.',
      price: 310,
      deliveryDays: 10,
      rating: 4.7,
      badges: ['SEO', 'Long-form'],
    },
  ]

  const steps: StepItem[] = [
    {
      title: 'Post or browse',
      description: 'Search gigs or post a project with your requirements.',
      icon: '🔍',
    },
    {
      title: 'Review matches',
      description: 'Compare offers, timelines, and reviews to pick the best fit.',
      icon: '✅',
    },
    {
      title: 'Chat and deliver',
      description: 'Collaborate in messages, track progress, and receive work.',
      icon: '💬',
    },
  ]

  const testimonials: Testimonial[] = [
    {
      name: 'Priya S.',
      role: 'Product Lead, SaaS',
      quote: 'We shipped our new marketing site in a week. The workflow and talent quality were excellent.',
    },
    {
      name: 'Jamal W.',
      role: 'Founder, Analytics Startup',
      quote: 'Found a data engineer overnight. The built-in comms kept the project on track.',
    },
    {
      name: 'Helena M.',
      role: 'Creative Director',
      quote: 'Great marketplace for specialized creatives. Fast turnarounds and clear pricing.',
    },
  ]

  function handleSearch() {
    if (!search.trim()) {
      navigate('/gigs')
      return
    }

    const query = encodeURIComponent(search.trim())
    navigate(`/gigs?query=${query}`)
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-sm font-medium">
                Trusted marketplace with curated freelancers
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Find talent or projects in minutes, deliver in days
              </h1>
              <Text className="text-lg text-white/80">
                Browse verified gigs, post detailed projects, and collaborate securely with built-in messaging and orders.
              </Text>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Try: React dashboard design"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    leftIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                        />
                      </svg>
                    }
                  />
                </div>
                <Button onClick={handleSearch} className="sm:w-auto w-full">
                  Search gigs
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="px-3 py-1 rounded-full bg-white/10">Web</span>
                <span className="px-3 py-1 rounded-full bg-white/10">Design</span>
                <span className="px-3 py-1 rounded-full bg-white/10">Data</span>
                <span className="px-3 py-1 rounded-full bg-white/10">Marketing</span>
              </div>
              <div className="flex gap-6 text-sm text-white/80">
                <div>
                  <p className="text-2xl font-bold text-white">12k+</p>
                  <p>Verified freelancers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">48h</p>
                  <p>Average response</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.8/5</p>
                  <p>Average rating</p>
                </div>
              </div>
            </div>

            <Card padding="lg" className="bg-white/90 backdrop-blur-sm">
              <Stack spacing={4}>
                <div>
                  <p className="text-sm font-medium text-primary-600">Live projects</p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">High-demand briefs</h2>
                  <p className="text-gray-600 mt-2">Bid or save the ones that match your skills.</p>
                </div>
                <div className="space-y-3">
                  {featuredGigs.slice(0, 3).map((gig) => (
                    <div key={gig.id} className="p-4 rounded-lg border border-gray-100 bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">{gig.seller}</p>
                          <h3 className="text-lg font-semibold text-gray-900">{gig.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>${gig.price}</span>
                            <span>•</span>
                            <span>{gig.deliveryDays} days</span>
                            <span>•</span>
                            <span>{gig.rating} ★</span>
                          </div>
                        </div>
                        <Badge>{gig.badges[0]}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => navigate('/projects')}>
                    Browse projects
                  </Button>
                  <Button variant="outline" fullWidth onClick={() => navigate('/gigs')}>
                    Explore gigs
                  </Button>
                </div>
              </Stack>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-primary-600">Categories</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Popular categories</h2>
              <Text className="text-gray-600 mt-2">Browse curated work across the fastest-growing tracks.</Text>
            </div>
            <Button variant="outline" onClick={() => navigate('/projects')}>
              Post a project
            </Button>
          </div>
          <Grid cols={3} gap={6}>
            {categories.map((category) => (
              <Card key={category.title} hoverable padding="lg" className="h-full">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>{category.icon}</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <p className="text-sm font-semibold text-primary-600">{category.gigs} active gigs</p>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      <section className="py-12 bg-gray-50">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-primary-600">Featured</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Top gigs this week</h2>
              <Text className="text-gray-600 mt-2">Handpicked offers with high ratings and fast delivery.</Text>
            </div>
            <Button variant="outline" onClick={() => navigate('/gigs')}>
              View all gigs
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {featuredGigs.map((gig) => (
              <Card key={gig.id} padding="lg" className="min-w-[280px] max-w-sm flex-1" hoverable clickable>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">{gig.seller}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{gig.title}</h3>
                  </div>
                  <Badge>{gig.badges[0]}</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <span>${gig.price}</span>
                  <span>•</span>
                  <span>{gig.deliveryDays} days</span>
                  <span>•</span>
                  <span>{gig.rating} ★</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {gig.badges.slice(1).map((badge) => (
                    <Badge key={badge} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="text-center mb-10 space-y-2">
            <p className="text-sm font-semibold text-primary-600">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900">Clear steps from brief to delivery</h2>
            <Text className="text-gray-600 max-w-2xl mx-auto">
              Post a brief, review talent, collaborate in messages, and track orders with milestones.
            </Text>
          </div>
          <Grid cols={3} gap={6}>
            {steps.map((step) => (
              <Card key={step.title} padding="lg" hoverable>
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>{step.icon}</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      <section className="py-12 bg-gray-50">
        <Container>
          <div className="text-center mb-10 space-y-2">
            <p className="text-sm font-semibold text-primary-600">Stories</p>
            <h2 className="text-3xl font-bold text-gray-900">Teams shipping faster</h2>
            <Text className="text-gray-600 max-w-2xl mx-auto">
              Real feedback from clients and freelancers collaborating on the platform.
            </Text>
          </div>
          <Grid cols={3} gap={6}>
            {testimonials.map((item) => (
              <Card key={item.name} padding="lg" hoverable>
                <div className="space-y-3">
                  <p className="text-lg text-gray-900 font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                  <p className="text-gray-700">“{item.quote}”</p>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <Container className="text-center space-y-4">
          <p className="text-sm font-semibold text-white/80">Ready to start?</p>
          <h2 className="text-4xl font-bold">Ship your next milestone with the right team</h2>
          <Text className="text-white/80 max-w-3xl mx-auto">
            Post a project, pick a gig, and collaborate securely. Built-in messaging, orders, and delivery keep everything aligned.
          </Text>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="secondary" onClick={() => navigate('/projects')}>
              Post a project
            </Button>
            <Button variant="outline" onClick={() => navigate('/gigs')} className="text-white border-white hover:bg-white/10">
              Explore gigs
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
