import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {

	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const {user, logout} = useAuth()

	const handleLogout = () => {
		logout()
		navigate("/login")
	}

	
	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className="sticky top-0 left-0 h-screen w-20 md:w-full flex flex-col border-r border-gray-700">
                <Link to="/" className="flex justify-center md:justify-start" >
                    <XSvg className="fill-white w-12 h-12 px-2 rounded-full hover:bg-stone-900" />
                </Link>
                <ul className="flex flex-col gap-3 mt-4">
                    
                    <li className="flex justify-center md:justify-start">
                        <Link to="/" className="flex items-center gap-3 hover:bg-stone-900 max-w-fit cursor-pointer rounded-full duration-300 py-2 pl-2 pr-4" >
                            <MdHomeFilled className="w-8 h-8" />
                            <span className="text-lg hidden md:block">Home</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${user?.username}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
                </ul>

                {user && (
					<Link
						to={`/profile/${user.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={user?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{user?.fullname}</p>
								<p className='text-slate-500 text-sm'>@{user?.username}</p>
							</div>
							<BiLogOut className='w-5 h-5 cursor-pointer'  
								onClick={ (e) => {
									e.preventDefault()
									handleLogout()
								}}	
							/>
						</div>
					</Link>
				)}

            </div>
			
		</div>
	);
};
export default Sidebar;