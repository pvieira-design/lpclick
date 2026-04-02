import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-loaded",
  display: "swap",
});

export const metadata = {
  title: "ClickCannabis — App de Controle de Tratamento",
  description:
    "Organize seus medicamentos de cannabis medicinal, receba lembretes inteligentes e acompanhe sua evolução. Disponível para iOS e Android.",
  openGraph: {
    title: "ClickCannabis — App de Controle de Tratamento",
    description:
      "Organize seus medicamentos, receba lembretes de doses e acompanhe sua evolução. O app gratuito para quem usa cannabis medicinal.",
    siteName: "ClickCannabis",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "ClickCannabis — App de Controle de Tratamento",
    description:
      "Organize seus medicamentos, receba lembretes de doses e acompanhe sua evolução. O app gratuito para quem usa cannabis medicinal.",
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${inter.className}`}>{children}</div>
  );
}
