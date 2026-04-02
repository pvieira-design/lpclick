import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-loaded",
  display: "swap",
});

export const metadata = {
  title: "Click Cannabis — App de Controle de Medicamento",
  description:
    "Organize seus medicamentos de cannabis medicinal, receba lembretes inteligentes e acompanhe sua evolução. Disponível para iOS e Android.",
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
