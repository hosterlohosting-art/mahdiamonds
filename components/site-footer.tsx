"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Award,
  Check,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
  Globe,
  ChevronDown,
} from "lucide-react";
import { BrandMark } from "./brand-mark";
import { useDemoStore } from "./demo-store-provider";
import type { CurrencyCode } from "@/lib/demo-data";

const currencies = [
  { code: "GBP", symbol: "\u00a3", label: "GBP (\u00a3) \u00b7 United Kingdom", region: "London / UK" },
  { code: "USD", symbol: "$", label: "USD ($) \u00b7 United States", region: "North America" },
  { code: "EUR", symbol: "\u20ac", label: "EUR (\u20ac) \u00b7 European Union", region: "Europe" },
  { code: "AED", symbol: "\u062f.\u0625", label: "AED (\u062f.\u0625) \u00b7 United Arab Emirates", region: "Middle East" },
];

const columns = [
  {
    title: "Primary Collections",
    links: [
      ["Engagement Rings", "/engagement-rings"],
      ["Wedding Rings", "/wedding-rings"],
      ["Certified Diamonds", "/diamonds/search"],
      ["Fine Jewellery", "/jewellery"],
      ["MAH Signatures", "/jewellery/signatures"],
    ],
  },
  {
    title: "The Maison",
    links: [
      ["MAH Bespoke", "/bespoke"],
      ["The Atelier & Savoir-Faire", "/atelier"],
      ["The MAH Story", "/our-house"],
      ["Maison Journal", "/journal"],
    ],
  },
  {
    title: "Global Utilities & Services",
    links: [
      ["Book an Appointment", "/appointments"],
      ["Client Services", "/contact"],
      ["Private Wishlist", "/vault"],
      ["My Account & Orders", "/admin"],
      ["Search Inventory", "/diamonds/search"],
    ],
  },
  {
    title: "Legal & Standards",
    links: [
      ["Delivery & Insured Transit", "/policies/delivery-collection"],
      ["Resizing & Returns", "/policies/returns-resizing"],
      ["Lifetime Warranty", "/policies/lifetime-warranty"],
      ["British Hallmarking Act 1973", "/policies/hallmarking-act"],
      ["Privacy & Discretion Charter", "/policies/privacy"],
      ["Terms of Sale", "/policies/terms"],
    ],
  },
];

export function SiteFooter() {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const store = useDemoStore();
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const handleSelectCurrency = (code: string) => {
    store.setCurrency(code as CurrencyCode);
    setCurrencyMenuOpen(false);
  };

  const selectedCurrency = store.currency;

  const currentCurrObj = currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  return (
    <footer className="site-footer lux-footer">
      {/* Newsletter */}
      <section className="lux-newsletter">
        <div className="shell newsletter-inner">
          <div className="newsletter-copy">
            <span className="newsletter-eyebrow">Private Notes from the Maison</span>
            <h2>New collections, high jewellery releases and considered guidance.</h2>
            <p className="newsletter-sub">Delivered discreetly. Receive private salon exhibition invitations and gemological market briefings.</p>
          </div>
          <div className="newsletter-form-col">
            {joined ? (
              <div className="newsletter-success">
                <span className="success-icon facet-oct-sm"><Check size={16} /></span>
                <div>
                  <strong>Invitation Recorded Discreetly</strong>
                  <p>Thank you for subscribing to private notes from MAH Diamonds.</p>
                </div>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); if (email) setJoined(true); }}>
                <div className="newsletter-input-wrap">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your confidential email address" />
                  <button type="submit" aria-label="Join the MAH mailing list"><span>Subscribe</span><ArrowRight size={15} /></button>
                </div>
                <small className="newsletter-disclaimer">By subscribing, you agree to our <Link href="/policies/privacy">Client Privacy Charter</Link>. Discretion guaranteed.</small>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4-Pillar Hallmark Assurance Strip */}
      <div className="footer-hallmarks">
        <div className="shell hallmarks-grid">
          <Link href="/diamonds/search" className="hallmark-item">
            <Award size={20} className="hallmark-icon" />
            <div>
              <strong>GIA & IGI Certified</strong>
              <small>Every centre diamond individually graded & laser inscribed</small>
            </div>
          </Link>
          <Link href="/atelier" className="hallmark-item">
            <Sparkles size={20} className="hallmark-icon" />
            <div>
              <strong>London Atelier Craftsmanship</strong>
              <small>Handcrafted in Mayfair & Hatton Garden master benches</small>
            </div>
          </Link>
          <Link href="/policies/hallmarking-act" className="hallmark-item">
            <ShieldCheck size={20} className="hallmark-icon" />
            <div>
              <strong>British Hallmarking Act 1973</strong>
              <small>Independently verified by the London Assay Office</small>
            </div>
          </Link>
          <Link href="/policies/delivery-collection" className="hallmark-item">
            <Truck size={20} className="hallmark-icon" />
            <div>
              <strong>Insured Worldwide Transit</strong>
              <small>Complimentary delivery & private London salon collection</small>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="shell footer-top">
        <div className="footer-intro">
          <BrandMark light size="lg" />
          <p>Parisian poetry, British royal heraldry, and Hatton Garden diamond expertise united in timeless milestone creations.</p>
          <p className="footer-note">Registered Sponsor Mark &lsquo;MAH&rsquo; &middot; London Assay Office Goldsmiths&rsquo; Hall. All rights reserved.</p>
        </div>
        <div className="footer-links">
          {columns.map((column) => (
            <div key={column.title} className="footer-col">
              <h3>{column.title}</h3>
              {column.links.map(([label, href]) => (
                <Link href={href} key={label}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="shell footer-bottom-inner">
          <div className="footer-legal-copy">
            <span>&copy; {new Date().getFullYear()} MAH Diamonds Ltd. All rights reserved.</span>
            <div className="legal-links-inline">
              <Link href="/policies/privacy">Privacy</Link>
              <span className="dot">&middot;</span>
              <Link href="/policies/terms">Terms</Link>
              <span className="dot">&middot;</span>
              <Link href="/policies/lifetime-warranty">Warranty</Link>
              <span className="dot">&middot;</span>
              <Link href="/policies/hallmarking-act">Hallmarking</Link>
            </div>
          </div>

          {/* Currency / Region Switcher */}
          <div className="currency-selector-wrap">
            <button type="button" className="currency-select-btn" onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)} aria-expanded={currencyMenuOpen} aria-label="Select currency and region">
              <Globe size={14} />
              <span>{currentCurrObj.code} ({currentCurrObj.symbol})</span>
              <ChevronDown size={13} className={`chevron ${currencyMenuOpen ? "open" : ""}`} />
            </button>
            {currencyMenuOpen && (
              <div className="currency-dropdown-menu">
                <div className="dropdown-header">Select Display Currency</div>
                {currencies.map((c) => (
                  <button key={c.code} className={`currency-option ${c.code === selectedCurrency ? "active" : ""}`} onClick={() => handleSelectCurrency(c.code)}>
                    <span className="curr-sym">{c.symbol}</span>
                    <div className="curr-meta"><strong>{c.code}</strong><small>{c.region}</small></div>
                    {c.code === selectedCurrency && <Check size={14} className="curr-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
