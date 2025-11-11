"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "./../modules/auth/useAuth.js"
import { getAvailableModules, getAvailableNavigation, hasAccessToRoute } from '../lib/modules';

export function useModules() {
  const { isAuth, user, permissions, logout, isLoading } = useAuth();
  const [availableModules, setAvailableModules] = useState({});
  const [availableNavigation, setAvailableNavigation] = useState([]);

  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    if (!isLoading) {
      const modules = getAvailableModules(isAuth, isAdmin, permissions);
      const navigation = getAvailableNavigation(isAuth, isAdmin, permissions);

      setAvailableModules(modules);
      setAvailableNavigation(navigation);
    }
  }, [isAuth, isAdmin, isLoading, permissions]);

  const checkRouteAccess = (pathname) => {
    return hasAccessToRoute(pathname, isAuth, isAdmin, permissions);
  };

  return {
    availableModules,
    availableNavigation,
    checkRouteAccess,
    isAuth,
    isAdmin,
    isLoading,
    user,
    logout
  };
}
