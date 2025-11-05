"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../modules/auth/AuthProvider';
import { getAvailableModules, getAvailableNavigation, hasAccessToRoute } from '../lib/modules';

export function useModules() {
  const { isAuth, userInfo, logout, isLoading } = useContext(AuthContext);
  const [availableModules, setAvailableModules] = useState({});
  const [availableNavigation, setAvailableNavigation] = useState([]);

  const isAdmin = userInfo?.isAdmin || false;

  useEffect(() => {
    if (!isLoading) {
      const modules = getAvailableModules(isAuth, isAdmin);
      const navigation = getAvailableNavigation(isAuth, isAdmin);

      setAvailableModules(modules);
      setAvailableNavigation(navigation);

      console.log('📦 Módulos disponibles:', Object.keys(modules));
      console.log('🧭 Navegación disponible:', navigation.map(nav => nav.path));
    }
  }, [isAuth, isAdmin, isLoading]);

  const checkRouteAccess = (pathname) => {
    return hasAccessToRoute(pathname, isAuth, isAdmin);
  };

  return {
    availableModules,
    availableNavigation,
    checkRouteAccess,
    isAuth,
    isAdmin,
    isLoading,
    userInfo,
    logout
  };
}
