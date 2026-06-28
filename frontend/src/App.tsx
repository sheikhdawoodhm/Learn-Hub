import Navbar from "./components/navbar"
import { useTheme } from "./context/themeContext"
import {Routes,Route } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";

import Home from "./pages/home"
import Profile from "./pages/profile"
import Courses from "./pages/courses"
import Login from "./pages/login"
import DashBoard from "./pages/dashBoard"
import Favorites from "./pages/favorites"
import CourseDetails from "./pages/courseDetails"
import AuthSync from "./components/authSync"
import ProtectedRoute from "./components/protectedRoute";
import AddCourse from "./pages/adminPages/addCourses";
import AddModule from "./pages/adminPages/addModules";
import CourseModulesPage from "./pages/courseModules";
import VideoPlaybackPage from "./pages/videoPlayback";
import QuizPage from "./pages/quiz";

function App() {
  const { darkMode } = useTheme()
  const location = useLocation();

  return (
    <div className={darkMode ? "dark" : ""}>
          <AuthSync />   
      <div className={`min-h-screen bg-[white]  text-black dark:bg-gray-900 dark:text-white transition-colors duration-300`}>
       {location.pathname != "/login" && <Navbar />}
        <Routes>
          <Route path="/" element={<Home/>}/>
          {/* <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/> */}
          <Route path="/courses" element={<ProtectedRoute><Courses/></ProtectedRoute>}/>
          {/* <Route path="/courses/:videoId" element={<ProtectedRoute><CourseDetails/></ProtectedRoute>}/> */}
          {/* <Route path="/dashboard" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/> */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/favorites" element={<ProtectedRoute><Favorites/></ProtectedRoute>}/>
          <Route path ="/add-course" element={<AddCourse/>}/>
          <Route path ="/add-module" element={<AddModule/>}/>
          <Route path ="/courses/:courseId" element={<CourseModulesPage/>}/>
          <Route path="/courses/:courseId/module/:moduleId/video/:videoId" element={<VideoPlaybackPage />} /> 
          <Route path="/courses/:courseId/module/:moduleId/video/:videoId/quiz" element={<QuizPage/>} />
        </Routes> 
               
        <Tooltip id="favorite-tip" />
        <Tooltip id="progress-tip" />
        <Tooltip id="notify-tip" />
        <Tooltip id="theme-tip" />
        <Tooltip id="login-tip" />
      </div>
    </div>
  )
}

export default App