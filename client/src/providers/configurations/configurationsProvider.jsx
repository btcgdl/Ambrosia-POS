"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../../services/apiClient";

export const ConfigurationsContext = createContext();

export function ConfigurationsProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const readBusinessTypeFromCookie = () => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|; )businessType=([^;]+)/);
    try {
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  };

  const businessType = useMemo(() => {
    return config?.businessType || readBusinessTypeFromCookie() || null;
  }, [config]);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient("/config", {
        skipRefresh: true,
        silentAuth: true,
      });
      setConfig(data);
    } catch (err) {
      setConfig(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const value = {
    config,
    isLoading,
    businessType,
    refreshConfig: fetchConfig,
    setConfig,
  };

  return (
    <ConfigurationsContext.Provider value={value}>
      {children}
    </ConfigurationsContext.Provider>
  );
}

export const useConfigurations = () => useContext(ConfigurationsContext);
