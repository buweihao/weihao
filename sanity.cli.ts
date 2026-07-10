import { defineCliConfig } from "sanity/cli";

const projectId = "x2e2nl4u";
const dataset =
    process.env.SANITY_STUDIO_DATASET ??
    process.env.PUBLIC_SANITY_DATASET ??
    "production";

export default defineCliConfig({
    api: {
        projectId,
        dataset,
    },
});
