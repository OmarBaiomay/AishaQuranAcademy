import React from 'react'
import HeroSection from '../components/home/HeroSection'
import { Helmet } from 'react-helmet-async'
import AboutUsSection from '../components/home/AboutUsSection'
import WhyUsSection from '../components/home/WhyUsSection'
import Pricing from '../components/home/PricingPlansSection'
import TestimonialsSlider from '../components/home/TestimonialsSliderSection'
import Accordion from '../components/home/AccordionSection'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home | Aisha Quran Academy</title>
        <meta name="description" content="Learn Quran and Arabic Online with Native T tutors" />
        <link rel="canonical" href="/" />
      </Helmet>
      <main className=''>
        <HeroSection />
        <AboutUsSection />
        <WhyUsSection />
        <Pricing />
        <TestimonialsSlider />
        <Accordion />
      </main>
    </>
  )
}

export default HomePage