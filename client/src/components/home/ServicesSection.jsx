import React from 'react';
import { BookOpen, Award, Brain, Baby, GraduationCap, Languages } from 'lucide-react';

const servicesData = [
  {
    title: "Online Quran Recitation Classes",
    description: "Learn to recite the Quran correctly with proper Tajweed",
    icon: BookOpen,
    color: "from-purple-500 to-purple-700"
  },
  {
    title: "Learn Tajweed Online",
    description: "Master Tajweed rules step by step",
    icon: Award,
    color: "from-blue-500 to-blue-700"
  },
  {
    title: "Quran Memorization Online",
    description: "Structured Hifz programs with continuous follow-up",
    icon: Brain,
    color: "from-emerald-500 to-emerald-700"
  },
  {
    title: "Online Quran Classes for Kids",
    description: "Fun, engaging lessons using Noor Al-Bayan methodology",
    icon: Baby,
    color: "from-pink-500 to-pink-700"
  },
  {
    title: "Online Quran Classes for Adults",
    description: "Flexible and goal-oriented learning",
    icon: GraduationCap,
    color: "from-indigo-500 to-indigo-700"
  },
  {
    title: "Learn Arabic Online",
    description: "From basics to advanced communication",
    icon: Languages,
    color: "from-amber-500 to-amber-700"
  }
];

const ServicesSection = () => {
  return (
    <section className="section bg-white dark:bg-zinc-900 pb-7">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16 reveal-up">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Our Courses
              </span>
            </div>
          </div>
          <h2 className="headline-2 mx-auto mb-4">
            Our Online Quran Classes
          </h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto">
            At Aisha Quran Academy, we offer a complete range of <strong className="text-purple-600 dark:text-purple-400">online Quran courses</strong> tailored to different ages and learning levels
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800/50 dark:to-zinc-900/50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 overflow-hidden reveal-up"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="relative text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {service.title}
                </h3>
                <p className="relative text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative Element */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-600/5 dark:bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="text-center reveal-up">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-lg shadow-purple-500/50">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            <p className="text-lg text-white font-semibold">
              All courses are delivered live by experienced tutors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;