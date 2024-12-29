import React from 'react'
import { userAuthStore } from '../store/useAuthStore.js';

const Navbar = () => {

  const {authUser, LogOut} = userAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    LogOut();
  }
    if(!authUser) return null;
    return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input type='submit' value='Log Out' className="btn btn-primary" />
      </form>
    </div>
  )
}

export default Navbar