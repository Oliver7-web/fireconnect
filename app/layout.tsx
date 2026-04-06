import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FireConnect - Rede Social para Bombeiros",
  description: "Conectando bombeiros civis a empresas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
