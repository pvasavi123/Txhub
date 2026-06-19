import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AdminProvider } from "./admin/context/AdminContext";

import AdminLayout from "./admin/layouts/AdminLayout";

import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import RegisterUser from "./admin/pages/RegisterUser";
import Settings from "./admin/pages/Settings";
import ClassManagement from "./admin/pages/ClassManagement";
import PaymentPage from "./admin/pages/payment";
import Batches from "./admin/pages/Batches";
import Mentors from "./admin/pages/Mentors";
import CourseDetails from "./admin/pages/CourseDetails";
import Certifications from "./admin/pages/Certifications";
import CourseProgress from "./admin/pages/CourseProgress";
import Attendance from "./admin/pages/Attendance";

import LoginPage from "./pages/LoginPage";
import MentorDashboard from "./pages/MentorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MessagePage from "./admin/pages/MessagePage";

const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error(e);
  }

  if (!user || !user.isAdmin) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              color: "red",
              fontSize: "40px",
              marginBottom: "20px",
            }}
          >
            Access Denied
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "18px",
              marginBottom: "30px",
            }}
          >
            You do not have access to the Admin Portal.
          </p>

          <button
            onClick={() => {
              window.location.href = "http://localhost:5173";
            }}
            style={{
              padding: "12px 24px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go To Website
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const RootRedirect = () => {
  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {}

  const trainerToken = localStorage.getItem("trainer_access_token");

  if (user && user.isAdmin) {
    return <Navigate to="/admin" replace />;
  } else if (trainerToken) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AdminProvider>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Trainer/Mentor Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MentorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="batches" element={<Batches />} />
          <Route path="mentors" element={<Mentors />} />
          <Route path="courses" element={<ClassManagement />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="courses/:courseId/progress" element={<CourseProgress />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="messages" element={<MessagePage/>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminProvider>
  );
}

export default App;