import type { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import { Bricolage_Grotesque } from "next/font/google";
import LandingClient from "./LandingClient";
import GoogleReviews from "./GoogleReviews";
import HowItWorks from "./HowItWorks";
import LinkList from "./LinkList";
import Footer from "./Footer";
import VideoStories from "./VideoStories";
import { TESTIMONIALS_META } from "../lp5/testimonialsMeta";

// Display só nos títulos desta rota — o corpo continua Geist do root.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · Agende sua consulta de cannabis medicinal",
  description:
    "Consulta online com médico especialista por R$50. Receita e autorização ANVISA sem burocracia. Agende em menos de 1 minuto.",
  openGraph: {
    title: "Médicos Prescritores de Cannabis Medicinal · Click Cannabis",
    description:
      "Consulta online com médico especialista por R$50. Agende em menos de 1 minuto, 100% online.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Médicos Prescritores de Cannabis Medicinal · Click Cannabis",
    description:
      "Consulta online com médico especialista por R$50. Agende em menos de 1 minuto, 100% online.",
  },
};

// Depoimentos em destaque no carrossel (mesmos rostos validados na lp12).
const FEATURED_IDS = [
  "c4c187de-ba4a-4793-9700-ce8a37b215b1", // Flavia
  "1ad9622d-aa32-4d93-aa9f-2450c9fb4b6a", // Eduardo
  "124d2626-1f79-423c-835b-771ba7f61370", // Miguel
  "c1b3ead5-4220-46f1-af9b-ad6884753a30", // Alexandre
  "23c65bc9-2930-4fb6-a7b5-02d9bfb2d1da", // Rafaella
];

export const revalidate = false;

const sql = neon(process.env.NEON_DATABASE_URL!);

type TestimonialRow = {
  id: string;
  user_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

export type Testimonial = TestimonialRow & {
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
  const all = await getTestimonials();
  const featured = FEATURED_IDS.map((id) => all.find((t) => t.id === id)).filter(
    (t): t is Testimonial => Boolean(t),
  );
  // Se algum destaque saiu do ar, completa com os mais recentes que têm nome.
  const stories =
    featured.length >= 3
      ? featured
      : [...featured, ...all.filter((t) => t.nome && !FEATURED_IDS.includes(t.id))].slice(0, 5);

  return (
    <div className={`lp13 ${display.variable}`}>
      <style>{`
        .lp13 {
          --green-900: #12301A;
          --green-800: #1C4423;
          --green-700: #285E31;
          --green-600: #2d6e3f;
          --green-500: #3D8F4A;
          --green-100: #E5F2E7;
          --green-50: #F5FAF6;
          --ink: #171B18;
          --muted: #5B6660;
          --line: #E5EAE6;
          --sand: #FBFAF7;
          --shadow-card: 0 1px 2px rgba(23,27,24,.04), 0 10px 30px rgba(23,27,24,.06);
          --shadow-float: 0 14px 34px rgba(40,94,49,.24);
          --radius-card: 1.25rem;
          --radius-btn: 999px;
        }
        .lp13 .font-display {
          font-family: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        /* Sem o contorno azul do sistema ao voltar de outra aba (ex.: WhatsApp).
           Foco por teclado ganha um anel verde discreto da marca. */
        .lp13 button:focus,
        .lp13 a:focus,
        .lp13 [role="checkbox"]:focus {
          outline: none;
        }
        .lp13 button:focus-visible,
        .lp13 a:focus-visible,
        .lp13 [role="checkbox"]:focus-visible {
          outline: 2px solid var(--green-500);
          outline-offset: 2px;
        }
        .lp13 dialog {
          position: fixed;
          margin: 0;
        }
        .lp13 dialog::backdrop {
          background: rgba(18, 48, 26, 0.55);
          backdrop-filter: blur(3px);
        }
        @keyframes lp13Live {
          0% { box-shadow: 0 0 0 0 rgba(61,143,74,.5); }
          100% { box-shadow: 0 0 0 10px rgba(61,143,74,0); }
        }
        .lp13 .live-dot::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          animation: lp13Live 1.8s cubic-bezier(.25,.8,.4,1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp13 .live-dot::after { animation: none; }
        }
      `}</style>

      <main
        className="min-h-svh"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, #EAF4EC 0%, var(--sand) 46%, var(--sand) 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-[30rem] px-5 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-8">
          <LandingClient />
          <HowItWorks />
          <VideoStories items={stories} />
          <GoogleReviews />
          <LinkList />
          <Footer />
        </div>
      </main>
    </div>
  );
}
