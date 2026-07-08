import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { finishAuthCheck, login } from "./redux/slices/authSlice";
import { setCompletedLectures } from "./redux/slices/progressSlice";
import API, { setAuthTokenInMemory } from "./api/axiosAPI";

import Navbar from "./components/navbar";
import { useTheme } from "./context/themeContext";
import { Routes, Route, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";

import Home from "./pages/home";
import Courses from "./pages/courses";
import Login from "./pages/login";
import Favorites from "./pages/favorites";
import AuthSync from "./components/authSync";
import ProtectedRoute from "./components/protectedRoute";
import AdminRoute from "./components/adminRoute";
import AddCourse from "./pages/adminPages/addCourses";
import AddModule from "./pages/adminPages/addModules";
import CourseModulesPage from "./pages/courseModules";
import VideoPlaybackPage from "./pages/videoPlayback";
import QuizPage from "./pages/quiz";
import CertificatePage from "./pages/CertificatePage";
import AdminDrafts from "./pages/adminDrafts";

function App() {
  const { darkMode } = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();


  const { isCheckingAuth } = useSelector((state: any) => state.auth);


  useEffect(() => {
    const verifySessionOnBoot = async () => {
      try {
        const res = await API.post("/auth/refresh", {}, { withCredentials: true });
        

        const { accessToken, user } = res.data;
        
        setAuthTokenInMemory(accessToken);
        
        if (user && user.name) {
          dispatch(login(user)); // 🚨 This keeps "Sheikh" locked into your state on refresh!
          
          try {
            const progressRes = await API.get("/user/user-history");
            if (progressRes.data.completedLectures) {
              dispatch(setCompletedLectures(progressRes.data.completedLectures));
            }
          } catch (progressErr) {
            console.error("Failed to load user progress:", progressErr);
          }
        }
      } catch (err) {
        console.error("Session refresh failed on boot:", err);
      } finally {
        dispatch(finishAuthCheck());
      }
    };

    verifySessionOnBoot();
  }, [dispatch]);


  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide">Securing session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>  
      <div className={`min-h-screen bg-[white] text-black dark:bg-gray-900 dark:text-white transition-colors duration-300`}>
        <AuthSync />
        {location.pathname !== "/login" && <Navbar />}
        
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          
          <Route path="/courses" element={<ProtectedRoute><Courses/></ProtectedRoute>}/>
          <Route path="/favorites" element={<ProtectedRoute><Favorites/></ProtectedRoute>}/>
          
          <Route path="/courses/:courseId" element={<ProtectedRoute><CourseModulesPage/></ProtectedRoute>}/>
          <Route path="/courses/:courseId/module/:moduleId/video/:videoId" element={<ProtectedRoute><VideoPlaybackPage /></ProtectedRoute>} /> 
          <Route path="/courses/:courseId/module/:moduleId/video/:videoId/quiz" element={<ProtectedRoute><QuizPage/></ProtectedRoute>} />
          <Route path="/courses/:courseId/certificate" element={<ProtectedRoute><CertificatePage/></ProtectedRoute>} />
          
          <Route path="/add-course" element={<AdminRoute><AddCourse/></AdminRoute>}/>
          <Route path="/add-module" element={<AdminRoute><AddModule/></AdminRoute>}/>
          <Route path="/admin/drafts" element={<AdminRoute><AdminDrafts/></AdminRoute>}/>
          
      
          {/* <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/> */}
          {/* <Route path="/courses/:videoId" element={<ProtectedRoute><CourseDetails/></ProtectedRoute>}/> */}
          {/* <Route path="/dashboard" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/> */}
        </Routes> 
               
        <Tooltip id="favorite-tip" />
        <Tooltip id="progress-tip" />
        <Tooltip id="notify-tip" />
        <Tooltip id="theme-tip" />
        <Tooltip id="login-tip" />
      </div>
    </div>
  );
}

export default App;
