import "server-only";
import { APPROVED_TESTIMONIALS } from "@/lib/approvedTestimonials";

export type GoalId = "sono" | "relaxar" | "dores" | "humor" | "foco";
export type Depoimento = { nome: string; iniciais: string; texto: string };

// Dois relatos curtos por objetivo, só da base aprovada; texto e cortes preservados.
const REVIEW_IDS: Record<GoalId, number[]> = {
  sono: [20, 1],
  relaxar: [28, 3],
  dores: [85, 83],
  humor: [120, 87],
  foco: [100, 169],
};

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}

export const DEPOIMENTOS = Object.fromEntries(
  Object.entries(REVIEW_IDS).map(([goal, ids]) => [goal, ids.map((id) => {
    const review = APPROVED_TESTIMONIALS.find((item) => item.sourceReviewId === id);
    if (!review) throw new Error(`Depoimento aprovado não encontrado: ${id}`);
    const primeiro = review.name.trim().split(/\s+/)[0];
    return { nome: primeiro[0].toUpperCase() + primeiro.slice(1).toLowerCase(), iniciais: iniciais(review.name), texto: review.text };
  })]),
) as Record<GoalId, Depoimento[]>;
