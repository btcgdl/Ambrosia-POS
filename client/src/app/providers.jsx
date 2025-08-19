"use client";

import { AuthProvider } from "../modules/auth/AuthProvider";
import { TurnProvider } from "../modules/cashier/useTurn";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

export default function Providers({ children }) {
  return (
    <>
      <AuthProvider>
        <TurnProvider>
          <HeroUIProvider>
            <ToastProvider placement="bottom-left" maxVisibleToasts={1} />
            {children}
          </HeroUIProvider>
        </TurnProvider>
      </AuthProvider>
    </>
  );
}
