import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel, MdRoom } from 'react-icons/md';
import { Calendar1Icon, Users } from 'lucide-react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

function Sidebar() {

  const activeMenu = true

  return (
    <div className='h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 pr-10 w-72 fixed'>
      <Link to='/' className='flex items-center'>
        <img src="../AishaLogo.svg" alt="Aisha Logo" width={150} height={150}/>
      </Link>
      <div className=''>
        <p className='text-gray-900 dark:text-zinc-300 m-3 mt-4 uppercase'>
          Dashboard

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Users />  Users
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Calendar1Icon />  Calender
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <MdRoom />  ClassRooms
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Users />  Users
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Users />  Users
          </NavLink>
        </p>
      </div>

      <div className=''>
        <p className='text-gray-900 dark:text-zinc-300 m-3 mt-4 uppercase'>
          Payments

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Users />  New Payment
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Calendar1Icon />  Calender
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <MdRoom />  ClassRooms
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Users />  Users
          </NavLink>

          <NavLink to={'/dashboard/users'} className='flex items-center justify-start gap-2 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900 p-3'> 
           <Users />  Users
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Sidebar