import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { loadWidgetSafely } from '../utils/loadWidgetSafely';

const RegisterCoursePage = () => {

  useEffect(() => {
    const leadScript = loadWidgetSafely({
      src: "https://widgets.leadconnectorhq.com/loader.js",
      attributes: {
        "data-resources-url": "https://widgets.leadconnectorhq.com/chat-widget/loader.js",
        "data-widget-id": "66941593748b6842e5ace39e"
      },
    });

    const najdScript = loadWidgetSafely({
      src: "https://link.najddigital.com/js/form_embed.js"
    });

    return () => {
      if (leadScript && document.body.contains(leadScript)) {
        document.body.removeChild(leadScript);
      }
      if (najdScript && document.body.contains(najdScript)) {
        document.body.removeChild(najdScript);
      }
    };
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


      {/* ✅ Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-purple-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-4">
          Register for Your Free Trial
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Start your journey in learning Quran, Arabic, and Islamic Studies. Enroll now and experience our expert teaching approach.
        </p>
      </section>

      {/* ✅ Registration Section */}
      <section id="reg" className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <iframe
            src="https://link.najddigital.com/widget/form/S7HaN54WBMf7M68rnXb4"
            style={{
              width: '100%',
              height: '847px',
              border: 'none',
              borderRadius: '8px',
            }}
            id="inline-S7HaN54WBMf7M68rnXb4"
            data-layout='{"id":"INLINE"}'
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Aisha Quran Academy Free Trial Reg"
            data-height="847"
            data-layout-iframe-id="inline-S7HaN54WBMf7M68rnXb4"
            data-form-id="S7HaN54WBMf7M68rnXb4"
            title="Aisha Quran Academy Free Trial Reg"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default RegisterCoursePage;
