import { defineField, defineType } from "sanity";

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
