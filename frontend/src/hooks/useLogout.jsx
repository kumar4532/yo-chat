import { useState } from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/AuthContext"
import axiosInstance from "../api/axiosInstance"

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext();

    const logout = async() => {
        setLoading(true)
        try {
            const res = await axiosInstance.post("/auth/logout")
            
            const data = res.data;
            
            if (data.error) {
                throw new error;
            }
            
            if (data) {
                localStorage.removeItem("chat-user");
                setAuthUser(null);
                toast.success("Successfully Logged Out")
            }
       } catch (error) {
            toast.error(error.message);
       } finally {
            setLoading(false);
       }
    }

    return {loading, logout}
}

export default useLogout;