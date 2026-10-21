"use client";

import { APPROVED_TESTIMONIALS, type ApprovedTestimonial } from "@/lib/approvedTestimonials";
import CardCarousel from "./CardCarousel";

const SLEEP_REVIEW_IDS = new Set([1, 3, 9, 12, 18, 34, 46, 72, 140, 146, 148, 165]);
const REVIEWS = APPROVED_TESTIMONIALS.filter((review) => SLEEP_REVIEW_IDS.has(review.sourceReviewId));

function displayDate(review: ApprovedTestimonial & { approximateDate?: { displayLabel: string } }) {
  if (review.approximateDate) return review.approximateDate.displayLabel;
  if (!review.publishedAt) return "";
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
            className="flex w-[calc(100%-1.5rem)] max-w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] sm:w-[340px]"
          >
            <div className="flex items-center gap-3">
              {review.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={review.photo} alt="" width={36} height={36} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="size-9 shrink-0 rounded-full bg-[var(--green-50)] object-cover" />
              ) : (
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-50)] text-xs font-semibold text-[var(--green-700)]">
                  {review.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--ink)]">{review.name}</p>
                <span role="img" aria-label="5 estrelas" className="text-sm tracking-wider text-[#e9a126]">★★★★★</span>
              </div>
            </div>
            <p className="mt-1 pl-12 text-[11px] leading-snug text-[var(--muted)]">{displayDate(review)}</p>
            <p className="mt-4 text-sm leading-6 text-[#46544b]">“{review.text}”</p>
          </article>
        ))}
      </CardCarousel>
      {compact && <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">Relatos pessoais. Resultados variam de pessoa para pessoa.</p>}
    </section>
  );
}
