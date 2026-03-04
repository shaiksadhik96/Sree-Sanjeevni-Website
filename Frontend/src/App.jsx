import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminOverview from "./pages/AdminOverview.jsx";
import ReceptionDashboard from "./pages/ReceptionDashboard.jsx";
import ReceptionOverview from "./pages/ReceptionOverview.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";
import BillingPage from "./pages/BillingPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import AboutAyurvedaPage from "./pages/AboutAyurvedaPage.jsx";
import BenefitsPage from "./pages/BenefitsPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ServicesBilling from "./components/ServicesBilling.jsx";
import AdminApprovalsPage from "./pages/AdminApprovalsPage.jsx";
import ReceptionBookingsPage from "./pages/ReceptionBookingsPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="patients" element={<PatientsPage viewOnly={true} />} />
        <Route path="approvals" element={<AdminApprovalsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="about-ayurveda" element={<AboutAyurvedaPage />} />
        <Route path="benefits" element={<BenefitsPage />} />
      </Route>

      <Route path="/reception" element={<ProtectedRoute role="receptionist"><ReceptionDashboard /></ProtectedRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<ReceptionOverview />} />
        <Route path="patients" element={<PatientsPage viewOnly={false} />} />
        <Route path="bookings" element={<ReceptionBookingsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="about-ayurveda" element={<AboutAyurvedaPage />} />
        <Route path="benefits" element={<BenefitsPage />} />
        <Route path="services" element={<ServicesBilling />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
