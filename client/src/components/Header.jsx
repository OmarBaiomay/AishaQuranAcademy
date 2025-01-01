/**
 * @copyright 2024 Omar Elbayoumi
 */

import { useState } from "react";
import Navbar from "./HomeNavbar";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {

    const [navOpen, setNavOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full h-20 flex-items-center z-40 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-900/0">
           <div className="max-w-screen-2xl w-full mx-auto px-4 py-4 flex justify-between items-center md:px-6 md:grid-cols-[1fr,3fr,1fr]">
            <h1>
                <a href="/" className="logo">
                    <img src="/AishaLogo.svg" width={150} alt="Aisha Quran Academy"/>
                </a>
            </h1>

            <div className="relative md:justify-self-center">
                <button className="menu-btn md:hidden" onClick={()=> setNavOpen((open) => !open)}>
                    <span className="m-icon">
                        {navOpen ? <X /> : <Menu /> }
                    </span>
                </button>

                {/* Navbar */}

                <Navbar navOpen={navOpen}/>
            </div>
            <Link to="/login" className="btn primary-purble-btn max-md:hidden md:justify-self-end">
                login
            </Link>
           </div>
        </header>
    )
}

export default Header;