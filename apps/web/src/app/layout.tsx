import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import "../index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      <head>
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      </head>
      {process.env.NODE_ENV === "production" && (
        <GoogleTagManager gtmId="GTM-NHB2NDHK" />
      )}
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <Script
          id="fbclid"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=new URL(window.location.href).searchParams;var f=p.get('fbclid');if(f){document.cookie='fbclid='+f+';path=/;max-age='+60*60*24*30;}})();`,
          }}
        />
      </body>
    </html>
  );
}
