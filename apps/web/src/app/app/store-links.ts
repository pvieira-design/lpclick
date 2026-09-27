export const APPLE_STORE_URL = "https://apps.apple.com/br/app/click-cannabis/id6760324783";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.clickcannabis.app";

export type Platform = "ios" | "android" | "other";

export function platformFromUserAgent(ua: string, maxTouchPoints = 0): Platform {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  // iPadOS 13+ se identifica como Mac; a tela sensível ao toque denuncia o iPad.
  if (/Macintosh/i.test(ua) && maxTouchPoints > 1) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}
