import type { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import { Bricolage_Grotesque } from "next/font/google";
import LandingClient from "./LandingClient";
import AnnouncementBar from "./AnnouncementBar";
import ConsumptionForms from "./ConsumptionForms";
import Faq from "./Faq";
import Footer from "./Footer";
import StickyContactCTA from "./StickyContactCTA";
import TestimonialsSlider from "./TestimonialsSlider";
import TestimonialsWall from "./TestimonialsWall";
import TreatmentSteps from "./TreatmentSteps";
import { TESTIMONIALS_META } from "../lp5/testimonialsMeta";

// atendimento-consulta = lp12 com o hero em ângulo de OBJETIVO (seleção única → patologia).
// Display font só desta rota: personalidade nos headings/números sem
// abandonar o tom clínico sans da lp5 (corpo continua Geist do root).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

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
// um depoimento novo (atendimento-consulta está em TESTIMONIAL_PATHS).
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
    <div className={`atendimento-consulta ${bricolage.variable}`}>
      <style>{`
        .atendimento-consulta {
          --green-900: #1C4423;
          --green-700: #285E31;
          --green-600: #2d6e3f;
          --green-500: #3D8F4A;
          --green-100: #E5F2E7;
          --green-50: #F5FAF6;
          --ink: #171B18;
          --muted: #5B6660;
          --line: #E5EAE6;
          --shadow-card: 0 1px 2px rgba(23,27,24,.05), 0 8px 24px rgba(23,27,24,.06);
          --shadow-float: 0 12px 32px rgba(40,94,49,.22);
          --radius-card: 1rem;
          --radius-panel: 1.5rem;
          --radius-btn: .875rem;
        }
        .atendimento-consulta .font-display {
          font-family: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;
          letter-spacing: -0.02em;
        }
        @keyframes ctaWave {
          0% {
            box-shadow: 0 0 0 0 rgba(61,143,74,0.55);
          }
          100% {
            box-shadow: 0 0 0 18px rgba(61,143,74,0);
          }
        }
        .atendimento-consulta .cta-pulse {
          position: relative;
          isolation: isolate;
        }
        .atendimento-consulta .cta-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: ctaWave 1.6s cubic-bezier(0.25, 0.8, 0.4, 1) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .atendimento-consulta .cta-pulse::after { animation: none; }
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-white">
        <AnnouncementBar />
        <LandingClient />
        {insomniaTestimonials.length > 0 ? (
          <div className="relative">
            <TestimonialsSlider
              items={insomniaTestimonials}
              titleLight="Histórias reais de"
              titleBold="nossos pacientes"
            />
            <div
              id="atendimento-consulta-sticky-anchor"
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 h-px w-px"
            />
          </div>
        ) : (
          <div id="atendimento-consulta-sticky-anchor" aria-hidden="true" />
        )}
        <ConsumptionForms />
        <div id="atendimento-consulta-treatment-steps">
          <TreatmentSteps />
        </div>
        <TestimonialsWall />
        <Faq />
      </main>
      <Footer />
      <StickyContactCTA />
    </div>
  );
}
