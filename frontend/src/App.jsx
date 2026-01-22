import React from "react"
import Home from "./pages/home/Home"
import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/login/Login"
import SignUp from "./pages/signup/SignUp"
import Profile from "./pages/profile/Profile"
import Video from "./pages/call/Video"
import Voice from "./pages/call/Voice"
import { Toaster } from "react-hot-toast"
import { useAuthContext } from "./context/AuthContext"
import LayoutSkeleton from "./components/skeleton/LayoutSkeleton"
import useListenMessages from "./hooks/useListenMessages"

function App() {
  const { authUser, loading } = useAuthContext();
  useListenMessages();

  if (loading) {
    return <LayoutSkeleton />;
  }
  return (
    <>
      <div className="p-4 h-screen flex items-center justify-center">
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={authUser ? <Navigate to={"/"} /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to={"/"} /> : <SignUp />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Login />} />
          <Route path="/video" element={authUser ? <Video /> : <Login />} />
          <Route path="/voice" element={authUser ? <Voice /> : <Login />} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
