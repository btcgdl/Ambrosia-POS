"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";

const context = require.context("./locales", true, /\.json$/);

function loadLocales() {
  const locales = { en: {}, es: {} };

  context.keys().forEach((key) => {
    const parts = key.split("/");
    const feature = parts[1]; 
    const fileName = parts[2]; 

    if (fileName.startsWith("en")) locales.en[feature] = context(key);
    if (fileName.startsWith("es")) locales.es[feature] = context(key);
  });

  return locales;
}

const dictionaries = loadLocales();

function mergeMessages(locale) {
  const messages = {};
  for (const [namespace, data] of Object.entries(dictionaries[locale])) {
    messages[namespace] = data;
  }
  return messages;
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState("es");
  const [messages, setMessages] = useState(mergeMessages("es"));

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored && dictionaries[stored]) {
      setLocale(stored);
      setMessages(mergeMessages(stored));
    }
  }, []);

  const changeLocale = (newLocale) => {
    if (dictionaries[newLocale]) {
      setLocale(newLocale);
      setMessages(mergeMessages(newLocale));
      localStorage.setItem("locale", newLocale);
    }
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
