import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutCompanyCarouselType = defineType({
    name: "aboutCompanyCarousel",
    title: "About Page — Company Carousel",
    type: "document",
    fields: [
        defineField({
            name: "subtitleI18n",
            title: "Subtitle",
            type: "object",
            description: "Optional small text shown below the Our Company heading.",
            fields: [
                defineField({
                    name: "en",
                    title: "English",
                    type: "string",
                }),
                defineField({
                    name: "zh",
                    title: "中文",
                    type: "string",
                }),
            ],
        }),
        defineField({
            name: "images",
            title: "Carousel images",
            type: "array",
            description: "Upload and drag images into display order. The carousel is hidden when this list is empty.",
            of: [
                defineArrayMember({
                    type: "image",
                    options: { hotspot: true },
                }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "About Page — Company Carousel",
                subtitle: "Automatic image carousel at the bottom of the About page",
            };
        },
    },
});
