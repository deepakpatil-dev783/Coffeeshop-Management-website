import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { OrderProvider } from "./context/OrderContext";
import { TableProvider } from "./context/TableContext";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { Home } from "./pages/Home";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

import { StaffDashboard } from "./pages/staff/StaffDashboard";
import { OwnerAnalytics } from "./pages/owner/OwnerAnalytics";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "customer" ? "/profile" : "/login"} replace />
    );
  }

  return children;
};

export const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <TableProvider>
              <Router>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      {/* Application startup routes */}
                      <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                      />
                      <Route path="/home" element={<Home />} />

                      {/* Customer Website Routes */}
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route
                        path="/reservations"
                        element={<ReservationsPage />}
                      />
                      <Route path="/profile" element={<ProfilePage />} />

                      {/* Authentication Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                      />

                      {/* Staff & Owner Dashboard Interfaces */}
                      <Route
                        path="/staff/*"
                        element={
                          <ProtectedRoute allowedRoles={["staff"]}>
                            <StaffDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/owner/*"
                        element={
                          <ProtectedRoute allowedRoles={["owner"]}>
                            <OwnerAnalytics />
                          </ProtectedRoute>
                        }
                      />

                      {/* Catch-all fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </TableProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
