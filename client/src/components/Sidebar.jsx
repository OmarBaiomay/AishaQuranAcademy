import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { BiSolidCommentCheck } from "react-icons/bi";
import { MdOutlineCancel, MdOutlineClass, MdRoom, MdSettings } from 'react-icons/md';
import { Calendar1Icon, Users } from 'lucide-react';
import { FiBook, FiFileText, FiEdit, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { BsNewspaper } from "react-icons/bs";
import { useStatContext } from '../context/ContextProvider';
import logo from '/assets/AishaLogo.png';

function Sidebar() {
  const { activeMenu, setActiveMenu } = useStatContext();
  const [openDropdown, setOpenDropdown] = useState('');

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? '' : menu);
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white bg-purple-500 text-md m-2';
  const inactiveLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-zinc-700 text-sm m-2 dark:text-zinc-300 dark:hover:text-zinc-900 hover:bg-zinc-200';

  return (
    <div className='pt-5'>
      {/* Logo */}
      <Link to='/' className='flex items-center'>
        <img src={logo} alt="Aisha Logo" width={150} height={150} />
      </Link>

      {/* Close Button */}
      <button
        className='block md:hidden text-2xl rounded-full absolute top-0 right-0 p-3 text-gray-900 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-900'
        onClick={() => setActiveMenu(!activeMenu)}
      >
        <MdOutlineCancel />
      </button>

      {/* Dashboard Group */}
      <div className='sidbar-group'>
        <p className='text-gray-500 dark:text-zinc-200 m-3 mt-4 uppercase'>Dashboard</p>
        <NavLink to='/dashboard' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
          <SiShopware className='text-md' />
          <span className='capitalize'>Dashboard</span>
        </NavLink>
        <div>
          <div className='flex items-center justify-between cursor-pointer p-2' onClick={() => toggleDropdown('dashboard')}>
            <span className='capitalize'>User Management</span>
            {openDropdown === 'dashboard' ? <FiChevronDown /> : <FiChevronRight />}
          </div>
          {openDropdown === 'dashboard' && (
            <div className='pl-4'>
              <NavLink to='/dashboard/users' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
                <Users className='text-md' />
                <span className='capitalize'>Users</span>
              </NavLink>
              <NavLink to='/dashboard/calender' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
                <Calendar1Icon className='text-md' />
                <span className='capitalize'>Calendar</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Class Management Group */}
      <div className='sidbar-group'>
        <p className='text-gray-500 dark:text-zinc-200 m-3 mt-4 uppercase'>Classes</p>
        <div className='flex items-center justify-between cursor-pointer p-2' onClick={() => toggleDropdown('classes')}>
          <span className='capitalize'>Class Management</span>
          {openDropdown === 'classes' ? <FiChevronDown /> : <FiChevronRight />}
        </div>
        {openDropdown === 'classes' && (
          <div className='pl-4'>
            <NavLink to='/dashboard/classrooms' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
              <MdRoom className='text-[20px]' />
              <span className='capitalize'>Classrooms</span>
            </NavLink>
            <NavLink to='/dashboard/courses' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
              <MdOutlineClass className='text-[20px]' />
              <span className='capitalize'>Courses</span>
            </NavLink>
            <NavLink to='/register-course' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
              <FiBook className='text-[20px]' />
              <span className='capitalize'>Register Course</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Blog & Testimonials Group */}
      <div className='sidbar-group'>
        <p className='text-gray-500 dark:text-zinc-200 m-3 mt-4 uppercase'>Blog & Feedback</p>
        <div className='flex items-center justify-between cursor-pointer p-2' onClick={() => toggleDropdown('blog')}>
          <span className='capitalize'>Blog & Testimonials</span>
          {openDropdown === 'blog' ? <FiChevronDown /> : <FiChevronRight />}
        </div>
        {openDropdown === 'blog' && (
          <div className='pl-4'>
            <NavLink to='/blogs' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
              <BsNewspaper className='text-[20px]' />
              <span className='capitalize'>Blog</span>
            </NavLink>
            <NavLink to='/blogs/create' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
              <FiEdit className='text-[20px]' />
              <span className='capitalize'>Add Blog</span>
            </NavLink>
            <NavLink to='/dashboard/testimonials' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
              <BiSolidCommentCheck className='text-[20px]' />
              <span className='capitalize'>Testimonials</span>
            </NavLink>
            <NavLink to='/dashboard/categories' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
              <BiSolidCommentCheck className='text-[20px]' />
              <span className='capitalize'>Categories</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Reports Group */}
      <div className='sidbar-group'>
        <p className='text-gray-500 dark:text-zinc-200 m-3 mt-4 uppercase'>Reports</p>
        <NavLink to='/dashboard/reports' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
          <FiFileText className='text-[20px]' />
          <span className='capitalize'>Reports</span>
        </NavLink>
      </div>

      {/* Settings Group */}
      <div className='sidbar-group'>
        <p className='text-gray-500 dark:text-zinc-200 m-3 mt-4 uppercase'>Settings</p>
        <NavLink to='/settings' className={({ isActive }) => isActive ? activeLink : inactiveLink}>
          <MdSettings className='text-[20px]' />
          <span className='capitalize'>Settings</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
