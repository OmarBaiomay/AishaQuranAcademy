import React from 'react'

const HomePage = () => {
  return (
    <main>
      <section id="home" className="pt-28 lg:pt-36">
        <div className="container lg:grid lg:grid-cols-2 items-center lg:gap-10">
            <div>
                <div className="flex items-start gap-3 flex-col">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide">
                        <span className="relative w-2 h-2 rounded-full bg-purple-600">
                            <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping"></span>
                        </span>
                        Start Your Journy With Us Now
                    </div>

                    <h2 className="headline-1 mt-5 mb-8 lg:mb-10 ">
                      Learn Quran and Arabic Online with Native Tutors
                    </h2>

                    <div className="flex justify-center items-center gap-3">
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
    </main>
  )
}

export default HomePage