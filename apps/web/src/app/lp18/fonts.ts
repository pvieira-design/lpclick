import { Inter, Lexend } from "next/font/google";

// Tipografia da marca (aidesignclick): Lexend nos títulos, Inter no corpo.
// Fica num arquivo só, usado pela /lp18 e pela /lp18/variantes, pra as duas
// pedirem a mesma fonte ao Google uma única vez no build.
// Lexend vai como fonte variável: a abertura usa 500 e 600, o formulário usa
// 400, 600 e 700.
export const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});
