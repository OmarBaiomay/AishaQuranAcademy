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
    <nav className="fixed w-full top-0 left-0 bg-zinc-500">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input type='submit' value='Log Out' className="btn btn-purple-primary" />
      </form>
    </nav>
  )
}

export default Navbar