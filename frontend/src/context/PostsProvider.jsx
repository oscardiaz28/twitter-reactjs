import { useQuery } from '@tanstack/react-query'
import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

const PostsContext = createContext()

const PostsProvider = ({children}) => {

    const {user} = useAuth()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const getPosts = async (url) => {
        setIsLoading(true)
        try{
            const token = localStorage.getItem("token")
            if(!token){
                return
            }
            // const url = "http://localhost:5000/api/posts/all"
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            setPosts(data)
            setIsLoading(false)
        }catch(error){
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    const deletePost = async (id) => {
        setIsPending(true)
        try{
            const token = localStorage.getItem("token")
            if(!token) return
            const url = `http://localhost:5000/api/posts/${id}`
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            const postsUpdate = posts.filter( post => post._id !== id )
            setPosts(postsUpdate)
            setIsPending(false)
            return data

        }catch(error){
            console.log(error)
        }finally{
            setIsPending(false)
        }
    }

    const uploadPost = async (formData) => {
        setIsPending(true)
        const token = localStorage.getItem("token")
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        }
        try{
            const url = `http://localhost:5000/api/posts/create`
            const response = await fetch(url, config)
            const data = await response.json()
            if(!response.ok){
                return {
                    status: false,
                    message: data.error
                }
            }
            // getPosts()
            setIsPending(false)
            return {
                status: true,
                message: "Post created successfully"
            }
        }catch(error){
            console.log(error)
        }finally{
            setIsPending(false)
        }
    }

    useEffect( () => {
        return () => {
            setPosts([])
        }
    }, [user])
    
  return (
    <PostsContext.Provider value={{posts, isLoading, getPosts, deletePost, isPending, uploadPost}}>
        {children}
    </PostsContext.Provider>
  )
}

export {
    PostsProvider
}


export default PostsContext