import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  const { isLoggedIn, user } = useSelector((state: any) => state.auth);
  const canManageCourses = user?.role === "admin" || user?.role === "instructor";

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!canManageCourses) {
      navigate("/");
    }
  }, [isLoggedIn, canManageCourses, navigate]);

  return isLoggedIn && canManageCourses ? <>{children}</> : null;
}

export default AdminRoute;
