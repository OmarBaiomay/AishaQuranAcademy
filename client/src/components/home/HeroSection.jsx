import React from 'react'
import Mode from '../../utils/mode'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'

const HeroSection = () => {
  return (
    <section id="home" className="pt-28 lg:pt-36">
        <div className="container lg:grid lg:grid-cols-2 items-center lg:gap-10">
            <div>
                <div className="flex items-start gap-3 flex-col">
                    <div className="flex items-center gap-1.5 text-zinc-200 text-sm tracking-wide">
                        <span className="relative w-2 h-2 rounded-full bg-purple-600">
                            <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping"></span>
                        </span>
                        Start Your Journy With Us Now
                    </div>

                    <h2 className="headline-1 mt-5 ">
                      Learn Quran and Arabic Online with Native Tutors
                    </h2>
                    <p className='mb-5 text-md text-zinc-200 italic'>
                        High-quality, affordable courses from Al-Azhar University graduates, available anytime, anywhere.
                    </p>

                    <div className="flex justify-center items-center gap-3">
                        <Link to="/register-course" className="btn primary-purble-btn max-md:hidden md:justify-self-end">
                            Free Trial
                        </Link>
                        <a href="" className="btn primary-whatsapp-btn flex items-center justify-center gap-1 max-md:hidden md:justify-self-end">
                            <FaWhatsapp /> WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block">
                <figure className="shadow-xl w-full max-w-[480px] ml-auto bg-gradient-to-t  from-purple-500 via-40% via-purple-600 to-85% rounded-full overflow-hidden">
                    <img className="w-full" src="/images/hero.png" width={656} height={800} alt="Omar Elbayoumi" />
                </figure>
            </div>
        </div>
      </section>
  )
}

export default HeroSection