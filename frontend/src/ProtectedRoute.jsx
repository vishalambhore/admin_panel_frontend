import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { admin, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (!admin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;