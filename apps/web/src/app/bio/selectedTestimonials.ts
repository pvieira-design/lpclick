import { TEXT_TESTIMONIALS } from "../lp5/textTestimonials";

// Seleção revisada para /bio e /lp13. Não inclui substitutos automáticos.
const SELECTED_NAMES = new Set([
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
);
