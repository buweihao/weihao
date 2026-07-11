const STORAGE_KEY = "b2b_attribution_v1";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

type Touchpoint = {
    landingPage: string;
    referrer: string;
    capturedAt: string;
    utm: Partial<Record<(typeof UTM_KEYS)[number], string>>;
};

type AttributionState = {
    sessionId: string;
    first: Touchpoint;
    last: Touchpoint;
};

function createSessionId() {
    return globalThis.crypto?.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function currentTouchpoint(): Touchpoint {
    const url = new URL(window.location.href);
    const utm = Object.fromEntries(
        UTM_KEYS.map((key) => [key, url.searchParams.get(key)?.slice(0, 200) || undefined]).filter(([, value]) => value),
    );
    return {
        landingPage: `${url.pathname}${url.search}`.slice(0, 700),
        referrer: document.referrer.slice(0, 700),
        capturedAt: new Date().toISOString(),
        utm,
    };
}

function readState(): AttributionState | undefined {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value ? JSON.parse(value) : undefined;
    } catch {
        return undefined;
    }
}

export function initializeAttribution() {
    if (typeof window === "undefined") return;
    const touchpoint = currentTouchpoint();
    const existing = readState();
    const state: AttributionState = existing
        ? { ...existing, last: touchpoint }
        : { sessionId: createSessionId(), first: touchpoint, last: touchpoint };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Attribution is optional when storage is unavailable.
    }
}

export function getAttributionPayload() {
    const state = readState();
    if (!state) return {};
    return {
        sessionId: state.sessionId,
        firstLandingPage: state.first.landingPage,
        firstReferrer: state.first.referrer,
        firstTouchAt: state.first.capturedAt,
        lastLandingPage: state.last.landingPage,
        lastReferrer: state.last.referrer,
        lastTouchAt: state.last.capturedAt,
        utmSource: state.last.utm.utm_source || state.first.utm.utm_source || "",
        utmMedium: state.last.utm.utm_medium || state.first.utm.utm_medium || "",
        utmCampaign: state.last.utm.utm_campaign || state.first.utm.utm_campaign || "",
        utmContent: state.last.utm.utm_content || state.first.utm.utm_content || "",
        utmTerm: state.last.utm.utm_term || state.first.utm.utm_term || "",
    };
}
