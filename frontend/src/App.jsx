import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedRoute from "./router/ProtectedRoute.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLayout>
            <HomePage />
          </AuthLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
              <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;
