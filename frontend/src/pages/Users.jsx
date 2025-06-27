import React, { useEffect, useState } from "react";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/users/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="users-container">
      <h2>All Users</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">{user.username[0].toUpperCase()}</div>
            <div className="user-details">
              <h3>{user.username}</h3>
              <p className={`status ${user.enabled ? "online" : "offline"}`}>
                ● {user.enabled ? "Online" : "Offline"}
              </p>
              <p className={`role ${user.role.toLowerCase()}`}>
                {user.role === "ADMIN" ? "🛡️ Admin" : "👤 User"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
