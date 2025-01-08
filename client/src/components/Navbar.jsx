import React, { useState } from 'react'
import { userAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';

const Navbar = () => {
  
  const {authUser, LogOut} = userAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    LogOut();
  }

  return (
    <nav className="fixed flex justify-end items-center shadow-md bg-white w-[-webkit-fill-available] z-10">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input type='submit' value='Log Out' className="primary-purple-btn cursor-pointer" />
      </form>
    </nav>
  )
}

export default Navbar