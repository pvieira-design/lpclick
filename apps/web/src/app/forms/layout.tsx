import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../../index.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis — Formulário",
  description: "Preencha o formulário para iniciar seu acompanhamento.",
  robots: { index: false, follow: false },
};

export default function FormsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={outfit.variable}>
      {children}
    </div>
  );
}
