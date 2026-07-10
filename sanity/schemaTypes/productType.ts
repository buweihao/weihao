import { defineArrayMember, defineField, defineType } from "sanity";

const localizedString = (name: string, title: string) =>
    defineField({
        name,
        title,
        type: "object",
        fields: [
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "zh", title: "中文", type: "string" }),
        ],
    });

const localizedText = (name: string, title: string) =>
    defineField({
        name,
        title,
        type: "object",
        fields: [
            defineField({ name: "en", title: "English", type: "text", rows: 4 }),
            defineField({ name: "zh", title: "中文", type: "text", rows: 4 }),
        ],
    });

export const productType = defineType({
    name: "atelierProduct",
    title: "Products",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Product name",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        localizedString("nameI18n", "Product name translations"),
        defineField({
            name: "slug",
            title: "URL slug",
            type: "slug",
            options: { source: "name", maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        localizedString("categoryI18n", "Category translations"),
        defineField({
            name: "subcategory",
            title: "Subcategory",
            type: "string",
        }),
        localizedString("subcategoryI18n", "Subcategory translations"),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            rows: 4,
            validation: (rule) => rule.required(),
        }),
        localizedText("descriptionI18n", "Description translations"),
        defineField({
            name: "stock",
            title: "Stock",
            type: "number",
            initialValue: 0,
            validation: (rule) => rule.required().min(0).integer(),
        }),
        defineField({
            name: "badge",
            title: "Badge",
            type: "string",
        }),
        localizedString("badgeI18n", "Badge translations"),
        defineField({
            name: "discount",
            title: "Discount percentage",
            type: "number",
            initialValue: 0,
            validation: (rule) => rule.min(0).max(100),
        }),
        defineField({
            name: "specs",
            title: "Specifications",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "label",
                            title: "Label",
                            type: "string",
                            validation: (rule) => rule.required(),
                        }),
                        localizedString("labelI18n", "Label translations"),
                        defineField({
                            name: "value",
                            title: "Value",
                            type: "string",
                            validation: (rule) => rule.required(),
                        }),
                        localizedString("valueI18n", "Value translations"),
                    ],
                }),
            ],
        }),
        defineField({
            name: "images",
            title: "Product images",
            type: "array",
            of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
            validation: (rule) => rule.required().min(1),
        }),
        defineField({
            name: "order",
            title: "Sort order",
            type: "number",
            initialValue: 999,
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "category",
            media: "images.0",
        },
    },
});
