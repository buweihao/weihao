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
            defineField({ name: "en", title: "English", type: "text", rows: 3 }),
            defineField({ name: "zh", title: "中文", type: "text", rows: 3 }),
        ],
    });

export const siteSettingsType = defineType({
    name: "siteSettings",
    title: "Site settings",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Site title",
            type: "string",
        }),
        localizedString("titleI18n", "Site title translations"),
        defineField({
            name: "announcement",
            title: "Announcement bar",
            type: "string",
        }),
        localizedString("announcementI18n", "Announcement translations"),
        defineField({
            name: "contactEmail",
            title: "Contact email",
            type: "string",
        }),
        defineField({
            name: "whatsappUrl",
            title: "WhatsApp URL",
            type: "url",
        }),
        defineField({
            name: "heroSlides",
            title: "Homepage carousel slides",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "image",
                            title: "Background image",
                            type: "image",
                            options: { hotspot: true },
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: "alt",
                            title: "Image alt text",
                            type: "string",
                        }),
                        localizedString("altI18n", "Image alt translations"),
                        defineField({
                            name: "eyebrow",
                            title: "Eyebrow",
                            type: "string",
                        }),
                        localizedString("eyebrowI18n", "Eyebrow translations"),
                        defineField({
                            name: "title",
                            title: "Title",
                            type: "string",
                            validation: (rule) => rule.required(),
                        }),
                        localizedString("titleI18n", "Title translations"),
                        defineField({
                            name: "description",
                            title: "Description",
                            type: "text",
                            rows: 3,
                        }),
                        localizedText("descriptionI18n", "Description translations"),
                        defineField({
                            name: "primaryLabel",
                            title: "Primary button label",
                            type: "string",
                        }),
                        localizedString("primaryLabelI18n", "Primary label translations"),
                        defineField({
                            name: "primaryHref",
                            title: "Primary button URL",
                            type: "string",
                            description: "Use a local path like /category/computers or a full URL.",
                        }),
                        defineField({
                            name: "secondaryLabel",
                            title: "Secondary button label",
                            type: "string",
                        }),
                        localizedString("secondaryLabelI18n", "Secondary label translations"),
                        defineField({
                            name: "secondaryHref",
                            title: "Secondary button URL",
                            type: "string",
                        }),
                        defineField({
                            name: "align",
                            title: "Text alignment",
                            type: "string",
                            initialValue: "center",
                            options: {
                                list: [
                                    { title: "Center", value: "center" },
                                    { title: "Left", value: "left" },
                                ],
                                layout: "radio",
                            },
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
                            title: "title",
                            subtitle: "primaryHref",
                            media: "image",
                        },
                    },
                }),
            ],
        }),
    ],
});
