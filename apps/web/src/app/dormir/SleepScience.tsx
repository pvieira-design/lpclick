"use client";

import CardCarousel from "./CardCarousel";
import { BENEFITS } from "./sleepBenefits";

export default function SleepScience() {
  return (
    <section id="dormir-science" aria-labelledby="dormir-science-title" className="border-t border-[var(--line)] bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-4 max-w-xl">
          <span className="mb-3 inline-flex rounded-full bg-[var(--green-100)] px-3 py-1 text-xs font-medium text-[var(--green-700)]">Ciência</span>
          <h2 id="dormir-science-title" className="font-display text-[25px] font-medium leading-tight text-[var(--ink)] sm:text-[30px]">A ciência por trás do sono</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">Como a cannabis medicinal atua em cada etapa do descanso.</p>
        </header>
        <CardCarousel label="Ciência por trás do sono">
          {BENEFITS.map((benefit, index) => (
            <article key={benefit.id} className="flex w-[calc(100%-1.5rem)] max-w-[360px] shrink-0 snap-start flex-col rounded-2xl border border-[var(--line)] bg-white p-5 sm:w-[360px] sm:p-6">
              <div className="mb-7 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--green-700)]">{benefit.badge}</p>
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--green-50)] text-xs text-[var(--green-700)]">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display min-h-[5.2em] text-xl font-medium leading-[1.3] text-[var(--ink)] min-[375px]:min-h-[3.9em] sm:text-[22px]">{benefit.title}</h3>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{benefit.body}</p>
            </article>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
