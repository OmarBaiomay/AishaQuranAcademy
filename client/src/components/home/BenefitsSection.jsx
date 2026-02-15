import React from 'react';
import { Home, UserCheck, Clock, TrendingUp } from 'lucide-react';

const benefitsData = [
  {
    title: "Learn Quran Online from Home",
    description: "Study from the comfort of your home, office, or anywhere in the world",
    icon: Home,
    color: "from-blue-500 to-blue-700"
  },
  {
    title: "Personal Attention from a Dedicated Quran Teacher",
    description: "One-on-one sessions ensure focused learning and rapid progress",
    icon: UserCheck,
    color: "from-emerald-500 to-emerald-700"
  },
  {
    title: "Flexible Timings Across Different Time Zones",
    description: "Schedule classes that fit your lifestyle, no matter where you live",
    icon: Clock,
    color: "from-purple-500 to-purple-700"
  },
  {
    title: "Continuous Progress Tracking and Feedback",
    description: "Regular reports and feedback to monitor your Quran learning journey",
    icon: TrendingUp,
    color: "from-amber-500 to-amber-700"
  }
];

const BenefitsSection = () => {
  return (
    <section className="section bg-gradient-to-b from-gray-50 via-purple-50/30 to-gray-50 dark:from-zinc-800/30 dark:via-purple-900/10 dark:to-zinc-800/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 reveal-up">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Benefits
                </span>
              </div>
            </div>
            <h2 className="headline-2 mx-auto mb-6">
              Why Learning Quran Online Is Effective
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-4xl mx-auto leading-relaxed">
              <strong className="text-purple-600 dark:text-purple-400">Learning Quran online</strong> allows students to study at their own pace while receiving direct guidance from qualified teachers. Our <strong className="text-purple-600 dark:text-purple-400">live online Quran classes</strong> combine traditional teaching methods with modern technology to ensure clarity, consistency, and progress.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefitsData.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 overflow-hidden reveal-up"
                >
                  {/* Background Gradient Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative flex items-start gap-5">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative Corner Element */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-600/5 dark:bg-purple-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center reveal-up">
            <div className="inline-block p-8 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 rounded-3xl shadow-2xl shadow-purple-500/30">
              <p className="text-xl md:text-2xl text-white font-bold mb-2">
                Experience the Future of Quran Education
              </p>
              <p className="text-purple-100 text-lg">
                Join thousands of students learning worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;