"use client";

import './globals.css';
import React, { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <button className="toggle-button" onClick={toggleSidebar}>
          <span>&#9776; {}</span>
        </button>
        <div className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
          <h2>Smart Casa</h2>
          <a href="#monitoring">Monitoring</a>
          {/* Gambar di bagian bawah */}
          <div className="sidebar-footer">
            <img src="/dashboard.png" alt="Footer Logo" />
          </div>
        </div>
        <div className={`main-content ${isSidebarOpen ? '' : 'expanded'}`}>
          {children}
        </div>
      </body>
    </html>
  );
}
