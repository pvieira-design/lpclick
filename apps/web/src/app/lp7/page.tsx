import type { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import QuizClient from "./QuizClient";
import { TESTIMONIALS_META } from "../lp5/testimonialsMeta";

export const metadata: Metadata = {
  title: "Quiz Cannabis Medicinal no Brasil — Click Cannabis",
  description:
    "Acerte 10 perguntas sobre cannabis medicinal no Brasil, importação e formatos de tratamento e ganhe uma consulta de acompanhamento gratuita com a Click.",
};

export const revalidate = 60;

const FEATURED_TESTIMONIAL_IDS = [
  "c4c187de-ba4a-4793-9700-ce8a37b215b1",
  "1ad9622d-aa32-4d93-aa9f-2450c9fb4b6a",
  "124d2626-1f79-423c-835b-771ba7f61370",
  "c1b3ead5-4220-46f1-af9b-ad6884753a30",
  "23c65bc9-2930-4fb6-a7b5-02d9bfb2d1da",
];

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

async function getFeaturedTestimonials(): Promise<Testimonial[]> {
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
        AND id = ANY(${FEATURED_TESTIMONIAL_IDS})
    `) as TestimonialRow[];
    return rows.map((r) => {
      const meta = TESTIMONIALS_META[r.id];
      return { ...r, nome: meta?.nome ?? null, patologias: meta?.patologias ?? [] };
    });
  } catch {
    return [];
  }
}

export default async function LP7Page() {
  const testimonials = await getFeaturedTestimonials();
  return <QuizClient testimonials={testimonials} />;
}
