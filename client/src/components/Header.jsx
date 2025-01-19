/**
 * @copyright 2024 Omar Elbayoumi
 */

import { useState } from "react";
import Navbar from "./HomeNavbar";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "/assets/AishaLogo.png"
import { userAuthStore } from "../store/useAuthStore";
import avatar from '/assets/user.svg';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";


const Header = () => {

    const [navOpen, setNavOpen] = useState(false);
    const {authUser, isAdmin, LogOut} = userAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
      setMenuOpen((prev) => !prev);
    };   

    const handleLogout = () => {
        LogOut();
        setMenuOpen(false);
    };
    

    return (
        <header className="fixed top-0 left-0 w-full h-auto flex-items-center z-40 py-3 md:py-0 bg-gradient-to-b bg-white shadow-md dark:from-zinc-900 dark:to-zinc-900/0">
            <div className="container">
                <div className="max-w-screen-2xl w-full mx-auto py-4 flex justify-between items-center md:grid-cols-[1fr,3fr,1fr]">
                <h1>
                    <a href="/" className="logo">
                        <img src={logo} width={150} alt="Aisha Quran Academy"/>
                    </a>
                </h1>
                {!authUser &&
                <div className="relative md:justify-self-center">
                    <button className="menu-btn md:hidden" onClick={()=> setNavOpen((open) => !open)}>
                        <span className="m-icon">
                            {navOpen ? <X /> : <Menu /> }
                        </span>
                    </button>

                    {/* Navbar */}
                    <Navbar navOpen={navOpen}/>
                </div>
                }
                {authUser && !isAdmin ?
                    <div className="relative">
                        <button onClick={toggleMenu} className="flex items-center space-x-2">
                        <img src={authUser.profilePic || `https://placehold.jp/3d4070/ffffff/150x150.png?text=${authUser.fullName.split(" ")[0][0]}${authUser.fullName.split(" ")[1][0]}`} alt={`${authUser?.fullName} Avatar`} className="w-10 h-10 rounded-full" />
                        <span className="text-gray-700 font-medium">
                            {authUser?.fullName.split(' ')[0]}
                        </span>
                        {!menuOpen ? 
                        <MdKeyboardArrowDown className='text-purple-600' />
                        :
                        <MdKeyboardArrowUp className='text-purple-600' />
                        }
                    </button>
        
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Settings
                        </Link>
                        <Link
                            to="/dashboard/calender"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Calendar
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                        </div>
                    )}
                    </div>
                    :
                    <Link to="/login" className="btn primary-purple-btn max-md:hidden md:justify-self-end">
                        Login
                    </Link>
                }
            </div>
            </div>
        </header>
    )
}

export default Header;