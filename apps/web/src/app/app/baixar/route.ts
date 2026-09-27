import { NextResponse } from "next/server";
import { APPLE_STORE_URL, PLAY_STORE_URL, platformFromUserAgent } from "../store-links";

// Destino do QR code e do botão "Baixar o app": leva cada aparelho para a própria loja.
export function GET(request: Request) {
  const platform = platformFromUserAgent(request.headers.get("user-agent") ?? "");
  const target =
    platform === "ios" ? APPLE_STORE_URL : platform === "android" ? PLAY_STORE_URL : new URL("/app#baixar", request.url);
  return NextResponse.redirect(target, 302);
}
