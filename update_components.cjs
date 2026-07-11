const fs = require('fs');

function processFile(filePath, replacer) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = replacer(content);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated", filePath);
    }
}

// 1. src/pages/contact.astro & src/pages/[lang]/contact.astro
const contactPageReplacer = (content) => {
    if (!content.includes('import { defaultLocale')) {
        content = content.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].contactPage;\n');
    }
    content = content.replace('Get in <span class="text-primary">Touch</span>', '{copy.title1}<span class="text-primary">{copy.title2}</span>');
    content = content.replace(/Leave us a message and we will get back to you shortly\.[\s\S]*?guide you through every step of the process\./, '{copy.subtitle}');
    // Fix imports if it's [lang]
    content = content.replace('from "../lib/i18n"', 'from "../../lib/i18n"');
    // Actually, wait, the path for [lang] is different. I'll use regex.
    return content;
};
processFile('src/pages/contact.astro', (c) => {
    if (!c.includes('import { defaultLocale')) {
        c = c.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].contactPage;\n');
    }
    c = c.replace('Get in <span class="text-primary">Touch</span>', '{copy.title1}<span class="text-primary">{copy.title2}</span>');
    c = c.replace(/Leave us a message and we will get back to you shortly\.[\s\S]*?guide you through every step of the process\./, '{copy.subtitle}');
    return c;
});
processFile('src/pages/[lang]/contact.astro', (c) => {
    if (!c.includes('import { defaultLocale')) {
        c = c.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].contactPage;\n');
    }
    c = c.replace('Get in <span class="text-primary">Touch</span>', '{copy.title1}<span class="text-primary">{copy.title2}</span>');
    c = c.replace(/Leave us a message and we will get back to you shortly\.[\s\S]*?guide you through every step of the process\./, '{copy.subtitle}');
    return c;
});

// 2. src/components/contact/ContactInfo.astro
processFile('src/components/contact/ContactInfo.astro', (c) => {
    if (!c.includes('import { defaultLocale')) {
        c = c.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].contactPage;\n');
    }
    c = c.replace('"Visit Us"', 'copy.visitUs');
    c = c.replace('"Call Us"', 'copy.callUs');
    c = c.replace('"Email Us"', 'copy.emailUs');
    return c;
});

// 3. src/components/contact/SocialFollow.astro
processFile('src/components/contact/SocialFollow.astro', (c) => {
    if (!c.includes('import { defaultLocale')) {
        c = c.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].contactPage;\n');
    }
    c = c.replace('Follow Us', '{copy.followUs}');
    return c;
});

// 4. src/components/about/AboutHero.astro
processFile('src/components/about/AboutHero.astro', (c) => {
    if (!c.includes('import { defaultLocale')) {
        c = c.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].about;\n');
    }
    c = c.replace('title = "About Our Story",', 'title = copy.heroTitle,');
    c = c.replace('subtitle = "Innovating the way you shop for technology, one device at a time.",', 'subtitle = copy.heroSubtitle,');
    return c;
});

// 5. src/components/about/AboutMission.astro
processFile('src/components/about/AboutMission.astro', (c) => {
    if (!c.includes('import { defaultLocale')) {
        c = c.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].about;\n');
    }
    c = c.replace('Our Mission', '{copy.missionTitle}');
    c = c.replace(/Redefining Premium <br \/> Tech Access/, '{copy.missionHeading}');
    c = c.replace(/Founded in 2024, our e-commerce platform was born from a[\s\S]*?quality and performance\./, '{copy.missionP1}');
    c = c.replace(/We believe that technology shouldn't just be a tool[\s\S]*?advanced\s*mobile devices\./, '{copy.missionP2}');
    c = c.replace(/Our commitment goes beyond selling; we strive to build a[\s\S]*?demand nothing but the\s*best\./, '{copy.missionP3}');
    c = c.replace('Happy Clients', '{copy.happyClients}');
    c = c.replace('Premium Products', '{copy.premiumProducts}');
    return c;
});

// 6. src/components/about/AboutValues.astro
processFile('src/components/about/AboutValues.astro', (c) => {
    if (!c.includes('import { defaultLocale')) {
        c = c.replace('---', '---\nimport { defaultLocale, isLocale, ui } from "../../lib/i18n";\n\nconst pathLocale = Astro.url.pathname.split("/").filter(Boolean)[0];\nconst currentLocale = isLocale(pathLocale) ? pathLocale : defaultLocale;\nconst copy = ui[currentLocale].about;\n');
    }
    c = c.replace('"Uncompromising Quality"', 'copy.value1Title');
    c = c.replace(/"We only partner with brands that meet our rigorous standards for performance, durability, and design\."/, 'copy.value1Desc');
    c = c.replace('"Fast Global Shipping"', 'copy.value2Title');
    c = c.replace(/"State-of-the-art logistics to ensure your premium tech reaches you safely and quickly, anywhere in the world\."/, 'copy.value2Desc');
    c = c.replace('"Expert Support"', 'copy.value3Title');
    c = c.replace(/"Our team of tech specialists is available 24\/7 to help you find the perfect device for your needs\."/, 'copy.value3Desc');
    
    c = c.replace('>Our Values<', '>{copy.valuesTitle}<');
    c = c.replace(/What Drives Us Forward/, '{copy.valuesHeading}');
    return c;
});

