"use client";

import { APPROVED_TESTIMONIALS, type ApprovedTestimonial } from "@/lib/approvedTestimonials";
import CardCarousel from "./CardCarousel";

const SLEEP_REVIEW_IDS = new Set([
  1, 3, 9, 12, 13, 18, 24, 25, 34, 39, 41, 46, 48, 49, 53, 71,
  72, 77, 81, 82, 90, 97, 104, 105, 106, 108, 109, 117, 140, 146, 148, 165,
]);
const REVIEWS = APPROVED_TESTIMONIALS.filter((review) => SLEEP_REVIEW_IDS.has(review.sourceReviewId));

function displayDate(review: ApprovedTestimonial) {
  if (review.approximateDate || !review.publishedAt) return null;
  const [year, month, day] = review.publishedAt.split("-");
  return `${day}/${month}/${year}`;
}

export default function TestimonialsWall({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="dormir-testimonials-wall"
      aria-labelledby="dormir-testimonials-title"
      className={compact ? "mx-auto w-full max-w-xl px-4 pb-8 sm:px-5 sm:pb-12" : "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-14"}
    >
      <header className={compact ? "mb-2" : "mb-4 max-w-xl"}>
        {!compact && <span className="mb-3 inline-flex rounded-full bg-[var(--green-100)] px-3 py-1 text-xs font-medium text-[var(--green-700)]">Depoimentos</span>}
        <h2 id="dormir-testimonials-title" className={compact ? "font-display text-lg font-medium text-[var(--ink)]" : "font-display text-[25px] font-medium leading-tight text-[var(--ink)] sm:text-[30px]"}>
          {compact ? "Depoimentos" : "Veja os relatos de quem já passou por aqui"}
        </h2>
        {!compact && <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">Relatos de quem buscou cuidar do sono. Resultados variam de pessoa para pessoa.</p>}
      </header>
      <CardCarousel label="Depoimentos de pacientes">
        {REVIEWS.map((review) => (
          <article
            key={review.sourceReviewId}
            className="flex min-h-[320px] w-[calc(100%-1.5rem)] max-w-[320px] shrink-0 snap-start flex-col rounded-2xl border border-[#e3ece5] bg-[#f8fbf8] p-5 sm:w-[320px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#253b2b]">{review.name}</p>
                <span role="img" aria-label="5 estrelas" className="mt-1 block text-sm tracking-wider text-[#f5a623]">★★★★★</span>
              </div>
              {displayDate(review) && <p className="max-w-[48%] shrink-0 pt-0.5 text-right text-xs leading-snug text-[#748278]">{displayDate(review)}</p>}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[#334439]">“{review.text}”</p>
          </article>
        ))}
      </CardCarousel>
      {compact && <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">Relatos pessoais. Resultados variam de pessoa para pessoa.</p>}
    </section>
  );
}
