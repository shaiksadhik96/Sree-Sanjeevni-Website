import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CustomerProvider } from "./context/CustomerContext.jsx";
import { ToastProvider } from "./components/ToastProvider.jsx";
import { DiscountProvider } from "./context/DiscountContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import { PaymentProvider } from "./context/PaymentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CustomerProvider>
          <DiscountProvider>
            <BookingProvider>
              <PaymentProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </PaymentProvider>
            </BookingProvider>
          </DiscountProvider>
        </CustomerProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
