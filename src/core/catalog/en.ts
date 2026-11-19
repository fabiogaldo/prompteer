/**
 * English Prompt Catalog (v1.0 MVP)
 * 3 Categories x 2 Objectives each = 6 total objectives.
 * Pure TypeScript only — Zero dependencies on React, Next.js, or DOM APIs.
 */

import { Category } from '../types';

export const CATALOG_EN: Category[] = [
  {
    id: 'corporate',
    title: 'Corporate & Workplace',
    description: 'Internal announcements, workplace communications, and team hiring posts.',
    icon: 'Briefcase',
    exampleUseCases: [
      'Holiday schedule notices',
      'Job opening posts',
      'Team process updates',
    ],
    objectives: [
      {
        id: 'holiday-announcement',
        categoryId: 'corporate',
        title: 'Holiday / Schedule Announcement',
        description: 'Communicate upcoming company holidays, office closures, or bridged long weekends clearly.',
        outputPreviewSnippet:
          'Subject: Notice: Office Closure & Holiday Schedule for [HOLIDAY]\n\nDear Team,\n\nPlease note our office will be closed on Friday, Nov 27...\nFor critical emergencies, please reach out to...',
        recommendedAgent: 'claude',
        recommendedAgentReason:
          'Claude excels at structured corporate announcements with nuanced workplace etiquette and clear instructions.',
        defaultTone: 'formal',
        fields: [
          {
            id: 'holidayName',
            label: 'Holiday or Occasion Name',
            placeholder: 'e.g., Thanksgiving Holiday Weekend, Year-End Closure',
            description: 'The specific holiday, event, or reason for schedule adjustment.',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT HOLIDAY OR OCCASION]',
          },
          {
            id: 'dates',
            label: 'Closure Dates & Adjusted Hours',
            placeholder: 'e.g., Friday, Nov 27 through Monday, Nov 30 (Reopening Tuesday, Dec 1 at 9:00 AM)',
            description: 'Exact dates the office is closed and when normal operations resume.',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT DATES & OPERATING HOURS]',
          },
          {
            id: 'urgentContact',
            label: 'Emergency or On-Call Contact Instructions',
            placeholder: 'e.g., For critical server issues, reach the DevOps rotation at pager@company.com',
            description: 'Optional escalation route for urgent matters during the closure.',
            type: 'textarea',
            required: false,
            fallbackPlaceholder: '[INSERT EMERGENCY CONTACT OR ON-CALL ESCALATION PATH]',
          },
        ],
        template: (values) => {
          return [
            `You are an experienced Internal Communications Director writing an official workplace announcement for all company staff.`,
            ``,
            `### OBJECTIVE`,
            `Draft a clear, professional, and well-structured company-wide announcement regarding an upcoming holiday schedule and office closure.`,
            ``,
            `### CONTEXT & SPECIFICATIONS`,
            `- Holiday / Occasion: ${values.holidayName}`,
            `- Schedule & Closure Dates: ${values.dates}`,
            `- Urgent / Escalation Procedures: ${values.urgentContact}`,
            ``,
            `### DELIVERABLES`,
            `Provide:`,
            `1. A professional Email Subject Line (concise and easy to spot in an inbox).`,
            `2. The Main Announcement Body (structured with clear headers or bullet points for key dates).`,
            `3. A Quick Checklist of reminders for staff before logging off (e.g., setting out-of-office autoreponders, client handoffs).`,
          ].join('\n');
        },
      },
      {
        id: 'job-opening',
        categoryId: 'corporate',
        title: 'Job Opening Post',
        description: 'Create an engaging social media post (LinkedIn, Twitter/X, or community groups) for an open role.',
        outputPreviewSnippet:
          "🚀 We're hiring: Senior Product Designer!\n\nAre you passionate about intuitive UX? Join our fast-growing team...\n\nKey Qualifications:\n• 5+ years design experience\n• Experience with Design Systems\n\nApply here: [LINK]",
        recommendedAgent: 'chatgpt',
        recommendedAgentReason:
          'ChatGPT produces compelling social hooks, clean formatting, and persuasive candidate-facing copy.',
        defaultTone: 'persuasive',
        fields: [
          {
            id: 'roleTitle',
            label: 'Role Title & Department',
            placeholder: 'e.g., Senior Frontend Engineer, Product Engineering',
            description: 'The job title and team hiring the position.',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT ROLE TITLE & DEPARTMENT]',
          },
          {
            id: 'keyHighlights',
            label: 'Key Responsibilities & Qualifications',
            placeholder: 'e.g., 4+ yrs React/TypeScript, remote-first team, competitive salary & equity',
            description: 'Top requirements, responsibilities, or perks that make the role attractive.',
            type: 'textarea',
            required: true,
            fallbackPlaceholder: '[INSERT KEY QUALIFICATIONS, RESPONSIBILITIES & PERKS]',
          },
          {
            id: 'applyLink',
            label: 'Application Instructions or Contact',
            placeholder: 'e.g., Apply at company.com/careers/designer or send a DM with your portfolio',
            description: 'Call to action for interested candidates.',
            type: 'text',
            required: false,
            fallbackPlaceholder: '[INSERT APPLICATION LINK OR RECRUITER CONTACT]',
          },
        ],
        template: (values) => {
          return [
            `You are a top Talent Acquisition and Employer Branding Specialist crafting a high-impact hiring post for social channels (LinkedIn, X, and professional forums).`,
            ``,
            `### OBJECTIVE`,
            `Write an engaging, high-conversion job announcement post designed to attract qualified candidates.`,
            ``,
            `### ROLE DETAILS`,
            `- Role Title & Team: ${values.roleTitle}`,
            `- Core Qualifications & Highlights: ${values.keyHighlights}`,
            `- Application Instructions: ${values.applyLink}`,
            ``,
            `### DELIVERABLES`,
            `Provide:`,
            `1. A catchy opening hook that grabs attention within the first two lines.`,
            `2. A concise summary of why this role matters and what makes the team unique.`,
            `3. Scannable bullet points for qualifications and benefits.`,
            `4. A clear call to action and relevant hashtags for visibility.`,
          ].join('\n');
        },
      },
    ],
  },
  {
    id: 'sales',
    title: 'Sales & Freelance',
    description: 'Classified marketplace ads, freelance service pitches, and client proposals.',
    icon: 'ShoppingBag',
    exampleUseCases: [
      'Product marketplace listings',
      'Freelance cold outreach pitches',
      'Client proposal teasers',
    ],
    objectives: [
      {
        id: 'product-listing',
        categoryId: 'sales',
        title: 'Product Listing Ad',
        description: 'Generate high-converting listing copy for eBay, Facebook Marketplace, or handmade goods.',
        outputPreviewSnippet:
          '✨ 2021 MacBook Pro 14" (M1 Pro, 16GB RAM, 512GB SSD) — Excellent Condition ✨\n\nUp for sale is a gently used MacBook Pro in flawless working condition. Battery health is 92%...\nPrice: $1,150 OBO. Local pickup in Seattle or tracked shipping.',
        recommendedAgent: 'perplexity',
        recommendedAgentReason:
          'Perplexity accurately synthesizes real-world market specs, comparative pricing, and feature highlights.',
        defaultTone: 'persuasive',
        fields: [
          {
            id: 'itemTitle',
            label: 'Item Name, Brand & Condition',
            placeholder: 'e.g., Sony WH-1000XM4 Noise-Cancelling Headphones, Like New with original case',
            description: 'Exact product name, brand, model, and physical condition.',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT ITEM NAME, MODEL & CONDITION]',
          },
          {
            id: 'keyFeatures',
            label: 'Key Specifications, Accessories & Flaws',
            placeholder: 'e.g., Includes USB-C cable and audio jack. Minor scuff on left headband. Battery lasts 30h.',
            description: 'Specs, included items, and any cosmetic or functional flaws.',
            type: 'textarea',
            required: true,
            fallbackPlaceholder: '[INSERT KEY SPECIFICATIONS, ACCESSORIES & KNOWN DEFECTS]',
          },
          {
            id: 'priceAndLocation',
            label: 'Price, Payment & Pickup/Shipping Terms',
            placeholder: 'e.g., $180 cash or Venmo. Local pickup in downtown Austin or buyer pays $10 shipping.',
            description: 'Asking price, flexibility (e.g. OBO), and transaction preferences.',
            type: 'text',
            required: false,
            fallbackPlaceholder: '[INSERT ASKING PRICE, PAYMENT METHODS & PICKUP/SHIPPING TERMS]',
          },
        ],
        template: (values) => {
          return [
            `You are a top marketplace copywriter crafting an honest, transparent, and high-converting classified listing for platforms like eBay, Facebook Marketplace, and Craigslist.`,
            ``,
            `### OBJECTIVE`,
            `Create a compelling, detailed product advertisement that builds buyer trust, accurately describes the item, and answers common buyer questions upfront.`,
            ``,
            `### ITEM DETAILS`,
            `- Item & Condition: ${values.itemTitle}`,
            `- Specifications & Included Items: ${values.keyFeatures}`,
            `- Pricing & Logistics: ${values.priceAndLocation}`,
            ``,
            `### DELIVERABLES`,
            `Provide:`,
            `1. A search-optimized Listing Title including brand, model, and condition keywords.`,
            `2. A transparent Product Overview describing condition, usage history, and included accessories.`,
            `3. A Bulleted Specs section formatted for quick mobile scanning.`,
            `4. Clear Transaction Terms (pricing, payment methods, local pickup safety, and shipping policy).`,
          ].join('\n');
        },
      },
      {
        id: 'freelance-pitch',
        categoryId: 'sales',
        title: 'Freelance Service Pitch',
        description: 'Craft an outreach message or pitch for potential clients via LinkedIn, email, or WhatsApp.',
        outputPreviewSnippet:
          'Hi Sarah,\n\nI noticed your Shopify store recently launched a new apparel collection—congrats!\n\nI specialize in optimizing checkout page speed and reducing cart abandonment for direct-to-consumer brands. Recently, I helped a similar brand boost mobile conversions by 22%...',
        recommendedAgent: 'claude',
        recommendedAgentReason:
          'Claude crafts empathetic, tailored client outreach that demonstrates genuine value without sounding spammy.',
        defaultTone: 'friendly',
        fields: [
          {
            id: 'serviceType',
            label: 'Service or Expertise Offered',
            placeholder: 'e.g., Web performance optimization & mobile speed audits for Shopify stores',
            description: 'What service, problem resolution, or specialized skill do you provide?',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT SPECIALIZED SERVICE OR SKILL]',
          },
          {
            id: 'targetClient',
            label: 'Target Client, Industry, or Prospect Name',
            placeholder: 'e.g., Founder or Head of E-commerce at emerging apparel brands',
            description: 'Who is this message addressed to, and what industry are they in?',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT PROSPECT NAME OR TARGET NICHE]',
          },
          {
            id: 'portfolioOrResults',
            label: 'Past Results, Metric Proof, or Portfolio',
            placeholder: 'e.g., Cut page load times by 40% for 3 DTC brands; portfolio at myportfolio.dev',
            description: 'Tangible proof, metric wins, or client testimonials.',
            type: 'textarea',
            required: false,
            fallbackPlaceholder: '[INSERT QUANTIFIABLE RESULTS, CASE STUDIES OR PORTFOLIO LINK]',
          },
        ],
        template: (values) => {
          return [
            `You are an elite freelance consultant and sales strategist writing a personalized, high-response outreach message to a prospective client.`,
            ``,
            `### OBJECTIVE`,
            `Write an effective, value-first pitch that sparks a low-friction conversation without feeling like aggressive sales spam.`,
            ``,
            `### PITCH CONTEXT`,
            `- Core Service Offered: ${values.serviceType}`,
            `- Target Client / Industry: ${values.targetClient}`,
            `- Social Proof & Results: ${values.portfolioOrResults}`,
            ``,
            `### DELIVERABLES`,
            `Provide:`,
            `1. A warm, observation-based opening line that proves this is not a generic mass template.`,
            `2. A concise value proposition linking the service to direct business impact (e.g., saved hours, higher revenue).`,
            `3. A frictionless Call to Action (e.g., offering a 2-minute audit or asking a specific question, rather than demanding a 30-minute sales call).`,
            `4. A 1-sentence follow-up reminder version suitable for LinkedIn or WhatsApp.`,
          ].join('\n');
        },
      },
    ],
  },
  {
    id: 'visuals',
    title: 'Visuals, Invites & Campaigns',
    description: 'Event invitations, social media campaign banners, and visual generative AI prompts.',
    icon: 'Palette',
    exampleUseCases: [
      'Event & birthday invitations',
      'Promotional campaign banners',
      'Generative image prompt pairs',
    ],
    objectives: [
      {
        id: 'event-invitation',
        categoryId: 'visuals',
        title: 'Event / Birthday Invitation',
        description: 'Generate both party invitation copy and a matching AI image prompt for invitation graphics.',
        outputPreviewSnippet:
          "🎉 You're Invited: Lucas's 30th Neon Retro Fiesta! 🎉\n\nJoin us for an unforgettable night of synthwave, retro cocktails, and arcade classics.\n📅 Date: Saturday, Oct 14 at 8:00 PM\n📍 Location: The Electric Warehouse\n\n[IMAGE PROMPT]: A vibrant 1980s retro-futuristic invitation banner with glowing neon typography...",
        recommendedAgent: 'gemini',
        recommendedAgentReason:
          'Gemini handles multimodal generation and visual design prompts exceptionally well.',
        defaultTone: 'friendly',
        fields: [
          {
            id: 'eventName',
            label: 'Event Name & Theme',
            placeholder: 'e.g., Maya\'s 10th Birthday: Enchanted Forest Adventure',
            description: 'Title of the event and the aesthetic or party theme.',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT EVENT NAME & THEME]',
          },
          {
            id: 'eventDetails',
            label: 'Date, Time, Location & Dress Code',
            placeholder: 'e.g., Sunday, June 18 at 2 PM, Riverview Community Park, fairy wings or green clothes',
            description: 'Essential logistics for guests.',
            type: 'textarea',
            required: true,
            fallbackPlaceholder: '[INSERT DATE, TIME, LOCATION & DRESS CODE]',
          },
          {
            id: 'rsvpInfo',
            label: 'RSVP Deadline & Contact Details',
            placeholder: 'e.g., RSVP by June 10 via text to David at 555-0143',
            description: 'How and when guests should confirm attendance.',
            type: 'text',
            required: false,
            fallbackPlaceholder: '[INSERT RSVP DEADLINE & CONTACT DETAILS]',
          },
        ],
        template: (values) => {
          return [
            `You are an event planner and creative director crafting a two-part event package: an engaging invitation message AND an AI image generation prompt for the invitation graphic.`,
            ``,
            `### OBJECTIVE`,
            `Deliver warm, exciting invitation text suitable for digital messaging (WhatsApp, Paperless Post, or Instagram) plus an accompanying Midjourney / DALL-E / Imagen prompt.`,
            ``,
            `### EVENT DETAILS`,
            `- Event & Theme: ${values.eventName}`,
            `- Logistics & Schedule: ${values.eventDetails}`,
            `- RSVP Instructions: ${values.rsvpInfo}`,
            ``,
            `### DELIVERABLES`,
            `Provide:`,
            `1. The Invitation Copy: A catchy header, welcoming message, bulleted logistics, and clear RSVP notice.`,
            `2. The Image Generation Prompt: A descriptive, style-guided prompt (including lighting, composition, color palette, and mood) tailored for AI image generators to create the banner background.`,
          ].join('\n');
        },
      },
      {
        id: 'campaign-banner',
        categoryId: 'visuals',
        title: 'Promotional / NGO Campaign Banner',
        description: 'Create headline copy, body messaging, and visual art direction for cause or promotional campaigns.',
        outputPreviewSnippet:
          'Campaign Headline: "Every Seed We Plant Protects Tomorrow."\n\nSupport our community reforestation mission. Over 5,000 native trees planted across our watershed...\n\n[IMAGE PROMPT]: Wide panoramic photograph of diverse community volunteers planting native seedlings at golden hour...',
        recommendedAgent: 'gemini',
        recommendedAgentReason:
          'Gemini provides powerful conceptual visual prompts alongside impactful copy.',
        defaultTone: 'persuasive',
        fields: [
          {
            id: 'campaignTopic',
            label: 'Campaign Cause or Promotional Theme',
            placeholder: 'e.g., Clean Oceans Beach Cleanup & Plastic Recycling Drive',
            description: 'The core mission, product launch, or charity cause.',
            type: 'text',
            required: true,
            fallbackPlaceholder: '[INSERT CAMPAIGN CAUSE OR THEME]',
          },
          {
            id: 'coreMessage',
            label: 'Core Message or Primary Call to Action',
            placeholder: 'e.g., Join our Saturday volunteer drive or sponsor 10kg of ocean plastic removal for $15',
            description: 'What do you want the audience to do or believe?',
            type: 'textarea',
            required: true,
            fallbackPlaceholder: '[INSERT CORE MESSAGE & PRIMARY CALL TO ACTION]',
          },
          {
            id: 'visualStyle',
            label: 'Desired Visual Aesthetic or Art Direction',
            placeholder: 'e.g., High-contrast documentary photography, coastal golden hour light, hopeful and inspiring',
            description: 'Desired mood, colors, or visual style for the campaign artwork.',
            type: 'text',
            required: false,
            fallbackPlaceholder: '[INSERT DESIRED VISUAL AESTHETIC & ART DIRECTION]',
          },
        ],
        template: (values) => {
          return [
            `You are a Creative Director at an award-winning campaign agency developing a complete campaign banner asset pack for digital advertising and social advocacy.`,
            ``,
            `### OBJECTIVE`,
            `Deliver high-impact marketing and advocacy copy paired with a professional visual layout directive and AI image generation prompt.`,
            ``,
            `### CAMPAIGN SPECIFICATIONS`,
            `- Campaign Topic / Cause: ${values.campaignTopic}`,
            `- Core Message & Action: ${values.coreMessage}`,
            `- Visual Style / Aesthetic: ${values.visualStyle}`,
            ``,
            `### DELIVERABLES`,
            `Provide:`,
            `1. Three Headline Variations: (A) Direct & Urgent, (B) Emotional & Story-driven, (C) Action-Oriented.`,
            `2. Supporting Sub-copy (2-3 punchy sentences summarizing the initiative and value).`,
            `3. Call-to-Action (CTA) Button Text options.`,
            `4. Complete AI Image Generator Prompt: Detailed photographic/illustrative prompt specifying framing, focal length, lighting, color harmony, and mood.`,
          ].join('\n');
        },
      },
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATALOG_EN.find((category) => category.id === id);
}

export function getObjectiveById(categoryId: string, objectiveId: string) {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  return category.objectives.find((obj) => obj.id === objectiveId);
}
