"use client";

import { AuthProvider } from "../modules/auth/AuthProvider";
import { TurnProvider } from "../modules/cashier/useTurn";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { I18nProvider } from "../i18n/I18nProvider";

export default function Providers({ children }) {
  return (
    <>
      <AuthProvider>
        <TurnProvider>
          <I18nProvider>
            <HeroUIProvider>
              <ToastProvider placement="top-right" maxVisibleToasts={1} />
              {children}
            </HeroUIProvider>
          </I18nProvider>
        </TurnProvider>
      </AuthProvider>
    </>
  );
}
