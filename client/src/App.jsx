import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Patient pages
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import AppointmentDetail from "./pages/AppointmentDetail";
import PrescriptionView from "./pages/PrescriptionView";
import Prescriptions from "./pages/Prescriptions";
import Profile from "./pages/Profile";
import VideoCall from "./pages/VideoCall";
import Notifications from "./pages/Notifications";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";
import WritePrescription from "./pages/doctor/WritePrescription";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAppointments from "./pages/admin/AdminAppointments";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ===== PATIENT ROUTES ===== */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute>
                    <Doctors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/:id"
                element={
                  <ProtectedRoute>
                    <DoctorDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:id"
                element={
                  <ProtectedRoute>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:id"
                element={
                  <ProtectedRoute>
                    <AppointmentDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions"
                element={
                  <ProtectedRoute>
                    <Prescriptions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions/:id"
                element={
                  <ProtectedRoute>
                    <PrescriptionView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video-call/:id"
                element={
                  <ProtectedRoute>
                    <VideoCall />
                  </ProtectedRoute>
                }
              />

              {/* ===== DOCTOR ROUTES ===== */}
              <Route
                path="/doctor/dashboard"
                element={
                  <RoleRoute roles={["doctor"]}>
                    <DoctorDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <RoleRoute roles={["doctor"]}>
                    <DoctorProfile />
                  </RoleRoute>
                }
              />
              <Route
                path="/doctor/appointments"
                element={
                  <RoleRoute roles={["doctor"]}>
                    <DoctorAppointments />
                  </RoleRoute>
                }
              />
              <Route
                path="/doctor/appointments/:id"
                element={
                  <RoleRoute roles={["doctor"]}>
                    <WritePrescription />
                  </RoleRoute>
                }
              />
              <Route
                path="/doctor/availability"
                element={
                  <RoleRoute roles={["doctor"]}>
                    <DoctorAvailability />
                  </RoleRoute>
                }
              />

              {/* ===== ADMIN ROUTES ===== */}
              <Route
                path="/admin"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminDoctors />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminUsers />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminAppointments />
                  </RoleRoute>
                }
              />

              {/* ===== 404 ===== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={2500} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;