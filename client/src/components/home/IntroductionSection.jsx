import React from 'react';
import { BookOpen, Users, Target } from 'lucide-react';

const IntroductionSection = () => {
  return (
    <section className="section bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-zinc-900">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-12 reveal-up">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Our Approach
                </span>
              </div>
            </div>
            <h2 className="headline-2 mx-auto mb-6 text-center w-100">
              Learn Quran and Arabic Online the Right Way
            </h2>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-xl border border-purple-100 dark:border-purple-900/50 reveal-up">
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed text-center">
              Aisha Quran Academy is a trusted <span className="font-semibold text-purple-600 dark:text-purple-400">online Quran academy</span> dedicated to helping non-native speakers <span className="font-semibold text-purple-600 dark:text-purple-400">learn Quran online</span> through live, one-on-one classes with qualified native Arabic tutors.
            </p>
            
            {/* Three Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-800 border border-purple-100 dark:border-purple-900/30 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 mb-2">For Beginners</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Start from basics with patient guidance</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-800 border border-purple-100 dark:border-purple-900/30 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 mb-2">For Adults</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Goal-oriented flexible learning</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-800 border border-purple-100 dark:border-purple-900/30 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 mb-2">For Kids</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Fun, engaging interactive lessons</p>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-purple-600/10 via-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:via-purple-800/20 dark:to-purple-900/20 border-l-4 border-purple-600">
              <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed text-center font-medium">
                Our mission is to make <span className="text-purple-600 dark:text-purple-400 font-bold">online Quran learning</span> effective, engaging, and spiritually enriching—no matter where you are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;