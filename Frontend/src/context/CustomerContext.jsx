import { createContext, useContext, useEffect, useCallback, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CustomerContext = createContext(null);

const API_URL = "http://localhost:5000/api/customers";

export const CustomerProvider = ({ children }) => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = useCallback(async () => {
    if (!token) return;
    try {
      console.log('[FETCH CUSTOMERS] Fetching customer data...');
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`[FETCH CUSTOMERS] SUCCESS: Fetched ${data.length} customers`);
        setCustomers(data.map((c) => ({ ...c, id: c._id })));
      } else {
        console.error('[FETCH CUSTOMERS] ERROR: Failed to fetch:', data.message);
      }
    } catch (err) {
      console.error("[FETCH CUSTOMERS] ERROR:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCustomers();
    }
  }, [token, fetchCustomers]);

  const addCustomer = useCallback(async (payload) => {
    if (!token) return null;
    try {
      console.log('[ADD CUSTOMER] Sending request to add customer:', payload.name);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        const newCustomer = { ...data, id: data._id };
        console.log(`[ADD CUSTOMER] SUCCESS: Customer added with ID: ${newCustomer.id}`);
        setCustomers((prev) => [newCustomer, ...prev]);
        return newCustomer;
      } else {
        console.error('[ADD CUSTOMER] ERROR: Failed to add customer:', data.message);
        return null;
      }
    } catch (err) {
      console.error("[ADD CUSTOMER] ERROR:", err);
      return null;
    }
  }, [token]);

  const updateCustomer = useCallback(async (id, updates) => {
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
        const updatedCustomer = { ...data, id: data._id };
        setCustomers((prev) =>
          prev.map((customer) => (customer.id === id ? updatedCustomer : customer)),
        );
      }
    } catch (err) {
      console.error("Failed to update customer", err);
    }
  }, [token]);

  const deleteCustomer = useCallback(async (id) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete customer", err);
    }
  }, [token]);

  return (
    <CustomerContext.Provider value={{
      customers,
      fetchCustomers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used inside CustomerProvider");
  }

  return context;
};
