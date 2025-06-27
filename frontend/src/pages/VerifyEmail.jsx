import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationCode: code,
        }),
      });

      if (res.ok) {
        setMessage("✅ Email verified successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const text = await res.text();
        setMessage("❌ Verification failed: " + text);
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(`http://localhost:8080/auth/resend?email=${email}`, {
        method: "POST",
      });

      if (res.ok) {
        setMessage("📧 Verification email resent!");
      } else {
        const text = await res.text();
        setMessage("❌ Failed to resend: " + text);
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  return (
    <div className="container">
      <h2>Verify Your Email</h2>
      <form onSubmit={handleVerify} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>

      <button onClick={handleResend} style={{ marginTop: "10px" }}>
        Resend Email
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
