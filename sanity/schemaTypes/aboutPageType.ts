import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPageType = defineType({
    name: "aboutPage",
    title: "About Page — Company Information",
    type: "document",
    fields: [
        defineField({
            name: "companyVideo",
            title: "Company video",
            type: "file",
            options: { accept: "video/mp4,video/webm,video/quicktime" },
            description: "Upload one MP4, WebM, or MOV company video.",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "companyImages",
            title: "Company images (exactly 4)",
            type: "array",
            description: "1–2: right-side images; 3: large bottom-left image; 4: bottom-right image.",
            of: [
                defineArrayMember({
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: "alt",
                            title: "Alternative text",
                            type: "string",
                        }),
                    ],
                }),
            ],
            validation: (rule) => rule.required().length(4),
        }),
        defineField({
            name: "companyDescriptionI18n",
            title: "Company introduction",
            type: "object",
            fields: [
                defineField({
                    name: "en",
                    title: "English",
                    type: "text",
                    rows: 12,
                    validation: (rule) => rule.required(),
                }),
                defineField({
                    name: "zh",
                    title: "中文",
                    type: "text",
                    rows: 12,
                    validation: (rule) => rule.required(),
                }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "About Page — Company Information",
                subtitle: "1 video · 4 images · bilingual introduction",
            };
        },
    },
});
