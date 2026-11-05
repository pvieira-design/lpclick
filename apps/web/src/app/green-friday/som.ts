"use client";

// Som curto de toque nos botões do quiz e o AudioContext que a roleta reaproveita.

let ctx: AudioContext | null = null;

// Tem que ser chamado dentro de um toque (política de autoplay).
export function audio(): AudioContext | null {
  try {
    // iPhone (Safari 17+): sem isso a chave de silencioso corta todo o som da página.
    const sessao = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (sessao) sessao.type = "playback";
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) ctx = new AC();
    }
    ctx?.resume().catch(() => {});
    return ctx;
  } catch {
    return null; // som é opcional
  }
}

export function tocarToque() {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* alguns browsers bloqueiam */
  }
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(620, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.07);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.16, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}
