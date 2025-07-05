import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {logoutFromService} from "./authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const login = ({ accessToken, refreshToken }) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        logoutFromService();
    };

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await refreshToken();
            const newAccessToken = response.data.accessToken;
            setAccessToken(newAccessToken);
            console.log('Access token refreshed');
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
        }
    }, [refreshToken]);

    useEffect(() => {
        if (refreshToken) {
            refreshAccessToken();
            const interval = setInterval(refreshAccessToken, 5 * 59 * 1000);
            return () => clearInterval(interval);
        }
    }, [refreshToken, refreshAccessToken]);

    const value = {
        accessToken,
        refreshToken,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
