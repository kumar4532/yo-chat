import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Profile from "./pages/profile/Profile";
import Video from "./pages/call/Video";
import Voice from "./pages/call/Voice";

import { Toaster } from "react-hot-toast";
import useListenMessages from "./hooks/useListenMessages";
import PublicRoute from "./components/routing/PublicRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";

function App() {
  useListenMessages();

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/login"
          element={<PublicRoute><Login /></PublicRoute>}
        />
        <Route
          path="/signup"
          element={<PublicRoute><SignUp /></PublicRoute>}
        />

        <Route
          path="/"
          element={<ProtectedRoute><Home /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
        <Route
          path="/video"
          element={<ProtectedRoute><Video /></ProtectedRoute>}
        />
        <Route
          path="/voice"
          element={<ProtectedRoute><Voice /></ProtectedRoute>}
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App