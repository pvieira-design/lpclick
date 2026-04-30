import { neon } from "@neondatabase/serverless";
import LandingClient from "./LandingClient";
import ConsumptionForms from "./ConsumptionForms";
import TestimonialsSlider from "./TestimonialsSlider";
import FeaturedTestimonial from "./FeaturedTestimonial";
import BenefitsSlider from "./BenefitsSlider";
import TreatmentSteps from "./TreatmentSteps";
import TreatmentCTA from "./TreatmentCTA";
import { TESTIMONIALS_META } from "./testimonialsMeta";

const FLAVIA_ID = "c4c187de-ba4a-4793-9700-ce8a37b215b1";
const FLAVIA_QUOTE =
  "Comecei com o óleo e agora estou tomando as jujubas de THC e durmo muito melhor. Indico sempre, só tenho o que agradecer!";
const FLAVIA_IMAGE = "/depoimentos/flavia.webp";

const EDUARDO_ID = "1ad9622d-aa32-4d93-aa9f-2450c9fb4b6a";
const EDUARDO_QUOTE =
  "Tenho 56 anos e sempre tive dificuldade para dormir. Fui receitado a jujuba e hoje durmo 7 a 8 horas direto — não sentia isso desde a adolescência.";
const EDUARDO_IMAGE = "/depoimentos/eduardo.webp";

const MIGUEL_ID = "124d2626-1f79-423c-835b-771ba7f61370";
const MIGUEL_QUOTE =
  "Demorou um pouco para chegar, mas valeu a pena demais. Reduziu muito minha ansiedade e o sono é outro. Recomendo demais!";
const MIGUEL_IMAGE = "/depoimentos/miguel.webp";

const ALEXANDRE_ID = "c1b3ead5-4220-46f1-af9b-ad6884753a30";
const ALEXANDRE_QUOTE =
  "Sou praticante de atividade física intensa. Melhorou demais meu sono e a recuperação muscular — é uma bênção da natureza esse remédio!";
const ALEXANDRE_IMAGE = "/depoimentos/alexandre.webp";

const RAFAELLA_ID = "23c65bc9-2930-4fb6-a7b5-02d9bfb2d1da";
const RAFAELLA_QUOTE =
  "Não tomo mais remédios. Desde os primeiros dias já senti uma diferença muito grande, a enxaqueca praticamente zerou. CBD é vida!";
const RAFAELLA_IMAGE = "/depoimentos/rafaella.webp";

const FEATURED_IDS = [
  FLAVIA_ID,
  EDUARDO_ID,
  MIGUEL_ID,
  ALEXANDRE_ID,
  RAFAELLA_ID,
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
  tempoPaciente: string | null;
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
      tempoPaciente: meta?.tempoPaciente ?? null,
    };
  });
}

function insomniaSubtitle(patologias: string[]): string {
  const others = patologias.filter(
    (p) => p.toLowerCase() !== "insônia",
  ).length;
  return others > 0 ? `Tratou insônia +${others}` : "Tratou insônia";
}

export default async function LandingPage() {
  const testimonials = await getTestimonials();
  const findById = (id: string) => testimonials.find((t) => t.id === id);
  const flavia = findById(FLAVIA_ID);
  const eduardo = findById(EDUARDO_ID);
  const miguel = findById(MIGUEL_ID);
  const alexandre = findById(ALEXANDRE_ID);
  const rafaella = findById(RAFAELLA_ID);
  const featuredItems = [
    flavia
      ? {
          testimonial: flavia,
          quote: FLAVIA_QUOTE,
          imageSrc: FLAVIA_IMAGE,
          subtitle: insomniaSubtitle(flavia.patologias),
        }
      : null,
    eduardo
      ? {
          testimonial: eduardo,
          quote: EDUARDO_QUOTE,
          imageSrc: EDUARDO_IMAGE,
          subtitle: insomniaSubtitle(eduardo.patologias),
        }
      : null,
    miguel
      ? {
          testimonial: miguel,
          quote: MIGUEL_QUOTE,
          imageSrc: MIGUEL_IMAGE,
          subtitle: insomniaSubtitle(miguel.patologias),
        }
      : null,
    alexandre
      ? {
          testimonial: alexandre,
          quote: ALEXANDRE_QUOTE,
          imageSrc: ALEXANDRE_IMAGE,
          subtitle: insomniaSubtitle(alexandre.patologias),
        }
      : null,
    rafaella
      ? {
          testimonial: rafaella,
          quote: RAFAELLA_QUOTE,
          imageSrc: RAFAELLA_IMAGE,
          subtitle: insomniaSubtitle(rafaella.patologias),
        }
      : null,
  ].filter((x): x is NonNullable<typeof x> => x !== null);
  // Slider final: todos os pacientes restantes (insônia + outras patologias),
  // exceto os que aparecem no slider featured.
  const remainingTestimonials = testimonials.filter(
    (t) => !FEATURED_IDS.includes(t.id),
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

      <main className="flex min-h-svh flex-col bg-white">
        <LandingClient />
        {featuredItems.length > 0 && (
          <FeaturedTestimonial items={featuredItems} />
        )}
        <BenefitsSlider />
        <ConsumptionForms />
        <TreatmentCTA />
        <TreatmentSteps />
        <TestimonialsSlider
          items={remainingTestimonials}
          titleLight="Histórias reais de"
          titleBold="nossos pacientes"
        />
      </main>
    </>
  );
}
