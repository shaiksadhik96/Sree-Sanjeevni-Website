import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardShell = ({ role, title, subtitle, children }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-brand-light">
      <Sidebar role={user?.role || role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between bg-gradient-to-r from-white to-herbal-50/30 border-b border-herbal-100 px-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-herbal-800">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-herbal-100 rounded-full">
              <p className="text-xs font-bold text-herbal-700 tracking-wide">HEALTHCARE</p>
            </div>
          </div>
        </header>
        <main className="relative flex-1 overflow-y-auto p-6">
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute top-6 right-10 h-2 w-2 rounded-full bg-brand/30 animate-pulse"></span>
            <span className="absolute top-20 right-24 h-1.5 w-1.5 rounded-full bg-amber-400/40 animate-pulse"></span>
            <span className="absolute bottom-16 right-14 h-2 w-2 rounded-full bg-emerald-400/30 animate-pulse"></span>
            <span className="absolute bottom-24 left-10 h-1.5 w-1.5 rounded-full bg-slate-400/30 animate-pulse"></span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
