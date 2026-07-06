import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  

  const { isLoggedIn } = useSelector((state: any) => state.auth);

  useEffect(() => {

    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);


  return isLoggedIn ? <>{children}</> : null;
}

export default ProtectedRoute;