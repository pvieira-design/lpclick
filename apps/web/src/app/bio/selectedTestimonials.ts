import { TEXT_TESTIMONIALS } from "../lp5/textTestimonials";

// Seleção revisada para /bio e /lp13. Não inclui substitutos automáticos.
const SELECTED_NAMES = new Set([
  "Arthur Marques",
  "Verista Convicto",
  "Nath Gomes",
  "Verinha Azeredo",
  "Duda Santana",
  "Jorge Moreira",
  "Luciana Pereira",
  "Gislene Spelta",
  "Angela Nicolau",
  "françoise Alves",
]);

export const SELECTED_TESTIMONIALS = TEXT_TESTIMONIALS.filter((review) =>
  SELECTED_NAMES.has(review.name),
).map((review) =>
  review.name === "Arthur Marques"
    ? {
        ...review,
        // Trecho omitido indicado explicitamente; original preservado na fonte.
        text: "Demorei para avaliar pq estava ocupado dormindo! […] Atendimento nota 1000 e médicos super atenciosos, tive uma boa experiência com eles.",
      }
    : review,
);
