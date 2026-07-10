export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
    en: "English",
    zh: "中文",
};

export const localeHtmlLang: Record<Locale, string> = {
    en: "en",
    zh: "zh-CN",
};

export function isLocale(value: string | undefined): value is Locale {
    return Boolean(value && locales.includes(value as Locale));
}

export function localePath(locale: Locale, path = "/"): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

export function stripLocale(pathname: string): string {
    const parts = pathname.split("/").filter(Boolean);
    if (isLocale(parts[0])) {
        const stripped = `/${parts.slice(1).join("/")}`;
        return stripped === "/" ? "/" : stripped.replace(/\/$/, "");
    }
    return pathname === "/" ? "/" : pathname.replace(/\/$/, "");
}

export function alternateLinks(pathname: string) {
    const path = stripLocale(pathname);
    return [
        { locale: "en" as const, hreflang: "en", href: localePath("en", path) },
        { locale: "zh" as const, hreflang: "zh-CN", href: localePath("zh", path) },
    ];
}

export function localizedPath(path: string, locale: Locale): string {
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("#")) {
        return path;
    }
    return localePath(locale, stripLocale(path));
}

export function pickLocalized(
    value: string | null | undefined,
    localized: Partial<Record<Locale, string | null | undefined>> | null | undefined,
    locale: Locale,
    fallback = "",
): string {
    return (
        localized?.[locale]?.trim() ||
        value?.trim() ||
        localized?.[defaultLocale]?.trim() ||
        localized?.zh?.trim() ||
        fallback
    );
}

export const ui = {
    en: {
        siteTitle: "E-COMMER | Astro",
        skip: "Skip to main content",
        categories: "Categories",
        browse: "Browse",
        moreInfo: "More Info",
        favorites: "Favorites",
        cart: "Shopping Cart",
        nav: {
            home: "Home",
            products: "Products",
            cleansing: "Cleansing",
            hydrating: "Hydrating",
            sunscreen: "Sunscreen",
            antiAging: "Anti-aging",
            about: "About",
            contact: "Contact",
        },
        footer: {
            copy:
                "Premium tech gear for the modern professional. Elevate your digital lifestyle with our curated collection.",
            shop: "Shop",
            support: "Support",
            stayUpdated: "Stay Updated",
            newsletter:
                "Subscribe to our newsletter for exclusive deals and tech news.",
            emailPlaceholder: "Enter your email",
            allProducts: "All Products",
            featured: "Featured",
            newArrivals: "New Arrivals",
            discounts: "Discounts",
            contactUs: "Contact Us",
            faqs: "FAQs",
            shippingReturns: "Shipping & Returns",
            orderStatus: "Order Status",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            rights: "All rights reserved.",
        },
        heroFallback: [
            {
                eyebrow: "",
                title: "Next-Gen Performance",
                description:
                    "Discover our new collection of high-performance laptops designed for creators and professionals.",
                primaryLabel: "Shop Laptops",
            },
            {
                eyebrow: "New Arrival",
                title: "Smart Connections",
                description:
                    "Stay ahead with the latest mobile technology. Experience power and elegance in the palm of your hand.",
                primaryLabel: "Explore Phones",
            },
            {
                eyebrow: "",
                title: "Level Up Your Game",
                description:
                    "Immerse yourself in the ultimate gaming experience with our pro-level gear and custom setups.",
                primaryLabel: "Get the Gear",
                secondaryLabel: "Accessories",
            },
        ],
        product: {
            inStock: "In Stock",
            outOfStock: "Out of Stock",
            addToCart: "Add to Cart",
            buyNow: "Buy Now",
            description: "Description",
            noDescription: "No description available for this product at this time.",
            save: "Save",
            certifiedWarranty: "Certified Warranty",
            insuredShipping: "Insured Shipping 24/48h",
            relatedProducts: "Related Products"
        },
        cart: {
            title: "Your Cart",
            empty: "Your cart is empty",
            empty_desc: "It looks like you haven't found that special tone yet. Explore our collection.",
            total: "Total",
            checkout: "Checkout",
            viewCart: "View Cart"
        },
        contact: {
            title: "Contact Us",
            sendUsMessage: "Send us a message",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            phone: "Phone",
            subject: "Subject",
            message: "Message",
            send: "Send Message",
            sending: "Sending...",
            success: "Message sent successfully!"
        }
    },
    zh: {
        siteTitle: "E-COMMER | Astro",
        skip: "跳到主要内容",
        categories: "分类",
        browse: "浏览",
        moreInfo: "更多信息",
        favorites: "收藏",
        cart: "购物车",
        nav: {
            home: "首页",
            products: "产品",
            cleansing: "清洁",
            hydrating: "补水",
            sunscreen: "防晒",
            antiAging: "抗衰",
            about: "关于",
            contact: "联系",
        },
        footer: {
            copy: "为现代专业人士精选高品质科技装备，让数字生活更高效、更有质感。",
            shop: "商店",
            support: "支持",
            stayUpdated: "获取更新",
            newsletter: "订阅邮件，获取专属优惠与科技资讯。",
            emailPlaceholder: "输入你的邮箱",
            allProducts: "全部产品",
            featured: "精选",
            newArrivals: "新品",
            discounts: "折扣",
            contactUs: "联系我们",
            faqs: "常见问题",
            shippingReturns: "配送与退换",
            orderStatus: "订单状态",
            privacy: "隐私政策",
            terms: "服务条款",
            rights: "版权所有。",
        },
        heroFallback: [
            {
                eyebrow: "",
                title: "新一代性能",
                description: "探索为创作者和专业人士打造的高性能笔记本新品系列。",
                primaryLabel: "选购笔记本",
            },
            {
                eyebrow: "新品上市",
                title: "智能连接",
                description: "用最新移动科技保持领先，在掌心体验性能与优雅。",
                primaryLabel: "探索手机",
            },
            {
                eyebrow: "",
                title: "升级你的游戏体验",
                description: "用专业装备和定制配置，沉浸在更完整的游戏体验里。",
                primaryLabel: "获取装备",
                secondaryLabel: "查看配件",
            },
        ],
        product: {
            inStock: "有货",
            outOfStock: "缺货",
            addToCart: "加入购物车",
            buyNow: "立即购买",
            description: "产品描述",
            noDescription: "暂无产品描述。",
            save: "立省",
            certifiedWarranty: "官方质保",
            insuredShipping: "24/48小时极速发货",
            relatedProducts: "相关产品"
        },
        cart: {
            title: "您的购物车",
            empty: "您的购物车是空的",
            empty_desc: "去看看有没有需要补充的装备吧！",
            total: "总计",
            checkout: "去结算",
            viewCart: "查看购物车"
        },
        contact: {
            title: "联系我们",
            sendUsMessage: "发送消息",
            firstName: "名字",
            lastName: "姓氏",
            email: "电子邮箱",
            phone: "电话号码",
            subject: "主题",
            message: "留言内容",
            send: "发送",
            sending: "发送中...",
            success: "消息发送成功！"
        }
    },
} as const;
