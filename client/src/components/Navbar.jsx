import React, { useState } from 'react'
import { userAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from "react-icons/bs";
import { IoNotificationsOutline } from 'react-icons/io5';
import { MdAccountCircle } from 'react-icons/md';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups/index.js';
import avatar from '/assets/user.svg';
import { useStatContext } from '../context/ContextProvider';


const Navbar = () => {

  const {activeMenu , setActiveMenu} = useStatContext();
  
  const NavButton = ({title, customFunc, icon, color, dotColor, tooltip, iconStyles}) => (
    <TooltipComponent content={tooltip} position='BottomCenter'>
      <button onClick={customFunc} className='flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-200'>
        <span className={`text-2xl text-${color} ${iconStyles}`}>
          {icon}
        </span>
      </button>
    </TooltipComponent>
  )

  const {authUser, LogOut} = userAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    LogOut();
  }

  return (
    <nav className="fixed flex justify-between items-center shadow-md bg-white w-[-webkit-fill-available] z-10 py-3 px-2">
      <NavButton title='Menu' icon={<AiOutlineMenu />} color='purple-600' dotColor='purple' tooltip='Chat' customFunc={() => setActiveMenu(!activeMenu)} />

      <div className='flex gap-2 justify-center items-center'>
        <NavButton title='Chat' icon={<BsChatLeft />} color='purple-600' dotColor='purple' tooltip='Chat' iconStyles={'text-xl'} />
        <NavButton title='Notifications' icon={<IoNotificationsOutline />} color='purple-600' dotColor='purple' tooltip='Notifications' />
        <Link to='/profile' className='flex items-center gap-1'>
          <img src={avatar} alt="User Avatar" className='w-5 rounded-full' />
          <span className='text-zinc-600'>Hi, </span><span className='text-zinc-700 font-bold'>{authUser?.firstName}</span>
          <MdKeyboardArrowDown className='text-purple-600' />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar


// <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//         <input type='submit' value='Log Out' className="primary-purple-btn cursor-pointer" />
//       </form>