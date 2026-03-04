import { createContext, useContext, useEffect, useCallback, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const PaymentContext = createContext(null);

const API_URL = "http://localhost:5000/api/payments";

export const PaymentProvider = ({ children }) => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);

  const fetchPayments = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setPayments(data.map((p) => ({ ...p, id: p._id })));
      }
    } catch (err) {
      console.error("[FETCH PAYMENTS] Error:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token, fetchPayments]);

  const createPayment = useCallback(async (payload) => {
    if (!token) return null;
    try {
      console.log('[CREATE PAYMENT] Sending payload:', payload);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('[CREATE PAYMENT] Response status:', response.status);
      console.log('[CREATE PAYMENT] Response data:', data);
      if (response.ok) {
        const newPayment = { ...data, id: data._id };
        setPayments((prev) => [newPayment, ...prev]);
        return newPayment;
      } else {
        console.error('[CREATE PAYMENT] Failed:', data.message);
        return null;
      }
    } catch (err) {
      console.error("[CREATE PAYMENT] Error:", err);
      return null;
    }
  }, [token]);

  const updatePayment = useCallback(async (id, updates) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (response.ok) {
        const updatedPayment = { ...data, id: data._id };
        setPayments((prev) =>
          prev.map((payment) => (payment.id === id ? updatedPayment : payment))
        );
      }
    } catch (err) {
      console.error("[UPDATE PAYMENT] Error:", err);
    }
  }, [token]);

  const deletePayment = useCallback(async (id) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments((prev) => prev.filter((payment) => payment.id !== id));
    } catch (err) {
      console.error("[DELETE PAYMENT] Error:", err);
    }
  }, [token]);

  const context = {
    payments,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
  };

  return (
    <PaymentContext.Provider value={context}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayments must be used within PaymentProvider");
  }
  return context;
};
