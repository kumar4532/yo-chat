import { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext'
import axiosInstance from '../api/axiosInstance';

function useLogin() {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async ({ username, password }) => {
        const success = handleInputErrors({ username, password });
        if (!success) return;

        setLoading(true);

        try {
            const res = await axiosInstance.post("/auth/login", { username, password });
            const data = res.data;

            if (data) {
                setAuthUser(data.user);
                toast.success("Logged In Successfully")
            }

        } catch (error) {
            console.log("Login error:", error);

            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                "Something went wrong";

            toast.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors({ username, password }) {
    if (!username || !password) {
        toast.error("Please fill all the fields");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true
}