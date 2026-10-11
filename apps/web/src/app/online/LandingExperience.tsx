"use client";

import { useState } from "react";
import type { ApprovedTestimonial } from "@/lib/approvedTestimonials";
import type { GoalId } from "./testimonialSelection";
import LandingClient from "./LandingClient";
import ProofStrip from "./ProofStrip";
import TestimonialsWall from "./TestimonialsWall";

export default function LandingExperience({ reviewsByGoal }: {
  reviewsByGoal: Record<GoalId, ApprovedTestimonial[]>;
}) {
  const [goal, setGoal] = useState<GoalId | null>(null);
  // Intercala os objetivos para que a visão inicial represente os cinco temas.
  const groups = Object.values(reviewsByGoal);
  const reviews = goal ? reviewsByGoal[goal] : groups[0].flatMap((_, index) => groups.map((items) => items[index]));

  return (
    <>
      <LandingClient onGoalChange={setGoal} goalReviews={goal ? reviewsByGoal[goal] : []} />
      <ProofStrip />
      <section className="px-5 pb-8 pt-12 text-center sm:pt-16">
        <h2 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>
          Histórias reais de <strong>quem já passou por aqui</strong>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-xs" style={{ color: "var(--muted)" }}>
          Relatos pessoais. Resultados variam de pessoa para pessoa.
        </p>
      </section>
      <TestimonialsWall key={goal ?? "todos"} reviews={reviews} />
    </>
  );
}
