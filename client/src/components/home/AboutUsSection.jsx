import React from 'react';
import { CheckCircle, Users, DollarSign } from 'lucide-react';
import logo from "/assets/AishaIcon.png";

const aboutItems = [
    {
        label: "Online Quran Classes Completed",
        number: 4000,
        icon: CheckCircle,
        color: "from-blue-500 to-blue-700"
    },
    {
        label: "Satisfied Students Worldwide",
        number: 225,
        icon: Users,
        color: "from-purple-500 to-purple-700"
    },
];

function AboutUsSection() {
  return (
    <section className='section bg-white dark:bg-zinc-900 pb-10' id='about'>
        <div className='container'>
            <div className='relative bg-gradient-to-br from-white via-purple-50/50 to-white dark:from-zinc-800 dark:via-purple-900/10 dark:to-zinc-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/30 overflow-hidden reveal-up'>
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-block mb-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                    Our Achievement
                                </span>
                            </div>
                        </div>
                        <h2 className='text-zinc-800 dark:text-zinc-50 font-bold mb-4 text-3xl md:text-4xl'>
                            About Aisha Quran Academy
                        </h2>
                    </div>

                    {/* Description */}
                    <p className='text-zinc-700 dark:text-zinc-300 mb-8 text-base md:text-lg leading-relaxed'>
                        Aisha Quran Academy is a trusted <strong className="text-purple-600 dark:text-purple-400">online Quran academy</strong> providing top-tier Quran and Arabic education to non-native speakers worldwide. Our academy connects students with highly qualified native tutors, primarily graduates from Al-Azhar University in Egypt, ensuring an authentic and enriching learning experience through <strong className="text-purple-600 dark:text-purple-400">live online Quran classes</strong>.
                    </p>
                    
                    {/* Stats Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center'>
                        {/* Stat Items */}
                        {aboutItems.map(({label, number, icon: IconComponent, color}, key) => (
                            <div 
                                className='group bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700' 
                                key={key}
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <div className='flex items-baseline'>
                                        <span className='text-3xl md:text-4xl text-zinc-800 dark:text-zinc-100 font-bold'>
                                            {number.toLocaleString()}
                                        </span>
                                        <span className='text-3xl text-purple-600 font-semibold ml-1'>+</span>
                                    </div>
                                </div>
                                <p className='text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium'>
                                    {label}
                                </p>
                            </div>
                        ))}
                        
                        {/* Price Item */}
                        <div className='group bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300'>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div className='flex items-baseline'>
                                    <span className='text-2xl text-white font-normal'>$</span>
                                    <span className='text-3xl md:text-4xl text-white font-bold'>8</span>
                                </div>
                            </div>
                            <p className='text-sm md:text-base text-purple-100 font-medium'>
                                Starting From Only Per Hour
                            </p>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className='mt-8 flex justify-center md:justify-end'>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            <img 
                                src={logo} 
                                alt='Aisha Quran Academy Logo' 
                                width={100} 
                                height={100} 
                                title="Aisha Quran Academy"
                                loading="lazy"
                                className='relative drop-shadow-2xl group-hover:scale-110 transition-transform duration-500'
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}

export default AboutUsSection;