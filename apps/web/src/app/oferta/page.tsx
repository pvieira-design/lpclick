import type { Metadata } from "next";
import { Fraunces, Lexend } from "next/font/google";
import LandingClient from "./LandingClient";
import "./oferta.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · Roleta Click · Cashback de R$50",
  description:
    "Gire a Roleta Click e libere R$50 de cashback. Use o cupom CASHBACK no link de pagamento da sua consulta.",
  openGraph: {
    title: "Click Cannabis · Roleta Click · Cashback de R$50",
    description:
      "Libere R$50 de cashback e use o cupom CASHBACK no pagamento da consulta.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

// Página estática, sem dependência de banco.
export const revalidate = false;

export default function OfertaPage() {
  return (
    <div className={`oferta ${fraunces.variable} ${lexend.variable}`}>
      <LandingClient />
    </div>
  );
}
