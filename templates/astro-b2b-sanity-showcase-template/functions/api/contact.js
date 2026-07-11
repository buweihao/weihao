const MAX_FIELD_LENGTH = 4000;

function json(data, status = 200) {
    return Response.json(data, {
        status,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}

function clean(value, maxLength = MAX_FIELD_LENGTH) {
    return String(value ?? "").trim().slice(0, maxLength);
}

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readPayload(request) {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return request.json();
    }

    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
}

function escapeHtml(value) {
    return clean(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function resolveFromEmail(value) {
    const configured = clean(value, 240);

    if (!configured) {
        return "E-commer Astro <noreply@example.com>";
    }

    if (configured.includes("@")) {
        return configured;
    }

    return `E-commer Astro <noreply@${configured}>`;
}

function buildEmail(payload) {
    const {
        inquiryId,
        name,
        email,
        company,
        phone,
        productInterest,
        message,
        sourceUrl,
        locale,
        submittedAt,
        receivedAt,
        firstLandingPage,
        firstReferrer,
        firstTouchAt,
        lastLandingPage,
        lastReferrer,
        lastTouchAt,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        country,
    } = payload;
    const subjectName = name || email;
    const subject = `[${inquiryId}] New inquiry from ${subjectName}`;
    const rows = [
        ["Inquiry ID", inquiryId],
        ["Name", name],
        ["Email", email],
        ["Company", company],
        ["Phone", phone],
        ["Product interest", productInterest],
        ["Source", sourceUrl],
        ["Language", locale],
        ["Country", country],
        ["Submitted at", submittedAt],
        ["Received at", receivedAt],
        ["First landing page", firstLandingPage],
        ["First referrer", firstReferrer],
        ["First touch at", firstTouchAt],
        ["Last landing page", lastLandingPage],
        ["Last referrer", lastReferrer],
        ["Last touch at", lastTouchAt],
        ["UTM source", utmSource],
        ["UTM medium", utmMedium],
        ["UTM campaign", utmCampaign],
        ["UTM content", utmContent],
        ["UTM term", utmTerm],
    ].filter(([, value]) => value);

    const text = [
        subject,
        "",
        ...rows.map(([label, value]) => `${label}: ${value}`),
        "",
        "Message:",
        message,
    ].join("\n");

    const htmlRows = rows
        .map(
            ([label, value]) =>
                `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
        )
        .join("");

    const html = `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#17201d">
            <h1 style="font-size:20px;margin:0 0 16px">New E-commer Astro inquiry</h1>
            <table style="border-collapse:collapse;margin-bottom:18px">${htmlRows}</table>
            <h2 style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#64736e">Message</h2>
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
    `;

    return { subject, text, html };
}

async function sendWithResend(env, payload, emailContent) {
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
        return { ok: false, status: 500, error: "Missing RESEND_API_KEY" };
    }

    const to = env.CONTACT_TO_EMAIL || "sales@example.com";
    const from = resolveFromEmail(env.CONTACT_FROM_EMAIL);

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to,
            reply_to: payload.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        return {
            ok: false,
            status: 502,
            error: detail || "Email provider rejected the message",
        };
    }

    return { ok: true };
}

export async function onRequestPost({ request, env }) {
    try {
        const body = await readPayload(request);

        if (clean(body.website)) {
            return json({ ok: true });
        }

        const payload = {
            inquiryId: crypto.randomUUID(),
            name: clean(body.name, 160),
            email: clean(body.email, 240).toLowerCase(),
            company: clean(body.company, 200),
            phone: clean(body.phone, 80),
            productInterest: clean(body.productInterest, 240),
            message: clean(body.message),
            sourceUrl: clean(body.sourceUrl, 500),
            locale: clean(body.locale, 20),
            submittedAt: clean(body.submittedAt, 40),
            receivedAt: new Date().toISOString(),
            firstLandingPage: clean(body.firstLandingPage, 700),
            firstReferrer: clean(body.firstReferrer, 700),
            firstTouchAt: clean(body.firstTouchAt, 40),
            lastLandingPage: clean(body.lastLandingPage, 700),
            lastReferrer: clean(body.lastReferrer, 700),
            lastTouchAt: clean(body.lastTouchAt, 40),
            utmSource: clean(body.utmSource, 200),
            utmMedium: clean(body.utmMedium, 200),
            utmCampaign: clean(body.utmCampaign, 200),
            utmContent: clean(body.utmContent, 200),
            utmTerm: clean(body.utmTerm, 200),
            country: clean(request.cf?.country, 10),
        };

        if (!payload.name || !payload.email || !payload.message) {
            return json({ ok: false, error: "Missing required fields" }, 400);
        }

        if (!isEmail(payload.email)) {
            return json({ ok: false, error: "Invalid email address" }, 400);
        }

        const emailContent = buildEmail(payload);
        const result = await sendWithResend(env, payload, emailContent);

        if (!result.ok) {
            console.error("[contact] email failed", result.error);
            return json(
                { ok: false, error: "Email service is not configured yet" },
                result.status,
            );
        }

        return json({ ok: true, inquiryId: payload.inquiryId });
    } catch (error) {
        console.error("[contact] unexpected error", error);
        return json({ ok: false, error: "Unable to send message" }, 500);
    }
}

export function onRequestGet() {
    return json({ ok: false, error: "Method not allowed" }, 405);
}
