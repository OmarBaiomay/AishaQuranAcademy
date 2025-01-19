import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { MdFreeCancellation } from "react-icons/md";


const HeroSection = () => {
  return (
    <section id="home" className="pt-28 lg:pt-36">
        <div className="container lg:grid lg:grid-cols-2 items-center lg:gap-10 place-items-center">
            <div>
                <div className="flex items-start gap-3 flex-col">
                    <div className="flex items-center gap-1.5 text-sm tracking-wide">
                        <span className="relative w-2 h-2 rounded-full bg-purple-600">
                            <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping"></span>
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-200" >Start Your Journy With Us Now</span>
                    </div>

                    <h2 className="headline-1">
                      Learn Quran and Arabic Online with Native Tutors
                    </h2>
                    <p className='mb-2 text-md text-zinc-600 dark:text-zinc-200 italic'>
                        High-quality, affordable courses from Al-Azhar University graduates, available anytime, anywhere.
                    </p>

                    <div className="flex justify-center items-center gap-3">
                        <Link to="/register-course" className="btn primary-purple-btn flex items-center justify-center gap-1 max-md:hidden md:justify-self-end">
                        <MdFreeCancellation /> Free Trial
                        </Link>
                        <a href="" className="btn primary-whatsapp-btn flex items-center justify-center gap-1 max-md:hidden md:justify-self-end text-3xl">
                            <FaWhatsapp /> WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>

            <div className="">
                <figure className="shadow-xl w-full max-w-[480px] ml-auto bg-gradient-to-t  from-purple-500 via-40% via-purple-600 to-85% rounded-full overflow-hidden">
                    <img className="w-full" src="/images/hero.png" width={656} height={800} alt="Omar Elbayoumi" />
                </figure>
            </div>
        </div>
      </section>
  )
}

export default HeroSection