import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Locale } from "./i18n";

const env = import.meta.env;

const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = env.PUBLIC_SANITY_API_VERSION ?? "2026-07-03";

export const hasSanityConfig = Boolean(projectId);

export const sanityClient = hasSanityConfig
    ? createClient({
          projectId,
          dataset,
          apiVersion,
          useCdn: false,
      })
    : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export type SanityProductDocument = {
    id?: string | null;
    name?: string | null;
    nameI18n?: Partial<Record<Locale, string | null>> | null;
    slug?: string | null;
    price?: number | null;
    description?: string | null;
    descriptionI18n?: Partial<Record<Locale, string | null>> | null;
    category?: string | null;
    categoryI18n?: Partial<Record<Locale, string | null>> | null;
    subcategory?: string | null;
    subcategoryI18n?: Partial<Record<Locale, string | null>> | null;
    stock?: number | null;
    badge?: string | null;
    badgeI18n?: Partial<Record<Locale, string | null>> | null;
    discount?: number | null;
    specs?: Array<{
        label?: string | null;
        labelI18n?: Partial<Record<Locale, string | null>> | null;
        value?: string | null;
        valueI18n?: Partial<Record<Locale, string | null>> | null;
    }> | null;
    images?: Array<{ asset?: unknown; alt?: string | null }> | null;
};

export type SanityCategoryDocument = {
    name?: string | null;
    nameI18n?: Partial<Record<Locale, string | null>> | null;
    slug?: string | null;
    image?: { asset?: unknown } | null;
};

export type SanityHeroSlide = {
    alt?: string | null;
    altI18n?: Partial<Record<Locale, string | null>> | null;
    eyebrow?: string | null;
    eyebrowI18n?: Partial<Record<Locale, string | null>> | null;
    title?: string | null;
    titleI18n?: Partial<Record<Locale, string | null>> | null;
    description?: string | null;
    descriptionI18n?: Partial<Record<Locale, string | null>> | null;
    primaryLabel?: string | null;
    primaryLabelI18n?: Partial<Record<Locale, string | null>> | null;
    primaryHref?: string | null;
    secondaryLabel?: string | null;
    secondaryLabelI18n?: Partial<Record<Locale, string | null>> | null;
    secondaryHref?: string | null;
    align?: "center" | "left" | null;
    image?: { asset?: unknown } | null;
};

export type SanitySiteSettings = {
    title?: string | null;
    titleI18n?: Partial<Record<Locale, string | null>> | null;
    announcement?: string | null;
    announcementI18n?: Partial<Record<Locale, string | null>> | null;
    heroSlides?: SanityHeroSlide[] | null;
};

let productsRequest: Promise<SanityProductDocument[]> | undefined;
let categoriesRequest: Promise<SanityCategoryDocument[]> | undefined;
let siteSettingsRequest: Promise<SanitySiteSettings | null> | undefined;

export async function fetchSanityProducts(): Promise<SanityProductDocument[]> {
    if (!sanityClient) return [];
    if (productsRequest) return productsRequest;

    productsRequest = sanityClient
        .fetch<SanityProductDocument[]>(`
            *[_type == "atelierProduct" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
                "id": _id,
                name,
                nameI18n,
                "slug": slug.current,
                price,
                description,
                descriptionI18n,
                category,
                categoryI18n,
                subcategory,
                subcategoryI18n,
                stock,
                badge,
                badgeI18n,
                discount,
                "specs": coalesce(specs, [])[] {
                    label,
                    labelI18n,
                    value,
                    valueI18n
                },
                "images": coalesce(images, [])[] {
                    asset,
                    alt
                }
            }
        `)
        .catch((error) => {
            console.warn("[sanity] Falling back to local products:", error);
            return [];
        });

    return productsRequest;
}

export async function fetchSanityCategories(): Promise<SanityCategoryDocument[]> {
    if (!sanityClient) return [];
    if (categoriesRequest) return categoriesRequest;

    categoriesRequest = sanityClient
        .fetch<SanityCategoryDocument[]>(`
            *[_type == "category" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
                name,
                nameI18n,
                "slug": slug.current,
                image
            }
        `)
        .catch((error) => {
            console.warn("[sanity] Falling back to local categories:", error);
            return [];
        });

    return categoriesRequest;
}

export async function fetchSanitySiteSettings(): Promise<SanitySiteSettings | null> {
    if (!sanityClient) return null;
    if (siteSettingsRequest) return siteSettingsRequest;

    siteSettingsRequest = sanityClient
        .fetch<SanitySiteSettings | null>(`
            *[_type == "siteSettings"][0] {
                title,
                titleI18n,
                announcement,
                announcementI18n,
                "heroSlides": coalesce(heroSlides, [])[] | order(coalesce(order, 999) asc) {
                    alt,
                    altI18n,
                    eyebrow,
                    eyebrowI18n,
                    title,
                    titleI18n,
                    description,
                    descriptionI18n,
                    primaryLabel,
                    primaryLabelI18n,
                    primaryHref,
                    secondaryLabel,
                    secondaryLabelI18n,
                    secondaryHref,
                    align,
                    image
                }
            }
        `)
        .catch((error) => {
            console.warn("[sanity] Falling back to local site settings:", error);
            return null;
        });

    return siteSettingsRequest;
}

export function imageUrlFor(source: unknown, width = 1200, height = 1500): string | undefined {
    if (!builder || !source) return undefined;

    try {
        return builder.image(source).width(width).height(height).fit("crop").auto("format").url();
    } catch {
        return undefined;
    }
}
