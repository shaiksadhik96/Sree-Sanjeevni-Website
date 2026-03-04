import { Outlet } from "react-router-dom";
import DashboardShell from "../components/DashboardShell.jsx";

const ReceptionDashboard = () => {
  return (
    <DashboardShell
      role="receptionist"
      title="Reception Dashboard"
      subtitle="Register new customers and manage appointments"
    >
      <Outlet />
    </DashboardShell>
  );
};

export default ReceptionDashboard;
