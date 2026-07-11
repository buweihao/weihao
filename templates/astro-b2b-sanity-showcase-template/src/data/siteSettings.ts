import { defaultLocale, pickLocalized, type Locale, ui } from "../lib/i18n";
import { fetchSanitySiteSettings, imageUrlForContain } from "../lib/sanity";

type SocialKey = "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "github";

export type SocialLink = {
    key: SocialKey | "whatsapp";
    name: string;
    icon: string;
    href: string;
};

export type SiteSettingsView = {
    brandName: string;
    logoUrl?: string;
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

const fallbackContactSubtitle: Record<Locale, string> = {
    en: "Leave us a message and we will get back to you shortly. Our team is ready to provide personalized advice and guide you through every step of the process.",
    zh: "给我们留言，我们会尽快回复您。我们的团队随时准备为您提供个性化建议，并在每一个步骤中为您提供指导。",
};

const fallbackAnnouncements: Record<Locale, string[]> = {
    en: [
        "Free Shipping on all orders over $50",
        "Summer Sale: Up to 50% OFF selected items",
        "12 Installments Interest-Free on Electronics",
        "New Arrivals! Check out the latest products",
    ],
    zh: [
        "订单满 $50 即享免运费",
        "夏季促销：指定商品最高五折",
        "电子产品支持 12 期免息",
        "新品上市，探索最新产品",
    ],
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
    const contactPageCopy = "contactPage" in copy ? copy.contactPage : undefined;
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
        brandName: pickLocalized(settings?.title, settings?.titleI18n, locale, "E-COMMER"),
        logoUrl: imageUrlForContain(settings?.logo?.asset, 160),
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
            contactPageCopy?.subtitle ?? fallbackContactSubtitle[locale],
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

export async function getAnnouncementMessages(locale: Locale = defaultLocale): Promise<string[]> {
    const settings = await fetchSanitySiteSettings();
    const items = settings?.announcementItems
        ?.filter((item) => item.enabled !== false)
        .map((item) => pickLocalized(undefined, item.textI18n, locale).trim())
        .filter(Boolean);

    if (items?.length) return items;

    const legacy = pickLocalized(settings?.announcement, settings?.announcementI18n, locale).trim();
    return legacy ? [legacy] : fallbackAnnouncements[locale];
}
