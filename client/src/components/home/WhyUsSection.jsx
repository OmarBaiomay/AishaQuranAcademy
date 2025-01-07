import React from 'react'
import { Player } from 'video-react';

const whyItems = [
    {
        label: "Native Tutors",
        discription: "Native Qualified Arabic Tutors",
        img: '/images/egypt.png'
    },

    {
        label: "Al-Azhar University",
        discription: "Native Arabic graduate from Al-Azhar University ",
        img: '/images/azhar.png'
    },

    {
        label: "Online Classes",
        discription: "Attend your classes anytime, anywhere.",
        img: '/images/online.png'
    },
]

function WhyUsSection() {
  return (
    <section id="whyus" className="pt-20">
        <div className="container flex flex-col items-center justify-center">
            <h2 className="text:2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-300 mb-4">Why Should You Choose Us....</h2>
            <div className='w-full'>
                <div className='flex flex-wrap gap-6 items-center justify-center md:items-center md:justify-between'>
                {
                    whyItems.map(({label, discription, img}, key) =>(
                        <div className='flex flex-col items-center justify-center' key={key}>
                            <div className='flex items-center md:mb-2'>
                                <img src={img} alt='logo' width={140} height={140} className='m-auto rounded-full drop-shadow-xl'/>
                            </div>
                            <div className='flex items-center md:mb-2'>
                                <span className='text-xl text-zinc-800 dark:text-zinc-300 font-bold'>{label}</span>
                            </div>
                            <div className='flex items-center md:mb-2 max-w-[80%] text-center'>
                                <span className='text-md text-zinc-800 dark:text-zinc-300'>{discription}</span>
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>

            <div className="w-full my-20">
            <Player
                playsInline
                poster="/images/video.png"
                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
            />
            </div>
        </div>
      </section>
  )
}

export default WhyUsSection