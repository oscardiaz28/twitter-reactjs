import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export const AuthLayout = () => {
  const {isLoading, isAuthenticated} = useAuth()

  if(isLoading){
    return (<></>)
  }

  return (
    <>
        { isAuthenticated == false
          ?  <Outlet />
          : <Navigate to="/" />
        }
        
    </>
  )
}
