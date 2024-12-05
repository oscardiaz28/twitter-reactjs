import React from 'react'
import { USERS_FOR_RIGHT_PANEL } from '../../utils/db/dummy'
import { Link } from 'react-router-dom'
import { RightPanelSkeleton } from '../skeletons/RightPanelSkeleton'
import { useQuery } from '@tanstack/react-query'
import useFollow from '../../hooks/useFollow'
import LoadingSpinner from './LoadingSpinner'

export const RightPanel = () => {

    const {data: suggestedUsers, isLoading, isError, error} = useQuery({
        queryKey: ["suggestedUsers"],
        queryFn: async () => {
            const token = localStorage.getItem('token')
            const url = "http://localhost:5000/api/users/suggested"
            try{
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "Something went wrong")
                }
                return data
            }catch(error){
                console.log(error)
            }
        }
    })
    const {followUnfollow, isPending: isFollowing} = useFollow()

    const handleFollow = (e, userId) => {
        e.preventDefault()
        followUnfollow(userId)
    }

  return (
    <div className='hidden md:block my-4 mx-2'>
        <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
            <p className='font-bold'>Who to follow</p>
            <div className='flex flex-col gap-4 mt-4'>

                {isLoading && (
                    <>
                        <RightPanelSkeleton />
                        <RightPanelSkeleton />
                        <RightPanelSkeleton />
                        <RightPanelSkeleton />
                    </>
                )}

                { !isLoading && 
                    suggestedUsers?.map( (user) => 
                        <Link to={`/profile/${user.username}`} className='flex items-center justify-between gap-4' key={user._id}>
                            <div className='flex items-center gap-2'>
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img src={user.profileImg || "/avatar-placeholder.png" } alt="" />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-semibold tracking-tight truncate w-28'>{user.fullname}</span>
                                    <span className='text-sm text-slate-500'>@{user.username}</span>
                                </div>
                            </div>
                            <div>
                                <button  
                                    className='btn bg-white rounded-full text-black btn-sm hover:bg-white hover:opacity-90'
                                    onClick={ (e) => handleFollow(e, user._id) }
                                    >
                                    {isFollowing ? <LoadingSpinner size='sm' /> : "Follow" }
                                    </button>
                            </div>
                        </Link>
                    ) 
                }
            </div>
        </div>
    </div>
    
  )
}
