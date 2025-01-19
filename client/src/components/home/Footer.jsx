import React from 'react'
import { MdFreeCancellation } from 'react-icons/md';
import { Link } from 'react-router-dom';

const sitemap = [
    {
      label: 'Home',
      href: '/'
    },
    {
      label: 'Register Course',
      href: '/register-course'
    },
    {
      label: 'All Courses',
      href: '/all-courses'
    },
  ];
  
  const socials = [
    {
      label: 'Facebook',
      href: ''
    },
    {
      label: 'LinkedIn',
      href: ''
    },
    {
      label: 'Twitter X',
      href: ''
    },
    {
      label: 'Instagram',
      href: ''
    },
  ];

const Footer = () => {
  return (
    <footer className="section">
        <div className="container">
            <div className="lg:grid lg:grid-cols-2">
                <div className="mb-10">
                    <h2 className="headline-1 mb-8 lg-max-w-[12ch]">
                        Let&apos;s Start Learning Today!
                    </h2>
                    <Link to="/register-course" className="btn primary-purple-btn flex items-center justify-center gap-1 max-md:hidden md:justify-self-end">
                        <MdFreeCancellation /> Free Trial
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:pl-20">
                    <div className=''>
                        <p className="mb-2 reveal-up">Sitemap</p>
                        <ul>
                        {
                            sitemap.map(({label, href}, key) =>(
                                <li key={key}>
                                    <a href={href} className='block text-sm text-zinc-400 py-1 transition-all hover:text-zinc-200 reveal-up' >
                                        {label}
                                    </a>
                                </li>
                            ))
                        }
                        </ul>
                    </div>

                    <div className=''>
                        <p className="mb-2 reveal-up">Social Links</p>
                        <ul>
                        {
                            socials.map(({label, href}, key) =>(
                                <li key={key}>
                                    <a href={href} className='block text-sm text-zinc-400 py-1 transition-all hover:text-zinc-200 reveal-up' target='_blank'>
                                        {label}
                                    </a>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-10 mb-8 pb-10">
                <a href="" className='reveal-up'>
                    <img src="/assets/AishaIcon.png" width={40} height={40} alt="Logo"/>
                </a>
                <p className='text-zinc-500 text-sm reveal-up'>
                    &copy; {new Date().getFullYear()} <a href='https://www.b-code.tech' target='_blank' className='text-purple-500'>B-Code | Omar Elbayoumi</a>
                </p>
            </div>
        </div>
    </footer>
  )
}

export default Footer