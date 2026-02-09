import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ThanksFreeTrialPage = () => {
  return (
    <>
      <Helmet>
        <title>Thank You | Aisha Quran Academy</title>
        <meta
          name="description"
          content="Thank you for registering for a free trial at Aisha Quran Academy. We look forward to helping you start your journey with the Quran and Arabic."
        />
        <link rel="canonical" href="/thanks-free-trial-reg" />
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-purple-50 px-4 text-center">
        <div className="max-w-xl bg-white shadow-xl rounded-xl p-10">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">Thank You for Registering!</h1>
          <p className="text-zinc-600 mb-6">
            We're excited to have you on board! One of our tutors will contact you soon to schedule your free trial class.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Back to Home
            </Link>
            <Link
              to="/coursess"
              className="bg-zinc-100 text-purple-700 px-6 py-3 rounded-lg hover:bg-zinc-200 transition"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThanksFreeTrialPage;
