import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function LP2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${inter.variable} font-[family-name:var(--font-inter)]`}>{children}</div>;
}
