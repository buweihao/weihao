const posts = [
  {
    slug: "how-pdrn-supports-skin-renewal",
    date: { en: "July 8, 2026", zh: "2026年7月8日" },
    author: { en: "Skin Research Team", zh: "肌肤研发团队" },
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=85",
    title: { en: "How PDRN Supports a Skin Renewal Routine", zh: "PDRN 如何融入肌肤焕新护理" },
    description: {
      en: "A practical introduction to PDRN skincare, suitable routines, and formulation considerations.",
      zh: "了解 PDRN 护肤的基础原理、适用护理流程与配方选择要点。",
    },
    content: {
      en: `<p>PDRN has become a popular ingredient in professional skincare formulas designed for tired-looking and dry skin. A thoughtful formula combines it with humectants and soothing ingredients instead of relying on a single headline ingredient.</p><h3>Build a balanced routine</h3><p>Use a gentle cleanser first, then apply a hydrating essence or serum. Follow with a moisturizer that helps reduce moisture loss. Daily sunscreen remains essential.</p><h3>Consistency matters</h3><p>Introduce new products gradually and follow the directions provided for each formula. For sensitive skin, a patch test is always recommended.</p>`,
      zh: `<p>PDRN 已成为针对干燥、倦容肌肤的专业护肤配方中备受关注的成分。成熟的产品不会只依赖单一概念，而是会搭配保湿剂与舒缓成分，形成更平衡的配方。</p><h3>建立合理护理流程</h3><p>先使用温和洁面，再使用补水精华或精华液，最后以面霜帮助减少水分流失。白天仍需坚持使用防晒产品。</p><h3>持续使用更重要</h3><p>新产品应逐步加入日常护理，并按照产品说明使用。敏感肌肤建议先进行局部测试。</p>`,
    },
  },
  {
    slug: "inside-a-modern-skincare-factory",
    date: { en: "July 3, 2026", zh: "2026年7月3日" },
    author: { en: "Quality Team", zh: "质量管理团队" },
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=85",
    title: { en: "Inside a Modern Skincare Manufacturing Process", zh: "走进现代护肤品生产流程" },
    description: {
      en: "From incoming materials to filling and inspection, see the controls behind consistent skincare production.",
      zh: "从原料入库到灌装检验，了解稳定护肤品生产背后的质量控制。",
    },
    content: {
      en: `<p>Reliable skincare manufacturing begins before ingredients enter the mixing vessel. Incoming materials are checked against specifications, documented, and stored under controlled conditions.</p><h3>Controlled production</h3><p>During batching, time, temperature, mixing speed, and addition sequence are recorded. These parameters help each batch match the approved standard.</p><h3>Filling and final inspection</h3><p>Packaging compatibility, fill weight, sealing, appearance, and labeling are inspected before finished products are released.</p>`,
      zh: `<p>可靠的护肤品生产在原料进入搅拌设备之前就已经开始。原料需要按照规格进行检验、记录，并在受控条件下储存。</p><h3>受控生产</h3><p>配料过程中会记录时间、温度、搅拌速度和投料顺序，确保每一批产品符合批准的生产标准。</p><h3>灌装与成品检验</h3><p>成品放行前还需检查包材相容性、灌装重量、密封、外观和标签信息。</p>`,
    },
  },
  {
    slug: "choosing-a-hydrating-serum",
    date: { en: "June 26, 2026", zh: "2026年6月26日" },
    author: { en: "Formulation Team", zh: "配方团队" },
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
    title: { en: "How to Choose a Hydrating Serum", zh: "如何选择合适的补水精华" },
    description: {
      en: "Texture, humectants, barrier support, and packaging all matter when comparing hydrating formulas.",
      zh: "比较补水配方时，质地、保湿成分、屏障支持和包装都值得关注。",
    },
    content: {
      en: `<p>A good hydrating serum should fit both the skin type and the rest of the routine. Lightweight textures often suit layered routines, while richer formulas may feel more comfortable in dry environments.</p><h3>Read the complete formula</h3><p>Look beyond one featured ingredient. Humectants attract water, while emollients and barrier-supporting ingredients help skin feel smoother and more comfortable.</p><h3>Consider the packaging</h3><p>Airless pumps and well-designed droppers can improve ease of use and help protect formulas during their intended shelf life.</p>`,
      zh: `<p>好的补水精华需要同时适合肤质和整体护理流程。轻盈质地更适合叠加使用，而在干燥环境中，较滋润的配方可能更加舒适。</p><h3>关注完整配方</h3><p>不要只看某一个明星成分。吸湿剂帮助吸引水分，润肤与屏障支持成分则有助于提升肌肤的柔润舒适感。</p><h3>重视产品包装</h3><p>真空泵和设计合理的滴管更方便使用，也有助于在产品保质期内保护配方。</p>`,
    },
  },
  {
    slug: "private-label-skincare-development",
    date: { en: "June 18, 2026", zh: "2026年6月18日" },
    author: { en: "Product Development Team", zh: "产品开发团队" },
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=85",
    title: { en: "From Concept to Private Label Skincare Product", zh: "从概念到自有品牌护肤产品" },
    description: {
      en: "A clear overview of briefing, sampling, packaging, testing, and production for private label projects.",
      zh: "梳理自有品牌项目从需求、打样、包材、测试到生产的主要环节。",
    },
    content: {
      en: `<p>A successful private label project starts with a focused brief: target customer, product format, texture, key claims, packaging direction, order quantity, and launch schedule.</p><h3>Sampling and evaluation</h3><p>Initial samples help align texture, fragrance, appearance, and application experience. Feedback should be specific so the next sample can be improved efficiently.</p><h3>Prepare for production</h3><p>Formula confirmation, packaging compatibility, artwork review, required testing, and production planning should be completed before the manufacturing slot is confirmed.</p>`,
      zh: `<p>成功的自有品牌项目始于清晰的需求说明，包括目标客户、产品形态、质地、核心卖点、包装方向、订购数量和上市计划。</p><h3>打样与评估</h3><p>初始样品用于确认质地、香型、外观和使用体验。反馈越具体，下一轮样品优化就越高效。</p><h3>进入生产准备</h3><p>在确认生产排期前，需要完成配方确认、包材相容性、设计稿审核、必要测试和生产计划。</p>`,
    },
  },
];

export function getBlogPosts(locale = "en") {
  const lang = locale === "zh" ? "zh" : "en";
  return posts.map((post) => ({
    slug: post.slug,
    image: post.image,
    date: post.date[lang],
    author: post.author[lang],
    title: post.title[lang],
    description: post.description[lang],
    content: post.content[lang],
  }));
}

export const blogPosts = getBlogPosts("en");
