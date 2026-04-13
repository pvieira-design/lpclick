import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.NEON_DATABASE_URL!);

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

    const result = await sql`
      INSERT INTO form_submissions (form_type, payload)
      VALUES (${formType}, ${JSON.stringify(payload)}::jsonb)
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
