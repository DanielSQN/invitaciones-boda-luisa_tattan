import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luisa & Tattan | Invitacion de boda",
  description: "Invitacion de boda de Luisa y Tattan para el 26 de septiembre de 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <body>{children}</body>
    </html>
  );
}
