import { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext'
import axiosInstance from '../api/axiosInstance';

function useSignup() {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullname, username, password, confirmPassword, gender }) => {
        const success = handleInputErrors({ fullname, username, password, confirmPassword, gender });
        if (!success) return;

        setLoading(true);

        try {
            const res = await axiosInstance.post("/auth/signup", {
                fullname,
                username,
                password,
                confirmPassword,
                gender,
            });

            const data = res.data;

            if (data) {
                localStorage.setItem("chat-user", JSON.stringify(data.user));
                setAuthUser(data.user);
                toast.success("Signed Up Successfully")
            }

        } catch (error) {
            console.log("Error is from catch");
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullname, username, password, confirmPassword, gender }) {

    if (!fullname || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill all the fields");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Password and ConfirmPasswrd should be similar");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true
}