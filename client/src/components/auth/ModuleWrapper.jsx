"use client";
import { useModules } from '../../hooks/useModules';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ModuleWrapper({ children }) {
  const { checkRouteAccess, isLoading } = useModules();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !checkRouteAccess(pathname)) {
      console.log('❌ Acceso denegado a:', pathname);
      router.push('/unauthorized');
    }
  }, [pathname, checkRouteAccess, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!checkRouteAccess(pathname)) {
    return null; // El useEffect ya redirige
  }

  return children;
}
