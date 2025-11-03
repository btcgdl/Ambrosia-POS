"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../modules/auth/AuthProvider";
import { getHomeRoute } from "../lib/getHomeRoute";
import LoadingCard from "../components/LoadingCard";
import { OnboardingWizard } from "../components/OnboardingWizard";

export default function HomePage() {
  // const router = useRouter();
  // const { user, isLoading, isAuth } = useContext(AuthContext);

  // useEffect(() => {
  //   if (isLoading) {
  //     return;
  //   }

  //   const homeRoute = getHomeRoute(user);
  //   router.replace(homeRoute);
  // }, [user, isAuth, isLoading, router]);

  return (
    // <LoadingCard
    //   message={isLoading ? "Verificando autenticación..." : "Redirigiendo..."}
    // />
    <OnboardingWizard />
  );
}
