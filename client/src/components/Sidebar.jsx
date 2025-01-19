import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel, MdRoom } from 'react-icons/md';
import { Calendar1Icon, Users } from 'lucide-react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStatContext } from '../context/ContextProvider';
import logo from '/assets/AishaLogo.png';

function Sidebar() {

  const {activeMenu , setActiveMenu} = useStatContext();

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white bg-purple-500 text-md m-2'
  const inactiveLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-zinc-700 text-sm m-2 dark:text-zinc-300 dark:hover:text-zinc-900 hover:bg-zinc-200'

  return (
    <div className='pt-5'>
      <Link to='/' className='flex items-center'>
        <img src={logo} alt="Aisha Logo" width={150} height={150}/>
      </Link>
      <button className='block md-hidden  text-2xl rounded-full absolute top-0 right-0 p-3 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900' onClick={() => setActiveMenu(!activeMenu)}> 
        <MdOutlineCancel />
      </button>
      <div className='sidbar-group'>
        <p className='text-gray-500 dark:text-zinc-200 m-3 mt-4 uppercase'>
          Dashboard
        </p>
          <NavLink to={'/dashboard/users'} className={({isActive}) => isActive ? activeLink : inactiveLink}> 
           <Users className='text-md'/>
           <span className='capitalize'>users</span>
          </NavLink>
          <NavLink to={'/dashboard/calender'} className={({isActive}) => isActive ? activeLink : inactiveLink}> 
           <Calendar1Icon className='text-md' />
           <span className='capitalize'>calender</span>
          </NavLink>
          <NavLink to={'/dashboard/classrooms'} className={({isActive}) => isActive ? activeLink : inactiveLink}> 
           <MdRoom className='text-[20px]'/>
           <span className='capitalize'>classrooms</span>
          </NavLink>
      </div>
    </div>
  )
}

export default Sidebar