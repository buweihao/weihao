import { products as localProducts, type Product } from "./products";
import { categories as localCategories } from "./home";
import {
    fetchSanityCategories,
    fetchSanityProducts,
    imageUrlFor,
    type SanityProductDocument,
} from "../lib/sanity";

const fallbackImage =
    "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=2000&auto=format&fit=crop";

export function slugifyCategory(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeProduct(doc: SanityProductDocument, index: number): Product {
    const images =
        doc.images
            ?.map((image) => imageUrlFor(image.asset))
            .filter((url): url is string => Boolean(url)) ?? [];

    return {
        id: doc.id ?? doc.slug ?? String(index + 1),
        name: doc.name ?? "Untitled product",
        title: doc.name ?? "Untitled product",
        price: doc.price ?? 0,
        description: doc.description ?? "",
        category: doc.category ?? "Products",
        subcategory: doc.subcategory ?? undefined,
        stock: doc.stock ?? 0,
        images: images.length ? images : [fallbackImage],
        slug: doc.slug ?? `product-${index + 1}`,
        badge: doc.badge ?? undefined,
        discount: doc.discount ?? undefined,
        specs:
            doc.specs
                ?.filter((spec) => spec.label && spec.value)
                .map((spec) => ({
                    label: String(spec.label),
                    value: String(spec.value),
                })) ?? [],
    };
}

export async function getCatalogProducts(): Promise<Product[]> {
    const sanityProducts = await fetchSanityProducts();

    if (sanityProducts.length === 0) {
        return localProducts;
    }

    return sanityProducts.map(normalizeProduct);
}

export async function getCatalogCategories() {
    const sanityCategories = await fetchSanityCategories();

    if (sanityCategories.length === 0) {
        return localCategories;
    }

    return sanityCategories.map((category) => ({
        name: category.name ?? "Products",
        image: imageUrlFor(category.image?.asset, 2000, 1000) ?? fallbackImage,
        path: `/category/${category.slug ?? slugifyCategory(category.name ?? "products")}`,
    }));
}

export function getRelatedProductsFromList(
    products: Product[],
    category: string,
    currentSlug: string,
) {
    return products.filter((p) => p.category === category && p.slug !== currentSlug).slice(0, 4);
}
