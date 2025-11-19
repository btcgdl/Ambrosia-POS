"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "./../modules/auth/useAuth.js"
import { getAvailableModules, getAvailableNavigation, hasAccessToRoute } from '../lib/modules';
import { useConfigurations } from "../providers/configurations/configurationsProvider";

export function useModules() {
  const { isAuth, user, permissions, logout, isLoading } = useAuth();
  const [availableModules, setAvailableModules] = useState({});
  const [availableNavigation, setAvailableNavigation] = useState([]);

  const isAdmin = user?.isAdmin || false;
  const { businessType } = useConfigurations();

  useEffect(() => {
    if (!isLoading) {
      const modules = getAvailableModules(
        isAuth,
        isAdmin,
        permissions,
        businessType,
      );
      const navigation = getAvailableNavigation(
        isAuth,
        isAdmin,
        permissions,
        businessType,
      );

      setAvailableModules(modules);
      setAvailableNavigation(navigation);
    }
  }, [isAuth, isAdmin, isLoading, permissions, businessType]);

  const checkRouteAccess = (pathname) => {
    return hasAccessToRoute(pathname, isAuth, isAdmin, permissions, businessType);
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
