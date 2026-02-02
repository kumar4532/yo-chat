import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Profile from "./pages/profile/Profile";
import Video from "./pages/call/Video";
import Voice from "./pages/call/Voice";

import { Toaster } from "react-hot-toast";
import useListenMessages from "./hooks/useListenMessages";
import AuthSkeleton from "./components/skeleton/AuthSkeleton";
import LayoutSkeleton from "./components/skeleton/LayoutSkeleton";

function App() {
  const { authUser, loading } = useAuthContext();
  const location = useLocation();
  useListenMessages();

  if (loading) {
    const authRoutes = ["/login", "/signup"];
    const isAuthRoute = authRoutes.includes(location.pathname);

    return isAuthRoute ? <AuthSkeleton /> : <LayoutSkeleton />;
  }

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/video" element={authUser ? <Video /> : <Navigate to="/login" />} />
        <Route path="/voice" element={authUser ? <Voice /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;