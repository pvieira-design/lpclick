import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import ClickLanding from "./ClickLanding";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-click-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · Consulta médica online",
  description:
    "Converse com um médico prescritor de cannabis medicinal em uma consulta online por R$50 e conte com suporte em todas as etapas.",
};

export default function ClickPage() {
  return (
    <div className={lexend.variable}>
      <ClickLanding />
    </div>
  );
}
