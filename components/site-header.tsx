"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
  Sparkles,
  Calendar,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./brand-mark";
import { primaryNavigation } from "@/lib/site-data";
import { useDemoStore } from "./demo-store-provider";

const utilities = [
  { label: "Search", href: "/search", icon: Search },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: UserRound },
  { label: "Bag", href: "/bag", icon: ShoppingBag },
];

const megaMenus: Record<
  string,
  {
    heading: string;
    groups: { title: string; links: [string, string][] }[];
    feature: [string, string, string];
  }
> = {
  "Engagement Rings": {
    heading: "Haute Joaillerie Settings",
    groups: [
      {
        title: "By Style",
        links: [
          ["All Engagement Rings", "/engagement-rings"],
          ["Solitaire", "/engagement-rings?style=solitaire"],
          ["Halo & Cluster", "/engagement-rings?style=halo"],
          ["Three-Stone Trilogy", "/engagement-rings?style=trilogy"],
          ["Pavé Band", "/engagement-rings?style=pave"],
        ],
      },
      {
        title: "Royal Collections",
        links: [
          ["1735 Collection", "/engagement-rings?collection=1735+Collection"],
          ["Wings Embrace Bridal", "/engagement-rings?collection=Wings+Embrace"],
          ["Albemarle Bridal", "/engagement-rings?collection=Albemarle+Collection"],
          ["Aloria Bridal", "/engagement-rings?collection=Aloria+Collection"],
        ],
      },
      {
        title: "The Maison Journey",
        links: [
          ["Select a Setting", "/engagement-rings"],
          ["Choose Compatible Diamond", "/diamonds/search"],
          ["MAH Bespoke Atelier", "/bespoke"],
          ["Book Private Consultation", "/appointments"],
        ],
      },
    ],
    feature: [
      "The Aster Solitaire",
      "Maison signature four-claw setting in solid platinum.",
      "/engagement-rings/configure?id=ER-001",
    ],
  },
  "Wedding Rings": {
    heading: "Bands of Eternal Promise",
    groups: [
      {
        title: "Discover",
        links: [
          ["All Wedding Bands", "/wedding-rings"],
          ["Diamond Eternity Bands", "/wedding-rings?style=diamond"],
          ["Classic Court Bands", "/wedding-rings?style=plain"],
          ["Curved & Shaped Bands", "/wedding-rings?style=shaped"],
        ],
      },
      {
        title: "Royal Suites",
        links: [
          ["1735 Eternity Suites", "/wedding-rings?collection=1735+Collection"],
          ["Albemarle Bands", "/wedding-rings?collection=Albemarle+Collection"],
          ["Wings Embrace Bands", "/wedding-rings?collection=Wings+Embrace"],
          ["Cosmos Eternity", "/wedding-rings?collection=Cosmos+Suite"],
        ],
      },
      {
        title: "Client Care",
        links: [
          ["Wedding Consultation", "/appointments"],
          ["Bespoke Commission", "/bespoke"],
          ["Finger Size Guidance", "/expert"],
        ],
      },
    ],
    feature: [
      "The Sovereign Court",
      "Handcrafted in London with a silky comfort-fit interior.",
      "/wedding-rings",
    ],
  },
  "Diamonds": {
    heading: "GIA & IGI Certified Diamonds",
    groups: [
      {
        title: "Diamond Origin",
        links: [
          ["Natural Diamonds", "/diamonds/search?type=natural"],
          ["Lab-Grown Diamonds", "/diamonds/search?type=lab-grown"],
          ["Search All Diamonds", "/diamonds/search"],
        ],
      },
      {
        title: "By Shape",
        links: [
          ["Round Brilliant", "/diamonds/search?shape=round"],
          ["Oval Cut", "/diamonds/search?shape=oval"],
          ["Emerald Cut", "/diamonds/search?shape=emerald"],
          ["Cushion Cut", "/diamonds/search?shape=cushion"],
        ],
      },
      {
        title: "Diamond Education",
        links: [
          ["The 4Cs Dossier", "/journal/article?id=4cs-dossier"],
          ["Speak with a Diamond Expert", "/expert"],
          ["Book Private Viewing", "/appointments"],
        ],
      },
    ],
    feature: [
      "The Diamond Search",
      "Compare clarity, cut and certificate references side-by-side.",
      "/diamonds/search",
    ],
  },
  "Jewellery": {
    heading: "Fine Jewellery & Signatures",
    groups: [
      {
        title: "Categories",
        links: [
          ["Rings", "/jewellery?style=ring"],
          ["Earrings", "/jewellery?style=earrings"],
          ["Necklaces", "/jewellery?style=necklace"],
          ["Bracelets", "/jewellery?style=bracelet"],
        ],
      },
      {
        title: "Signatures & Suites",
        links: [
          ["MAH Signatures", "/jewellery/signatures"],
          ["High Jewellery Creations", "/jewellery"],
          ["Book Private Viewing", "/appointments"],
        ],
      },
    ],
    feature: [
      "Octagonal Signature Solitaire",
      "Cut-corner octagonal collet hand-forged in pure 950 platinum.",
      "/jewellery/signatures",
    ],
  },
  "MAH Bespoke": {
    heading: "Bespoke Haute Joaillerie",
    groups: [
      {
        title: "Commissions",
        links: [
          ["Bespoke Engagement Rings", "/bespoke?category=engagement"],
          ["Bespoke Jewellery", "/bespoke?category=jewellery"],
          ["The Bespoke Process", "/bespoke#process"],
          ["Start Your Commission", "/bespoke#commission"],
        ],
      },
      {
        title: "Consultations",
        links: [
          ["In-Store Appointment (Hatton Garden)", "/appointments"],
          ["Virtual Consultation", "/appointments"],
          ["WhatsApp Bespoke Concierge", "/contact"],
        ],
      },
    ],
    feature: [
      "One-of-a-Kind Creations",
      "Work directly with our master jewellers and diamond mounters.",
      "/bespoke",
    ],
  },
  "The Atelier": {
    heading: "London Atelier & Savoir-Faire",
    groups: [
      {
        title: "Artisan Bench Craft",
        links: [
          ["Craftsmanship", "/atelier#craftsmanship"],
          ["Jewellery Remodelling", "/atelier#remodelling"],
          ["Restoration & Repairs", "/atelier#repairs"],
          ["Workshops", "/atelier#workshops"],
        ],
      },
      {
        title: "Maison Standards",
        links: [
          ["British Hallmarking Act 1973", "/policies/hallmarking-act"],
          ["Lifetime Craftsmanship Warranty", "/policies/lifetime-warranty"],
          ["Meet the Artisans", "/atelier"],
        ],
      },
    ],
    feature: [
      "Hatton Garden Workshop",
      "Traditional bench goldsmithing combined with precision CAD engineering.",
      "/atelier",
    ],
  },
  "Our House": {
    heading: "Heritage, Philosophy & Journal",
    groups: [
      {
        title: "The Maison",
        links: [
          ["The MAH Story", "/our-house#story"],
          ["Our Philosophy", "/our-house#philosophy"],
          ["Our Craft", "/our-house#craft"],
          ["Visit Us", "/contact"],
        ],
      },
      {
        title: "Publications",
        links: [
          ["Journal", "/journal"],
          ["Private Client Care", "/contact"],
          ["Client Services", "/contact"],
        ],
      },
    ],
    feature: [
      "Timeless Craft. Made for Generations.",
      "Discover the heritage and values that define MAH Diamonds London.",
      "/our-house",
    ],
  },
};

const mobileAccordionCategories = [
  {
    idx: "01",
    title: "Engagement Rings",
    href: "/engagement-rings",
    sublinks: [
      { label: "Shop Engagement Rings", href: "/engagement-rings" },
      { label: "Design Your Own Ring", href: "/engagement-rings/configure" },
      { label: "Diamond Engagement Rings", href: "/engagement-rings?type=diamond" },
      { label: "Lab-Grown Diamond Engagement Rings", href: "/engagement-rings?type=lab" },
      { label: "Engagement Ring Styles", href: "/engagement-rings?tab=styles" },
      { label: "Engagement Ring Buying Guide", href: "/journal/article?id=buying-guide" },
    ],
  },
  {
    idx: "02",
    title: "Wedding Rings",
    href: "/wedding-rings",
    sublinks: [
      { label: "Women's Wedding Rings", href: "/wedding-rings?gender=women" },
      { label: "Men's Wedding Rings", href: "/wedding-rings?gender=men" },
      { label: "Diamond Wedding Rings", href: "/wedding-rings?style=diamond" },
      { label: "Plain Wedding Rings", href: "/wedding-rings?style=plain" },
      { label: "Bespoke Wedding Rings", href: "/wedding-rings?bespoke=true" },
    ],
  },
  {
    idx: "03",
    title: "Diamonds",
    href: "/diamonds",
    sublinks: [
      { label: "Natural Diamonds", href: "/diamonds/search?type=Natural" },
      { label: "Lab-Grown Diamonds", href: "/diamonds/search?type=Lab-grown" },
      { label: "Diamond Shapes", href: "/diamonds/search?tab=shapes" },
      { label: "The 4Cs", href: "/diamonds?guide=4cs" },
      { label: "Diamond Education", href: "/diamonds?tab=education" },
    ],
  },
  {
    idx: "04",
    title: "Jewellery",
    href: "/jewellery",
    sublinks: [
      { label: "Rings", href: "/jewellery?style=ring" },
      { label: "Earrings", href: "/jewellery?style=earrings" },
      { label: "Necklaces", href: "/jewellery?style=necklace" },
      { label: "Bracelets", href: "/jewellery?style=bracelet" },
      { label: "MAH Signatures", href: "/jewellery/signatures" },
    ],
  },
  {
    idx: "05",
    title: "MAH Bespoke",
    href: "/bespoke",
    sublinks: [
      { label: "Bespoke Engagement Rings", href: "/bespoke?category=engagement" },
      { label: "Bespoke Jewellery", href: "/bespoke?category=jewellery" },
      { label: "The Bespoke Process", href: "/bespoke#process" },
      { label: "Start Your Commission", href: "/bespoke#commission" },
    ],
  },
  {
    idx: "06",
    title: "The Atelier",
    href: "/atelier",
    sublinks: [
      { label: "Craftsmanship", href: "/atelier#craftsmanship" },
      { label: "Jewellery Remodelling", href: "/atelier#remodelling" },
      { label: "Restoration & Repairs", href: "/atelier#repairs" },
      { label: "Workshops", href: "/atelier#workshops" },
    ],
  },
  {
    idx: "07",
    title: "Our House",
    href: "/our-house",
    sublinks: [
      { label: "The MAH Story", href: "/our-house#story" },
      { label: "Our Philosophy", href: "/our-house#philosophy" },
      { label: "Our Craft", href: "/our-house#craft" },
      { label: "Journal", href: "/journal" },
      { label: "Visit Us", href: "/contact" },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>("Engagement Rings");
  const store = useDemoStore();

  const badgeFor = (label: string) =>
    label === "Wishlist"
      ? store.wishlist.length
      : label === "Bag"
      ? store.bag.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

  const menu = mega ? megaMenus[mega] : null;

  if (pathname.startsWith("/admin")) return null;

  const toggleMobileAccordion = (title: string) => {
    setExpandedMobileCategory(expandedMobileCategory === title ? null : title);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header lux-header" onMouseLeave={() => setMega(null)}>
        <div className="appointment-bar">
          <Link href="/appointments">
            <span>Private Consultations in Mayfair & Hatton Garden</span>
            <span>·</span>
            <span>Complimentary Fully Insured Delivery</span>
            <span>Book Private Viewing</span>
          </Link>
        </div>
        <div className="shell header-main">
          <button
            className="mobile-menu-button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={20} strokeWidth={1.25} />
          </button>
          <div className="header-locality">
            <span>London Salons</span>
            <small>Mayfair & Hatton Garden · {store.currency || "GBP"}</small>
          </div>
          <BrandMark />
          <div className="header-utilities">
            {utilities.map(({ label, href, icon: Icon }) => {
              const badge = badgeFor(label);
              return (
                <Link
                  href={href}
                  key={label}
                  className="utility-link"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={18} strokeWidth={1.25} />
                  {badge > 0 && <span className="utility-badge">{badge}</span>}
                </Link>
              );
            })}
          </div>
        </div>
        <nav className="desktop-nav lux-desktop-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              onMouseEnter={() => setMega(megaMenus[item.label] ? item.label : null)}
              onFocus={() => setMega(megaMenus[item.label] ? item.label : null)}
              className={pathname.startsWith(item.href) ? "active" : ""}
            >
              {item.label}
              {megaMenus[item.label] && <ChevronDown size={11} strokeWidth={1.3} />}
            </Link>
          ))}
        </nav>
        {menu && (
          <div className="mega-menu" onMouseEnter={() => setMega(mega)}>
            <div className="shell mega-grid">
              <div className="mega-intro">
                <small>Haute Joaillerie</small>
                <strong>{menu.heading}</strong>
                <Link
                  href={
                    primaryNavigation.find((item) => item.label === mega)?.href || "/"
                  }
                >
                  View All Creations <ArrowRightIcon />
                </Link>
              </div>
              {menu.groups.map((group) => (
                <div className="mega-group" key={group.title}>
                  <p>{group.title}</p>
                  {group.links.map(([label, href]) => (
                    <Link href={href} key={label}>
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
              <Link href={menu.feature[2]} className="mega-feature">
                <Image
                  src="/images/mah-hero-concept.png"
                  alt=""
                  fill
                  sizes="280px"
                />
                <span>
                  <small>Maison Selection</small>
                  <strong>{menu.feature[0]}</strong>
                  <em>{menu.feature[1]}</em>
                </span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Elevated Mobile Drawer */}
      <div
        className={["mobile-drawer", open ? "open" : ""].filter(Boolean).join(" ")}
        aria-hidden={!open}
      >
        <button
          className="drawer-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
        <div className="drawer-panel">
          {/* Drawer Header */}
          <div className="drawer-head">
            <BrandMark />
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} strokeWidth={1.25} />
            </button>
          </div>

          {/* Client Quick Action Bar */}
          <div className="drawer-top-utilities">
            <Link
              href="/search"
              className="drawer-util-item"
              onClick={() => setOpen(false)}
            >
              <div className="drawer-util-icon-wrap">
                <Search size={16} strokeWidth={1.3} />
              </div>
              <span>Search</span>
            </Link>
            <Link
              href="/wishlist"
              className="drawer-util-item"
              onClick={() => setOpen(false)}
            >
              <div className="drawer-util-icon-wrap">
                <Heart size={16} strokeWidth={1.3} />
                {store.wishlist.length > 0 && (
                  <span className="drawer-util-badge">{store.wishlist.length}</span>
                )}
              </div>
              <span>Wishlist</span>
            </Link>
            <Link
              href="/bag"
              className="drawer-util-item"
              onClick={() => setOpen(false)}
            >
              <div className="drawer-util-icon-wrap">
                <ShoppingBag size={16} strokeWidth={1.3} />
                {store.bag.length > 0 && (
                  <span className="drawer-util-badge">
                    {store.bag.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <span>Bag</span>
            </Link>
            <Link
              href="/account"
              className="drawer-util-item"
              onClick={() => setOpen(false)}
            >
              <div className="drawer-util-icon-wrap">
                <UserRound size={16} strokeWidth={1.3} />
              </div>
              <span>Vault</span>
            </Link>
          </div>

          {/* Currency Switcher Row */}
          <div className="drawer-currency-row">
            <span className="drawer-currency-label">Select Currency</span>
            <div className="drawer-currency-pills">
              {(["GBP", "USD", "EUR", "AED"] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  className={`drawer-curr-btn ${store.currency === curr ? "active" : ""}`}
                  onClick={() => store.setCurrency(curr)}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion Navigation */}
          <nav className="drawer-accordion-nav" aria-label="Mobile primary navigation">
            {mobileAccordionCategories.map((cat) => {
              const isExpanded = expandedMobileCategory === cat.title;
              return (
                <div
                  key={cat.title}
                  className={`drawer-acc-item ${isExpanded ? "expanded" : ""}`}
                >
                  <button
                    type="button"
                    className="drawer-acc-header"
                    onClick={() => toggleMobileAccordion(cat.title)}
                    aria-expanded={isExpanded}
                  >
                    <div className="drawer-acc-title-group">
                      <span className="drawer-acc-idx">{cat.idx}</span>
                      <span className="drawer-acc-name">{cat.title}</span>
                    </div>
                    <ChevronDown size={16} className="drawer-acc-chevron" />
                  </button>

                  {isExpanded && (
                    <div className="drawer-acc-sublinks">
                      {cat.sublinks.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="drawer-acc-sublink"
                          onClick={() => setOpen(false)}
                        >
                          {sub.label}
                          <span>→</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Private Consultation Feature Box */}
          <div className="drawer-consultation-box facet-oct-sm">
            <span className="eyebrow">Mayfair & Hatton Garden</span>
            <h4>Private Salon Consultations</h4>
            <p>
              Experience bespoke commissions and inspect loose certified diamonds in our discreet London salons.
            </p>
            <Link
              href="/appointments"
              className="drawer-consultation-btn facet-oct-sm"
              onClick={() => setOpen(false)}
            >
              <Calendar size={14} /> Book Private Appointment
            </Link>
          </div>

          {/* Salon Contacts */}
          <div className="drawer-salon-contacts">
            <strong>London Salons & Concierge</strong>
            <div className="drawer-salon-line">
              <span>Mayfair Flagship: 14 New Bond St</span>
              <a href="tel:+442079460920">+44 20 7946 0920</a>
            </div>
            <div className="drawer-salon-line">
              <span>Hatton Garden Atelier: 32 Hatton Gdn</span>
              <a href="tel:+442079460921">+44 20 7946 0921</a>
            </div>
          </div>

          {/* Policies Quick Strip */}
          <div className="drawer-policies-strip">
            <Link href="/policies/delivery-collection" onClick={() => setOpen(false)}>
              Delivery
            </Link>
            <Link href="/policies/returns-resizing" onClick={() => setOpen(false)}>
              Resizing
            </Link>
            <Link href="/policies/lifetime-warranty" onClick={() => setOpen(false)}>
              Warranty
            </Link>
            <Link href="/policies/hallmarking-act" onClick={() => setOpen(false)}>
              Hallmarks
            </Link>
            <Link href="/policies/privacy" onClick={() => setOpen(false)}>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>;
}
