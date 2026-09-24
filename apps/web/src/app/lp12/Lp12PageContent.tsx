import { Bricolage_Grotesque } from "next/font/google";
import LandingClient from "./LandingClient";
import AnnouncementBar from "./AnnouncementBar";
import ConsumptionForms from "./ConsumptionForms";
import Faq from "./Faq";
import Footer from "./Footer";
import StickyContactCTA from "./StickyContactCTA";
import TestimonialsWall from "./TestimonialsWall";
import TreatmentSteps from "./TreatmentSteps";
import TrustPillars from "./TrustPillars";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export default function Lp12PageContent({
  videoTestimonials,
  variant,
}: {
  videoTestimonials?: React.ReactNode;
  variant?: "inicio";
}) {
  return (
    <div className={`lp12 ${bricolage.variable}`}>
      <style>{`
        .lp12 {
          --green-900: #1C4423;
          --green-700: #285E31;
          --green-600: #2d6e3f;
          --green-500: #3D8F4A;
          --green-100: #E5F2E7;
          --green-50: #F5FAF6;
          --ink: #171B18;
          --muted: #5B6660;
          --line: #E5EAE6;
          --shadow-card: 0 1px 2px rgba(23,27,24,.05), 0 8px 24px rgba(23,27,24,.06);
          --shadow-float: 0 12px 32px rgba(40,94,49,.22);
          --radius-card: 1rem;
          --radius-panel: 1.5rem;
          --radius-btn: .875rem;
        }
        .lp12 .font-display {
          font-family: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;
          letter-spacing: -0.02em;
        }
        .lp12 dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          margin: 0;
        }
        .lp12 dialog::backdrop {
          background: rgba(23, 27, 24, 0.55);
        }
        @media (prefers-reduced-motion: reduce) {
          .lp12 dialog, .lp12 dialog::backdrop { transition: none; }
        }
        @keyframes ctaWave {
          0% {
            box-shadow: 0 0 0 0 rgba(61,143,74,0.55);
          }
          100% {
            box-shadow: 0 0 0 18px rgba(61,143,74,0);
          }
        }
        .lp12 .cta-pulse {
          position: relative;
          isolation: isolate;
        }
        .lp12 .cta-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: ctaWave 1.6s cubic-bezier(0.25, 0.8, 0.4, 1) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp12 .cta-pulse::after { animation: none; }
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-white">
        <AnnouncementBar variant={variant} />
        <LandingClient variant={variant} />
        {videoTestimonials ?? <div id="lp12-sticky-anchor" aria-hidden="true" />}
        {variant === "inicio" && <TestimonialsWall variant="inicio" />}
        <ConsumptionForms />
        <div id="lp12-treatment-steps">
          <TreatmentSteps />
        </div>
        {variant !== "inicio" && <TrustPillars />}
        {variant !== "inicio" && <TestimonialsWall />}
        <Faq />
      </main>
      <Footer />
      <StickyContactCTA variant={variant} />
    </div>
  );
}
