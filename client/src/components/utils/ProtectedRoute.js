import { Navigate } from 'react-router-dom';
import {useUserRole} from "../../contexts/UserRoleContext";

export default function ProtectedRoute({ children }) {
    const { userRole } = useUserRole();

    if (!userRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
