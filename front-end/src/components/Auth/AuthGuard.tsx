import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { verifyToken } from "../../utils/verifyToken";
import LoginPage from "../../pages/LoginPage";

function AuthGuard({ children }: { children: ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  const expired = !token || verifyToken(token);
  useEffect(() => {
    if (expired) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
      dispatch(logout());
    }
  }, [expired, dispatch]);

  if (expired) {
    return <LoginPage />;
  }

  return children;
}

export default AuthGuard;
