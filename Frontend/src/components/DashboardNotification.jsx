import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";

const DashboardNotification = ({ userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (userRole === "receptionist") {
        // Fetch pending bookings (awaiting admin approval)
        let bookings = [];
        let discounts = [];
        let payments = [];

        try {
          const bookingsRes = await fetch("http://localhost:5000/api/bookings?_t=" + Date.now());
          if (bookingsRes.ok) bookings = await bookingsRes.json();
        } catch (e) {
          console.error("Error fetching bookings:", e);
        }
        
        try {
          const discountsRes = await fetch("http://localhost:5000/api/discounts?_t=" + Date.now());
          if (discountsRes.ok) discounts = await discountsRes.json();
        } catch (e) {
          console.error("Error fetching discounts:", e);
        }

        try {
          const paymentsRes = await fetch("http://localhost:5000/api/payments?_t=" + Date.now());
          if (paymentsRes.ok) payments = await paymentsRes.json();
        } catch (e) {
          console.error("Error fetching payments:", e);
        }

        const notifs = [];

        // Count pending bookings (not yet approved by admin)
        const pendingBookings = Array.isArray(bookings) 
          ? bookings.filter((b) => b.status === "pending").length 
          : 0;
        if (pendingBookings > 0) {
          notifs.push({
            id: "bookings",
            type: "warning",
            title: "Pending Bookings Awaiting Approval",
            count: pendingBookings,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
          });
        }

        // Count approved discounts (admin approved - ready to bill)
        const approvedDiscounts = Array.isArray(discounts) 
          ? discounts.filter((d) => d.status === "approved").length 
          : 0;
        if (approvedDiscounts > 0) {
          notifs.push({
            id: "discounts",
            type: "success",
            title: "Approved Discounts Ready for Billing",
            count: approvedDiscounts,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
          });
        }

        // Count unpaid/partially paid bills
        const unpaidBills = Array.isArray(payments)
          ? payments.filter(
            (p) => p.paymentStatus === "Pending" || p.paymentStatus === "Partially Paid"
          ).length
          : 0;
        if (unpaidBills > 0) {
          notifs.push({
            id: "billing",
            type: "alert",
            title: "Outstanding Bills Pending Collection",
            count: unpaidBills,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
          });
        }

        setNotifications(notifs);
      } else if (userRole === "admin") {
        // Admin notifications
        let bookings = [];
        let discounts = [];

        try {
          const bookingsRes = await fetch("http://localhost:5000/api/bookings?_t=" + Date.now());
          if (bookingsRes.ok) bookings = await bookingsRes.json();
        } catch (e) {
          console.error("Error fetching bookings:", e);
        }

        try {
          const discountsRes = await fetch("http://localhost:5000/api/discounts?_t=" + Date.now());
          if (discountsRes.ok) discounts = await discountsRes.json();
        } catch (e) {
          console.error("Error fetching discounts:", e);
        }

        const notifs = [];

        // Count pending bookings needing admin approval
        const pendingBookings = Array.isArray(bookings)
          ? bookings.filter((b) => b.status === "pending").length
          : 0;
        if (pendingBookings > 0) {
          notifs.push({
            id: "bookings",
            type: "warning",
            title: "Booking Approvals Pending",
            count: pendingBookings,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
          });
        }

        // Count pending discount offers needing admin approval
        const pendingDiscounts = Array.isArray(discounts)
          ? discounts.filter((d) => d.status === "pending").length
          : 0;
        if (pendingDiscounts > 0) {
          notifs.push({
            id: "discounts",
            type: "alert",
            title: "Discount Offers Awaiting Approval",
            count: pendingDiscounts,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
          });
        }

        setNotifications(notifs);
      }
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userRole]);

  // Auto-refresh notifications every 10 seconds
  useEffect(() => {
    fetchNotifications(); // Initial fetch
    
    const refreshInterval = setInterval(() => {
      fetchNotifications();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(refreshInterval);
  }, [fetchNotifications]);

  return (
    <AnimatePresence>
      {notifications.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          className="mb-6 space-y-4"
        >
          {/* Header with refresh */}
          <div className="flex items-center justify-between px-2 py-2 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-lg border border-orange-200 shadow-md">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
              </motion.div>
              <h3 className="text-sm font-bold text-gray-800">ACTIVE ALERTS</h3>
              <span className="font-bold text-red-600 text-sm ml-2">({notifications.reduce((sum, n) => sum + n.count, 0)} pending)</span>
            </div>
            <button
              onClick={fetchNotifications}
              disabled={isLoading}
              className="text-xs bg-red-600 hover:bg-red-700 active:scale-95 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition disabled:opacity-50 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh Now
            </button>
          </div>

          {/* Notifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.map((notif, idx) => {
              const IconComponent = notif.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.08, type: "spring", stiffness: 120 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className={`
                    ${notif.bgColor} border-l-4 ${notif.borderColor}
                    rounded-xl p-5 shadow-lg hover:shadow-xl transition-all
                    border border-opacity-40 backdrop-blur-sm
                    relative overflow-hidden
                  `}
                >
                  {/* Animated background glow */}
                  <motion.div
                    animate={{ 
                      background: notif.type === "alert" ? ["rgba(239, 68, 68, 0.1)", "rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.1)"] : "transparent"
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: notif.type === "alert" ? Infinity : 0 
                    }}
                    className="absolute inset-0 rounded-xl"
                  />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start gap-3 flex-1">
                      <motion.div
                        animate={{ 
                          scale: notif.type === "alert" ? [1, 1.2, 1] : 1,
                          rotate: notif.type === "alert" ? [0, 5, -5, 0] : 0
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: notif.type === "alert" ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                        className="flex-shrink-0"
                      >
                        <IconComponent className={`${notif.color} w-6 h-6 mt-1`} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${notif.color} break-words`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-700 mt-1 font-medium">
                          {notif.count} item{notif.count !== 1 ? "s" : ""} awaiting action
                        </p>
                      </div>
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className={`
                        text-xl font-bold ${notif.color} 
                        bg-white/80 rounded-full w-12 h-12 flex items-center justify-center
                        flex-shrink-0 ml-3 shadow-md border-2 ${notif.borderColor}
                      `}
                    >
                      {notif.count}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Last refreshed timestamp */}
          <div className="flex items-center justify-between px-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 border border-gray-200">
            <span>Last updated: <span className="font-semibold">{lastRefresh.toLocaleTimeString()}</span></span>
            <span className="text-gray-500">Auto-refresh: Every 10 seconds</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardNotification;
