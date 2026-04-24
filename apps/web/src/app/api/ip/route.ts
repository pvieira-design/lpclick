import { NextResponse } from "next/server";

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "";
  return request.headers.get("x-real-ip") ?? "";
}

export async function GET(request: Request) {
  return NextResponse.json({ ip: clientIp(request) });
}
