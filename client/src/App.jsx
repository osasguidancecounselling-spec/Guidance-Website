import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard/Home';
import AppointmentsPage from './pages/Student/AppointmentsPage';
import StudentChatPage from './pages/Student/StudentChatPage';
import MySchedulePage from './pages/Student/MySchedulePage';
import StudentResourcesPage from './pages/Student/StudentResourcesPage';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAppointmentsPage from './pages/Admin/AdminAppointmentsPage';
import AdminChatPage from './pages/Admin/AdminChatPage';
import AdminForms from './pages/Admin/AdminForms';
import Students from './pages/Admin/Students';
import Resources from './pages/Admin/Resources';
import Analytics from './pages/Admin/Analytics';
import AdminSettingsPage from './pages/Admin/AdminSettingsPage';
import StudentProfilePage from './pages/Admin/StudentProfilePage';
import AdminFormViewer from "./pages/Admin/AdminFormViewer";
import SubmissionViewer from './pages/Admin/SubmissionViewer';

const App = () => (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/appointments" element={
        <ProtectedRoute allowedRoles={['student']}>
          <AppointmentsPage />
        </ProtectedRoute>
      } />
      <Route path="/my-schedule" element={
        <ProtectedRoute allowedRoles={['student']}>
          <MySchedulePage />
        </ProtectedRoute>
      } />
      <Route path="/resources" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentResourcesPage />
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentChatPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/appointments" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminAppointmentsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Students />
        </ProtectedRoute>
      } />
      <Route path="/admin/students/:studentId" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <StudentProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/admin/forms" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminForms />
        </ProtectedRoute>
      } />
      <Route path="/admin/submissions/view/:submissionId" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SubmissionViewer />
        </ProtectedRoute>
      } />
      <Route path="/admin/resources" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Resources />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/chat" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminChatPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminSettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/forms/view/:filename" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminFormViewer />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
);

export default App;
