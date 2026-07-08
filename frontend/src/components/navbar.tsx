import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../context/themeContext";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout as reduxLogout } from "../redux/slices/authSlice";
import { resetProgress } from "../redux/slices/progressSlice";
import { clearAuthTokenInMemory } from "../api/axiosAPI";
import { useNotification } from "../context/NotificationContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [imageError, setImageError] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const { notifications, clearNotifications } = useNotification();

  const { darkMode, toggleTheme } = useTheme();
  
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state: any) => state.auth);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/Courses" },
    { name: "Favorites", path: "/favorites" },
  ];

  if (isLoggedIn && (user?.role === "admin" || user?.role === "instructor")) {
    navLinks.push({ name: "Drafts", path: "/admin/drafts" });
  }

  const handleCustomLogout = () => {
    clearAuthTokenInMemory();
    dispatch(reduxLogout());
    dispatch(resetProgress());
    setShowProfileMenu(false);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const getUserDisplayName = () => user?.name || user?.email || "User";
  const getUserInitial = () => getUserDisplayName().charAt(0).toUpperCase();

  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 max-w-7xl mx-auto">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white">school</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">LearnHub</span>
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
          >
            <span className="material-symbols-outlined text-blue-600">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <div ref={notifRef} className="relative hidden md:block">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-blue-100 cursor-pointer dark:hover:bg-gray-800 rounded-full transition-all duration-200 relative"
            >
              <span className="material-symbols-outlined text-blue-600">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-fadeIn">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.map((notif) => (
                        <li key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex gap-3 items-start">
                            <span className={`material-symbols-outlined mt-0.5 ${
                              notif.type === 'success' ? 'text-emerald-500' : 
                              notif.type === 'error' ? 'text-red-500' : 'text-blue-500'
                            }`}>
                              {notif.type === 'success' ? 'check_circle' : notif.type === 'error' ? 'error' : 'info'}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                              <span className="text-xs text-gray-500 mt-1 block">
                                {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_paused</span>
                      <p className="text-sm">You have no new notifications.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300 text-center"
            >
              Login
            </Link>
          ) : (
            <div ref={profileRef} className="relative hidden md:flex items-center gap-3">
              {/* 💡 FIX: Renders the full string value directly instead of splitting */}
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Hey, {getUserDisplayName()} 👋
              </span>

              {user?.picture && !imageError ? (
                <img
                  src={user.picture}
                  alt={getUserInitial()}
                  onError={() => setImageError(true)}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer object-cover"
                />
              ) : (
                /* 💡 Initial Icon Badge Layout */
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold text-base cursor-pointer select-none shadow-sm transition-colors duration-150"
                >
                  {getUserInitial()}
                </div>
              )}

              {/* Dropdown Layout Anchor */}
              {showProfileMenu && (
                <div className="flex flex-col bg-white dark:bg-gray-800 absolute right-0 top-12 w-64 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-200 z-50 animate-fadeIn">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name || "User Profile"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {user?.email || "No Email Bound"}
                    </p>
                  </div>

                  <button
                    onClick={handleCustomLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-b-xl font-medium transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <span className="material-symbols-outlined text-blue-600">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION --- */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 animate-slideDown">
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

          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block text-center bg-blue-600 text-white py-2 rounded-full mt-4"
            >
              Login
            </Link>
          ) : (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="px-2 py-2 mb-3">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleCustomLogout}
                className="w-full block text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-full font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;