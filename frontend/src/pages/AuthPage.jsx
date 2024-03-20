import React from "react";
import SignupCard from "../components/SignUp";
import LoginCard from "../components/Login";
import { useSelector } from "react-redux";

const AuthPage = () => {
  const authValue = useSelector((state) => state.authSlice.value);
  return <>{authValue === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
