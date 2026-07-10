import { defineField, defineType } from "sanity";

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
        defineField({
            name: "announcement",
            title: "Announcement bar",
            type: "string",
        }),
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
    ],
});
