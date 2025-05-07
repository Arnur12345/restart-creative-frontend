import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/users', label: 'Пайдаланушылар' },
  { to: '/admin/weeks', label: 'Тақырыптық апталар' }
];

const AdminSidebar = () => (
  <aside className="w-64 min-h-full bg-white border-r shadow-lg py-8 px-4 flex flex-col">
    <nav className="flex flex-col space-y-2">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-primary-50'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar; 