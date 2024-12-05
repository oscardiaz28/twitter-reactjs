import React, { useRef, useState } from 'react'
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import toast from 'react-hot-toast';
import usePosts from '../../hooks/usePosts';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const CreatePost = () => {

    const [text, setText] = useState("")
    const [img, setImg] = useState(null)
    const imgRef = useRef(null)
	const queryClient = useQueryClient()

    // const isError = false
	const {mutate: createPost, isPending, isError, error} = useMutation({
		mutationFn: async (formData) => {
			const token = localStorage.getItem("token")
			try{
				const url = `http://localhost:5000/api/posts/create`
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(formData)
				})
				const data = await response.json()
				if(!response.ok){
					throw new Error(error.response || "Something went wrong")
				}
				return data
			}catch(error){
				console.log(error)
				throw new Error(error.message)
			}
		},
		onSuccess: () => {
			setImg(null)
			setText("")
			queryClient.invalidateQueries({queryKey: ["posts"]})
			toast.success("Post created successfully")
		}
	})

    const data = {
		profileImg: "/avatars/boy1.png",
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		createPost({text, img})
	};

    const handleImgChange = e => {
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader()
            reader.onload = () => {
                setImg(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={data.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
}

export default CreatePost