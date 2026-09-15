import { NextResponse } from "next/server";
import { contextoDoCabecalhoCookie } from "@/lib/tracking-context-cookie";

const UPSTREAM = "https://clickcannabis.com/api/leads/";

function comContextoDeTracking(body: string, trackingContextId: string | undefined): string {
  if (trackingContextId === undefined) return body;
  try {
    const dados = JSON.parse(body);
    if (dados === null || typeof dados !== "object" || Array.isArray(dados)) return body;
    return JSON.stringify({ ...dados, trackingContextId });
  } catch {
    return body;
  }
}

export async function POST(request: Request) {
  const body = comContextoDeTracking(
    await request.text(),
    contextoDoCabecalhoCookie(request.headers.get("cookie"))
  );

  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const text = await upstream.text();
    return new NextResponse(text || null, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }
}
