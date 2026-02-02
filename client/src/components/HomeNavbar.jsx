import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function Navbar({ navOpen, setNavOpen }) {
  const location = useLocation();

  // Close navbar when route changes (on mobile)
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "Home", link: "/" },
    { label: "Register Course", link: "/register-course" },
    { label: "All Courses", link: "/courses" },
    { label: "Blogs", link: "/blogs" },
  ];

  return (
    <nav className={"navbar " + (navOpen ? "active" : "")}>
      {navItems.map(({ label, link }, index) => (
        <Link
          to={link}
          key={index}
          className={`nav-link ${
            location.pathname === link ? "active" : ""
          }`}
          onClick={() => setNavOpen(false)} // Close on mobile
        >
          {label}
        </Link>
      ))}

      <Link
        to="/login"
        className={`nav-link block md:hidden ${
          location.pathname === "/login" ? "active" : ""
        }`}
        onClick={() => setNavOpen(false)}
      >
        Login
      </Link>
    </nav>
  );
}

Navbar.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired,
};

export default Navbar;
