"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../modules/auth/AuthProvider';
import { getAvailableModules, getAvailableNavigation, hasAccessToRoute } from '../lib/modules';

export function useModules() {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);
  const [availableModules, setAvailableModules] = useState({});
  const [availableNavigation, setAvailableNavigation] = useState([]);

  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    if (!isLoading) {
      const modules = getAvailableModules(isAuthenticated, isAdmin);
      const navigation = getAvailableNavigation(isAuthenticated, isAdmin);
      
      setAvailableModules(modules);
      setAvailableNavigation(navigation);
      
      console.log('📦 Módulos disponibles:', Object.keys(modules));
      console.log('🧭 Navegación disponible:', navigation.map(nav => nav.path));
    }
  }, [isAuthenticated, isAdmin, isLoading]);

  const checkRouteAccess = (pathname) => {
    return hasAccessToRoute(pathname, isAuthenticated, isAdmin);
  };

  return {
    availableModules,
    availableNavigation,
    checkRouteAccess,
    isAuthenticated,
    isAdmin,
    isLoading,
    user
  };
}