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
    plugins: [structureTool()],
    schema: {
        types: schemaTypes,
    },
});
