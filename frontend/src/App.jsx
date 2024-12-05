import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { LoginPage } from './pages/auth/LoginPage'
import Sidebar from './components/common/Sidebar'
import { RightPanel } from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'
import { AuthLayout } from './layouts/AuthLayout'
import { PrivateLayout } from './layouts/PrivateLayout'
import { AuthProvider } from './context/AuthProvider'
import { PostsProvider } from './context/PostsProvider'

function App() {

  return (
    <>
      <div className='flex max-w-6xl mx-auto'>

        <AuthProvider>
          <PostsProvider>

            <Routes>

              <Route element={ <AuthLayout /> }>
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/login' element={<LoginPage />} />
              </Route>

              <Route path='/' element={<PrivateLayout />}>
                <Route index element={ <HomePage /> } />
                <Route path='/notifications' element={<NotificationPage />} />
                <Route path='/profile/:username' element={<ProfilePage />} />
              </Route>

            </Routes>

            <Toaster />

          </PostsProvider>
        </AuthProvider>

      </div>
    </>
  )
}

export default App
