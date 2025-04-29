import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ThemeWeeks from './components/ThemeWeeks';
import Layout from './components/Layout';
import WeekLandingPage from './components/WeekLandingPage';
import AdminPanel from './components/admin/AdminPanel';
import AdminLayout from './components/admin/AdminLayout';
import UsersPage from './components/admin/UsersPage';
import WeeksPage from './components/admin/WeeksPage';
import VideosPage from './components/admin/VideosPage';

function App() {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/theme-weeks" element={<ThemeWeeks />} />
          <Route path="/theme-weeks/:id" element={<WeekLandingPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPanel token={token} />}> 
          <Route element={<AdminLayout />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="weeks" element={<WeeksPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route index element={<Navigate to="users" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
