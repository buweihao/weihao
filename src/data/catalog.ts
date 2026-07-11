import { products as localProducts, type Product } from "./products";
import { categories as localCategories } from "./home";
import {
    fetchSanityCategories,
    fetchSanityProducts,
    fetchSanitySiteSettings,
    imageUrlFor,
    imageUrlForContain,
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

export function isValidCategorySlug(value: string | null | undefined): value is string {
    return Boolean(value?.trim());
}

export type HeroSlide = {
    image: string;
    alt: string;
    href: string;
};

export type CatalogCategory = {
    name: string;
    image: string;
    path: string;
    slug: string;
};

function normalizeProduct(doc: SanityProductDocument, index: number, locale: Locale): Product {
    const images =
        doc.images
            // Product artwork must preserve its original aspect ratio. The generic
            // imageUrlFor helper intentionally crops to a marketing-card ratio,
            // which was cutting off square product images before they reached the gallery.
            ?.map((image) => imageUrlForContain(image.asset, 1600))
            .filter((url): url is string => Boolean(url)) ?? [];
    let category = pickLocalized(
        doc.productTypeName,
        doc.productTypeNameI18n,
        locale,
        pickLocalized(doc.category, doc.categoryI18n, locale, "Products"),
    );

    if (category === "toner") category = ui[locale].nav.toner;
    else if (category === "essence") category = ui[locale].nav.essence;
    else if (category === "lotion") category = ui[locale].nav.lotion;
    else if (category === "cream") category = ui[locale].nav.cream;
    else if (category === "mask") category = ui[locale].nav.mask;
    else if (category === "cleansing") category = ui[locale].nav.cleansing;
    // Legacy values remain readable until older projects migrate their documents.
    else if (category === "hydrating") category = ui[locale].nav.essence;
    else if (category === "sunscreen") category = ui[locale].nav.cream;
    else if (category === "antiAging") category = ui[locale].nav.essence;

    // Keep the filter key language-neutral. Chinese labels can contain no ASCII
    // characters, so deriving the slug from the translated display name collapses
    // unrelated categories into the generic `products` bucket.
    const categorySlug =
        doc.productTypeSlug?.trim() ||
        slugifyCategory(doc.category ?? "") ||
        slugifyCategory(doc.categoryI18n?.en ?? "") ||
        "products";

    return {
        id: doc.id ?? doc.slug ?? String(index + 1),
        name: pickLocalized(doc.name, doc.nameI18n, locale, "Untitled product"),
        title: pickLocalized(doc.name, doc.nameI18n, locale, "Untitled product"),
        price: doc.price ?? 0,
        description: pickLocalized(doc.description, doc.descriptionI18n, locale),
        productDetail: pickLocalized(doc.productDetail, doc.productDetailI18n, locale),
        category,
        categorySlug,
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
        return localProducts.map((product) => ({
            ...product,
            categorySlug: product.categorySlug ?? slugifyCategory(product.category),
        }));
    }

    return sanityProducts.map((product, index) => normalizeProduct(product, index, locale));
}

export async function getCatalogCategories(locale: Locale = defaultLocale) {
    const [sanityCategories, sanityProducts] = await Promise.all([
        fetchSanityCategories(),
        fetchSanityProducts(),
    ]);
    const products = sanityProducts.map((product, index) => normalizeProduct(product, index, locale));

    if (sanityCategories.length > 0) {
        return sanityCategories.map((category): CatalogCategory => {
            const slug = category.slug?.trim() || slugifyCategory(category.name ?? "");
            const matchingProduct = products.find((product) => product.categorySlug === slug);
            return {
                name: pickLocalized(category.name, category.nameI18n, locale, "Products"),
                image: imageUrlFor(category.image?.asset, 1200, 1200) ?? matchingProduct?.images[0] ?? fallbackImage,
                slug,
                path: localizedPath(`/products?type=${slug}`, locale),
            };
        }).filter((category) => isValidCategorySlug(category.slug));
    }

    return localCategories.map((definition): CatalogCategory => {
        const matchingProduct = products.find((product) => product.categorySlug === definition.slug);
        return {
            name: definition.nameI18n[locale],
            image:
                matchingProduct?.images[0] ??
                definition.image,
            slug: definition.slug,
            path: localizedPath(`/products?type=${definition.slug}`, locale),
        };
    });
}

function normalizeHeroSlide(slide: SanityHeroSlide, index: number, locale: Locale): HeroSlide {
    const fallback = ui[locale].heroFallback[index] ?? ui[locale].heroFallback[0];
    const image = imageUrlForContain(slide.image?.asset, 1920) ?? fallbackImage;
    const href = slide.href || slide.primaryHref || "/";

    return {
        image,
        alt: fallback.title,
        href: localizedPath(href, locale),
    };
}

export async function getHeroSlides(locale: Locale = defaultLocale): Promise<HeroSlide[]> {
    const settings = await fetchSanitySiteSettings();
    const sanitySlides = settings?.heroSlides?.filter((slide) => slide.image?.asset);

    if (sanitySlides?.length) {
        return sanitySlides.map((slide, index) => normalizeHeroSlide(slide, index, locale));
    }

    const fallbackImages = [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop",
    ];
    const fallbackHrefs = ["/products?type=computers", "/products?type=phones", "/products?type=accessories"];

    return ui[locale].heroFallback.map((slide, index) => ({
        image: fallbackImages[index] ?? fallbackImage,
        alt: slide.title,
        href: localizedPath(fallbackHrefs[index] ?? "/", locale),
    }));
}

export function getRelatedProductsFromList(
    products: Product[],
    category: string,
    currentSlug: string,
) {
    return products.filter((p) => p.category === category && p.slug !== currentSlug).slice(0, 4);
}
