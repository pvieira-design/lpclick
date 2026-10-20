import "server-only";
import { APPROVED_TESTIMONIALS } from "@/lib/approvedTestimonials";

export type GoalId = "sono" | "relaxar" | "dores" | "humor" | "foco";

// Seleção editorial pelo texto final aprovado, não apenas pelas tags legadas.
// Oito relatos distintos por objetivo; preservar os textos e os cortes da base.
const REVIEW_IDS: Record<GoalId, number[]> = {
  sono: [1, 3, 8, 13, 24, 34, 48, 140],
  relaxar: [2, 9, 25, 46, 146, 72, 148, 149],
  dores: [41, 12, 47, 19, 26, 50, 60, 137],
  humor: [39, 73, 56, 63, 177, 5, 126, 165],
  foco: [51, 59, 163, 18, 27, 45, 74, 128],
};

export const GOAL_TESTIMONIALS = Object.fromEntries(
  Object.entries(REVIEW_IDS).map(([goal, ids]) => [goal, ids.map((id) => {
    const review = APPROVED_TESTIMONIALS.find((item) => item.sourceReviewId === id);
    if (!review) throw new Error(`Depoimento aprovado não encontrado: ${id}`);
    return review;
  })]),
) as Record<GoalId, typeof APPROVED_TESTIMONIALS>;
