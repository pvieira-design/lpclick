import type { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import { Fraunces, Lexend } from "next/font/google";
import LandingClient from "./LandingClient";
import type { VideoTestimonial } from "./TestimonialsSlider";
import { TESTIMONIALS_META } from "../lp5/testimonialsMeta";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · O óleo certo para o seu tratamento",
  description:
    "Cannabis medicinal com consulta médica, receita, importação e acompanhamento. Tudo 100% online, regulamentado pela ANVISA. Primeira consulta R$50.",
  openGraph: {
    title: "Click Cannabis · O óleo certo para o seu tratamento",
    description:
      "Cannabis medicinal com consulta médica, receita, importação e acompanhamento. Tudo 100% online, regulamentado pela ANVISA.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

// Cache estático; revalidado sob demanda pelo /api/forms/submit ao entrar um
// depoimento novo (lp11 está em TESTIMONIAL_PATHS).
export const revalidate = false;

type TestimonialRow = {
  id: string;
  user_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

// Mesmo critério da lp9: "Andre C." não é paciente em tratamento.
const EXCLUDED_IDS = new Set(["eb7251cd-087b-47bb-b619-e574cc11c636"]);

async function getTestimonials(): Promise<VideoTestimonial[]> {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!);
    const rows = (await sql`
      SELECT
        id,
        payload->'url'->>'userId' AS user_id,
        payload->>'videoUrl' AS video_url,
        payload->>'thumbnailUrl' AS thumbnail_url
      FROM form_submissions
      WHERE form_type = 'historia'
        AND payload->>'videoUrl' IS NOT NULL
      ORDER BY created_at DESC
    `) as TestimonialRow[];
    return rows
      .filter((r) => !EXCLUDED_IDS.has(r.id))
      .map((r) => {
        const meta = TESTIMONIALS_META[r.id];
        return {
          ...r,
          nome: meta?.nome ?? null,
          patologias: meta?.patologias ?? [],
        };
      });
  } catch {
    return [];
  }
}

export default async function LP11Page() {
  const testimonials = await getTestimonials();
  return (
    <div className={`lp11 ${fraunces.variable} ${lexend.variable}`}>
      <LandingClient testimonials={testimonials} />
    </div>
  );
}
