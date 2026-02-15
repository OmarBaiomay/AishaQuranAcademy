import React, { useState,useEffect } from "react";
import { Helmet } from "react-helmet";
import RegistrationForm from '../components/home/RegistrationFormSection'

const CoursesPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      _id: "1",
      title: "First Steps to Arabic",
      about:
        "Perfect for young beginners, this course introduces the Arabic alphabet, correct pronunciation, and foundational reading and writing skills through interactive and engaging lessons.",
      content: [
        "The Arabic alphabet and correct pronunciation",
        "Letter shapes in the beginning, middle, and end of words",
        "Short vowels: Fatha, Kasra, and Damma",
        "Tanween, Madd (long vowels), Sukoon, and Shadda",
        "Alif Maqsuraa and Hamza"
      ],
      forAdults: false,
      forKids: true,
      image: "/images/courses/first_steps_to_arabic.webp"
    },
    {
      _id: "2",
      title: "Learning Arabic",
      about:
        "A full Arabic language course focusing on listening, speaking, reading, and writing to help learners confidently use the language in real-life situations.",
      content: [
        "Engage in conversations with native speakers",
        "Improve fluency and pronunciation",
        "Understand various dialects and accents",
        "Respond confidently and spontaneously in conversations",
        "Comprehend spoken Arabic in diverse situations"
      ],
      forAdults: true,
      forKids: true,
      image: "/images/courses/learning_arabic.webp"
    },
    {
      _id: "3",
      title: "Arabic Phonetics",
      about:
        "This course develops your understanding of the phonetic structure of Arabic through studying articulation points (Makharij) and characteristics of letters (Sifaat).",
      content: [
        "Correct pronunciation of all 28 Arabic letters",
        "Deep understanding of articulation and letter characteristics",
        "Improve clarity and precision in speech",
        "Exercises to distinguish between similar sounds"
      ],
      forAdults: true,
      forKids: false,
      image: "/images/courses/arabic_phonatics.webp"
    },
    {
      _id: "4",
      title: "Quran Recitation",
      about:
        "Designed to help students recite the Quran accurately with the correct rhythm, tone, and Tajweed rules.",
      content: [
        "Proper Quran recitation with guidance",
        "Application of Tajweed rules",
        "Recitation practice with teacher feedback",
        "Understand meanings to enhance pronunciation",
        "Memorization techniques for fluency"
      ],
      forAdults: true,
      forKids: true,
      image: "/images/courses/quran_recitation.webp"
    },
    {
      _id: "5",
      title: "Quran Memorization",
      about:
        "This course supports learners in memorizing the Quran step-by-step with experienced tutors and consistent follow-up.",
      content: [
        "Structured memorization of Quranic verses",
        "Memory techniques for long-term retention",
        "Understanding the meanings of verses",
        "Regular reviews and teacher evaluation",
        "Building discipline and consistency"
      ],
      forAdults: true,
      forKids: true,
      image: "/images/courses/quran_memorization.webp"
    },
    {
      _id: "6",
      title: "Learn Tajweed",
      about:
        "A full journey through the rules of Tajweed, this course is ideal for anyone looking to perfect their recitation of the Quran.",
      content: [
        "All foundational and advanced Tajweed rules",
        "How to apply Tajweed in daily recitation",
        "Identifying and fixing common mistakes",
        "Practice through guided sessions",
        "Build fluency with correct pronunciation"
      ],
      forAdults: true,
      forKids: true,
      image: "/images/courses/learn_tajweed.webp"
    },
    {
      _id: "7",
      title: "Noor Albayan",
      about:
        "Based on the Noor Albayan method, this course teaches kids to read Arabic and the Quran fluently and correctly.",
      content: [
        "Phonetic Arabic reading skills",
        "Proper articulation and pronunciation",
        "Reading with fluency and Tajweed basics",
        "Solid foundation for Quran recitation",
        "Recognition of letter forms and sounds"
      ],
      forAdults: false,
      forKids: true,
      image: "/images/courses/noor_albayan.png"
    },
    {
      _id: "8",
      title: "Egyptian Dialect",
      about:
        "This course is focused on everyday Egyptian Arabic for learners who want to engage in real-life conversation naturally and confidently.",
      content: [
        "Essential daily expressions and idioms",
        "Listening comprehension in Egyptian dialect",
        "Cultural insights and appropriate usage",
        "Improve fluency in informal speech",
        "Roleplay and scenario-based learning"
      ],
      forAdults: true,
      forKids: false,
      image: "/images/courses/egyptian_dialect.webp"
    },
    {
      _id: "9",
      title: "Islamic Studies",
      about:
        "A structured course to deepen the understanding of Islam, covering beliefs, practices, and moral teachings with engaging lessons.",
      content: [
        "Islamic beliefs (Aqeedah) and the five pillars",
        "Life and stories of the Prophets",
        "Practical Fiqh for daily worship",
        "Islamic manners and ethics",
        "Application of Islamic teachings in daily life"
      ],
      forAdults: true,
      forKids: true,
      image: "/images/courses/islamic_studies.webp"
    },
    {
      _id: "10",
      title: "Qasas Al-Anbiya’a",
      about:
        "A storytelling-based course that brings to life the stories of the Prophets (peace be upon them) to inspire love for Islam and strengthen faith.",
      content: [
        "Stories of Prophets and their life journeys",
        "Moral and spiritual lessons from their struggles",
        "Historical understanding of Islamic roots",
        "Real-life application of Prophetic examples",
        "Emotional connection with Islamic history"
      ],
      forAdults: true,
      forKids: true,
      image: "/images/courses/qusas_elanbyaa.webp"
    },
    {
      _id: "11",
      title: "Hadith",
      about:
        "This course introduces students to the sayings of the Prophet Muhammad ﷺ and how they shape Islamic thought and behavior.",
      content: [
        "What Hadith is and why it matters",
        "Study selected authentic Hadiths",
        "Understand the context and meanings",
        "Apply Hadith in everyday behavior",
        "Memorize and reflect on key narrations"
      ],
      forAdults: true,
      forKids: true,
      image: "/images/courses/Hadith.webp"
    },
    {
      _id: "12",
      title: "AlFiqh AlMuyassar",
      about:
        "A simplified course in Islamic jurisprudence (Fiqh), offering practical knowledge on purification, prayer, fasting, and more.",
      content: [
        "Basic rulings for worship and daily life",
        "Differences between schools of thought",
        "Simple and clear explanations of Fiqh issues",
        "Understand how rulings apply in modern times",
        "Build confidence in Islamic practice"
      ],
      forAdults: true,
      forKids: false,
      image: "/images/courses/alFiqh_alMuyassar.webp"
    }
  ];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.najddigital.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Arabic & Quran Courses – Tajweed, Dialects & Islamic Studies</title>
      <meta name="description" content="Join our interactive courses to learn Arabic, Quran recitation, Tajweed, Egyptian dialect, and Islamic studies for beginners, kids, and adults." />
      <meta name="keywords" content="learn Arabic, Quran courses, Tajweed, Egyptian dialect, Islamic studies, Quran memorization, Prophets stories, Hadith, Fiqh, Noor Albayan" />
      <meta name="author" content="Omar Elbayoumi" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://aishaquran.com/courses" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://aishaquran.com/courses" />
      <meta property="og:title" content="Arabic & Quran Courses – Tajweed, Dialects & Islamic Studies" />
      <meta property="og:description" content="Explore engaging Arabic and Quran courses including Tajweed, Egyptian dialect, and Islamic studies for all ages." />
      <meta property="og:image" content="https://aishaquran.com/assets/socialImage.png" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Arabic & Quran Courses – Tajweed, Dialects & Islamic Studies" />
      <meta name="twitter:description" content="Join our interactive courses to learn Arabic, Quran recitation, Tajweed, Egyptian dialect, and Islamic studies for all ages." />
      <meta name="twitter:image" content="https://aishaquran.com/assets/socialImage.png" />
      <meta name="twitter:site" content="@AishaAcademy" />
    </Helmet>

    <div className="pt-32 px-10">
      <h1 className="text-3xl font-bold text-zinc-700 mb-8 text-center">Our Courses</h1>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={course.image || "https://via.placeholder.com/300"}
                alt={course.title}
                className="w-full h-auto object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-zinc-800">{course.title}</h2>
                <div className="mt-4">
                  {course.forAdults && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2">For Adults</span>}
                  {course.forKids && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">For Kids</span>}
                </div>
                <div className="mt-4">
                  <p className="text-zinc-600">{course.about}</p>
                </div>
                <div className="mt-4 buttons-wrapper flex justify-start items-center gap-4">
                <button
                  className="block bg-purple-500 text-white text-center rounded-lg px-4 py-2 mt-6 hover:bg-purple-600"
                  onClick={() => setSelectedCourse(course)}
                >
                  Details
                </button>

                <a href="#reg" className="block bg-green-500 text-white text-center rounded-lg px-4 py-2 mt-6 hover:bg-green-600">
                  Enroll Now
                </a>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      <section id="reg" className="pt-20 px-4 pb-28 dark:from-zinc-900 dark:to-zinc-800">
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

      {/* Modal for Course Details */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedCourse(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">{selectedCourse.title}</h2>
            <p className="text-zinc-600 mb-6">{selectedCourse.about}</p>
            <h3 className="text-lg font-bold text-zinc-800 mb-2">What will the student learn?</h3>
            <ul className="list-disc list-inside text-zinc-600">
              {selectedCourse.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="mt-6">
              {selectedCourse.forAdults && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2">For Adults</span>}
              {selectedCourse.forKids && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">For Kids</span>}
            </div>
            <button
              className="bg-purple-500 text-white text-center rounded-lg px-4 py-2 mt-6 hover:bg-purple-600"
              onClick={() => setSelectedCourse(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default CoursesPage;