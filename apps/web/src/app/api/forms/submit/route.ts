import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.NEON_DATABASE_URL!);

// Páginas que renderizam depoimentos a partir do banco. Revalidadas sob demanda
// quando entra um depoimento novo, em vez de consultar o Neon a cada 60s.
const TESTIMONIAL_PATHS = [
  "/depoimentos",
  "/lp3",
  "/lp4",
  "/lp5",
  "/lp6",
  "/lp7",
  "/lp8",
  "/lp9",
  "/lp11",
  "/lp12",
  "/bio",
];

function clientIp(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip") || null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { formType, payload } = body as {
      formType: string;
      payload: Record<string, unknown>;
    };

    if (!formType || !payload) {
      return NextResponse.json(
        { error: "formType e payload são obrigatórios" },
        { status: 400 }
      );
    }

    const auditedPayload = {
      ...payload,
      serverAudit: {
        ip: clientIp(request),
        userAgent: request.headers.get("user-agent"),
        acceptLanguage: request.headers.get("accept-language"),
        receivedAt: new Date().toISOString(),
      },
    };

    const result = await sql`
      INSERT INTO form_submissions (form_type, payload)
      VALUES (${formType}, ${JSON.stringify(auditedPayload)}::jsonb)
      RETURNING id, created_at
    `;

    // Um depoimento novo (com vídeo) só afeta as páginas de depoimentos.
    // Invalida o cache estático delas sob demanda para não depender de ISR por tempo.
    if (formType === "historia" && payload.videoUrl) {
      for (const path of TESTIMONIAL_PATHS) revalidatePath(path);
    }

    return NextResponse.json({ id: result[0].id, created_at: result[0].created_at });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar formulário" },
      { status: 500 }
    );
  }
}
