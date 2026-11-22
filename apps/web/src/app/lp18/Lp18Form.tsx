"use client";

import AvaliacaoClient from "../avaliacao/AvaliacaoClient";
import type { Depoimento, GoalId } from "../avaliacao/testimonialSelection";
import "./form.css";

export default function Lp18Form({ depoimentos }: { depoimentos: Record<GoalId, Depoimento[]> }) {
  return <AvaliacaoClient depoimentos={depoimentos} origem="LP18" />;
}
