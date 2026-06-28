import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";

import { login, logout } from "../redux/slices/authSlice";
import { hydrateFavorites, resetFavorites } from "../redux/slices/favoritesSlice";
// import { hydrateProgress, resetProgress } from "../redux/slices/progressSlice";

function AuthSync() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      const userId = user.sub;

      dispatch(
        login({
          id: userId,
          name: user.name,
          email: user.email,
          picture: user.picture,
        })
      );

      dispatch(hydrateFavorites(userId));
      // dispatch(hydrateProgress(userId));
    }

    if (!isAuthenticated && !user) {
      dispatch(logout());
      dispatch(resetFavorites());
      // dispatch(resetProgress());
    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  return null;
}

export default AuthSync;