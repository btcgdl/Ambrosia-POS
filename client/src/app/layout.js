import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import ModuleNavigation from "../components/ModuleNavigation";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ambrosia-POS",
  description: "Made by BTCGDL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="">
            <ModuleNavigation>{children}</ModuleNavigation>
          </div>
        </Providers>
      </body>
    </html>
  );
}
