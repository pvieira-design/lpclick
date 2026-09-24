import { APPROVED_TESTIMONIALS, type ApprovedTestimonial } from "@/lib/approvedTestimonials";

// Cada relato menciona o objetivo correspondente no próprio texto.
// As tags antigas não são usadas como critério automático.
export const INICIO_TESTIMONIAL_GROUPS = [
  {
    pathology: "Insônia",
    title: "Dormir melhor",
    names: [
      "Arthur Marques", "Luciana Pereira", "Ana Karina Santos",
      "Bruno Assis", "Lizandra Barbuto", "Alan Paulo Moura",
      "Sandra Araujo", "William Oliveira Olivera",
    ],
  },
  {
    pathology: "Ansiedade",
    title: "Relaxar",
    names: [
      "Nath Gomes", "Eduarda Carolini", "Kelven Bittencourt",
      "Meire Marinho", "kevin ribeiro", "Natã Bernardo",
    ],
  },
  {
    pathology: "Dores",
    title: "Alívio de dores",
    names: [
      "Gislene Spelta", "Marcilene Cardoso", "Lucimara Amandio",
      "Jeni Lisbeth", "Maria Eleonora Rabêllo", "Wadson Brito",
    ],
  },
  {
    pathology: "Depressão",
    title: "Melhorar meu humor",
    names: [
      "Adriana Monteiro Lopes Buono", "Jheryk Marx",
      "angela maria carvalho silva cassol", "Eliseu plauth",
      "Brenda Iochem", "nelson santos",
    ],
  },
  {
    pathology: "TDAH",
    title: "Mais foco e concentração",
    names: [
      "Roseni Santos", "Ricardo Andrade", "Sandra CardosoBueno",
      "Leonardo Zerlotti", "Guilherme Lima", "Pri Luz",
    ],
  },
] as const;

const approvedByName = new Map(APPROVED_TESTIMONIALS.map((review) => [review.name, review]));

export function getInicioGroupTestimonials(names: readonly string[]): ApprovedTestimonial[] {
  return names.map((name) => approvedByName.get(name)).filter((review): review is ApprovedTestimonial => !!review);
}

export function getInicioTestimonials(selected: Iterable<string>, limitPerGoal = 4): ApprovedTestimonial[] {
  const conditions = new Set(selected);
  return INICIO_TESTIMONIAL_GROUPS
    .filter((group) => conditions.has(group.pathology))
    .flatMap((group) => getInicioGroupTestimonials(group.names.slice(0, limitPerGoal)));
}
