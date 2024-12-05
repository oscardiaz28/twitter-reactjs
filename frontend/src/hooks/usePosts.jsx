import { useContext } from "react"
import PostsContext from "../context/PostsProvider"

const usePosts = () => {
    return useContext(PostsContext)
}

export default usePosts