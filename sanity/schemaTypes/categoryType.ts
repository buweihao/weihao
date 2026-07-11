import { defineField, defineType } from "sanity";

export const categoryType = defineType({
    name: "category",
    title: "Product Categories",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Default / English name",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "nameI18n",
            title: "Category name translations",
            type: "object",
            fields: [
                defineField({ name: "en", title: "English", type: "string" }),
                defineField({ name: "zh", title: "中文", type: "string" }),
            ],
        }),
        defineField({
            name: "slug",
            title: "Category URL slug",
            type: "slug",
            options: { source: "name", maxLength: 80 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "image",
            title: "Category cover image",
            type: "image",
            options: { hotspot: true },
            description: "Used on the homepage category grid and category header.",
        }),
        defineField({
            name: "order",
            title: "Sort order",
            type: "number",
            initialValue: 999,
        }),
        defineField({
            name: "active",
            title: "Show on website",
            type: "boolean",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "nameI18n.zh",
            fallbackTitle: "nameI18n.en",
            slug: "slug.current",
            active: "active",
            media: "image",
        },
        prepare({ title, fallbackTitle, slug, active, media }) {
            return {
                title: title || fallbackTitle || "Untitled category",
                subtitle: `${slug || "no-slug"}${active === false ? " · Hidden" : ""}`,
                media,
            };
        },
    },
});
