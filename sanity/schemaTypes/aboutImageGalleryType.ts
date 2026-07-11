import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutImageGalleryType = defineType({
    name: "aboutImageGallery",
    title: "About Page — Additional Images",
    type: "document",
    fields: [
        defineField({
            name: "images",
            title: "Images",
            type: "array",
            description: "Add images in display order. Each image is shown on its own row at its original aspect ratio.",
            of: [
                defineArrayMember({
                    type: "image",
                    options: { hotspot: false },
                }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "About Page — Additional Images",
                subtitle: "One full-width image per row",
            };
        },
    },
});
