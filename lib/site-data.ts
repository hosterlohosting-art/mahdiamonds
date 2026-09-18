export const primaryNavigation = [
  { label: "Engagement Rings", href: "/engagement-rings" },
  { label: "Wedding Rings", href: "/wedding-rings" },
  { label: "Diamonds", href: "/diamonds" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "MAH Bespoke", href: "/bespoke" },
  { label: "The Atelier", href: "/atelier" },
  { label: "Our House", href: "/our-house" },
];

export type RoutePage = {
  section: string;
  eyebrow: string;
  title: string;
  intro: string;
  dark?: boolean;
  steps?: string[];
  modules: { title: string; body: string; href?: string; cta?: string }[];
  notice?: string;
};

const contentModule = (title: string, body: string, href?: string, cta?: string) => ({ title, body, href, cta });

export const routePages: Record<string, RoutePage> = {
  "engagement-rings": {
    section: "05A", eyebrow: "Engagement rings", title: "The beginning of your forever.",
    intro: "Discover a setting first, then continue into a guided journey to choose the compatible centre diamond.",
    modules: [contentModule("Choose a ring setting", "Browse by style, compatible shape, metal and design attributes once the approved catalogue is connected.", "/engagement-rings/configure", "Explore the journey"), contentModule("Begin with a diamond", "Start with the stone and return to compatible settings.", "/diamonds/search", "Discover diamonds"), contentModule("A personal conversation", "For guidance or a bespoke direction, begin with an MAH expert.", "/appointments", "Book an appointment")],
    notice: "Products, imagery, prices, availability and lead times will come from MAH's approved catalogue.",
  },
  "engagement-rings/configure": {
    section: "05B", eyebrow: "Ring configuration", title: "Shape a setting around your choice.",
    intro: "A guided foundation for shape, metal, setting options and ring size, with compatibility preserved throughout.",
    steps: ["Setting", "Diamond", "Ring size", "Review"],
    modules: [contentModule("Setting options", "Only valid options for the selected design will appear."), contentModule("Select a diamond", "Natural and lab-grown stones share one inventory search filtered for compatibility.", "/engagement-rings/diamonds", "Continue to diamonds"), contentModule("Need guidance?", "Size guidance and expert appointments remain accessible.", "/expert", "Speak to an expert")],
    notice: "No illustrative setting prices or options have been hard-coded.",
  },
  "engagement-rings/diamonds": {
    section: "05C", eyebrow: "Diamond selection", title: "Compare with confidence.",
    intro: "A focused selection experience for compatible natural and lab-grown diamonds that preserves the ring configuration.",
    steps: ["Ring saved", "Choose type", "Filter", "Compare up to three", "Select"],
    modules: [contentModule("Primary filters", "Price, carat, colour, clarity and cut will respond to live inventory."), contentModule("Advanced detail", "Additional criteria appear only when the inventory feed supplies them."), contentModule("One inventory", "Ring and loose-diamond journeys share one underlying search system.")],
    notice: "Specifications, laboratories, certificates, prices and availability require MAH's live data source.",
  },
  "engagement-rings/review": {
    section: "05D", eyebrow: "Complete ring", title: "Review every considered detail.",
    intro: "The final review keeps setting, selected diamond and ring size clearly separated before showing a complete total.",
    steps: ["Setting", "Diamond", "Ring size", "Complete price"],
    modules: [contentModule("Edit without starting over", "Return to any stage while preserving other valid selections."), contentModule("Availability revalidation", "The selected stone is checked again before entering the bag."), contentModule("A clear next step", "Add Complete Ring to Bag appears only when all selections are complete.", "/bag", "View bag foundation")],
    notice: "Pricing and lead-time language remains absent until MAH confirms its rules.",
  },
  "wedding-rings": {
    section: "10A", eyebrow: "Wedding rings", title: "Made to mark a promise.",
    intro: "A collection foundation for women's, men's, diamond, plain and bespoke wedding-ring journeys.",
    modules: [contentModule("Wedding ring collection", "Filters will be driven by the approved catalogue.", "/wedding-rings/product", "View product foundation"), contentModule("Bespoke wedding rings", "Bespoke routes into a commission rather than standard shopping.", "/bespoke", "Explore bespoke"), contentModule("Shared checkout", "Every purchasable piece uses one bag and checkout system.")],
    notice: "No demonstration products, metals, prices or delivery wording are shown as live information.",
  },
  "wedding-rings/product": {
    section: "10B", eyebrow: "Wedding ring detail", title: "A clear place to make it yours.",
    intro: "A reusable product foundation supporting only options valid for each wedding ring.",
    steps: ["Choose options", "Confirm availability", "Add to bag"],
    modules: [contentModule("Product gallery", "Approved imagery and media controls appear according to available assets."), contentModule("Configurable options", "Price, image, SKU and availability update for meaningful variants."), contentModule("Client guidance", "Expert guidance and bespoke remain accessible.", "/expert", "Speak to an expert")],
    notice: "Product details, craftsmanship, delivery and care copy await approval.",
  },
  diamonds: {
    section: "11A", eyebrow: "Diamonds", title: "Choose with clarity and confidence.", dark: true,
    intro: "Begin with natural or lab-grown diamonds, a preferred shape, or the complete search.",
    modules: [contentModule("Natural diamonds", "Enter the shared search with Natural selected.", "/diamonds/search?type=natural", "Explore natural"), contentModule("Lab-grown diamonds", "Enter the same search with Lab-grown selected.", "/diamonds/search?type=lab-grown", "Explore lab-grown"), contentModule("Diamond education", "A quieter route for guidance before shopping.", "/journal", "Explore our guides")],
    notice: "Inventory, grading data, media and pricing will come from MAH's approved feed.",
  },
  "diamonds/search": {
    section: "11B", eyebrow: "Loose diamonds", title: "A precise search, kept simple.",
    intro: "Principal filters, result views and comparison states are structured for one shared live inventory system.",
    steps: ["Diamond type", "Shape", "Price", "Carat", "Colour", "Clarity", "Cut"],
    modules: [contentModule("Table and grid views", "Switch views without losing filters or position."), contentModule("Active filters", "Selections remain visible, removable and responsive to inventory."), contentModule("Diamond details", "Each live result uses one detail template.", "/diamonds/detail", "View detail foundation")],
    notice: "Result counts, ranges, sorting, laboratories and certificates must be live.",
  },
  "diamonds/detail": {
    section: "11C", eyebrow: "Diamond detail", title: "Every available detail, in one place.",
    intro: "A reusable detail foundation for imagery, specifications, grading report and two legitimate next journeys.",
    modules: [contentModule("Choose this diamond", "Preserve the stone while showing compatible settings.", "/engagement-rings", "Choose a setting"), contentModule("Buy as a loose diamond", "Continue to the shared bag when availability is confirmed.", "/bag", "View bag foundation"), contentModule("Back to results", "Return with filters, sorting and position preserved.", "/diamonds/search", "Back to search")],
    notice: "No illustrative stone, certificate, reference number or price is represented as MAH inventory.",
  },
  jewellery: {
    section: "12A", eyebrow: "Jewellery", title: "Details that carry meaning.",
    intro: "A flexible collection foundation for MAH's eventual catalogue, with Signatures held within Jewellery.",
    modules: [contentModule("Explore jewellery", "Filters reflect actual product data.", "/jewellery/product", "View product foundation"), contentModule("MAH Signatures", "A distinct editorial collection, not an eighth primary category.", "/jewellery/signatures", "Discover Signatures"), contentModule("One commerce system", "All purchasable pieces share the same bag and checkout.")],
    notice: "Final categories, names, materials, variants, prices and availability require the catalogue.",
  },
  "jewellery/product": {
    section: "12B", eyebrow: "Jewellery detail", title: "A product template that adapts to the piece.",
    intro: "A reusable detail and configuration foundation showing only media and options available for the product.",
    steps: ["View", "Select options", "Confirm", "Add to bag"],
    modules: [contentModule("Adaptive configuration", "A necklace may use chain length; a ring may use size."), contentModule("Rich media when available", "Zoom, video and 360° appear only when supported."), contentModule("Related jewellery", "Catalogue-led recommendations reuse this template.")],
    notice: "Descriptions, care, delivery and craftsmanship content remain pending approval.",
  },
  "jewellery/signatures": {
    section: "13", eyebrow: "MAH Signatures", title: "A signature still being defined.",
    intro: "A short editorial foundation ready for approved signature pieces and a future design story.",
    modules: [contentModule("Signature pieces", "Only products confirmed as MAH Signatures appear here.", "/jewellery/product", "View product system"), contentModule("The signature story", "Reserved for approved identity; no motif or origin story is invented."), contentModule("Bespoke-only pieces", "Catalogue rules can route selected pieces to a commission.", "/bespoke", "Explore bespoke")],
    notice: "The permanent MAH Signature motif and story still require a client decision.",
  },
  bespoke: {
    section: "14", eyebrow: "MAH Bespoke", title: "A Diamond as Individual as You", dark: true,
    intro: "Begin a bespoke commission with MAH.",
    steps: ["Discover", "Design", "Craft", "Your creation"],
    modules: [
      contentModule("Bespoke Engagement Rings", "A dedicated enquiry route separate from Add to Bag.", "/expert", "Start a conversation"),
      contentModule("Bespoke Wedding Rings", "A considered route for a personal piece.", "/appointments", "Book an appointment"),
      contentModule("Bespoke Jewellery", "A flexible start for an approved commission process.", "/expert", "Begin your commission")
    ],
    notice: "Deposits, pricing, production times, delivery and warranties follow approved MAH bespoke guidelines.",
  },
  atelier: {
    section: "15", eyebrow: "The Atelier", title: "From first line to final detail.", dark: true,
    intro: "An editorial structure for approved information about design, materials and creation.",
    steps: ["Design", "Craft", "Detail"],
    modules: [contentModule("Journey of craft", "A three-stage framework ready for confirmed process content."), contentModule("Materials and stones", "A space for approved information without sourcing claims."), contentModule("A personal creation", "Continue into the bespoke journey.", "/bespoke", "Start your commission")],
    notice: "Concept imagery does not depict an actual MAH workshop or craftsperson.",
  },
  "our-house": {
    section: "16", eyebrow: "Our House", title: "The House of MAH",
    intro: "Discover the story and direction of MAH Diamonds.",
    modules: [
      contentModule("Diamonds", "MAH-approved diamond content.", "/diamonds", "Explore diamonds"),
      contentModule("Design", "MAH-approved design philosophy.", "/atelier", "View design philosophy"),
      contentModule("The MAH experience", "MAH-approved brand and client experience.", "/expert", "Speak to an expert")
    ],
    notice: "No founding date, heritage, location, achievement or brand claim has been invented.",
  },
  journal: {
    section: "17A", eyebrow: "The Journal", title: "A Closer Look at a Brighter World", dark: true,
    intro: "Stories and perspectives from the world of fine jewellery, told by MAH.",
    modules: [contentModule("From the Owner", "Thoughts, reflections and a look ahead from the person behind MAH.", "/journal/article", "View article"), contentModule("Diamond & Jewellery Education", "Knowledge, guidance and insights to help you make more informed choices.", "/journal/article", "View article"), contentModule("House Stories", "Meet the craftsmanship, expertise and heritage that shape MAH.", "/journal/article", "View article")],
    notice: "Article titles, authors, dates, claims and imagery follow approved MAH editorial standards.",
  },
  "journal/article": {
    section: "17B", eyebrow: "Journal article template", title: "One flexible template for every MAH story.",
    intro: "A reusable article system supporting paragraphs, imagery, pull quotes and optional navigation.",
    modules: [contentModule("Flexible body", "Content expands naturally and supports full-width imagery."), contentModule("Optional modules", "Author, date, reading time and contents hide when empty."), contentModule("Related stories", "Up to three relevant stories follow without clutter.", "/journal", "Back to journal")],
    notice: "This route does not hard-code the reference document's sample article.",
  },
  expert: {
    section: "18", eyebrow: "Speak to an MAH Expert", title: "Let's Talk About What Matters to You",
    intro: "Whether you have a question, would like guidance or want to discuss a special piece, an MAH expert is here to help.",
    modules: [contentModule("Enquiry form", "The production form connects directly to MAH's client enquiry system."), contentModule("Prefer an appointment?", "Appointment booking remains a separate journey.", "/appointments", "Book an appointment"), contentModule("Privacy by design", "Every conversation is treated with care and discretion.")],
    notice: "Recipient addresses, response times, availability and promises follow strict MAH privacy guidelines.",
  },
  appointments: {
    section: "19", eyebrow: "Book an appointment", title: "A more personal experience.",
    intro: "One booking foundation for in-person and online consultations, ready for a live calendar.",
    steps: ["Consultation type", "Subject", "Date & time", "Your details", "Review & confirm"],
    modules: [contentModule("In person", "A venue appears only after MAH confirms a location."), contentModule("Online consultation", "Joining information follows a successful booking."), contentModule("Live availability", "Dates, timezones and final checks come from the provider.")],
    notice: "No location, availability, timezone, meeting link or cancellation policy is hard-coded.",
  },
  contact: {
    section: "20", eyebrow: "Contact / Visit MAH", title: "Choose the right way to begin.",
    intro: "A practical route to enquiry, appointment booking and, when approved, contact and location information.",
    modules: [contentModule("Speak to an expert", "Use the dedicated enquiry journey.", "/expert", "Send an enquiry"), contentModule("Book an appointment", "Use the separate consultation journey.", "/appointments", "Book an appointment"), contentModule("Direct contact and location", "This appears once approved details are supplied.")],
    notice: "No address, map, hours, telephone number or email is displayed until confirmed.",
  },
  bag: {
    section: "06", eyebrow: "Your selection", title: "A calm review before secure checkout.",
    intro: "The shared bag preserves each product, its options and, where relevant, its centre diamond.",
    steps: ["Review", "Edit", "Revalidate", "Checkout"],
    modules: [contentModule("Ready for catalogue integration", "Items, certification and totals will render from live data."), contentModule("Guest checkout", "Account creation remains optional.", "/checkout", "View checkout foundation"), contentModule("Need reassurance?", "Expert guidance remains secondary.", "/expert", "Speak to an expert")],
    notice: "VAT, charges, reservation and lead-time rules still require MAH decisions.",
  },
  checkout: {
    section: "07", eyebrow: "Secure checkout", title: "Private, clear and free from distraction.",
    intro: "A five-stage checkout foundation with guest purchase and one persistent order summary.",
    steps: ["Customer details", "Delivery / collection", "Billing", "Payment", "Review & confirm"],
    modules: [contentModule("Information preserved", "Details remain intact when moving between steps."), contentModule("Approved payment provider", "Methods and recovery follow MAH's selected provider."), contentModule("Conditional verification", "High-value verification appears only when triggered.", "/verification", "View verification")],
    notice: "Delivery, collection, VAT and payment rules are integration points.",
  },
  verification: {
    section: "08", eyebrow: "Secure verification", title: "A conditional step for selected purchases.",
    intro: "This state follows payment only when an approved provider requires additional verification.",
    steps: ["Payment received", "Secure verification", "Order confirmed"],
    modules: [contentModule("Customer action", "An action appears only when genuinely required."), contentModule("Clear pending state", "Orders remain unconfirmed until verification succeeds."), contentModule("Recovery", "Preserve details and guide a retry or request for help.", "/expert", "Speak to an expert")],
    notice: "No verification threshold, timeframe or outcome is hard-coded.",
  },
  confirmation: {
    section: "09", eyebrow: "Purchase confirmation", title: "Confirmed, with care.",
    intro: "A post-payment foundation for confirmation, selection summary and fulfilment status.",
    steps: ["Order confirmed", "Preparing your order", "Ready for delivery / collection"],
    modules: [contentModule("Order details", "Information comes from the completed transaction."), contentModule("Optional account", "Guests can create an account after purchase."), contentModule("Client care", "Guidance remains available without upselling.", "/expert", "Speak to an expert")],
    notice: "No sample order, email, product, status or price is presented as real.",
  },
  search: { section: "Utility", eyebrow: "Search", title: "Search MAH.", intro: "A global route ready for catalogue and editorial indexing.", modules: [contentModule("Search integration pending", "Results will connect to approved data without becoming primary navigation.")] },
  wishlist: { section: "Utility", eyebrow: "Wishlist", title: "Saved for later.", intro: "One wishlist foundation across all shopping journeys.", modules: [contentModule("Your wishlist is currently empty", "Live items appear once catalogue and account systems are connected.")] },
  account: { section: "Utility", eyebrow: "My account", title: "Your MAH account.", intro: "An optional route for sign-in, saved selections and orders.", modules: [contentModule("Guest purchase remains available", "An account will never be required to complete a purchase.")] },
};
