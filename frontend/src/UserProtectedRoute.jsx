import { Navigate } from 'react-router-dom';
import { useUser } from '../src/contexts/UserContext';

const UserProtectedRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default UserProtectedRoute;