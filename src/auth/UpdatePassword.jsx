import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully! You can now log in.");
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
