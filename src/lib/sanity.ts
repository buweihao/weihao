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
    productDetail?: string | null;
    productDetailI18n?: Partial<Record<Locale, string | null>> | null;
    productTypeName?: string | null;
    productTypeNameI18n?: Partial<Record<Locale, string | null>> | null;
    productTypeSlug?: string | null;
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
    order?: number | null;
    active?: boolean | null;
};

export type SanityHeroSlide = {
    href?: string | null;
    primaryHref?: string | null;
    image?: { asset?: unknown } | null;
};

export type SanityAboutPage = {
    companyVideoUrl?: string | null;
    companyImages?: Array<{
        asset?: unknown;
        alt?: string | null;
    }> | null;
    companyDescriptionI18n?: Partial<Record<Locale, string | null>> | null;
};

export type SanityAboutRecommendation = {
    items?: Array<{
        image?: { asset?: unknown; alt?: string | null } | null;
        textI18n?: Partial<Record<Locale, string | null>> | null;
    }> | null;
};

export type SanityAboutImageGallery = {
    images?: Array<{ asset?: unknown }> | null;
};

export type SanityAboutCompanyCarousel = {
    images?: Array<{ asset?: unknown }> | null;
};

export type SanitySiteSettings = {
    title?: string | null;
    titleI18n?: Partial<Record<Locale, string | null>> | null;
    logo?: { asset?: unknown } | null;
    announcement?: string | null;
    announcementI18n?: Partial<Record<Locale, string | null>> | null;
    announcementItems?: Array<{
        textI18n?: Partial<Record<Locale, string | null>> | null;
        enabled?: boolean | null;
        order?: number | null;
    }> | null;
    footerCopy?: string | null;
    footerCopyI18n?: Partial<Record<Locale, string | null>> | null;
    contactSubtitle?: string | null;
    contactSubtitleI18n?: Partial<Record<Locale, string | null>> | null;
    contactAddress?: string | null;
    contactAddressI18n?: Partial<Record<Locale, string | null>> | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    whatsappPhone?: string | null;
    whatsappUrl?: string | null;
    socialLinks?: Partial<Record<"facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "github", string | null>> | null;
    heroSlides?: SanityHeroSlide[] | null;
};

let productsRequest: Promise<SanityProductDocument[]> | undefined;
let categoriesRequest: Promise<SanityCategoryDocument[]> | undefined;
let siteSettingsRequest: Promise<SanitySiteSettings | null> | undefined;
let aboutPageRequest: Promise<SanityAboutPage | null> | undefined;
let aboutRecommendationRequest: Promise<SanityAboutRecommendation | null> | undefined;
let aboutImageGalleryRequest: Promise<SanityAboutImageGallery | null> | undefined;
let aboutCompanyCarouselRequest: Promise<SanityAboutCompanyCarousel | null> | undefined;

export async function fetchSanityProducts(): Promise<SanityProductDocument[]> {
    if (!sanityClient) return [];
    if (productsRequest && !import.meta.env.DEV) return productsRequest;

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
                productDetail,
                productDetailI18n,
                "productTypeName": productType->name,
                "productTypeNameI18n": productType->nameI18n,
                "productTypeSlug": productType->slug.current,
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
    if (categoriesRequest && !import.meta.env.DEV) return categoriesRequest;

    categoriesRequest = sanityClient
        .fetch<SanityCategoryDocument[]>(`
            *[_type == "category" && defined(slug.current) && active != false] | order(coalesce(order, 999) asc, name asc) {
                name,
                nameI18n,
                "slug": slug.current,
                image,
                order,
                active
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
    if (siteSettingsRequest && !import.meta.env.DEV) return siteSettingsRequest;

    siteSettingsRequest = sanityClient
        .fetch<SanitySiteSettings | null>(`
            *[_type == "siteSettings"][0] {
                title,
                titleI18n,
                logo,
                announcement,
                announcementI18n,
                "announcementItems": coalesce(announcementItems, [])[] | order(coalesce(order, 999) asc) {
                    textI18n,
                    enabled,
                    order
                },
                footerCopy,
                footerCopyI18n,
                contactSubtitle,
                contactSubtitleI18n,
                contactAddress,
                contactAddressI18n,
                contactPhone,
                contactEmail,
                whatsappPhone,
                whatsappUrl,
                socialLinks,
                "heroSlides": coalesce(heroSlides, [])[] | order(coalesce(order, 999) asc) {
                    href,
                    primaryHref,
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

export async function fetchSanityAboutPage(): Promise<SanityAboutPage | null> {
    if (!sanityClient) return null;
    if (aboutPageRequest && !import.meta.env.DEV) return aboutPageRequest;

    aboutPageRequest = sanityClient
        .fetch<SanityAboutPage | null>(`
            *[_type == "aboutPage" && _id == "aboutPage"][0] {
                "companyVideoUrl": companyVideo.asset->url,
                "companyImages": coalesce(companyImages, [])[] {
                    asset,
                    alt
                },
                companyDescriptionI18n
            }
        `)
        .catch((error) => {
            console.warn("[sanity] Unable to load About Page:", error);
            return null;
        });

    return aboutPageRequest;
}

export async function fetchSanityAboutRecommendation(): Promise<SanityAboutRecommendation | null> {
    if (!sanityClient) return null;
    if (aboutRecommendationRequest && !import.meta.env.DEV) return aboutRecommendationRequest;

    aboutRecommendationRequest = sanityClient
        .fetch<SanityAboutRecommendation | null>(`
            *[_type == "aboutRecommendation" && _id == "aboutRecommendation"][0] {
                "items": coalesce(items, [])[] {
                    image { asset, alt },
                    textI18n
                }
            }
        `)
        .catch((error) => {
            console.warn("[sanity] Unable to load About Page recommendations:", error);
            return null;
        });

    return aboutRecommendationRequest;
}

export async function fetchSanityAboutImageGallery(): Promise<SanityAboutImageGallery | null> {
    if (!sanityClient) return null;
    if (aboutImageGalleryRequest && !import.meta.env.DEV) return aboutImageGalleryRequest;

    aboutImageGalleryRequest = sanityClient
        .fetch<SanityAboutImageGallery | null>(`
            *[_type == "aboutImageGallery" && _id == "aboutImageGallery"][0] {
                "images": coalesce(images, [])[] { asset }
            }
        `)
        .catch((error) => {
            console.warn("[sanity] Unable to load additional About Page images:", error);
            return null;
        });

    return aboutImageGalleryRequest;
}

export async function fetchSanityAboutCompanyCarousel(): Promise<SanityAboutCompanyCarousel | null> {
    if (!sanityClient) return null;
    if (aboutCompanyCarouselRequest && !import.meta.env.DEV) return aboutCompanyCarouselRequest;

    aboutCompanyCarouselRequest = sanityClient
        .fetch<SanityAboutCompanyCarousel | null>(`
            *[_type == "aboutCompanyCarousel" && _id == "aboutCompanyCarousel"][0] {
                "images": coalesce(images, [])[] { asset }
            }
        `)
        .catch((error) => {
            console.warn("[sanity] Unable to load About Page company carousel:", error);
            return null;
        });

    return aboutCompanyCarouselRequest;
}

export function imageUrlFor(source: unknown, width = 1200, height = 1500): string | undefined {
    if (!builder || !source) return undefined;

    try {
        return builder.image(source).width(width).height(height).fit("crop").auto("format").url();
    } catch {
        return undefined;
    }
}

export function imageUrlForContain(source: unknown, width = 1920): string | undefined {
    if (!builder || !source) return undefined;

    try {
        return builder.image(source).width(width).fit("max").quality(82).auto("format").url();
    } catch {
        return undefined;
    }
}

export function imageSrcSetForContain(source: unknown, widths = [480, 800, 1200]): string | undefined {
    const candidates = widths
        .map((width) => {
            const url = imageUrlForContain(source, width);
            return url ? `${url} ${width}w` : undefined;
        })
        .filter(Boolean);

    return candidates.length ? candidates.join(", ") : undefined;
}
