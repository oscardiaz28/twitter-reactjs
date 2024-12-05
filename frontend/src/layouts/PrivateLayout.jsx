import React from 'react'
import Sidebar from '../components/common/Sidebar'
import { RightPanel } from '../components/common/RightPanel'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export const PrivateLayout = () => {
  const {isAuthenticated, user} = useAuth()
  console.log(isAuthenticated)
  
  return (
    <>
      {
        isAuthenticated 
        ? <>
              <Sidebar />
                <Outlet />
              <RightPanel />
          </>
        : <Navigate to="/login" />
      }
    </>
  )
}
