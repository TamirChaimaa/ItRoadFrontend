import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";
import Dashboard from "./dashboard/Dashboard";
import Documents from "./documents/Documents";
import AddDocument from "./documents/AddDocument";
import Profile from "./profile/Profile";
import Loader from "./Loader";

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) return <Loader />;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="add-document" element={<AddDocument />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <Routes>
    <Route path="dashboard/*" element={<AdminDashboardLayout />} />
  </Routes>
);

export default AdminDashboard;