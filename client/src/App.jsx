import React, { useEffect } from 'react'
import { useStatContext } from './context/ContextProvider'
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
import Calender from './pages/dashboard/Calender.jsx'
import Classrooms from './pages/dashboard/Classrooms.jsx'
import UserDetails from './pages/dashboard/UserDetails.jsx'
import AddClassroomPage from './components/dashboard/AddClassroomPage.jsx'
import ClassroomDetails from './pages/dashboard/ClassroomDetails.jsx'

const App = () => {
  const {activeMenu} = useStatContext();

  const {authUser, checkAuth, isAdmin, isCheckingAuth} = userAuthStore();

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
      {authUser && !isAdmin && <Header />}
      <div className={`main-container`}>
        <div className={`bg-white h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto shadow-lg ${!authUser || !isAdmin ? 'hidden' : ''} ${activeMenu ? 'pb-10 pr-10 pl-3 w-72 fixed' : 'w-0 p-0 hidden'} `}>
          {authUser && <Sidebar />}
        </div>

        <div className={`${authUser && isAdmin && activeMenu ? ' w-[-webkit-fill-available] md:ml-72 relative' : 'w-full flex-1'}`}>
        
        {authUser && isAdmin && <Navbar />}

          <Routes>
            {/* For Not Logged Is User */}
            <Route path='/' element={
              !authUser ? <HomePage/> : (!isAdmin ? <ProfilePage /> : <Dashboard />) 
              } />
            <Route path='/dashboard' element={!authUser || !isAdmin ? <Navigate to="/"/> : <Dashboard/>} />
            <Route path='/signup' element={!authUser ?  <SignUpPage/> : <Navigate to="/"/>}/>
            <Route path='/login' element={!authUser ? <LogInPage/> : <Navigate to="/"/>}/>
            <Route path='/settings' element={authUser ? <SettingsPage/> : <Navigate to="/"/>}/>
            <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/"/>}/>
            <Route path='/register-course' element={!authUser ? <RegisterCoursePage /> : <Navigate to="/"/>}/>
            <Route path='/all-courses' element={!authUser ? <CoursesPage/> : <Navigate to="/"/>}/>
            <Route path='/settings' element={!authUser ? <SettingsPage /> : <Navigate to="/"/>}/>
            <Route path='/calender' element={!authUser ? <CoursesPage/> : <Navigate to="/"/>}/>

            {/* For Dashboard */}
            <Route path='/dashboard/users' element={authUser ? <Users/> : <Navigate to="/"/>}/>
            <Route path='/dashboard/users/:id' element={authUser ? <UserDetails /> : <Navigate to="/"/>}/>
            <Route path='/dashboard/calender' element={authUser ? <Calender /> : <Navigate to="/"/>}/>
            <Route path='/dashboard/classrooms' element={authUser ? <Classrooms /> : <Navigate to="/"/>}/>
            <Route path='/dashboard/classrooms/add' element={authUser ? <AddClassroomPage /> : <Navigate to="/"/>}/>
            <Route path='/dashboard/classrooms/:id' element={authUser ? <ClassroomDetails /> : <Navigate to="/"/>} />
            </Routes>
        </div>
      </div>
      
    </>
  )
}

export default App