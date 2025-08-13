import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import Theme from "../Theme";
import { FaXmark } from "react-icons/fa6";

const ProfileContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  font-size: 1.2rem; 
`;

const Card = styled.div`
 background: ${Theme.colors.darkBrownRgba};
  border-radius: 16px;
  padding: 32px 28px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  position: relative;

  .close--profile {
    font-size: 2.5rem;
    color: ${Theme.colors.whiteText};
    position: absolute;
    right: 2rem;
    top: 2rem;
    cursor: pointer;
  }

  h1 {
    text-align: center;
    margin-bottom: 24px;
    color: ${Theme.colors.whiteText};
    font-weight: 700;
    font-size: 24px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${Theme.colors.whiteText};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid ${Theme.colors.whiteText};
  background: transparent;
  font-size: 14px;
  box-sizing: border-box;
  color: ${Theme.colors.whiteText};
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: ${Theme.colors.primary || "#2575fc"};
  color: white;
  padding: 12px 0;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.25s ease;

  &.submit--btn {
    background-color: ${Theme.colors.whiteText};
    color: ${Theme.colors.text};
    &:hover {
      background-color: ${Theme.colors.primary || "#2575fc"};
      color: ${Theme.colors.whiteText};
    }
  }

  &:hover {
    background-color: ${Theme.colors.whiteText};
    color: ${Theme.colors.text};
  }
`;

const Message = styled.p`
  color: ${({ error }) => (error ? "red" : "#007BFF")};
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }
    getProfile();
  }

  async function getProfile() {
    setLoading(true);
    setMessage("");
    setErrorMsg(false);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg(true);
      setMessage(userError?.message || "User not found.");
      setLoading(false);
      return;
    }

    setEmail(user.email);

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, address")
      .eq("id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      await supabase
        .from("profiles")
        .insert({ id: user.id, full_name: "", address: "" });
      setFullName("");
      setAddress("");
    } else if (data) {
      setFullName(data.full_name || "");
      setAddress(data.address || "");
    } else if (error) {
      setErrorMsg(true);
      setMessage(error.message);
    }

    setLoading(false);
  }

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg(false);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg(true);
      setMessage(userError?.message || "User not found.");
      setLoading(false);
      return;
    }

    try {
      if (email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
        setMessage("Email update link sent! Please check your inbox.");
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        address,
      });

      if (profileError) throw profileError;

      if (!errorMsg) setMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMsg(true);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword() {
    if (!password) {
      setErrorMsg(true);
      setMessage("Please enter a new password.");
      return;
    }

    setLoading(true);
    setMessage("");
    setErrorMsg(false);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMsg(true);
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully.");
      setPassword("");
    }
    setLoading(false);
  }

  return (
    <ProfileContainer>
      <Card>
        <FaXmark
          className="close--profile"
          onClick={() => navigate(-1)}
        />
        <h1>My Profile</h1>

        {message && <Message error={errorMsg}>{message}</Message>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <form onSubmit={updateProfile}>
              <Label>Full Name:</Label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Label>Email:</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Label>Address:</Label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Button type="submit" disabled={loading} className="submit--btn">
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>

            <Label>New Password:</Label>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button onClick={updatePassword} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </>
        )}
      </Card>
    </ProfileContainer>
  );
}
