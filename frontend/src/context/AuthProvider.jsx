import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AuthContext = createContext()

const AuthProvider = ({children}) => {

    const queryClient = useQueryClient()
    const [token, setToken] = useState(localStorage.getItem("token"))

    const {data: user, isLoading, isError, error} = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            if(!token){
                return null
            }
            const url = "http://localhost:5000/api/auth/me"
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error)
            }
            return data
        },
        retry: false,
        enabled: !!token
    })

    const setAuthToken = (newToken) => {
        localStorage.setItem("token", newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        queryClient.clear()
    }


    return (
        <AuthContext.Provider value={{
            user, 
            isLoading, 
            isAuthenticated: user ? true : false,
            logout,
            setAuthToken
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext