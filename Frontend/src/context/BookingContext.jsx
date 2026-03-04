import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const BookingContext = createContext(null);

const API_URL = "http://localhost:5000/api/bookings";

export const BookingProvider = ({ children }) => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data.map((b) => ({ ...b, id: b._id })));
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const createBooking = async (payload) => {
    try {
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
        const newBooking = { ...data, id: data._id };
        setBookings((prev) => [newBooking, ...prev]);
        return newBooking;
      }
    } catch (err) {
      console.error("Failed to create booking", err);
    }
  };

  const updateBookingStatus = async (id, payload) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        const updatedBooking = { ...data, id: data._id };
        setBookings((prev) =>
          prev.map((booking) => (booking.id === id ? updatedBooking : booking)),
        );
        return updatedBooking;
      }
    } catch (err) {
      console.error("Failed to update booking", err);
    }
  };

  const value = useMemo(
    () => ({
      bookings,
      fetchBookings,
      createBooking,
      updateBookingStatus,
    }),
    [bookings, token],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookings must be used inside BookingProvider");
  }

  return context;
};
