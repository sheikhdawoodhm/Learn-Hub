import { NavLink, Link } from "react-router-dom"
import { useTheme } from "../context/themeContext"
import { useAuth0 } from "@auth0/auth0-react"
import { useState, useRef, useEffect } from "react";


function Navbar() {
  const [open, setOpen] = useState(false)

  const { darkMode, toggleTheme } = useTheme()
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [showProfileMenu,setShowProfileMenu] = useState(false);
  const [imageError,setImageError] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/Courses" },
    { name: "Favorites", path: "/favorites" },
    // { name: "Profile", path: "/profile" },
      // { name: "Dashboard", path: "/dashboard" },
  ]

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setShowProfileMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">

      <div className="flex justify-between items-center px-4 md:px-10 py-4 max-w-7xl mx-auto">

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                school
              </span>
            </div>

            <span className="text-2xl font-bold text-blue-600">
              LearnHub
            </span>

          </Link>

          <nav className="hidden md:flex gap-6 items-center">

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                }
              >
                {link.name}
              </NavLink>
            ))}

          </nav>

        </div>

        <div className="flex items-center gap-2 md:gap-4">

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-blue-100 cursor-pointer dark:hover:bg-gray-800 rounded-full transition-all duration-200"
            data-tooltip-id="theme-tip"
            data-tooltip-content="Toggle Theme"          >
            <span className="material-symbols-outlined text-blue-600">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

        <button
          className="p-2 hover:bg-blue-100 cursor-pointer dark:hover:bg-gray-800 rounded-full transition-all duration-200"
          data-tooltip-id="notify-tip"
          data-tooltip-content="Notifications"
        >
          <span className="material-symbols-outlined text-blue-600">
            notifications
          </span>
        </button>
          {
            !isAuthenticated ? (
              <Link
                to="/login"
                className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                data-tooltip-id="login-tip"
                data-tooltip-content="Login"
              >
                Login
              </Link>
            ) : (
              <div ref = {profileRef}className="relative group hidden md:flex items-center gap-3">

                <span className="font-medium text-sm">
                  Hey, {user?.given_name || user?.name?.split(" ")[0]} 👋
                </span>

                {user?.picture && !imageError ? (
                  <img
                    src={user.picture}
                    alt={user.name?.charAt(0)}
                    onError={() => setImageError(true)}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
                    data-tooltip-id="login-tip"
                    data-tooltip-content="Login"
                  />
                ) : (
                  <div  onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                {showProfileMenu && (<div className="flex flex-col bg-white dark:bg-gray-800 absolute right-0 top-12 w-50px rounded-xl shadow-lg border  transition-all duration-200">

                  <div className="p-4 border-b">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm">{user?.email}</p>
                  </div>

                  <button
                    onClick={() =>
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin,
                        },
                      })
                    }
                    className="w-full text-left px-4 py-3 hover:bg-blue-300"
                  >
                    Logout
                  </button>

                </div>)}
              </div>
            )
          }

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            <span className="material-symbols-outlined text-blue-600">
              {open ? "close" : "menu"}
            </span>
          </button>

        </div>

      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block mt-3 text-blue-600 font-semibold"
                  : "block mt-3 text-gray-600 dark:text-gray-300"
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block text-center bg-blue-600 text-white py-2 rounded-full mt-4"
          >
            Login
          </Link>

        </div>
      )}

    </header>
  )
}

export default Navbar