"use client";

import { useEffect, useState, useMemo } from "react";
import { NextIntlClientProvider } from "next-intl";

import onboarding_es from "../components/pages/Onboarding/locales/es.js";
import onboarding_en from "../components/pages/Onboarding/locales/en.js";

const translations = {
  en: {
    onboarding: onboarding_en
  },
  es: {
    onboarding: onboarding_es
  },
}

function mergeLocales(locale) {
  const groups = translations[locale] || {};
  return Object.values(groups).reduce(
    (acc, mod) => ({ ...acc, ...mod }),
    {}
  );
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState("es");
  const messages = useMemo(() => mergeLocales(locale), [locale]);

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored && translations[stored]) {
      setLocale(stored);
    }
  }, []);

  const changeLocale = (newLocale) => {
    if (!translations[newLocale]) return;
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher locale={locale} onChange={changeLocale} visible="yes" />
      {children}
    </NextIntlClientProvider>
  );
}

function LanguageSwitcher({ locale, onChange, visible }) {
  if (visible === "none") return null;
  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      <button
        onClick={() => onChange(locale === "es" ? "en" : "es")}
        style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "#eee",
          border: "none",
          cursor: "pointer",
        }}
      >
        {locale === "es" ? "Switch to English" : "Cambiar a Español"}
      </button>
    </div>
  );
}
