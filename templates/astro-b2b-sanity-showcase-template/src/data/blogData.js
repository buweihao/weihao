const posts = [
  {
    slug: "how-to-evaluate-a-b2b-supplier",
    date: { en: "July 8, 2026", zh: "2026年7月8日" },
    author: { en: "Sourcing Team", zh: "采购团队" },
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
    title: { en: "How to Evaluate a B2B Supplier", zh: "如何评估 B2B 供应商" },
    description: {
      en: "A practical framework for comparing quality systems, capacity, communication, and delivery reliability.",
      zh: "从质量体系、产能、沟通和交付可靠性等方面评估供应商。",
    },
    content: {
      en: `<p>A reliable supplier should be able to explain its process, quality controls, production capacity, and lead-time assumptions clearly.</p><h3>Verify the essentials</h3><p>Review specifications, certifications, sample quality, and change-control procedures before placing a production order.</p><h3>Plan communication</h3><p>Agree on milestones, approval owners, and reporting frequency so issues can be identified early.</p>`,
      zh: `<p>可靠的供应商应能清晰说明生产流程、质量控制、产能和交期依据。</p><h3>核实关键条件</h3><p>正式下单前，应检查产品规格、认证、样品质量和变更控制流程。</p><h3>规划沟通机制</h3><p>提前确认项目节点、审批负责人和汇报频率，以便尽早发现问题。</p>`,
    },
  },
  {
    slug: "from-prototype-to-production",
    date: { en: "July 3, 2026", zh: "2026年7月3日" },
    author: { en: "Product Team", zh: "产品团队" },
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=85",
    title: { en: "From Prototype to Production", zh: "从样品到批量生产" },
    description: {
      en: "Key checkpoints for specifications, samples, packaging, testing, and production approval.",
      zh: "梳理规格、样品、包装、测试和生产批准的关键节点。",
    },
    content: {
      en: `<p>A successful production launch starts with a precise brief covering target users, specifications, packaging, quantity, and schedule.</p><h3>Approve a reference sample</h3><p>Keep an approved sample and documented tolerances as the shared quality reference.</p><h3>Prepare production</h3><p>Complete testing, artwork approval, packaging checks, and material planning before confirming the production slot.</p>`,
      zh: `<p>成功的量产项目始于清晰的需求说明，包括目标用户、规格、包装、数量和时间计划。</p><h3>确认标准样品</h3><p>保留签样并记录允许偏差，作为双方共同的质量参考。</p><h3>做好量产准备</h3><p>确认排产前，应完成测试、设计稿审批、包装检查和物料计划。</p>`,
    },
  },
  {
    slug: "building-a-resilient-supply-chain",
    date: { en: "June 26, 2026", zh: "2026年6月26日" },
    author: { en: "Operations Team", zh: "运营团队" },
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    title: { en: "Building a More Resilient Supply Chain", zh: "构建更稳健的供应链" },
    description: {
      en: "Use forecasting, safety stock, milestone tracking, and supplier visibility to reduce delivery risk.",
      zh: "通过预测、安全库存、节点跟踪和供应商透明度降低交付风险。",
    },
    content: {
      en: `<p>Resilience comes from visibility and preparation rather than excess inventory alone.</p><h3>Share realistic forecasts</h3><p>Rolling forecasts help suppliers reserve materials and capacity while allowing demand to evolve.</p><h3>Track leading indicators</h3><p>Monitor material readiness, inspection results, and shipment bookings instead of waiting for the final delivery date.</p>`,
      zh: `<p>供应链韧性来自透明度和充分准备，而不仅仅是增加库存。</p><h3>共享合理预测</h3><p>滚动预测有助于供应商预留物料和产能，同时适应需求变化。</p><h3>跟踪前置指标</h3><p>应关注物料齐套、检验结果和订舱状态，而不是等到最终交付日期才发现问题。</p>`,
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
