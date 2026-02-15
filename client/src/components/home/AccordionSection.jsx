import React, { useState } from "react";

const Accordion = () => {
  const faqs = [
    {
      header: "Is it possible to learn Quran online effectively?",
      text: "Yes, live online Quran classes with qualified teachers are highly effective and widely trusted worldwide. Our one-on-one approach ensures personalized attention and rapid progress."
    },
    {
      header: "Who teaches the online Quran classes?",
      text: "All classes are taught by native Arabic tutors, most of whom are graduates of Al-Azhar University. They have years of experience teaching Quran and Arabic to non-native speakers."
    },
    {
      header: "Are the online Quran classes suitable for kids?",
      text: "Absolutely. We offer specialized online Quran classes for kids using age-appropriate teaching methods like Noor Al-Bayan, making learning fun and engaging."
    },
    {
      header: "Do you offer one-on-one Quran classes online?",
      text: "Yes, all our online Quran lessons are conducted one-on-one for maximum focus and progress. This ensures personalized attention from your dedicated Quran teacher."
    },
    {
      header: "Is there a free trial available?",
      text: "Yes, you can register for a free trial class before enrolling. This allows you to experience our teaching methods and meet your tutor."
    },
    {
      header: "What courses are offered at Aisha Quran Academy?",
      text: "We offer Quran recitation, Tajweed, Quran memorization (Hifz), Arabic language, and Islamic studies courses for both kids and adults."
    },
    {
      header: "How are the online Quran classes delivered?",
      text: "Our classes are delivered live online through video conferencing, allowing real-time interaction with your tutor from anywhere in the world."
    },
    {
      header: "What is the cost of online Quran classes?",
      text: "We offer affordable pricing starting from $8 per hour. We have flexible plans to suit different schedules and budgets, with options for 2, 3, or 4 hours per week."
    },
    {
      header: "How can I track my progress in online Quran learning?",
      text: "We provide monthly progress reports and continuous feedback from your teacher. You can monitor your Quran learning journey and see where you need to improve."
    },
    {
      header: "Are the courses suitable for beginners?",
      text: "Yes, our online Quran courses are suitable for complete beginners. We offer personalized attention and start from the basics, progressing at your own pace."
    },
    {
      header: "How can I enroll in online Quran classes?",
      text: "You can enroll by visiting our registration page or contacting us via WhatsApp. We will guide you through the enrollment process and schedule your free trial."
    }
  ];

  const half = Math.ceil(faqs.length / 2);
  const firstHalf = faqs.slice(0, half);
  const secondHalf = faqs.slice(half);

  return (
    <section className="container mx-auto">
      <div className="mx-auto max-w-screen-xl">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-purple-600">
                FAQ
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark dark:text-zinc-100 sm:text-[40px]/[48px]">
                Frequently Asked Questions About Learning Quran Online
              </h2>
              <p className="text-base text-body-color dark:text-dark-6">
                Find answers to common questions about our online Quran classes and learning programs.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            {firstHalf.map((item, index) => (
              <AccordionItem key={index} header={item.header} text={item.text} />
            ))}
          </div>
          <div className="w-full px-4 lg:w-1/2">
            {secondHalf.map((item, index) => (
              <AccordionItem key={index + half} header={item.header} text={item.text} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-[-1]">
        <svg
          width="1440"
          height="886"
          viewBox="0 0 1440 886"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="1308.65"
              y1="1142.58"
              x2="602.827"
              y2="-418.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3056D3" stopOpacity="0.36" />
              <stop offset="1" stopColor="#F5F2FD" stopOpacity="0" />
              <stop offset="1" stopColor="#F5F2FD" stopOpacity="0.096144" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Accordion;

const AccordionItem = ({ header, text }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };

  return (
    <div className="mb-8 w-full rounded-lg bg-white p-4 shadow-[0px_20px_95px_0px_rgba(201,203,204,0.30)] dark:bg-dark-2 dark:shadow-[0px_20px_95px_0px_rgba(0,0,0,0.30)] sm:p-8 lg:px-6 xl:px-8">
      <button className={`faq-btn flex w-full text-left`} onClick={() => handleToggle()}>
        <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-white/5">
          <svg
            className={`fill-primary stroke-primary duration-200 ease-in-out ${active ? "rotate-180" : ""}`}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>
        <div className="w-full">
          <h4 className="mt-1 text-md font-semibold text-dark dark:text-zinc-200">
            {header}
          </h4>
        </div>
      </button>
      <div className={`pl-[62px] duration-200 ease-in-out ${active ? "block" : "hidden"}`}>
        <p className="py-3 text-base leading-relaxed text-body-color dark:text-zinc-300">
          {text}
        </p>
      </div>
    </div>
  );
};