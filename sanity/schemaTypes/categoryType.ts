import { defineField, defineType } from "sanity";

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

export const categoryType = defineType({
    name: "category",
    title: "Categories",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        localizedString("nameI18n", "Name translations"),
        defineField({
            name: "slug",
            title: "URL slug",
            type: "slug",
            options: { source: "name", maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "image",
            title: "Hero image",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "order",
            title: "Sort order",
            type: "number",
            initialValue: 999,
        }),
    ],
});
