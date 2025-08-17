"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../modules/auth/AuthProvider";
import { getHomeRoute } from "../lib/getHomeRoute";
import LoadingCard from "../components/LoadingCard";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Si no está autenticado, redirigir a login
        router.replace("/auth");
      } else {
        // Si está autenticado, redirigir a su página home personalizada
        const homeRoute = getHomeRoute(user);
        console.log(`🏠 Redirigiendo usuario a: ${homeRoute}`);
        router.replace(homeRoute);
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Mostrar loading mientras se determina la redirección
  return (
    <LoadingCard 
      message={isLoading ? "Verificando autenticación..." : "Redirigiendo..."} 
    />
  );
}