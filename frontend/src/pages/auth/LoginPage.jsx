import React, { useState } from 'react'
import XSvg from '../../components/svgs/X'
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';


export const LoginPage = () => {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {setAuthToken} = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const loginUser = async ({username, password}) => {
    try{
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
      }
      const res = await fetch("http://localhost:5000/api/auth/login", config)
      const data = await res.json()
      if(!res.ok) {
        throw new Error(data.error || data.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  const { mutate, isError, isLoading, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const {token} = data
      setAuthToken(token)
      toast.success("LogIn successfully")
      queryClient.invalidateQueries(["auth"])
      navigate("/")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  return (

    <div className='max-w-screen-xl mx-auto h-screen px-10 flex flex-col md:flex-row items-center py-10'>

      <div>
        <XSvg className="fill-white lg:w-2/3" />
      </div>

      <div className='flex-1 flex flex-col items-center justify-center'>

      <form onSubmit={handleSubmit} className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col'>

        <XSvg className='w-24 lg:hidden fill-white' />
        <h1 className='text-4xl font-extrabold text-white'>Join Today.</h1>

        <label htmlFor="" className='input input-bordered rounded flex items-center gap-2'>
          <MdOutlineMail />
          <input 
            type='text'
            className='grow'
            placeholder='Username'
            name='username'
            onChange={handleChange}
            value={formData.username}
          />
        </label>

        <label className='input input-bordered rounded flex items-center gap-2'>
          <MdPassword />
          <input
            type='password'
            className='grow'
            placeholder='Password'
            name='password'
            onChange={handleChange}
            value={formData.password}
          />
        </label>

        <button type='submit' className='btn rounded-full btn-primary text-white'>{isLoading ? "Loading" : "Sign In"}</button>
        {isError && <p className='text-red-500'>{error.message}</p>}
        </form>

        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
        <p className='text-white text-lg'>Don't have an account?</p>
        <Link to="/signup" >
          <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign Up</button>
        </Link>
        </div>

      </div>

    </div>

  )
}
