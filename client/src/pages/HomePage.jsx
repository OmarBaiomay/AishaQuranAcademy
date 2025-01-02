import React from 'react'
import HeroSection from '../components/home/HeroSection'
import { Helmet } from 'react-helmet-async'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home | Aisha Quran Academy</title>
        <meta name="description" content="Learn Quran and Arabic Online with Native T tutors" />
        <link rel="canonical" href="/" />
      </Helmet>
      <main>
        <HeroSection />
      </main>
    </>
  )
}

export default HomePage