import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store";
import { useState } from "react";
import CreateInspectionPage from "./CreateInspectionPage";
import InspectionListPage from "./InspectionListPage";
import SummaryPage from "./SummaryPage";

function DashboardPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState("home");
  const user = useSelector((state: RootState) => state.auth.user);

  function handleLogout() {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");

    dispatch(logout());
  }
  if (page === "create") {
    return (
      <CreateInspectionPage
        onBack={() => setPage("home")}
        onCreated={() => {}}
      />
    );
  }

  if (page === "list") {
    return <InspectionListPage onBack={() => setPage("home")} />;
  }

  if (page === "summary") {
    return <SummaryPage onBack={() => setPage("home")} />;
  }

  return (
    <main>
      <h1>Quality Inspection Tracker</h1>

      <p>Welcome, {user?.name}</p>

      <button onClick={handleLogout}>Sign out</button>

      <hr />

      <div className="dashboard-actions">
        <button onClick={() => setPage("create")}>Log new defect</button>

        <button onClick={() => setPage("list")}>View inspections</button>

        <button onClick={() => setPage("summary")}>View summary</button>
      </div>
    </main>
  );
}

export default DashboardPage;
