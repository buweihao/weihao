const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Add about and contactPage to English
content = content.replace(
    /        contact: \{/,
    `        about: {
            heroTitle: "About Our Story",
            heroSubtitle: "Innovating the way you shop for premium products.",
            missionTitle: "Our Mission",
            missionHeading: "Redefining Premium Access",
            missionP1: "Founded in 2024, our e-commerce platform was born from a simple idea: making high-end products accessible to everyone who values quality and performance.",
            missionP2: "We believe that the products you use should be an extension of your lifestyle. That's why we meticulously curate every product in our catalog.",
            missionP3: "Our commitment goes beyond selling; we strive to build a community of enthusiasts who demand nothing but the best.",
            happyClients: "Happy Clients",
            premiumProducts: "Premium Products",
            valuesTitle: "Our Values",
            valuesHeading: "What Drives Us Forward",
            value1Title: "Uncompromising Quality",
            value1Desc: "We only partner with brands that meet our rigorous standards for performance, safety, and design.",
            value2Title: "Fast Global Shipping",
            value2Desc: "State-of-the-art logistics to ensure your premium items reach you safely and quickly, anywhere in the world.",
            value3Title: "Expert Support",
            value3Desc: "Our team of specialists is available 24/7 to help you find the perfect products for your needs."
        },
        contactPage: {
            title1: "Get in ",
            title2: "Touch",
            subtitle: "Leave us a message and we will get back to you shortly. Our team is ready to provide personalized advice and guide you through every step of the process.",
            visitUs: "Visit Us",
            callUs: "Call Us",
            emailUs: "Email Us",
            followUs: "Follow Us"
        },
        contact: {`
);

// Add about and contactPage to Chinese
content = content.replace(
    /        contact: \{\n            title: "联系我们",/,
    `        about: {
            heroTitle: "关于我们的故事",
            heroSubtitle: "为您提供最前沿的高端护肤与美妆体验，点亮您的每一次护肤日常。",
            missionTitle: "我们的使命",
            missionHeading: "重新定义高端护肤体验",
            missionP1: "我们平台成立于 2024 年，源于一个简单的想法：让所有看重品质和成效的人，都能轻松获得高端护肤产品。",
            missionP2: "我们相信护肤品不仅是日常工具，更是您自信与美丽的延伸。正因如此，我们精心挑选目录中的每一款产品，把控每一个细节。",
            missionP3: "我们的承诺不仅限于销售；我们致力于建立一个追求极致美学的爱好者社区。",
            happyClients: "满意客户",
            premiumProducts: "精选产品",
            valuesTitle: "我们的价值观",
            valuesHeading: "推动我们前进的动力",
            value1Title: "毫不妥协的品质",
            value1Desc: "我们仅与满足我们对功效、安全性和成分有着严格标准的品牌合作。",
            value2Title: "极速全球物流",
            value2Desc: "最先进的物流体系，确保您的精选护肤品安全快速地送达世界各地。",
            value3Title: "专家级服务",
            value3Desc: "我们的护肤专家团队 24/7 全天候为您服务，帮助您找到最适合您肤质的产品。"
        },
        contactPage: {
            title1: "联系 ",
            title2: "我们",
            subtitle: "给我们留言，我们会尽快回复您。我们的团队随时准备为您提供个性化建议，并在每一个步骤中为您提供指导。",
            visitUs: "我们的地址",
            callUs: "联系电话",
            emailUs: "电子邮件",
            followUs: "关注我们"
        },
        contact: {
            title: "联系我们",`
);

fs.writeFileSync('src/lib/i18n.ts', content, 'utf8');
