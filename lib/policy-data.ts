import {
  Truck,
  RotateCcw,
  Award,
  ShieldCheck,
  Lock,
  FileText,
  type LucideIcon,
} from "lucide-react";

export type PolicySlug =
  | "delivery-collection"
  | "returns-resizing"
  | "lifetime-warranty"
  | "hallmarking-act"
  | "privacy"
  | "terms";

export interface PolicyData {
  slug: PolicySlug;
  sectionCode: string;
  shortTitle: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  lastUpdated: string;
  icon: LucideIcon;
  summaryPillars: { title: string; desc: string }[];
  content: {
    heading: string;
    body: string;
    subsections?: { title: string; detail: string }[];
    callout?: { type: "note" | "assurance" | "legal"; text: string };
  }[];
}

export const MAISON_POLICIES: Record<PolicySlug, PolicyData> = {
  "delivery-collection": {
    slug: "delivery-collection",
    sectionCode: "POL-01",
    shortTitle: "Delivery & Collection",
    title: "Delivery & Salon Collection Policy",
    eyebrow: "Insured Global Transit & Private Handover",
    subtitle: "Complimentary fully insured worldwide transit, discreet packaging, and private London salon handover.",
    lastUpdated: "September 2024",
    icon: Truck,
    summaryPillars: [
      { title: "Complimentary Royal Mail Special Delivery", desc: "Guaranteed UK next-day by 1pm with mandatory signature." },
      { title: "100% Lloyd's Insured Transit", desc: "Every creation fully protected until client signature is recorded." },
      { title: "Discreet Outer Packaging", desc: "No brand name or jewellery references on external parcels." },
      { title: "Mayfair & Hatton Garden Handover", desc: "Private consultation viewing with diamond loupe inspection." },
    ],
    content: [
      {
        heading: "1. Comprehensive Transit Insurance",
        body: "Every MAH Diamonds creation is fully insured during transit through our comprehensive Lloyd's of London bullion and precious jewellery policy. Responsibility remains entirely with the Maison until you, or your designated recipient, physically sign for the parcel upon delivery.",
        callout: {
          type: "assurance",
          text: "Zero financial risk in transit: In the highly unlikely event of package disruption, MAH will immediately replace the piece or issue an unconditional refund.",
        },
      },
      {
        heading: "2. Discreet & Tamper-Evident Packaging",
        body: "To safeguard surprise proposals and protect valuable milestone creations, all MAH parcels are dispatched in completely discreet, unbranded cardboard security cartons. There is no external mention of 'diamonds', 'jewellery', or 'MAH'. The sender is listed under a discreet corporate entity.",
        subsections: [
          {
            title: "Internal Luxury Presentation",
            detail: "Inside the outer carton sits our signature MAH Midnight Blue presentation case, ribbon-bound with leather care wallet, microfibre polishing cloth, and tamper-evident security seal.",
          },
          {
            title: "Tamper-Evident Security Seal",
            detail: "Each ring box is sealed with a serialized security hologram. If this seal arrives broken or tampered with, do not accept the package and notify our concierge immediately.",
          },
        ],
      },
      {
        heading: "3. Delivery Timescales & Dispatch Protocols",
        body: "Production lead times vary depending on the artisanal nature of your selection:",
        subsections: [
          {
            title: "Ready-to-Wear Pieces & Loose Diamonds",
            detail: "Dispatched within 1 to 2 business days following verified security authentication.",
          },
          {
            title: "Engagement Rings & Made-to-Order Mounts",
            detail: "Hand-set and finished at our London bench within 2 to 3 weeks.",
          },
          {
            title: "Full Bespoke Commissions & Master Atelier Works",
            detail: "Hand-forged over 4 to 6 weeks, accommodating CAD prototypes, wax carving, and London Assay Office hallmarking.",
          },
        ],
      },
      {
        heading: "4. Private Salon Handover (Mayfair & Hatton Garden)",
        body: "Clients residing in or visiting London may elect for private salon collection in lieu of courier delivery. Handover appointments take place in our private Mayfair suite or Hatton Garden atelier.",
        subsections: [
          {
            title: "Salon Verification Protocol",
            detail: "Please bring photographic identification (Passport or Photocard Driving Licence) and the original payment confirmation email.",
          },
          {
            title: "The Handover Experience",
            detail: "Your dedicated diamond specialist will review the GIA/IGI grading report under a 10× triplet loupe, verify laser inscription on the diamond girdle, and provide complimentary initial finger fitting.",
          },
        ],
      },
      {
        heading: "5. International Shipping & Customs Clearance",
        body: "We ship internationally via DHL Express Insured Priority. For international orders, local import duties, VAT, or regional customs tariffs are calculated transparently at checkout or handled via our global customs brokerage to ensure seamless arrival.",
      },
    ],
  },
  "returns-resizing": {
    slug: "returns-resizing",
    sectionCode: "POL-02",
    shortTitle: "Resizing & Returns",
    title: "Resizing & Return Guarantee",
    eyebrow: "Artisanal Precision & Peace of Mind",
    subtitle: "A 30-day grace period with complimentary master goldsmith resizing and transparent return conditions.",
    lastUpdated: "September 2024",
    icon: RotateCcw,
    summaryPillars: [
      { title: "Complimentary 30-Day Resizing", desc: "One expert resize by our Hatton Garden goldsmiths at no cost." },
      { title: "30-Day Returns on Ready Pieces", desc: "Full refund or exchange on unworn catalogue designs." },
      { title: "Free Insured Return Postage", desc: "Prepaid tracked return labels provided for all approved returns." },
      { title: "Bespoke Adjustment Guarantee", desc: "Custom creations tailored to exact ergonomics without compromise." },
    ],
    content: [
      {
        heading: "1. Complimentary 30-Day Ring Resizing",
        body: "We understand that proposing or presenting a gift often involves an estimated finger size. MAH provides one complimentary ring resize within 30 days of initial delivery or salon collection.",
        subsections: [
          {
            title: "Expert Goldsmith Adjustment",
            detail: "Unlike high-street jewellers who stretch metal, our goldsmiths cut, solder with matching fine alloy, and re-burnish by hand, ensuring structural durability and claw tension remain flawless.",
          },
          {
            title: "Standard Adjustment Range",
            detail: "Most solitaire and trilogy rings can be adjusted up or down by 2 full UK finger sizes (e.g. from Size K to M). Beyond this range, our master setter will advise if a new shank is required.",
          },
          {
            title: "Full Eternity Bands Exception",
            detail: "Due to diamonds encircling the entire circumference, full eternity bands cannot be resized. We recommend an initial consultation or sizing band trial prior to engraving.",
          },
        ],
        callout: {
          type: "note",
          text: "Turnaround for complimentary resizing is typically 5 to 7 business days, including final sonic cleaning and inspection.",
        },
      },
      {
        heading: "2. 30-Day Returns for Catalogue Creations",
        body: "We want you to be entirely enamoured with your MAH creation. If a ready-to-wear piece or catalogue engagement ring does not meet your expectations, you may return it within 30 days of delivery for a full refund or exchange.",
        subsections: [
          {
            title: "Condition Requirements",
            detail: "Items must be returned in pristine, unworn condition, in their original presentation box, accompanied by all GIA/IGI laboratory certificates, appraisal documentation, and the unbroken tamper tag.",
          },
          {
            title: "Security Tag Verification",
            detail: "Every piece has a discreet security tag attached. If the tag is removed, cut, or damaged, the piece is deemed accepted and is ineligible for a standard return.",
          },
        ],
      },
      {
        heading: "3. Bespoke Commissions & Personalized Items",
        body: "Pieces created to bespoke specifications, customized designs with client-sourced gemstones, and rings with personal laser engravings are crafted uniquely for the commissioning client and cannot be returned for refund.",
        callout: {
          type: "assurance",
          text: "Our Bespoke Commitment: While bespoke items cannot be refunded, our Lifetime Craftsmanship Warranty and complimentary resizing apply in full. We will work tirelessly to ensure your piece is perfection.",
        },
      },
      {
        heading: "4. Return Procedure & Logistics",
        body: "To initiate a return or resizing adjustment, contact your personal concierge at concierge@mahdiamonds.co.uk. We will issue a return authorization code (RMA) and a prepaid, fully insured Royal Mail / DHL shipping dossier.",
      },
    ],
  },
  "lifetime-warranty": {
    slug: "lifetime-warranty",
    sectionCode: "POL-03",
    shortTitle: "Lifetime Warranty",
    title: "Lifetime Craftsmanship Warranty",
    eyebrow: "Our Enduring Promise of British Excellence",
    subtitle: "Enduring protection against manufacturing defects, complimentary annual servicing, and diamond security checks.",
    lastUpdated: "September 2024",
    icon: Award,
    summaryPillars: [
      { title: "Lifetime Manufacturing Warranty", desc: "Guaranteed structural integrity for the lifetime of your creation." },
      { title: "Complimentary Annual Servicing", desc: "Claw tightening, ultrasonic cleansing, and gemstone inspection." },
      { title: "Free Rhodium Plating for Life", desc: "Annual mirror-finish plating for all 18ct White Gold rings." },
      { title: "Dedicated Hatton Garden Atelier", desc: "Expert bench repairs at preferential client rates for accidental damage." },
    ],
    content: [
      {
        heading: "1. Scope of Lifetime Guarantee",
        body: "Every piece bearing the MAH sponsor's mark is crafted by master artisans according to the highest standards of British goldsmithing. We guarantee that your jewellery is free from structural defects in materials and craftsmanship for life.",
        subsections: [
          {
            title: "What Is Covered",
            detail: "Claw failure, solder seam fracturing, porosity defects in platinum or gold castings, and mounting integrity under normal wear conditions.",
          },
          {
            title: "Gemstone Integrity",
            detail: "Should a centre stone become loose due to a collet manufacturing flaw, we will tighten and secure it immediately at our expense.",
          },
        ],
      },
      {
        heading: "2. Complimentary Annual Salon Servicing",
        body: "Fine jewellery requires periodic care to retain its structural strength and brilliance. All MAH clients are entitled to complimentary annual servicing at our London salons or via insured transit:",
        subsections: [
          {
            title: "Microscope Claw Inspection",
            detail: "Our setter inspects every prong under 20× magnification to ensure diamonds remain firmly seated and claws have not thinned from contact.",
          },
          {
            title: "Ultrasonic & Steam Purification",
            detail: "Removes microscopic oils, lotions, and daily dust from behind the diamond pavilion, restoring maximum light refraction.",
          },
          {
            title: "Rhodium Refinishing (18ct White Gold)",
            detail: "Complimentary annual re-dipping in high-grade liquid rhodium to maintain vibrant, silvery-white lustre.",
          },
        ],
      },
      {
        heading: "3. Wear & Tear, Accidents & Third-Party Work",
        body: "Fine jewellery is durable yet precious. The warranty does not cover accidental trauma (such as dropping, impact with hard surfaces, or gym contact), loss, theft, or wear and tear resulting from sports.",
        callout: {
          type: "legal",
          text: "Important Condition: Having work, resizing, or repair conducted by an unauthorized jeweller or high-street repairer voids the MAH Lifetime Warranty.",
        },
      },
      {
        heading: "4. Loss Prevention & Insurance Valuation",
        body: "We provide an official Insurance Valuation Dossier with every piece, updated every 2 years upon request to reflect prevailing precious metal and diamond market values.",
      },
    ],
  },
  "hallmarking-act": {
    slug: "hallmarking-act",
    sectionCode: "POL-04",
    shortTitle: "British Hallmarking Act",
    title: "British Hallmarking Act 1973 Compliance",
    eyebrow: "Independent Statutory Purity Assurance",
    subtitle: "Official precious metal verification by the London Assay Office at Goldsmiths' Hall since 1300 AD.",
    lastUpdated: "September 2024",
    icon: ShieldCheck,
    summaryPillars: [
      { title: "London Assay Office Mark", desc: "The historic Leopard's Head of Goldsmiths' Hall struck on every piece." },
      { title: "Official Sponsor's Mark: MAH", desc: "Registered unique maker's hallmark identifying the Maison." },
      { title: "Statutory Fineness Standards", desc: ".950 Platinum, 750 (18ct) Gold verified through chemical assay." },
      { title: "British Hallmarking Act 1973", desc: "Full adherence to UK statutory consumer protection laws." },
    ],
    content: [
      {
        heading: "1. The British Hallmarking Tradition",
        body: "Under the British Hallmarking Act 1973, it is an offence to describe any article as being wholly or partly made of gold, silver, platinum or palladium unless it has been independently tested and hallmarked by one of the four statutory UK Assay Offices.",
        subsections: [
          {
            title: "The Role of Goldsmiths' Hall",
            detail: "All MAH creations are sent directly to the London Assay Office at Goldsmiths' Hall, which has continuously tested precious metals since the year 1300 under royal charter.",
          },
          {
            title: "Independent Protection",
            detail: "A hallmark cannot be self-certified by a jeweller. It is struck only after laboratory cupellation or X-ray fluorescence tests confirm exact alloy composition.",
          },
        ],
      },
      {
        heading: "2. The Anatomy of an MAH Hallmark",
        body: "When examining the inner shank of your MAH ring through a 10× loupe, you will observe the official 5-part hallmark suite:",
        subsections: [
          {
            title: "1. Sponsor's Mark (MAH)",
            detail: "The distinctive initials of MAH Diamonds in a customized punch shield, legally registered with the Worshipful Company of Goldsmiths.",
          },
          {
            title: "2. Standard Mark",
            detail: "Illustrates the metal category: a crown for Gold, or the Orb of state for Platinum.",
          },
          {
            title: "3. Fineness Mark (Milliemes)",
            detail: "Specifies precious metal purity out of 1000 parts: '950' for 95% Pure Platinum; '750' for 18ct Gold (75% Pure Gold).",
          },
          {
            title: "4. Assay Office Mark",
            detail: "The iconic Leopard's Head, the historic hallmark of the City of London.",
          },
          {
            title: "5. Date Letter",
            detail: "A specific letter identifying the exact calendar year of creation and assay stamping.",
          },
        ],
      },
      {
        heading: "3. Approved Dealer's Notice",
        body: "As a registered British precious jewellery house, MAH displays the statutory British Hallmarking Council Dealer's Notice across our online portals and physical London salons.",
        callout: {
          type: "note",
          text: "Clients may request a macro-photographic certificate of their hallmark alongside their GIA/IGI laboratory certificate.",
        },
      },
    ],
  },
  "privacy": {
    slug: "privacy",
    sectionCode: "POL-05",
    shortTitle: "Privacy Charter",
    title: "Client Privacy & Discretion Charter",
    eyebrow: "Confidentiality, Discretion & Data Protection",
    subtitle: "Uncompromising standards of personal discretion and full UK GDPR & Data Protection Act 2018 compliance.",
    lastUpdated: "September 2024",
    icon: Lock,
    summaryPillars: [
      { title: "Surprise Proposal Discretion", desc: "Private consultation notes and secret contact channels respected." },
      { title: "Zero Third-Party Data Sharing", desc: "Your client data is never sold, traded, or shared with brokers." },
      { title: "Bank-Grade Encryption", desc: "All client vault dossiers protected under 256-bit AES encryption." },
      { title: "UK GDPR Compliance", desc: "Complete transparency and right to erasure at any moment." },
    ],
    content: [
      {
        heading: "1. Our Commitment to Total Discretion",
        body: "We understand that acquiring an engagement ring, wedding band, or surprise anniversary creation is one of the most personal moments of your life. Discretion is the cornerstone of the Maison. We ensure that communications, delivery notices, and appointment reminders never inadvertently spoil your momentous surprise.",
        subsections: [
          {
            title: "Dedicated Contact Instructions",
            detail: "Clients may specify alternative email addresses, SMS-only verification, or request that no phone calls be placed to certain numbers.",
          },
          {
            title: "Encrypted Digital Dossiers",
            detail: "Saved designs, diamond preferences, and finger sizes stored in your private Client Vault are protected by bank-grade security protocols.",
          },
        ],
      },
      {
        heading: "2. Information We Collect & Why",
        body: "We collect only data necessary to craft your jewellery, fulfill insured logistics, and provide lifelong aftercare:",
        subsections: [
          {
            title: "Transactional Details",
            detail: "Name, delivery address, billing address, and contact telephone for courier delivery and verification.",
          },
          {
            title: "Jewellery Specifications",
            detail: "Finger sizes, alloy preferences, diamond certificates, and engraving inscriptions to maintain your creation's lifetime service log.",
          },
          {
            title: "No Stored Card Data",
            detail: "We never store raw payment card numbers or CVV codes. All payments are processed through tokenized, Level-1 PCI-DSS banking partners.",
          },
        ],
      },
      {
        heading: "3. Third-Party Sharing Principles",
        body: "We do not sell, rent, or trade your personal information to third-party marketing companies, advertisers, or data brokers. Information is shared strictly with essential partners required to fulfill your order:",
        subsections: [
          {
            title: "Insured Couriers (Royal Mail / DHL)",
            detail: "Only name, delivery address, and delivery tracking phone number.",
          },
          {
            title: "Assay & Gemological Institutes (GIA, IGI, London Assay Office)",
            detail: "Gemstone specifications only; no personal client data is ever transmitted to grading laboratories.",
          },
        ],
      },
      {
        heading: "4. Your Rights Under UK GDPR",
        body: "You have full rights to request access to, rectify, or request permanent deletion of your client records. Contact our data compliance officer at privacy@mahdiamonds.co.uk.",
      },
    ],
  },
  "terms": {
    slug: "terms",
    sectionCode: "POL-06",
    shortTitle: "Terms of Sale",
    title: "Terms & Conditions of Sale",
    eyebrow: "Dignified, Transparent Legal Governance",
    subtitle: "Terms governing acquisitions, diamond reservations, bespoke commissions, and high-value verification.",
    lastUpdated: "September 2024",
    icon: FileText,
    summaryPillars: [
      { title: "Transparent Pricing & VAT", desc: "All UK prices inclusive of statutory 20% VAT with no hidden costs." },
      { title: "Live Diamond Reservation", desc: "Certified diamonds secured upon confirmed deposit or order receipt." },
      { title: "Statutory High-Value AML Compliance", desc: "Independent verification for high-value milestone transactions." },
      { title: "Governing Law", desc: "Governed by and construed under the laws of England & Wales." },
    ],
    content: [
      {
        heading: "1. Order Acceptance & Contract Formation",
        body: "All orders placed through the MAH Diamonds website, via phone, or during a salon appointment are subject to acceptance by the Maison. Upon submitting an order, you will receive an acknowledgement email. The contract between you and MAH Diamonds is formed only when we confirm verified payment and dispatch your creation (or issue a bespoke commission agreement).",
      },
      {
        heading: "2. Diamond Availability & Live Market Pricing",
        body: "Our diamond inventory links directly to verified world bourses and our London vaults. While inventory feeds update in real time, in the rare event that a selected stone has been simultaneously acquired on an international exchange or contains a typographical pricing error:",
        subsections: [
          {
            title: "Priority Sourcing",
            detail: "Our gemological team will present an alternative diamond of equal or superior 4Cs specifications at no additional cost.",
          },
          {
            title: "Right of Cancellation",
            detail: "If the proposed alternative is not to your satisfaction, you may cancel with an immediate 100% refund.",
          },
        ],
      },
      {
        heading: "3. High-Value Verification & AML Regulations",
        body: "In compliance with the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017 and UK High-Value Dealer guidelines, transactions exceeding statutory thresholds may undergo secure identity confirmation prior to dispatch.",
        callout: {
          type: "note",
          text: "Verification is discreet, swift, and conducted through encrypted biometric document checks. Your order remains securely reserved throughout.",
        },
      },
      {
        heading: "4. Bespoke Commissions & Deposits",
        body: "Bespoke projects require a 50% non-refundable deposit upon final CAD blueprint and gemstone sign-off, which secures workshop bench time and precious alloy casting. The remaining 50% balance is payable prior to dispatch or salon handover.",
      },
      {
        heading: "5. Intellectual Property & Original Designs",
        body: "All jewellery designs, proprietary setting architectures, CAD renderings, photographic assets, and the MAH brand crest remain the exclusive intellectual property of MAH Diamonds. Unauthorized replication is strictly prohibited.",
      },
      {
        heading: "6. Governing Law & Jurisdiction",
        body: "These terms and conditions are governed by and construed in accordance with English law. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the Courts of England and Wales.",
      },
    ],
  },
};
