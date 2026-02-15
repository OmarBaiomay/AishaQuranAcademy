import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import RegistrationForm from '../components/home/RegistrationFormSection';
import { loadWidgetSafely } from '../utils/loadWidgetSafely';

const RegisterCoursePage = () => {

  useEffect(() => {
  }, []);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Register Now | Learn Quran, Arabic & Islamic Studies Online</title>
        <meta name="description" content="Register now to learn Quran, Arabic, and Islamic Studies online with expert tutors. Enjoy a free trial and flexible learning from the comfort of your home." />
        <meta name="keywords" content="learn Quran, learn Arabic, Islamic studies, online Quran classes, Arabic for beginners, free Quran trial, Quran tutoring, register Quran course, free Islamic course" />
        <meta name="author" content="Omar Elbayoumi" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://aishaquran.com/register-course" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aishaquran.com/register-course" />
        <meta property="og:title" content="Register Now | Learn Quran, Arabic & Islamic Studies Online" />
        <meta property="og:description" content="Join expert tutors online to study Quran, Arabic, and Islamic Studies. Free trial available!" />
        <meta property="og:image" content="https://aishaquran.com/assets/socialImage.png" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Register Now | Learn Quran, Arabic & Islamic Studies Online" />
        <meta name="twitter:description" content="Register now to learn Quran, Arabic, and Islamic Studies online with expert tutors. Free trial available!" />
        <meta name="twitter:image" content="https://aishaquran.com/assets/socialImage.png" />
        <meta name="twitter:site" content="@AishaAcademy" />
      </Helmet>

      <section id="reg" className="pt-32 px-4 pb-28 dark:from-zinc-900 dark:to-zinc-800">
          <div className="container max-w-4xl mx-auto text-center mb-12">
            <span className="mb-2 block text-lg font-semibold text-purple-600">
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              Start Learning Quran Online Today
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-4">
              Register now for a <strong>free trial</strong> and experience high-quality <strong>online Quran classes</strong> with professional teachers who care about your progress.
            </p>
            <p className="text-xl font-semibold text-purple-600">
              🎯 Start Your Free Trial Now
            </p>
          </div>

          <RegistrationForm />
        </section>

    </>
  );
};

export default RegisterCoursePage;
