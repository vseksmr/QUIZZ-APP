import React, { useEffect, useState } from "react";
import './Settings.css'

const Settings = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated.");
      return;
    }

    fetch("http://localhost:8080/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setUser)
      .catch((err) =>
        setError("Failed to load user info: " + err.message)
      );
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmNewPassword) {
      return alert("New passwords do not match!");
    }

    try {
      const res = await fetch("http://localhost:8080/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      alert("Failed to change password: " + err.message);
    }
  };

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  if (!user) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div className="container">
      <div className="settings-info">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Enabled:</strong> {user.enabled ? "✅ Yes" : "❌ No"}</p>
        <p><strong>Account Locked:</strong> {user.accountNonLocked ? "✅ No" : "❌ Yes"}</p>
        <p><strong>Credentials Expired:</strong> {user.credentialsNonExpired ? "✅ No" : "❌ Yes"}</p>
        <p><strong>Verification Code:</strong> {user.verificationCode ?? "✅ Verified"}</p>
      </div>

      <button
  onClick={() => setShowPasswordForm((prev) => !prev)}
  className="change-password-form cancel-button"
>
  {showPasswordForm ? "Cancel" : "Change Password"}
</button>

{showPasswordForm && (
  <form onSubmit={handlePasswordChange} className="change-password-form">
    <input
      type="password"
      name="oldPassword"
      placeholder="Old Password"
      value={form.oldPassword}
      onChange={handleFormChange}
      required
    />
    <input
      type="password"
      name="newPassword"
      placeholder="New Password"
      value={form.newPassword}
      onChange={handleFormChange}
      required
    />
    <input
      type="password"
      name="confirmNewPassword"
      placeholder="Confirm New Password"
      value={form.confirmNewPassword}
      onChange={handleFormChange}
      required
    />
    <button type="submit">Submit</button>
  </form>
)}
    </div>
  );
};

export default Settings;
