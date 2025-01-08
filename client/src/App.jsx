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
import Dashboard from './pages/Dashboard.jsx'
import RegisterCoursePage from './pages/RegisterCoursePage.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import Users from './pages/dashboard/Users.jsx'

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
      {!authUser && <Header />}
      {authUser && <Navbar />}
      <div className=''>
          {authUser && <Sidebar />}
        <Routes>
          {/* For Not Logged Is User */}
          <Route path='/' element={!authUser ? <HomePage/> : <Dashboard />} />
          <Route path='/dashboard' element={!authUser ? <Navigate to="/"/> : <Dashboard/>} />
          <Route path='/signup' element={!authUser ?  <SignUpPage/> : <Navigate to="/"/>}/>
          <Route path='/login' element={!authUser ? <LogInPage/> : <Navigate to="/"/>}/>
          <Route path='/settings' element={authUser ? <SettingsPage/> : <Navigate to="/"/>}/>
          <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/"/>}/>
          <Route path='/register-course' element={!authUser ? <RegisterCoursePage /> : <Navigate to="/"/>}/>
          <Route path='/all-courses' element={!authUser ? <CoursesPage/> : <Navigate to="/"/>}/>

          {/* For Dashboard */}
          <Route path='/dashboard/users' element={authUser ? <Users/> : <Navigate to="/"/>}/>
        </Routes>
      </div>
      
    </>
  )
}

export default App