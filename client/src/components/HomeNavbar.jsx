import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";

function Navbar( {navOpen} ) {

    const lastActiveLink = useRef()
    const activeBox = useRef()
    // const [navOpenHere, setNavOpen] = useState(false);

    const initActiveBox = () =>{
        activeBox.current.style.top = lastActiveLink.current.offsetTop+ 'px';
        activeBox.current.style.left = lastActiveLink.current.offsetLeft+ 'px';
        activeBox.current.style.width = lastActiveLink.current.offsetWidth+ 'px';
        activeBox.current.style.height = lastActiveLink.current.offsetHeight+ 'px';
    }

    useEffect(initActiveBox, []);

    window.addEventListener('resize', initActiveBox)
    const activeCurrentLink = (e) =>{
        lastActiveLink.current?.classList.remove('active');
        e.target.classList.add('active')
        lastActiveLink.current = e.target;
        activeBox.current.style.top = e.target.offsetTop+ 'px';
        activeBox.current.style.left = e.target.offsetLeft+ 'px';
        activeBox.current.style.width = e.target.offsetWidth+ 'px';
        activeBox.current.style.height = e.target.offsetHeight+ 'px';
    
    }

    const navItems = [
        {
            label: 'Home',
            link: '/',
            className: 'nav-link active',
            ref: lastActiveLink,
        },
        {
            label: 'Register Course',
            link: '/register-course',
            className: 'nav-link',
        },
        {
            label: 'All Courses',
            link: '/all-courses',
            className: 'nav-link',
        },
    ]

  return (
    <nav className={'navbar ' + (navOpen ? 'active': '')}>
        {
            navItems.map(({label, link, className, ref}, key) => (
                <Link to={link} className={className} key={key} ref={ref} onClick={activeCurrentLink}>
                    {label}
                </Link>
            ))
        }

        { 
            <Link to='/login' className='nav-link block md:hidden' onClick={activeCurrentLink}>
                Login
            </Link>
        }

        <div className="active-box" ref={activeBox}></div>
    </nav>
  )
}

Navbar.propTypes = {
    navOpen: PropTypes.bool.isRequired
}

export default Navbar