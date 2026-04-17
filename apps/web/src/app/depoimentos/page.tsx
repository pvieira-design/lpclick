import { neon } from "@neondatabase/serverless";

export const revalidate = 60;

const sql = neon(process.env.NEON_DATABASE_URL!);

type Submission = {
  id: string;
  user_id: string | null;
  video_url: string;
  created_at: string;
};

async function getSubmissions(): Promise<Submission[]> {
  const rows = await sql`
    SELECT
      id,
      payload->'url'->>'userId' AS user_id,
      payload->>'videoUrl' AS video_url,
      created_at
    FROM form_submissions
    WHERE form_type = 'historia'
      AND payload->>'videoUrl' IS NOT NULL
    ORDER BY created_at DESC
  `;
  return rows as Submission[];
}

export default async function DepoimentosPage() {
  const submissions = await getSubmissions();

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-logo { opacity: 0; animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .anim-title { opacity: 0; animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 120ms forwards; }
        .anim-subtitle { opacity: 0; animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 220ms forwards; }
        .anim-card { opacity: 0; animation: fadeInUp 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .anim-logo, .anim-title, .anim-subtitle, .anim-card {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <main className="min-h-svh bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-16">
          <header className="mb-8 text-center sm:mb-12">
            <img
              src="/logo.svg"
              alt="Click Cannabis"
              width={200}
              height={29}
              fetchPriority="high"
              decoding="async"
              className="anim-logo mx-auto mb-6"
            />
            <h1
              className="anim-title text-[1.75rem] leading-tight tracking-tight text-gray-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
            >
              <span className="font-light">Mural de</span>{" "}
              <span className="font-semibold">Depoimentos</span>
            </h1>
            <p className="anim-subtitle mt-3 text-sm text-gray-500 sm:text-base">
              Pacientes compartilhando suas histórias com Cannabis Medicinal
            </p>
          </header>

          {submissions.length === 0 ? (
            <p className="mt-12 text-center text-sm text-gray-400">
              Ainda não há depoimentos publicados.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
              {submissions.map((s, i) => (
                <article
                  key={s.id}
                  className="anim-card overflow-hidden rounded-xl border-2 border-gray-200 bg-white"
                  style={{ animationDelay: `${250 + i * 60}ms` }}
                >
                  <video
                    src={s.video_url}
                    controls
                    preload="metadata"
                    playsInline
                    className="aspect-[9/16] w-full bg-black object-cover"
                  />
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-gray-400">Paciente</p>
                      <p className="text-sm font-semibold text-[#1a5c30]">
                        #{s.user_id ?? "—"}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ backgroundColor: "#e6f2e9", color: "#2d6e3f" }}
                    >
                      História
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
