import Navbar from "./components/Navbar"
import { useTheme } from "./context/ThemeContext"
import {Routes,Route } from "react-router-dom"
import { useLocation } from "react-router-dom"

import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Courses from "./pages/Courses"
import Login from "./pages/Login"
import DashBoard from "./pages/DashBoard"
import Favorites from "./pages/Favorites"

function App() {
  const { darkMode } = useTheme()
  const location = useLocation();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
       {location.pathname != "/login" && <Navbar />}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/favorites" element={<Favorites/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App