import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import ClickLanding from "./ClickLanding";

const bricolage = Bricolage_Grotesque({
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
    <div className={bricolage.variable}>
      <ClickLanding />
    </div>
  );
}
