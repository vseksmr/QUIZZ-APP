import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./AppLayout.css";

const AppLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    console.log("🔃 AppLayout: loading user...");
    return null;
  }

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="app-title-wrapper">
          <div className="app-title">QUIZAPP</div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? "✖" : "☰"}
          </button>
        </div>
        <div className="user-info">
          <button className="logout-btn" onClick={() => window.location.href = '/logout'}>Logout</button>
        </div>
      </header>

      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-user">
            <div className="user-circle">{user?.email[0]?.toUpperCase()}</div>
            {sidebarOpen && <p className="user-name">{user?.email}</p>}
            <span className="status">● Online</span>
          </div>

          <nav className="sidebar-nav">
  <Link to="/dashboard">
    <span role="img" aria-label="Dashboard">🏠</span>
    {sidebarOpen && <span className="sidebar-link-text"> Dashboard</span>}
  </Link>
  <Link to="/quizzes">
    <span role="img" aria-label="Quizzes">📝</span>
    {sidebarOpen && <span className="sidebar-link-text"> Quizzes</span>}
  </Link>
  <Link to="/quizzes/create">
    <span role="img" aria-label="Create Quiz">➕</span>
    {sidebarOpen && <span className="sidebar-link-text"> Create Quiz</span>}
  </Link>
  <Link to="/users">
    <span role="img" aria-label="Users">👥</span>
    {sidebarOpen && <span className="sidebar-link-text"> Users</span>}
  </Link>
  <Link to="/history">
    <span role="img" aria-label="History">📊</span>
    {sidebarOpen && <span className="sidebar-link-text"> History</span>}
  </Link>
  <Link to="/settings">
    <span role="img" aria-label="Settings">⚙️</span>
    {sidebarOpen && <span className="sidebar-link-text"> Settings</span>}
  </Link>
  {user?.isAdmin && (
    <Link to="/admin">
      <span role="img" aria-label="Admin">🛠</span>
      {sidebarOpen && <span className="sidebar-link-text"> Admin Panel</span>}
    </Link>
  )}
</nav>
        </aside>

        <main className={`main-content ${sidebarOpen ? "with-sidebar" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
