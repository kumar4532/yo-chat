import { Navigate } from "react-router-dom";
import AuthSkeleton from "../skeleton/AuthSkeleton"
import { useAuthContext } from "../../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { authUser, loading } = useAuthContext();

    if (loading) {
        return <AuthSkeleton />;
    }

    if (authUser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;