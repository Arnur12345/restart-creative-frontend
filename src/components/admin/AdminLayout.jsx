import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet, useOutletContext } from 'react-router-dom';

const AdminLayout = () => {
  const parentContext = useOutletContext(); // получаем { token, user } из AdminPanel
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Outlet context={parentContext} />
      </main>
    </div>
  );
};

export default AdminLayout; 