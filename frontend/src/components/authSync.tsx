import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";

import { login } from "../redux/slices/authSlice";
import { hydrateFavorites } from "../redux/slices/favoritesSlice";
import API, { setAuthTokenInMemory } from "../api/axiosAPI";


function AuthSync() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      const syncGoogleUser = async () => {
        const response = await API.post("/auth/oauth", {
          name: user.name,
          email: user.email,
          picture: user.picture,
          provider: "google",
          role: "student",
        });

        if (response.data.success) {
          setAuthTokenInMemory(response.data.accessToken);
          dispatch(login({ ...response.data.user, picture: user.picture }));
          dispatch(hydrateFavorites(response.data.user.id));
        }
      };

      syncGoogleUser().catch((err) => {
        console.error("Failed to sync Google user with backend:", err);
      });

    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  return null;
}

export default AuthSync;
