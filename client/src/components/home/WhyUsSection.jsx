import React from 'react';
import { Award, GraduationCap, Video, Users, Calendar, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

const whyItems = [
    {
        label: "Native Arabic Quran Teachers",
        description: "Native Qualified Arabic Tutors with proven teaching experience",
        img: '/images/egypt.png',
        icon: Award
    },
    {
        label: "Certified Al-Azhar University Graduates",
        description: "All our tutors are graduates from Al-Azhar University in Egypt",
        img: '/images/azhar.png',
        icon: GraduationCap
    },
    {
        label: "Live Online Quran Classes",
        description: "Not pre-recorded - attend live classes anytime, anywhere",
        img: '/images/online.png',
        icon: Video
    },
];

const additionalBenefits = [
  { text: "One-on-One Personalized Learning", icon: Users },
  { text: "Flexible Schedules for Kids & Adults", icon: Calendar },
  { text: "Affordable Pricing with Free Trial", icon: DollarSign },
  { text: "Progress Tracking & Feedback", icon: TrendingUp }
];

function WhyUsSection() {
  return (
    <section id="whyus" className="section bg-white dark:bg-zinc-900 relative overflow-hidden pb-7">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 reveal-up">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Trust & Authority
              </span>
            </div>
          </div>
          <h2 className="headline-2 mx-auto mb-6">
            Why Thousands Choose Aisha Quran Academy
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Experience excellence in Quran education with certified native tutors
          </p>
        </div>
        
        {/* Main Features */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {whyItems.map(({label, description, img, icon: IconComponent}, key) => (
            <div 
              className='group relative flex flex-col items-center text-center bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 overflow-hidden reveal-up' 
              key={key}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
              
              {/* Image */}
              <div className='relative mb-6'>
                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img 
                    src={img} 
                    alt={label} 
                    width={140} 
                    height={140}
                    title={label}
                    loading="lazy"
                    className='relative rounded-full shadow-2xl group-hover:scale-105 transition-transform duration-500 border-4 border-white dark:border-zinc-800'
                    />
              </div>
              
              {/* Icon Badge */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className='relative text-2xl text-zinc-800 dark:text-zinc-100 font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
                {label}
              </h3>
              <p className='relative text-md text-zinc-600 dark:text-zinc-400 leading-relaxed'>
                {description}
              </p>

              {/* Decorative Corner */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-600/10 dark:bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="reveal-up">
          <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 dark:from-zinc-800 dark:via-zinc-800/50 dark:to-zinc-800 p-8 rounded-3xl border border-purple-200 dark:border-purple-900/30 shadow-xl">
            <h3 className="text-2xl font-bold text-center text-zinc-800 dark:text-zinc-100 mb-8">
              Additional Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {additionalBenefits.map(({text, icon: IconComponent}, index) => (
                <div 
                  key={index}
                  className="group flex items-center gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;