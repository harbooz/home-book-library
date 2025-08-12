import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password", // change to your deployed URL
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent! Please check your email.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
