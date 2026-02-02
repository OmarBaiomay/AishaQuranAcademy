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
import CallUsButton from "./common/CallUsButton";
import { FaPhoneAlt } from "react-icons/fa";

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
                <div>
                    <a href="/" className="logo">
                        <img src={logo} width={140} alt="Aisha Quran Academy"/>
                    </a>
                </div>
                
                <div className="flex ">
                    <CallUsButton
                    label="Call Us Now"
                    icon={FaPhoneAlt}
                    className="text-xl md:hidden"
                    />

                    <div className="relative md:justify-self-center">
                        <button className="menu-btn md:hidden" onClick={()=> setNavOpen((open) => !open)}>
                            <span className="m-icon">
                                {navOpen ? <X /> : <Menu /> }
                            </span>
                        </button>

                    {/* Navbar */}
                    <Navbar navOpen={navOpen} setNavOpen={setNavOpen} />

                    </div>
                </div>
            </div>
            </div>
        </header>
    )
}

export default Header;