import { useLocation, useNavigate } from 'react-router-dom';
import { useTurn } from './useTurn';
import { useUserRole } from "../../contexts/UserRoleContext";
import { useEffect } from 'react';

const notProtectedRoutes = ['/', '/open-turn', '/close-turn'];

export function ProtectedRoute({ children }) {
    const { openTurn } = useTurn();
    const { userRole } = useUserRole();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!notProtectedRoutes.includes(location.pathname)) {
            if (!openTurn && userRole) {
                navigate('/open-turn', { replace: true });
            }
            if (!userRole) navigate('/', { replace: true });
        }
    }, [userRole, openTurn, location.pathname, navigate]);

    if (notProtectedRoutes.includes(location.pathname)) {
        return children;
    }

    if (!userRole || !openTurn) {
        return null;
    }

    return children;
}