import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from 'react-hot-toast'
import useAuth from "./useAuth"

const useFollow = () => {

    const queryClient = useQueryClient()

    const {mutate: followUnfollow, isPending} = useMutation({
        mutationFn: async (id) => {
            const url= `http://localhost:5000/api/users/follow/${id}`
            const token = localStorage.getItem("token")
            try{
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "Something went wrong")
                }
                return;
            }catch(error){
                throw new Error(error.error || error.message)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey: ["auth"]})
            ])
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return {
        followUnfollow,
        isPending
    }
    
}

export default useFollow