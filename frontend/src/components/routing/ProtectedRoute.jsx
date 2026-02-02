import { Navigate } from "react-router-dom";
import LayoutSkeleton from "../skeleton/LayoutSkeleton"
import AuthSkeleton from "../skeleton/AuthSkeleton";
import { useAuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { authUser, loading } = useAuthContext();
    const isLoggedInHint = localStorage.getItem("isLoggedIn") === "true";

    if (loading) {
        return isLoggedInHint ? <LayoutSkeleton /> : <AuthSkeleton />;
    }

    if (!authUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;