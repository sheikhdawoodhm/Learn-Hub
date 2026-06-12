import { useState } from "react"
import { NavLink, Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useAuth0 } from "@auth0/auth0-react"


function Navbar() {
  const [open, setOpen] = useState(false)

  const { darkMode, toggleTheme } = useTheme()
  const { user, isAuthenticated } = useAuth0()
  console.log(user)

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/Courses" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Favorites", path: "/favorites" },
    { name: "Profile", path: "/profile" },
  ]

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
            className="p-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
          >
            <span className="material-symbols-outlined text-blue-600">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button className="p-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200">
            <span className="material-symbols-outlined text-blue-600">
              notifications
            </span>
          </button>

          <Link
            to="/login"
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300"
          >
            Login
          </Link>

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