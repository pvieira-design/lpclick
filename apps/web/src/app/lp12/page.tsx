import type { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import TestimonialsSlider from "./TestimonialsSlider";
import { TESTIMONIALS_META } from "../lp5/testimonialsMeta";
import Lp12PageContent from "./Lp12PageContent";

export const metadata: Metadata = {
  title: "Click Cannabis · Médicos Prescritores de Cannabis Medicinal",
  description:
    "Consulta médica por R$50, receita, autorização ANVISA e entrega em até 15 dias úteis. Tratamento 100% online com acompanhamento completo.",
  openGraph: {
    title: "Click Cannabis · Médicos Prescritores de Cannabis Medicinal",
    description:
      "Consulta médica por R$50, receita, autorização ANVISA e entrega em até 15 dias úteis. Tratamento 100% online.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

const FEATURED_INSOMNIA_IDS = [
  "c4c187de-ba4a-4793-9700-ce8a37b215b1", // Flavia
  "1ad9622d-aa32-4d93-aa9f-2450c9fb4b6a", // Eduardo
  "124d2626-1f79-423c-835b-771ba7f61370", // Miguel
  "c1b3ead5-4220-46f1-af9b-ad6884753a30", // Alexandre
  "23c65bc9-2930-4fb6-a7b5-02d9bfb2d1da", // Rafaella
];

// Cache estático; revalidado sob demanda pelo /api/forms/submit ao entrar
// um depoimento novo (lp12 está em TESTIMONIAL_PATHS).
export const revalidate = false;

const sql = neon(process.env.NEON_DATABASE_URL!);

type TestimonialRow = {
  id: string;
  user_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

type Testimonial = TestimonialRow & {
  nome: string | null;
  patologias: string[];
};

async function getTestimonials(): Promise<Testimonial[]> {
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
  return rows.map((r) => {
    const meta = TESTIMONIALS_META[r.id];
    return {
      ...r,
      nome: meta?.nome ?? null,
      patologias: meta?.patologias ?? [],
    };
  });
}

export default async function LandingPage() {
  const testimonials = await getTestimonials();
  const insomniaTestimonials = testimonials.filter((t) =>
    FEATURED_INSOMNIA_IDS.includes(t.id),
  );

  return (
    <Lp12PageContent
      videoTestimonials={
        insomniaTestimonials.length > 0 ? (
          <div className="relative">
            <TestimonialsSlider
              items={insomniaTestimonials}
              titleLight="Histórias reais de"
              titleBold="nossos pacientes"
            />
            <div
              id="lp12-sticky-anchor"
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 h-px w-px"
            />
          </div>
        ) : undefined
      }
    />
  );
}
