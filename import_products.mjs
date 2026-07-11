import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DATA_FILE = path.resolve(ROOT, process.env.PRODUCTS_DATA_FILE ?? "products_actual.json");
const APPLY = process.argv.includes("--apply");
const VALID_CATEGORIES = new Set(["cleansing", "hydrating", "sunscreen", "antiAging"]);

loadLocalEnv(path.join(ROOT, ".env"));

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || "2026-07-03";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) fail("缺少 SANITY_STUDIO_PROJECT_ID 或 PUBLIC_SANITY_PROJECT_ID。", 2);
if (APPLY && !token) fail("执行上传需要在本地 .env 设置 SANITY_WRITE_TOKEN。", 2);

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

function loadLocalEnv(filename) {
    if (!fs.existsSync(filename)) return;
    for (const line of fs.readFileSync(filename, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const separator = trimmed.indexOf("=");
        if (separator < 1) continue;
        const key = trimmed.slice(0, separator).trim();
        let value = trimmed.slice(separator + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
        if (!(key in process.env)) process.env[key] = value;
    }
}

function fail(message, exitCode = 1) {
    console.error(`[错误] ${message}`);
    process.exit(exitCode);
}

function stableDocumentId(slug) {
    return `atelierProduct.${slug.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 100)}`;
}

function resolveImagePath(imagePath) {
    return path.isAbsolute(imagePath) ? imagePath : path.resolve(ROOT, imagePath);
}

function optionalLocalized(product, field) {
    const en = product[field];
    const zh = product[`${field}Zh`];
    return en || zh ? { en: en || zh, zh: zh || en } : undefined;
}

function validateProducts(products) {
    if (!Array.isArray(products) || products.length === 0) fail("产品 JSON 必须是非空数组。", 2);
    const slugs = new Set();
    const errors = [];
    products.forEach((product, index) => {
        const label = `第 ${index + 1} 项`;
        for (const field of ["name", "nameZh", "slug", "category", "description", "descriptionZh"]) {
            if (!product[field]) errors.push(`${label} 缺少 ${field}`);
        }
        if (!Number.isFinite(Number(product.price)) || Number(product.price) < 0) errors.push(`${label} price 无效`);
        if (!VALID_CATEGORIES.has(product.category)) errors.push(`${label} category 无效: ${product.category}`);
        if (slugs.has(product.slug)) errors.push(`${label} slug 重复: ${product.slug}`);
        slugs.add(product.slug);
        if (!Array.isArray(product.imagePaths) || product.imagePaths.length === 0) {
            errors.push(`${label} imagePaths 必须是非空数组`);
        } else {
            for (const imagePath of product.imagePaths) {
                if (!fs.existsSync(resolveImagePath(imagePath))) errors.push(`${label} 找不到图片: ${imagePath}`);
            }
        }
    });
    if (errors.length) fail(`导入前校验失败：\n- ${errors.join("\n- ")}`, 2);
}

async function uploadImages(product) {
    const images = [];
    for (const [index, imagePath] of product.imagePaths.entries()) {
        const absolutePath = resolveImagePath(imagePath);
        console.log(`  -> 上传图片 ${index + 1}/${product.imagePaths.length}: ${path.basename(absolutePath)}`);
        const asset = await client.assets.upload("image", fs.createReadStream(absolutePath), { filename: path.basename(absolutePath) });
        images.push({
            _key: `image-${index + 1}`,
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            ...(product.imageAlts?.[index] ? { alt: product.imageAlts[index] } : {}),
        });
    }
    return images;
}

async function findTargetId(slug) {
    const matches = await client.fetch(`*[_type == "atelierProduct" && slug.current == $slug]{_id}`, { slug });
    if (matches.length > 1) fail(`后台已有 ${matches.length} 个相同 slug（${slug}），请先处理重复记录。`);
    return matches[0]?._id || stableDocumentId(slug);
}

function buildDocument(product, id, images) {
    const document = {
        _id: id,
        _type: "atelierProduct",
        name: product.name,
        nameI18n: { en: product.name, zh: product.nameZh },
        slug: { _type: "slug", current: product.slug },
        category: product.category,
        price: Number(product.price),
        description: product.description,
        descriptionI18n: { en: product.description, zh: product.descriptionZh },
        stock: Number(product.stock ?? 0),
        discount: Number(product.discount ?? 0),
        images,
    };
    for (const field of ["subcategory", "badge", "productDetail"]) {
        if (product[field] != null) document[field] = product[field];
        const localized = optionalLocalized(product, field);
        if (localized) document[`${field}I18n`] = localized;
    }
    if (Array.isArray(product.specs)) document.specs = product.specs;
    if (product.order != null) document.order = Number(product.order);
    return document;
}

async function main() {
    if (!fs.existsSync(DATA_FILE)) fail(`找不到数据文件: ${DATA_FILE}`, 2);
    let products;
    try {
        products = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch (error) {
        fail(`JSON 解析失败: ${error.message}`, 2);
    }
    validateProducts(products);
    console.log(`[校验通过] ${products.length} 款产品，模式: ${APPLY ? "写入后台" : "DRY RUN（不联网、不写入）"}`);
    if (!APPLY) {
        for (const product of products) console.log(`- ${product.nameZh} (${product.slug})：${product.imagePaths.length} 张图片`);
        console.log("\n确认无误后运行: node import_products.mjs --apply");
        return;
    }
    for (const [index, product] of products.entries()) {
        console.log(`\n[${index + 1}/${products.length}] ${product.nameZh}`);
        const targetId = await findTargetId(product.slug);
        const images = await uploadImages(product);
        const result = await client.createOrReplace(buildDocument(product, targetId, images));
        console.log(`  => 更新成功: ${result._id}`);
    }
    console.log("\n[完成] 所有产品已按 slug 更新，没有创建重复产品。");
}

main().catch((error) => fail(error.message));
