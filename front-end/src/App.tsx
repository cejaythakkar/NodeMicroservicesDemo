import { useSelector } from "react-redux";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import type { RootState } from "./store";
import AuthGuard from "./components/Auth/AuthGuard";

function App() {
  const token = useSelector((state: RootState) => state.auth.token);
  if (token) {
    return (
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    );
  }
  return <LoginPage />;
}

export default App;
