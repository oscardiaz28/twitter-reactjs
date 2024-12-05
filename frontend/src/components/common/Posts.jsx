import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useEffect } from "react";
import usePosts from "../../hooks/usePosts";
import { useQuery } from "@tanstack/react-query";

const Posts = (props) => {
	const {feedType, username, userId} = props
	// const {posts: POSTS, getPosts, isLoading} = usePosts()

	const getPostEndpoint = () => {
		switch(feedType){
			case "forYou":
				return "http://localhost:5000/api/posts/all";
			case "following":
				return "http://localhost:5000/api/posts/following";
			case "posts": 
				return `http://localhost:5000/api/posts/user/${username}`
			case "likes": 
				return `http://localhost:5000/api/posts/likes/${userId}`
			default: 
				return "http://localhost:5000/api/posts/all"
		}
	}
	const POST_ENDPOINT = getPostEndpoint()
	const {data: POSTS, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const token = localStorage.getItem("token")
			const response = await fetch(POST_ENDPOINT, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			const data = await response.json()
			//TODO: handle response.error
			return data
		}
	})

	useEffect( () => {
		refetch()
	}, [feedType, username, refetch])

	return (
		<>
			{ (isLoading || isRefetching ) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;