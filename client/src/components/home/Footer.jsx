import React from 'react'
import { MdFreeCancellation } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import FreeTrialButton from '../common/FreeTrialButton';
import CallUsButton from '../common/CallUsButton';
import { FaPhoneAlt } from 'react-icons/fa';

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
      href: '/coursess'
    },
    {
      label: 'Blogs',
      href: '/blogs'
    },
    {
      label: 'Privacy Policy',
      href: '/privacy-policy'
    },
    {
      label: 'Terms of Use and Policy',
      href: '/terms'
    },
  ];
  
  const socials = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=100086610662274&mibextid=ZbWKwL'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/aisha-quran-academy'
    },
    {
      label: 'Twitter X',
      href: 'https://x.com/AishaAcademy1?t=a2BtsSzcHkxOMVjvpze3Bw&s=09'
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/aisha_academy1/'
    },
    {
      label: 'Whatsapp',
      href: 'https://wa.me/201227307646?text=Hello%20I%20Want%20To%20Know%20More%20About%20The%20Academy%20Courses%20and%20Offers'
    },
    {
      label: 'Youtube',
      href: 'https://www.youtube.com/@Aisha_Quran_Academy'
    },
  ];

const Footer = () => {

  const navigate = useNavigate();

  const handleClick = (href) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="section">
        <div className="container">
            <div className="lg:grid lg:grid-cols-2">
                <div className="mb-10">
                    <h2 className="headline-1 mb-8 lg-max-w-[12ch]">
                        Let&apos;s Start Learning Today!
                    </h2>
                    <div className='flex'>
                      <FreeTrialButton />
                      <CallUsButton
                        label="Call Us Now"
                        icon={FaPhoneAlt}
                        className="text-xl md:hidden"
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:pl-20">
                    <div className=''>
                        <p className="mb-2 reveal-up">Sitemap</p>
                        <ul>
                        {
                            sitemap.map(({label, href}, key) =>(
                                <button
                                  key={key}
                                  onClick={() => handleClick(href)}
                                  className="block text-sm text-zinc-400 py-1 transition-all hover:text-zinc-200 reveal-up text-left">
                                  {label}
                                </button>
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