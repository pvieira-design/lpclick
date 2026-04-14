import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.NEON_DATABASE_URL!);

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

    return NextResponse.json({ id: result[0].id, created_at: result[0].created_at });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar formulário" },
      { status: 500 }
    );
  }
}
