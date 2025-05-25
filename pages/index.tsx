// pages/index.tsx
import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { HeroBanner } from '../components/HeroBanner'
import USPSection from '../components/USPSection'
import ComparisonSection from '../components/ComparisonSection'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import PricingTeaser from '../components/PricingTeaser'
import EarlyAccessSection from '../components/EarlyAccessSection'

const Home: NextPage = () => (
  <Layout>
    <HeroBanner />

    <USPSection />
    <ComparisonSection />
    <HowItWorks />
    <Testimonials />
    <PricingTeaser />

    <EarlyAccessSection />
  </Layout>
)

export default Home
