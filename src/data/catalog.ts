import { products as localProducts, type Product } from "./products";
import { categories as localCategories } from "./home";
import {
    fetchSanityCategories,
    fetchSanityProducts,
    fetchSanitySiteSettings,
    imageUrlFor,
    type SanityHeroSlide,
    type SanityProductDocument,
} from "../lib/sanity";
import { defaultLocale, localizedPath, pickLocalized, type Locale, ui } from "../lib/i18n";

const fallbackImage =
    "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=2000&auto=format&fit=crop";

export function slugifyCategory(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export type HeroSlide = {
    image: string;
    alt: string;
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
    align: "center" | "left";
};

function normalizeProduct(doc: SanityProductDocument, index: number, locale: Locale): Product {
    const images =
        doc.images
            ?.map((image) => imageUrlFor(image.asset))
            .filter((url): url is string => Boolean(url)) ?? [];

    return {
        id: doc.id ?? doc.slug ?? String(index + 1),
        name: pickLocalized(doc.name, doc.nameI18n, locale, "Untitled product"),
        title: pickLocalized(doc.name, doc.nameI18n, locale, "Untitled product"),
        price: doc.price ?? 0,
        description: pickLocalized(doc.description, doc.descriptionI18n, locale),
        category: pickLocalized(doc.category, doc.categoryI18n, locale, "Products"),
        subcategory: pickLocalized(doc.subcategory, doc.subcategoryI18n, locale) || undefined,
        stock: doc.stock ?? 0,
        images: images.length ? images : [fallbackImage],
        slug: doc.slug ?? `product-${index + 1}`,
        badge: pickLocalized(doc.badge, doc.badgeI18n, locale) || undefined,
        discount: doc.discount ?? undefined,
        specs:
            doc.specs
                ?.filter((spec) => spec.label && spec.value)
                .map((spec) => ({
                    label: pickLocalized(spec.label, spec.labelI18n, locale),
                    value: pickLocalized(spec.value, spec.valueI18n, locale),
                })) ?? [],
    };
}

export async function getCatalogProducts(locale: Locale = defaultLocale): Promise<Product[]> {
    const sanityProducts = await fetchSanityProducts();

    if (sanityProducts.length === 0) {
        return localProducts;
    }

    return sanityProducts.map((product, index) => normalizeProduct(product, index, locale));
}

export async function getCatalogCategories(locale: Locale = defaultLocale) {
    const sanityCategories = await fetchSanityCategories();

    if (sanityCategories.length === 0) {
        return localCategories;
    }

    return sanityCategories.map((category) => ({
        name: pickLocalized(category.name, category.nameI18n, locale, "Products"),
        image: imageUrlFor(category.image?.asset, 2000, 1000) ?? fallbackImage,
        path: `/category/${category.slug ?? slugifyCategory(category.name ?? "products")}`,
    }));
}

function normalizeHeroSlide(slide: SanityHeroSlide, index: number, locale: Locale): HeroSlide {
    const fallback = ui[locale].heroFallback[index] ?? ui[locale].heroFallback[0];
    const image = imageUrlFor(slide.image?.asset, 1920, 900) ?? fallbackImage;
    const title = pickLocalized(slide.title, slide.titleI18n, locale, fallback.title);

    return {
        image,
        alt: pickLocalized(slide.alt, slide.altI18n, locale, title),
        eyebrow: pickLocalized(slide.eyebrow, slide.eyebrowI18n, locale, fallback.eyebrow),
        title,
        description: pickLocalized(
            slide.description,
            slide.descriptionI18n,
            locale,
            fallback.description,
        ),
        primaryLabel: pickLocalized(
            slide.primaryLabel,
            slide.primaryLabelI18n,
            locale,
            fallback.primaryLabel,
        ),
        primaryHref: localizedPath(slide.primaryHref || "/category/computers", locale),
        secondaryLabel:
            pickLocalized(
                slide.secondaryLabel,
                slide.secondaryLabelI18n,
                locale,
                fallback.secondaryLabel ?? "",
            ) || undefined,
        secondaryHref: slide.secondaryHref ? localizedPath(slide.secondaryHref, locale) : undefined,
        align: slide.align === "left" ? "left" : "center",
    };
}

export async function getHeroSlides(locale: Locale = defaultLocale): Promise<HeroSlide[]> {
    const settings = await fetchSanitySiteSettings();
    const sanitySlides = settings?.heroSlides?.filter((slide) => slide.title || slide.titleI18n);

    if (sanitySlides?.length) {
        return sanitySlides.map((slide, index) => normalizeHeroSlide(slide, index, locale));
    }

    const fallbackImages = [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop",
    ];
    const fallbackHrefs = ["/category/computers?sub=notebooks", "/category/phones", "/category/accessories"];

    return ui[locale].heroFallback.map((slide, index) => ({
        image: fallbackImages[index] ?? fallbackImage,
        alt: slide.title,
        eyebrow: slide.eyebrow,
        title: slide.title,
        description: slide.description,
        primaryLabel: slide.primaryLabel,
        primaryHref: localizedPath(fallbackHrefs[index] ?? "/", locale),
        secondaryLabel: slide.secondaryLabel,
        secondaryHref: slide.secondaryLabel ? localizedPath("/category/accessories", locale) : undefined,
        align: index === 1 ? "left" : "center",
    }));
}

export function getRelatedProductsFromList(
    products: Product[],
    category: string,
    currentSlug: string,
) {
    return products.filter((p) => p.category === category && p.slug !== currentSlug).slice(0, 4);
}
