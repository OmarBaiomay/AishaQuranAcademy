import React from 'react'
import HeroSection from '../components/home/HeroSection'
import { Helmet } from 'react-helmet-async'
import IntroductionSection from '../components/home/IntroductionSection'
import AboutUsSection from '../components/home/AboutUsSection'
import WhyUsSection from '../components/home/WhyUsSection'
import ServicesSection from '../components/home/ServicesSection'
import BenefitsSection from '../components/home/BenefitsSection'
import Pricing from '../components/home/PricingPlansSection'
import TestimonialsSlider from '../components/home/TestimonialsSliderSection'
import Accordion from '../components/home/AccordionSection'
import RegistrationForm from '../components/home/RegistrationFormSection'

const HomePage = () => {
  return (
    <>
      <Helmet>
        {/* Fixed: Title shortened to under 65 characters */}
        <title>Learn Quran Online | Native Tutors | Aisha Quran Academy</title>
        
        {/* Fixed: Description shortened to under 170 characters */}
        <meta name="description" content="Learn Quran online with certified Al-Azhar tutors. Live classes for kids & adults. Flexible schedules. Start your free trial today!" />
        
        {/* Removed: Obsolete keywords meta tag */}
        <meta name="author" content="Aisha Quran Academy" />
        <meta name="robots" content="index, follow" />
        
        {/* Fixed: Single viewport declaration */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Fixed: Single canonical URL matching actual domain */}
        <link rel="canonical" href="https://aishaquran.com/" />

        {/* Open Graph Meta Tags - Single set, consistent */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aishaquran.com/" />
        <meta property="og:title" content="Learn Quran Online | Native Arabic Tutors | Free Trial" />
        <meta property="og:description" content="Learn Quran online with certified Al-Azhar tutors. Live one-on-one classes for kids & adults. Free trial available!" />
        <meta property="og:image" content="https://aishaquran.com/assets/socialImage.png" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags - Consistent with OG */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AishaAcademy" />
        <meta name="twitter:title" content="Learn Quran Online | Native Arabic Tutors | Free Trial" />
        <meta name="twitter:description" content="Learn Quran online with certified Al-Azhar tutors. Start your free trial today!" />
        <meta name="twitter:image" content="https://aishaquran.com/assets/socialImage.png" />

        {/* Structured Data - Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Aisha Quran Academy",
            "description": "Learn Quran online with certified Al-Azhar University tutors through live one-on-one classes",
            "url": "https://aishaquran.com",
            "logo": "https://aishaquran.com/assets/AishaIcon.png",
            "image": "https://aishaquran.com/assets/socialImage.png",
            "sameAs": [
              "https://www.facebook.com/profile.php?id=100086610662274",
              "https://www.instagram.com/aisha_academy1/",
              "https://x.com/AishaAcademy1",
              "https://www.youtube.com/@Aisha_Quran_Academy"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+201227307646",
              "contactType": "Customer Service",
              "availableLanguage": ["English", "Arabic"]
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "EG"
            }
          })}
        </script>

        {/* Structured Data - Course Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Online Quran Classes",
            "description": "Learn Quran online with live native Arabic tutors from Al-Azhar University. One-on-one classes for kids and adults.",
            "provider": {
              "@type": "Organization",
              "name": "Aisha Quran Academy",
              "sameAs": "https://aishaquran.com"
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "online",
              "courseWorkload": "PT2H"
            },
            "offers": {
              "@type": "Offer",
              "category": "Online Education",
              "priceCurrency": "USD",
              "price": "64",
              "availability": "https://schema.org/InStock",
              "url": "https://aishaquran.com/register-course"
            },
            "educationalLevel": "Beginner to Advanced",
            "teaches": "Quran recitation, Tajweed, Arabic language, Islamic studies"
          })}
        </script>

        {/* Structured Data - WebSite Schema with SearchAction */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Aisha Quran Academy",
            "url": "https://aishaquran.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://aishaquran.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://aishaquran.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Courses",
                "item": "https://aishaquran.com/coursess"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Register",
                "item": "https://aishaquran.com/register-course"
              }
            ]
          })}
        </script>
      </Helmet>

      <main>
        {/* Hero Section with H1 */}
        <HeroSection />

        {/* Mobile/Tablet Registration Form - Only visible on small/medium screens */}
        <section id="mobile-reg" className="block lg:hidden mt-5 pt-12 pb-16 dark:from-zinc-900 dark:via-purple-900/10 dark:to-zinc-900">
          <div className="container max-w-3xl mx-auto">
            {/* Mobile CTA Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Limited Time Offer
                  </span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
                Register for Your Free Trial
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-300">
                Start learning Quran online today with native Arabic tutors
              </p>
            </div>

            {/* Registration Form */}
            <RegistrationForm />
          </div>
        </section>

        {/* Introduction Section */}
        <IntroductionSection />

        {/* Stats Section */}
        <AboutUsSection />

        {/* Why Choose Us - Trust & Authority */}
        <WhyUsSection />

        {/* Our Services - Main Courses */}
        <ServicesSection />

        {/* Benefits of Learning Online */}
        <BenefitsSection />

        {/* Pricing Plans */}
        <Pricing />

        {/* Testimonials */}
        <TestimonialsSlider />

        {/* FAQ Section */}
        <Accordion />

        {/* Final CTA - Registration Form (Desktop Version) */}
        <section id="reg" className="pt-20 px-4 pb-28 bg-gradient-to-b from-purple-50 to-white dark:from-zinc-900 dark:to-zinc-800">
          <div className="container max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Get Started Today
                </span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Start Learning Quran Online Today
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-4">
              Register now for a <strong className="text-purple-600 dark:text-purple-400">free trial</strong> and experience high-quality <strong className="text-purple-600 dark:text-purple-400">online Quran classes</strong> with professional teachers who care about your progress.
            </p>
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-purple-600">
              <span className="text-2xl">🎯</span>
              <span>Start Your Free Trial Now</span>
            </div>
          </div>

          <RegistrationForm />
        </section>
      </main>
    </>
  )
}

export default HomePage