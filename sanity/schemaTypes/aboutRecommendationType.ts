import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutRecommendationType = defineType({
    name: "aboutRecommendation",
    title: "About Page — Main Recommendation",
    type: "document",
    fields: [
        defineField({
            name: "items",
            title: "Recommendation items",
            type: "array",
            description: "Add up to 9 items. Drag items to control their reading order from left to right, top to bottom.",
            of: [
                defineArrayMember({
                    name: "recommendationItem",
                    title: "Image + text",
                    type: "object",
                    fields: [
                        defineField({
                            name: "image",
                            title: "Image",
                            type: "image",
                            options: { hotspot: true },
                            validation: (rule) => rule.required(),
                            fields: [
                                defineField({
                                    name: "alt",
                                    title: "Alternative text",
                                    type: "string",
                                }),
                            ],
                        }),
                        defineField({
                            name: "textI18n",
                            title: "Text",
                            type: "object",
                            fields: [
                                defineField({
                                    name: "en",
                                    title: "English",
                                    type: "text",
                                    rows: 3,
                                    validation: (rule) => rule.required(),
                                }),
                                defineField({
                                    name: "zh",
                                    title: "中文",
                                    type: "text",
                                    rows: 3,
                                    validation: (rule) => rule.required(),
                                }),
                            ],
                            validation: (rule) => rule.required(),
                        }),
                    ],
                    preview: {
                        select: {
                            title: "textI18n.en",
                            subtitle: "textI18n.zh",
                            media: "image",
                        },
                    },
                }),
            ],
            validation: (rule) => rule.required().min(1).max(9),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "About Page — Main Recommendation",
                subtitle: "Up to 9 image-and-text recommendation cards",
            };
        },
    },
});
