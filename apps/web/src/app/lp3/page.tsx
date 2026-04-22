import { neon } from "@neondatabase/serverless";
import LandingClient from "./LandingClient";
import ConsumptionForms from "./ConsumptionForms";
import TestimonialsSlider from "./TestimonialsSlider";
import TreatmentSteps from "./TreatmentSteps";
import TreatmentCTA from "./TreatmentCTA";

export const revalidate = 60;

const sql = neon(process.env.NEON_DATABASE_URL!);

type Testimonial = {
  id: string;
  user_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await sql`
    SELECT
      id,
      payload->'url'->>'userId' AS user_id,
      payload->>'videoUrl' AS video_url,
      payload->>'thumbnailUrl' AS thumbnail_url
    FROM form_submissions
    WHERE form_type = 'historia'
      AND payload->>'videoUrl' IS NOT NULL
    ORDER BY created_at DESC
  `;
  return rows as Testimonial[];
}

export default async function LandingPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
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
          opacity: 0;
          animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .anim-title {
          opacity: 0;
          animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 120ms forwards;
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

      <main className="flex min-h-svh flex-col bg-white">
        <LandingClient />
        <TestimonialsSlider items={testimonials} />
        <ConsumptionForms />
        <TreatmentCTA />
        <TreatmentSteps />
      </main>
    </>
  );
}
