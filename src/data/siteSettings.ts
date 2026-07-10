import { defaultLocale, pickLocalized, type Locale, ui } from "../lib/i18n";
import { fetchSanitySiteSettings } from "../lib/sanity";

type SocialKey = "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "github";

export type SocialLink = {
    key: SocialKey | "whatsapp";
    name: string;
    icon: string;
    href: string;
};

export type SiteSettingsView = {
    footerCopy: string;
    contactSubtitle: string;
    contactAddress: string;
    contactPhone: string;
    contactEmail: string;
    whatsappPhone: string;
    whatsappUrl?: string;
    socialLinks: SocialLink[];
};

const socialMeta: Record<SocialKey, { name: string; icon: string }> = {
    facebook: { name: "Facebook", icon: "lucide:facebook" },
    twitter: { name: "Twitter / X", icon: "lucide:twitter" },
    instagram: { name: "Instagram", icon: "lucide:instagram" },
    linkedin: { name: "LinkedIn", icon: "lucide:linkedin" },
    youtube: { name: "YouTube", icon: "lucide:youtube" },
    github: { name: "GitHub", icon: "lucide:github" },
};

function normalizeWhatsappUrl(phone: string | null | undefined) {
    const digits = phone?.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : undefined;
}

function externalUrl(value: string | null | undefined) {
    const trimmed = value?.trim();
    return trimmed || undefined;
}

export async function getSiteSettings(locale: Locale = defaultLocale): Promise<SiteSettingsView> {
    const settings = await fetchSanitySiteSettings();
    const copy = ui[locale];
    const whatsappPhone = settings?.whatsappPhone?.trim() ?? "";
    const whatsappUrl = normalizeWhatsappUrl(whatsappPhone) ?? externalUrl(settings?.whatsappUrl);

    const socialLinks = (Object.entries(socialMeta) as Array<[SocialKey, (typeof socialMeta)[SocialKey]]>)
        .map(([key, meta]) => {
            const href = externalUrl(settings?.socialLinks?.[key]);
            return href ? { key, ...meta, href } : undefined;
        })
        .filter((link): link is SocialLink => Boolean(link));

    if (whatsappUrl) {
        socialLinks.push({
            key: "whatsapp",
            name: "WhatsApp",
            icon: "lucide:message-circle",
            href: whatsappUrl,
        });
    }

    return {
        footerCopy: pickLocalized(
            settings?.footerCopy,
            settings?.footerCopyI18n,
            locale,
            copy.footer.copy,
        ),
        contactSubtitle: pickLocalized(
            settings?.contactSubtitle,
            settings?.contactSubtitleI18n,
            locale,
            copy.contactPage.subtitle,
        ),
        contactAddress: pickLocalized(
            settings?.contactAddress,
            settings?.contactAddressI18n,
            locale,
            "123 Tech Street",
        ),
        contactPhone: settings?.contactPhone?.trim() || "+1 (555) 123-4567",
        contactEmail: settings?.contactEmail?.trim() || "contact@e-commerce.com",
        whatsappPhone,
        whatsappUrl,
        socialLinks,
    };
}
