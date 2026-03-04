import { Outlet } from "react-router-dom";
import DashboardShell from "../components/DashboardShell.jsx";

const AdminDashboard = () => {
  return (
    <DashboardShell
      role="admin"
      title="Admin Dashboard"
      subtitle="Clinic overview and customer services"
    >
      <Outlet />
    </DashboardShell>
  );
};

export default AdminDashboard;
