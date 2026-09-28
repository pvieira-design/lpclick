import type { ApprovedTestimonial } from "@/lib/approvedTestimonials";
import ReviewStars from "./ReviewStars";

export default function InicioReviewCard({
  review,
  compact = false,
}: {
  review: ApprovedTestimonial;
  compact?: boolean;
}) {
  const publishedAt = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${review.publishedAt}T12:00:00Z`),
  );
  const nameParts = review.name.trim().split(/\s+/);
  const displayName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
    : nameParts[0];

  return (
    <article className={`flex h-full flex-col rounded-2xl border border-[#e3ece5] bg-[#f8fbf8] ${compact ? "p-3.5" : "p-5"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#253b2b]">{displayName}</p>
          <div className="mt-1"><ReviewStars /></div>
        </div>
        <p className="shrink-0 pt-0.5 text-xs text-[#748278]">{publishedAt}</p>
      </div>
      <p className={`mt-3 text-[#334439] ${compact ? "text-sm leading-[1.5]" : "text-[15px] leading-relaxed"}`}>
        “{review.text}”
      </p>
    </article>
  );
}
