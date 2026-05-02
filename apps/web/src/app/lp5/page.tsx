import { neon } from "@neondatabase/serverless";
import LandingClient from "./LandingClient";
import ConsumptionForms from "./ConsumptionForms";
import MediaLogosMarquee from "./MediaLogosMarquee";
import TestimonialsSlider from "./TestimonialsSlider";
import TreatmentSteps from "./TreatmentSteps";
import TreatmentCTA from "./TreatmentCTA";
import StickyContactCTA from "./StickyContactCTA";
import TestimonialsWall from "./TestimonialsWall";
import { TESTIMONIALS_META } from "./testimonialsMeta";

const FEATURED_INSOMNIA_IDS = [
  "c4c187de-ba4a-4793-9700-ce8a37b215b1", // Flavia
  "1ad9622d-aa32-4d93-aa9f-2450c9fb4b6a", // Eduardo
  "124d2626-1f79-423c-835b-771ba7f61370", // Miguel
  "c1b3ead5-4220-46f1-af9b-ad6884753a30", // Alexandre
  "23c65bc9-2930-4fb6-a7b5-02d9bfb2d1da", // Rafaella
];

export const revalidate = 60;

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
  const otherTestimonials = testimonials.filter(
    (t) => !FEATURED_INSOMNIA_IDS.includes(t.id),
  );

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(16px); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .anim-logo {
          animation: slideUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .anim-title {
          animation: slideUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 120ms forwards;
        }
        .anim-subtitle {
          opacity: 0;
          animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 220ms forwards;
        }
        .anim-card {
          opacity: 0;
          animation: fadeInUp 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .anim-btn {
          opacity: 0;
          animation: fadeInUp 500ms cubic-bezier(0.23, 1, 0.32, 1) 1050ms forwards;
        }
        dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          margin: 0;
        }
        dialog::backdrop {
          background: rgba(0,0,0,0.5);
        }
        @keyframes tooltipIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.96); }
          60% { opacity: 1; transform: translateY(-3px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tooltip-enter {
          animation: tooltipIn 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .tooltip-enter { animation: none; opacity: 1; }
          .anim-logo, .anim-title, .anim-subtitle, .anim-card, .anim-btn {
            animation: none;
            opacity: 1;
          }
          dialog, dialog::backdrop {
            transition: none;
          }
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-white pb-[calc(10rem+env(safe-area-inset-bottom))]">
        <LandingClient />
        {insomniaTestimonials.length > 0 ? (
          <div className="relative">
            <TestimonialsSlider
              items={insomniaTestimonials}
              titleLight="Histórias reais de"
              titleBold="pacientes com insônia"
            />
            <div
              id="lp5-sticky-anchor"
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 h-px w-px"
            />
          </div>
        ) : (
          <div id="lp5-sticky-anchor" aria-hidden="true" />
        )}
        <ConsumptionForms />
        <TreatmentCTA />
        <MediaLogosMarquee />
        <div id="lp5-treatment-steps">
          <TreatmentSteps />
        </div>
        {otherTestimonials.length > 0 && (
          <div id="lp5-other-testimonials">
            <TestimonialsSlider
              items={otherTestimonials}
              titleLight="Conheça os"
              titleBold="demais pacientes"
            />
          </div>
        )}
        <TestimonialsWall />
      </main>
      <StickyContactCTA />
    </>
  );
}
