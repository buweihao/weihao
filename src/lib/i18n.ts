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
            computers: "Computers",
            phones: "Phones",
            audio: "Audio",
            accessories: "Accessories",
            all: "All",
            notebooks: "Notebooks",
            keyboards: "Keyboards",
            monitors: "Monitors",
            android: "Android",
            iphone: "iPhone",
            about: "About",
            blog: "Blog",
            contact: "Contact",
            aboutUs: "About Us",
            ourBlog: "Our Blog",
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
            computers: "电脑",
            phones: "手机",
            audio: "音频",
            accessories: "配件",
            all: "全部",
            notebooks: "笔记本",
            keyboards: "键盘",
            monitors: "显示器",
            android: "安卓",
            iphone: "iPhone",
            about: "关于",
            blog: "博客",
            contact: "联系",
            aboutUs: "关于我们",
            ourBlog: "我们的博客",
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
    },
} as const;
