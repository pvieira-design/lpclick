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
          {BENEFITS.map(({ id, badge, title, body, theme }) => (
            <article
              key={id}
              className="relative flex min-h-[420px] w-[calc(100%-1.5rem)] max-w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] sm:w-[360px]"
              style={{ background: theme.bg, color: theme.fg }}
            >
              {theme.orb && <div aria-hidden="true" className="pointer-events-none absolute -right-[22%] -top-[16%] aspect-square w-[70%]" style={{ background: theme.orb }} />}
              <div className="relative z-[1] flex flex-1 flex-col gap-12 p-5 sm:gap-28 sm:p-7">
                <p className="min-h-[3em] text-[11px] font-medium uppercase tracking-[.16em] min-[375px]:min-h-[1.5em]" style={{ color: theme.eyebrow }}>{badge}</p>
                <div className="flex flex-col gap-3.5">
                  <h3 className="font-display min-h-[4.8em] text-[1.375rem] font-medium leading-[1.2] min-[375px]:min-h-[3.6em] sm:min-h-[2.4em] sm:text-[1.625rem]">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: theme.fgMuted }}>{body}</p>
                </div>
              </div>
            </article>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
