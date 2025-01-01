import React, { useEffect } from 'react'
import { Loader } from "lucide-react"
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LogInPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { userAuthStore } from './store/useAuthStore.js'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'

const App = () => {

  const {authUser, checkAuth, isCheckingAuth} = userAuthStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth])

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <>
      <Toaster />

      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        {/* <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/>}/> */}
        <Route path='/signup' element={!authUser ?  <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LogInPage/> : <Navigate to="/"/>}/>
        <Route path='/settings' element={authUser ? <SettingsPage/> : <Navigate to="/"/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/"/>}/>
      </Routes>
      {/* <Sidebar /> */}

    </>
  )
}

export default App