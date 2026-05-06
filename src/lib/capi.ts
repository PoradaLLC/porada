declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

export type CapiEventName = "Contact" | "Lead" | "PageView";

export async function trackEvent(
  eventName: CapiEventName,
  userData?: { em?: string; fn?: string },
  params?: Record<string, unknown>
) {
  const eventId = crypto.randomUUID();
  const eventSourceUrl = window.location.href;

  // Browser pixel — deduplicated via shared eventId
  window.fbq?.("track", eventName, params ?? {}, { eventID: eventId });

  // Server-side CAPI — fire-and-forget, never break UX
  fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_name: eventName, event_id: eventId, event_source_url: eventSourceUrl, user_data: userData }),
  }).catch(() => {});
}
