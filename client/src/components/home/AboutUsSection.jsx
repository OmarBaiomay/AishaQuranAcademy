import { number } from 'prop-types'
import React from 'react'
import logo from "/assets/AishaLogo.svg"


const aboutItems = [
    {
        label: "Classes Done",
        number: 4000
    },
    {
        label: "Saitisfied Students",
        number: 225
    },
]


function AboutUsSection() {
  return (
    <section className='section' id='about'>
        <div className='container'>
            <div className='bg-white border-1 dark:border-none dark:bg-zinc-800/50 p-7 rounded-2xl md:p-12 '>
            <h2 className='text-zinc-800 dark:text-zinc-50 font-bold mb-4 md:text-3xl'>About Us</h2>
                <p className='text-zinc-800 dark:text-zinc-50 mb-4 md:mb-8 md:text-md'>
                    Aisha Quran Academy is an innovative online platform dedicated to providing non-native speakers with top-tier Quran and Arabic education. Our academy connects students with highly qualified native tutors, primarily graduates from Al-Azhar University in Egypt, ensuring an authentic and enriching learning experience. By offering flexible, convenient classes that can be accessed from home, the office, or any location, we aim to make quality Quranic and Islamic education accessible to all, while fostering good Islamic manners in our students.
                </p>
                <div className='flex flex-wrap items-center gap-4 md:gap-7'>
                    {
                        aboutItems.map(({label, number}, key) =>(
                            <div className='' key={key}>
                                <div className='flex items-center md:mb-2'>
                                    <span className='text-2xl text-zinc-800 dark:text-zinc-300 font-bold md:text-4xl'>{number}</span>
                                    <span className='text-2xl text-purple-600 font-semibold'> +</span>
                                </div>
                                <p className='text-sm text-zinc-700 dark:text-zinc-100'>{label}</p>
                            </div>
                        ))
                    }
                    <div className=''>
                        <div className='flex items-center md:mb-2'>
                            <span className='text-2xl text-zinc-800 dark:text-zinc-300 font-bold md:text-4xl'>8</span>
                            <span className='text-2xl text-purple-600 font-semibold'></span>
                        </div>
                        <p className='text-sm text-zinc-700 dark:text-zinc-100'>USD Only Per Hour</p>
                    </div>
                    <img src={logo} alt='logo' width={150} height={150} className='ml-auto'/>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AboutUsSection