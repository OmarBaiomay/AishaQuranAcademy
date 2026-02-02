import React, { useState } from "react";

const Accordion = () => {
  const faqs = [
    {
      header: "What is Aisha Quran Academy?",
      text: "Aisha Quran Academy is an online Quran Academy based in Egypt that provides a wide range of courses customized for kids and adults, including Quran, Arabic, and Islamic studies."
    },
    {
      header: "Who teaches the courses at Aisha Quran Academy?",
      text: "All of our courses are taught by expert native Arabic-qualified teachers. They have years of experience and are highly trained to provide the best education for you and your kids."
    },
    {
      header: "How are the courses customized to meet individual needs?",
      text: "Our courses are designed to meet the specific needs and learning styles of each individual student. We offer personalized attention and feedback to help our students succeed."
    },
    {
      header: "What courses are offered at Aisha Quran Academy?",
      text: "We offer courses in Quran, Arabic, and Islamic studies. Our courses cover a wide range of topics and are designed to provide a comprehensive education."
    },
    {
      header: "How are the courses delivered?",
      text: "Our courses are delivered online, which allows our students to learn at their own pace and from the comfort of their own home."
    },
    {
      header: "What is the cost of the courses at Aisha Quran Academy?",
      text: "We offer affordable prices for our courses, and no matter what is your budget limit, we will find a suitable plan for you. Please visit our website or contact us for more information."
    },
    {
      header: "How can I track my progress?",
      text: "We offer the ability to track your progress and receive feedback from your teachers. You can monitor your progress and see where you need to improve."
    },
    {
      header: "Are the courses suitable for beginners?",
      text: "Yes, our courses are suitable for beginners. We offer personalized attention and feedback to help our students succeed."
    },
    {
      header: "How can I enroll in a course?",
      text: "You can enroll in a course by visiting our website or contacting us. We will guide you through the enrollment process."
    },
    {
      header: "Is there a free trial available?",
      text: "Yes, we offer a free trial for all our courses. Please visit our website or contact us for more information."
    },
    {
      header: "What if I have additional questions?",
      text: "If you have additional questions, please feel free to contact us. We are happy to answer any questions you may have and provide more information about our courses."
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
              <span className="mb-2 block text-lg font-semibold text-primary">
                FAQ
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark dark:text-zinc-100 sm:text-[40px]/[48px]">
                Any Questions? Look Here
              </h2>
              <p className="text-base text-body-color dark:text-dark-6">
                Find the answers to the most common questions about Aisha Quran Academy.
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
    event.preventDefault();
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
          <h4 className="mt-1 text-md font-semibold text-dark dark:text-zinc-800">
            {header}
          </h4>
        </div>
      </button>
      <div className={`pl-[62px] duration-200 ease-in-out ${active ? "block" : "hidden"}`}>
        <p className="py-3 text-base leading-relaxed text-body-color dark:text-zinc-800">
          {text}
        </p>
      </div>
    </div>
  );
};
