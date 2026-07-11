type EventData = Record<string, string | number | boolean | null | undefined>;

declare global {
    interface Window {
        umami?: {
            track: (eventName: string, data?: Record<string, string | number | boolean>) => void;
        };
    }
}

function cleanEventData(data: EventData) {
    return Object.fromEntries(
        Object.entries(data)
            .filter(([, value]) => value !== undefined && value !== null && value !== "")
            .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 200) : value]),
    ) as Record<string, string | number | boolean>;
}

export function trackEvent(eventName: string, data: EventData = {}) {
    if (typeof window === "undefined") return;
    try {
        window.umami?.track(eventName, cleanEventData(data));
    } catch (error) {
        console.warn("[analytics] Unable to track event", error);
    }
}

export function installAutomaticAnalytics() {
    if (typeof document === "undefined" || document.documentElement.dataset.analyticsReady) return;
    document.documentElement.dataset.analyticsReady = "true";

    document.addEventListener("click", (event) => {
        const target = event.target as Element | null;
        const link = target?.closest<HTMLAnchorElement>('a[href*="wa.me/"], a[href*="api.whatsapp.com/"]');
        if (!link) return;

        const productName = document.querySelector(".product-info h1")?.textContent?.trim();
        trackEvent("whatsapp_click", {
            page_path: window.location.pathname,
            page_language: document.documentElement.lang,
            product_name: productName,
            button_location: link.dataset.analyticsLocation || link.id || "whatsapp_link",
        });
    });
}
