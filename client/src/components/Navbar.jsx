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
import Chat from './dashboard/Chat.jsx';
import Notifications from './dashboard/Notifications.jsx';
import Profile from './dashboard/Profile.jsx';
import { LogOutIcon } from 'lucide-react';


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
    <nav className="fixed flex justify-between items-center shadow-md bg-white w-[-webkit-fill-available] z-10 py-3 px-5">

      <NavButton title='Menu' icon={<AiOutlineMenu />} color='purple-600' dotColor='purple' tooltip='Chat' customFunc={() => setActiveMenu(!activeMenu)} />

      <div className='flex gap-2 justify-center items-center'>
        <NavButton title='Chat' icon={<BsChatLeft />} color='purple-600' dotColor='purple' tooltip='Chat' iconStyles={'text-xl'} />
        <NavButton title='Notifications' icon={<IoNotificationsOutline />} color='purple-600' dotColor='purple' tooltip='Notifications' />
        <NavButton title='Log Out' icon={<LogOutIcon/>} color='purple-600' dotColor='purple' tooltip='Log Out' customFunc={handleSubmit}/>
        <TooltipComponent content={'profile'} position='BottomCenter'>
          <Link to={`/profile/${authUser._id}`} className='flex items-center gap-1'>
            <img src={avatar} alt="User Avatar" className='w-5 rounded-full' />
            <span className='text-zinc-600'>Hi, </span><span className='text-zinc-700 font-bold'>{authUser?.fullName.split(" ")[0]}</span>
            <MdKeyboardArrowDown className='text-purple-600' />
          </Link>
        </TooltipComponent>
        
      </div>
    </nav>
  )
}

export default Navbar