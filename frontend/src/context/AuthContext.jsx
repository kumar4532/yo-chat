import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMe = async () => {
            try {
                const res = await axiosInstance.get("/auth/me");

                setAuthUser(res.data);
                console.log("response for refresh", res.data)
            } catch {
                setAuthUser(null);
            } finally {
                setLoading(false);
            }
        };

        getMe();
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};