import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId =
    process.env.SANITY_STUDIO_PROJECT_ID ??
    process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset =
    process.env.SANITY_STUDIO_DATASET ??
    process.env.PUBLIC_SANITY_DATASET ??
    "production";

if (!projectId) {
    throw new Error(
        "Set SANITY_STUDIO_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID before starting Sanity Studio.",
    );
}

export default defineConfig({
    name: "e-commer-astro-studio",
    title: "E-commer Astro Studio",
    projectId,
    dataset,
    plugins: [structureTool()],
    schema: {
        types: schemaTypes,
    },
});
