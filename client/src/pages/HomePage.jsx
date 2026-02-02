import React from 'react'
import HeroSection from '../components/home/HeroSection'
import { Helmet } from 'react-helmet-async'
import AboutUsSection from '../components/home/AboutUsSection'
import WhyUsSection from '../components/home/WhyUsSection'
import Pricing from '../components/home/PricingPlansSection'
import TestimonialsSlider from '../components/home/TestimonialsSliderSection'
import Accordion from '../components/home/AccordionSection'
import NajdFormEmbed from '../components/common/NajdFormEmbed'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Aisha Quran Academy | Learn Quran & Arabic – Free Trial</title>
        <meta name="description" content="Join Aisha Quran Academy to learn Quran and Arabic online with native tutors from Al-Azhar. Affordable, flexible, high-quality courses. Free trial available." />
        <meta name="keywords" content="Quran online, Arabic online, learn Quran, learn Arabic, Al-Azhar tutors, Islamic studies, native Arabic tutors, Quran classes, Arabic classes, Aisha Quran Academy, online Quran academy, Quran for kids, Arabic for beginners" />
        <meta name="author" content="Omar Elbayoumi" />
        <meta name="robots" content="index, follow" />
        {/* Viewport (Mobile Optimization) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical URL (Avoid duplicate content issues) */}
        <link rel="canonical" href="https://aishaquran.com" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aishaquran.com/" />
        <meta property="og:title" content="Aisha Quran Academy | Learn Quran & Arabic – Free Trial" />
        <meta property="og:description" content="Study Quran and Arabic online with Al-Azhar native tutors. Try a free class today!" />
        <meta property="og:image" content="https://aishaquran.com/assets/socialImage.png" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aisha Quran Academy | Learn Quran & Arabic – Free Trial" />
        <meta name="twitter:description" content="Join Aisha Quran Academy to learn Quran and Arabic with certified Al-Azhar tutors. Book a free trial now!" />
        <meta name="twitter:image" content="https://aishaquran.com/assets/socialImage.png" />
        <meta name="twitter:site" content="@AishaAcademy" />
      </Helmet>

      <main>
        <HeroSection />
        <AboutUsSection />
        <WhyUsSection />
        <Pricing />
        <TestimonialsSlider />
        <Accordion />

        {/* ✅ Registration Form at the bottom */}
        <section id="reg" className="pt-20 px-4 pb-28 bg-zinc-50">
          <h1 className="text-3xl font-bold text-center text-zinc-800 mb-6">
            Start Your Learning Journey Today!
          </h1>
          <p className="text-center text-zinc-600 mb-8 max-w-2xl mx-auto">
            Register now for a free trial and experience our quality Quran, Arabic, and Islamic studies courses.
          </p>

          <NajdFormEmbed />
        </section>
      </main>
    </>
  )
}

export default HomePage
