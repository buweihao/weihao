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
            name: "logo",
            title: "Site logo",
            type: "image",
            description: "Shown beside the site name in the header and footer.",
            options: { hotspot: true },
        }),
        defineField({
            name: "announcement",
            title: "Announcement bar",
            type: "string",
        }),
        localizedString("announcementI18n", "Announcement translations"),
        defineField({
            name: "announcementItems",
            title: "Top announcement messages",
            description: "Rotating messages shown in the black bar at the top of every page.",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        localizedString("textI18n", "Message"),
                        defineField({
                            name: "enabled",
                            title: "Enabled",
                            type: "boolean",
                            initialValue: true,
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
                            en: "textI18n.en",
                            zh: "textI18n.zh",
                            enabled: "enabled",
                            order: "order",
                        },
                        prepare({ en, zh, enabled, order }) {
                            return {
                                title: en || zh || "Untitled announcement",
                                subtitle: `${enabled === false ? "Disabled" : "Enabled"} · Order ${order ?? 999}`,
                            };
                        },
                    },
                }),
            ],
        }),
        defineField({
            name: "contactEmail",
            title: "Contact email",
            type: "string",
        }),
        defineField({
            name: "footerCopy",
            title: "Footer description",
            type: "text",
            rows: 3,
            description: "Default footer sentence under the site logo.",
        }),
        localizedText("footerCopyI18n", "Footer description translations"),
        defineField({
            name: "contactSubtitle",
            title: "Contact page intro",
            type: "text",
            rows: 4,
            description: "Intro paragraph on the contact page.",
        }),
        localizedText("contactSubtitleI18n", "Contact page intro translations"),
        defineField({
            name: "contactAddress",
            title: "Contact address",
            type: "text",
            rows: 2,
        }),
        localizedText("contactAddressI18n", "Contact address translations"),
        defineField({
            name: "contactPhone",
            title: "Contact phone",
            type: "string",
        }),
        defineField({
            name: "whatsappPhone",
            title: "WhatsApp phone number",
            type: "string",
            description:
                "Enter a phone number with country code, for example +15551234567. The website will create the WhatsApp chat link automatically.",
        }),
        defineField({
            name: "whatsappUrl",
            title: "Legacy WhatsApp URL",
            type: "url",
            hidden: true,
        }),
        defineField({
            name: "socialLinks",
            title: "Follow Us links",
            type: "object",
            fields: [
                defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
                defineField({ name: "twitter", title: "Twitter / X URL", type: "url" }),
                defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
                defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
                defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
                defineField({ name: "github", title: "GitHub URL", type: "url" }),
            ],
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
                            title: "Carousel image",
                            type: "image",
                            options: { hotspot: true },
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: "href",
                            title: "Click-through URL",
                            type: "string",
                            description: "Use a local path like /products?type=essence or a full URL.",
                            validation: (rule) => rule.required(),
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
                            title: "href",
                            media: "image",
                        },
                        prepare({ title, media }) {
                            return {
                                title: title || "Carousel slide",
                                subtitle: "Image click-through",
                                media,
                            };
                        },
                    },
                }),
            ],
        }),
    ],
});
