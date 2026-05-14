import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ( ({children}) => {
    const { token } = useAuthStore((state) => state.token);

    const localToken = localStorage.getItem("token");

    if(!token && !localToken) {
        return <Navigate to="login" replace />
    }
    return children;
});

export default ProtectedRoute;