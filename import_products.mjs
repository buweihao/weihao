import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// 1. 初始化 Sanity 客户端
const client = createClient({
    projectId: "x2e2nl4u", // 您的 Project ID
    dataset: "production",
    apiVersion: "2024-01-01",
    token: "skFfiWW4dz1MAYHI5khXD8g0PPlxyFpXXNeV6YjNdviYyhjv77fMwSF5PskBc3lysKKnuJwJp8yjxep4Tlb3DIMOhKwVWzhA75eF3zH22IQjdhogzIziomLB4OTw3ws6uB18of1Hp8C33LLuKaRoFHhuyr3qiPoBL2xuV6Wz3GtshZ0V25D1",
    useCdn: false,
});

// 2. 读取要上传的 JSON 数据文件
const DATA_FILE = "./products_actual.json";

async function uploadProducts() {
    console.log(`[准备导入] 正在读取文件: ${DATA_FILE}`);
    
    if (!fs.existsSync(DATA_FILE)) {
        console.error(`[错误] 找不到数据文件 ${DATA_FILE}！请先创建。`);
        return;
    }

    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    let products = [];
    try {
        products = JSON.parse(rawData);
    } catch (e) {
        console.error(`[错误] 解析 JSON 文件失败，请检查格式是否正确：`, e.message);
        return;
    }

    console.log(`[开始导入] 发现 ${products.length} 个商品待上传...\n`);

    for (const [index, product] of products.entries()) {
        console.log(`[${index + 1}/${products.length}] 正在处理商品: ${product.nameZh || product.name}`);

        const sanityDocument = {
            _type: "atelierProduct",
            name: product.name,
            nameI18n: {
                en: product.name,
                zh: product.nameZh,
            },
            slug: {
                _type: "slug",
                current: product.slug,
            },
            category: product.category, // 必须是: cleansing, hydrating, sunscreen, 或 antiAging
            price: Number(product.price),
            description: product.description,
            descriptionI18n: {
                en: product.description,
                zh: product.descriptionZh,
            },
            stock: Number(product.stock || 0),
            discount: Number(product.discount || 0),
            images: [], // 将在下方填充
        };

        // 3. 处理并上传图片
        if (product.imagePaths && Array.isArray(product.imagePaths)) {
            for (const imagePath of product.imagePaths) {
                if (fs.existsSync(imagePath)) {
                    console.log(`  -> 正在上传图片: ${imagePath}`);
                    const imageBuffer = fs.readFileSync(path.resolve(imagePath));
                    try {
                        const imageAsset = await client.assets.upload("image", imageBuffer, {
                            filename: path.basename(imagePath),
                        });
                        sanityDocument.images.push({
                            _key: Math.random().toString(36).substring(2, 10),
                            _type: "image",
                            asset: {
                                _type: "reference",
                                _ref: imageAsset._id,
                            },
                        });
                    } catch (uploadErr) {
                        console.error(`  -> [错误] 图片上传失败: ${imagePath}`, uploadErr.message);
                    }
                } else {
                    console.warn(`  -> [警告] 找不到图片文件: ${imagePath}，已跳过。`);
                }
            }
        }

        // 4. 上传完整商品数据至 Sanity
        try {
            const result = await client.create(sanityDocument);
            console.log(`  => ✅ 上传成功! 商品 ID: ${result._id}\n`);
        } catch (err) {
            console.error(`  => ❌ 上传失败!`, err.message, `\n`);
        }
    }
    
    console.log(`[导入完成] 所有商品处理完毕！`);
}

uploadProducts();
