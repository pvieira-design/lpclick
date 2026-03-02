import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Click Cannabis — Encontre seu Médico Prescritor",
  description:
    "Consulte médicos especializados em cannabis medicinal. Selecione suas patologias e inicie seu tratamento com acompanhamento profissional.",
  metadataBase: new URL("https://lpclick.com"),
  openGraph: {
    title: "Click Cannabis — Encontre seu Médico Prescritor",
    description:
      "Ansiedade, insônia, dores crônicas? Conectamos você a médicos prescritores de cannabis medicinal em poucos cliques.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Click Cannabis — Encontre seu Médico Prescritor",
    description:
      "Ansiedade, insônia, dores crônicas? Conectamos você a médicos prescritores de cannabis medicinal em poucos cliques.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
