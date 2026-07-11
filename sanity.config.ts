import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = "x2e2nl4u";
const dataset =
    process.env.SANITY_STUDIO_DATASET ??
    process.env.PUBLIC_SANITY_DATASET ??
    "production";

export default defineConfig({
    name: "e-commer-astro-studio",
    title: "E-commer Astro Studio",
    projectId,
    dataset,
    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title("Content")
                    .items([
                        S.listItem()
                            .id("aboutPage")
                            .title("About Page — Company Information")
                            .schemaType("aboutPage")
                            .child(
                                S.document()
                                    .schemaType("aboutPage")
                                    .documentId("aboutPage"),
                            ),
                        S.listItem()
                            .id("aboutRecommendation")
                            .title("About Page — Main Recommendation")
                            .schemaType("aboutRecommendation")
                            .child(
                                S.document()
                                    .schemaType("aboutRecommendation")
                                    .documentId("aboutRecommendation"),
                            ),
                        S.listItem()
                            .id("aboutImageGallery")
                            .title("About Page — Additional Images")
                            .schemaType("aboutImageGallery")
                            .child(
                                S.document()
                                    .schemaType("aboutImageGallery")
                                    .documentId("aboutImageGallery"),
                            ),
                        S.divider(),
                        ...S.documentTypeListItems().filter(
                            (item) => !["aboutPage", "aboutRecommendation", "aboutImageGallery"].includes(item.getId() ?? ""),
                        ),
                    ]),
        }),
    ],
    schema: {
        types: schemaTypes,
    },
});
