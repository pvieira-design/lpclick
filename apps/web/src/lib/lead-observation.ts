import { captureLead } from "@click-cannabis/tracking-edge/browser";
import { sendGTMEvent } from "@next/third-parties/google";

export function normalizeLeadObservationId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return /^obs_[A-Za-z0-9_-]{8,64}$/.exec(value)?.[0] === value
    ? value
    : undefined;
}

export function captureLeadObservation(): string | undefined {
  try {
    return normalizeLeadObservationId(captureLead());
  } catch {
    return undefined;
  }
}

export function sendCorrelatedLeadEvent(
  event: Record<string, unknown>,
  leadObservationId: unknown,
): boolean {
  let succeeded = true;
  try {
    sendGTMEvent({
      ...event,
      lead_observation_id:
        normalizeLeadObservationId(leadObservationId) ?? null,
    });
  } catch {
    succeeded = false;
  }
  try {
    sendGTMEvent({ lead_observation_id: null });
  } catch {
    succeeded = false;
  }
  return succeeded;
}

export function withLeadObservation<T extends { data: object }>(
  payload: T,
  leadObservationId: unknown,
): T {
  const id = normalizeLeadObservationId(leadObservationId);
  if (id === undefined) return payload;
  return { ...payload, data: { ...payload.data, lead_observation_id: id } };
}
