import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

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
    slug?: string | null;
    price?: number | null;
    description?: string | null;
    category?: string | null;
    subcategory?: string | null;
    stock?: number | null;
    badge?: string | null;
    discount?: number | null;
    specs?: Array<{ label?: string | null; value?: string | null }> | null;
    images?: Array<{ asset?: unknown; alt?: string | null }> | null;
};

export type SanityCategoryDocument = {
    name?: string | null;
    slug?: string | null;
    image?: { asset?: unknown } | null;
};

let productsRequest: Promise<SanityProductDocument[]> | undefined;
let categoriesRequest: Promise<SanityCategoryDocument[]> | undefined;

export async function fetchSanityProducts(): Promise<SanityProductDocument[]> {
    if (!sanityClient) return [];
    if (productsRequest) return productsRequest;

    productsRequest = sanityClient
        .fetch<SanityProductDocument[]>(`
            *[_type == "atelierProduct" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
                "id": _id,
                name,
                "slug": slug.current,
                price,
                description,
                category,
                subcategory,
                stock,
                badge,
                discount,
                "specs": coalesce(specs, [])[] {
                    label,
                    value
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

export function imageUrlFor(source: unknown, width = 1200, height = 1500): string | undefined {
    if (!builder || !source) return undefined;

    try {
        return builder.image(source).width(width).height(height).fit("crop").auto("format").url();
    } catch {
        return undefined;
    }
}
