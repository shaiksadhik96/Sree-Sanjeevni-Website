import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const DiscountContext = createContext(null);

const API_URL = 'http://localhost:5000/api/discounts';

export const DiscountProvider = ({ children }) => {
  const { token } = useAuth();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDiscounts();
    }
  }, [token]);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setDiscounts(data.map((d) => ({ ...d, id: d._id })));
      }
    } catch (err) {
      console.error('Failed to fetch discounts', err);
    } finally {
      setLoading(false);
    }
  };

  const createDiscount = async (payload) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        const newDiscount = { ...data, id: data._id };
        setDiscounts((prev) => [newDiscount, ...prev]);
        return newDiscount;
      }
      return null;
    } catch (err) {
      console.error('Failed to create discount', err);
      return null;
    }
  };

  const updateDiscountStatus = async (discountId, status, adminNote, appliedToCustomer) => {
    try {
      const response = await fetch(`${API_URL}/${discountId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNote, appliedToCustomer }),
      });
      const data = await response.json();
      if (response.ok) {
        setDiscounts((prev) =>
          prev.map((d) => (d.id === discountId ? { ...data, id: data._id } : d))
        );
        return data;
      }
      return null;
    } catch (err) {
      console.error('Failed to update discount status', err);
      return null;
    }
  };

  const deleteDiscount = async (discountId) => {
    try {
      const response = await fetch(`${API_URL}/${discountId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete discount', err);
      return false;
    }
  };

  return (
    <DiscountContext.Provider value={{ discounts, loading, fetchDiscounts, createDiscount, updateDiscountStatus, deleteDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscounts = () => {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error('useDiscounts must be used within DiscountProvider');
  }
  return context;
};
