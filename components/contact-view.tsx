"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";

const LOCATIONS = [
  {
    name: "Mayfair Private Salon",
    district: "Old Bond Street",
    address: "14 Old Bond Street, Mayfair",
    city: "London W1S 4PP",
    hours: "Monday – Saturday: 10:00 – 18:00 · Sunday by Appointment",
    desc: "Private champagne viewing suites overlooking historic Bond Street for engagement, high jewelry, and bespoke commissions.",
    image: "/images/journal-atelier.jpg",
  },
  {
    name: "Hatton Garden Atelier",
    district: "London Diamond Quarter",
    address: "32 Hatton Garden, Holborn",
    city: "London EC1N 8DL",
    hours: "Monday – Friday: 09:30 – 17:30 · Saturday by Appointment",
    desc: "Our active diamond vault and workshop bench access where clients view loose stones under optical magnification.",
    image: "/images/bespoke-artisan.jpg",
  },
];

export function ContactView({ page }: { page: RoutePage }) {
  return (
    <main id="main-content" className="contact-page">
      {/* 20 Hero Section */}
      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <div className="contact-hero-bg">
          <Image
            src="/images/journal-atelier.jpg"
            alt="MAH London salon entrance"
            fill
            priority
            sizes="100vw"
            className="contact-hero-img"
          />
          <div className="contact-hero-overlay" />
        </div>

        <div className="shell contact-hero-content">
          <p className="eyebrow eyebrow-light">Section 20 · Contact / Visit MAH</p>
          <h1 id="contact-hero-title">
            Choose the right way to begin.
          </h1>
          <p className="contact-hero-sub">
            Direct channels to our client concierge, master gemmologists, and private London salons.
          </p>
          <div className="contact-hero-ctas">
            <Link href="/appointments" className="button button-light facet-oct-sm">
              <CalendarDays size={15} /> Book an Appointment
            </Link>
            <Link href="/expert" className="button button-outline-light facet-oct-sm">
              <MessageCircle size={15} /> Speak to an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Contact Routes */}
      <section className="contact-routes-section section-pad">
        <div className="shell">
          <div className="section-heading centred">
            <p className="eyebrow">Client Services</p>
            <h2>Three Ways to Connect</h2>
          </div>

          <div className="contact-routes-grid">
            <div className="contact-route-card facet-oct-sm">
              <span className="route-icon-wrap facet-oct-sm">
                <MessageCircle size={22} strokeWidth={1.15} />
              </span>
              <h3>Speak to an MAH Expert</h3>
              <p>Send a personal enquiry or ask technical questions regarding stone proportions, grading, or bespoke timeframes.</p>
              <Link href="/expert" className="button button-dark facet-oct-sm">
                Send an Enquiry <ArrowRight size={14} />
              </Link>
            </div>

            <div className="contact-route-card facet-oct-sm">
              <span className="route-icon-wrap facet-oct-sm">
                <CalendarDays size={22} strokeWidth={1.15} />
              </span>
              <h3>Book a Private Appointment</h3>
              <p>Reserve an in-person consultation in Mayfair or Hatton Garden, or an ultra-high-definition online video session.</p>
              <Link href="/appointments" className="button button-dark facet-oct-sm">
                Book Consultation <ArrowRight size={14} />
              </Link>
            </div>

            <div className="contact-route-card facet-oct-sm">
              <span className="route-icon-wrap facet-oct-sm">
                <Phone size={22} strokeWidth={1.15} />
              </span>
              <h3>Direct Telephone & Concierge</h3>
              <p>Speak immediately with an MAH client advisor during salon operating hours for urgent commissions or guidance.</p>
              <a href="tel:+442074991234" className="button button-dark facet-oct-sm">
                Call +44 (0)20 7499 1234
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Showrooms & Salons Section */}
      <section className="contact-locations-section section-pad" style={{ background: "var(--white)" }}>
        <div className="shell">
          <div className="section-heading centred">
            <p className="eyebrow">Maison Destinations</p>
            <h2>Visit MAH in London</h2>
            <p style={{ maxWidth: 640, margin: "14px auto 0", color: "var(--muted)" }}>
              We welcome private visits by appointment to ensure dedicated salon privacy and curated diamond previews.
            </p>
          </div>

          <div className="locations-grid">
            {LOCATIONS.map((loc) => (
              <article key={loc.name} className="location-card facet-oct">
                <div className="location-img-wrap">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                  <span className="location-badge">{loc.district}</span>
                </div>
                <div className="location-card-body">
                  <span className="eyebrow">{loc.district}</span>
                  <h3>{loc.name}</h3>
                  <div className="location-details">
                    <p><MapPin size={15} /> {loc.address}, {loc.city}</p>
                    <p><Clock size={15} /> {loc.hours}</p>
                  </div>
                  <p className="location-desc">{loc.desc}</p>
                  <div className="location-ctas">
                    <Link href="/appointments" className="button button-dark facet-oct-sm">
                      Book at {loc.name.split(" ")[0]} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Contact Details Block */}
      <section className="contact-direct-section section-pad">
        <div className="shell contact-direct-box facet-oct">
          <div className="direct-grid">
            <div>
              <p className="eyebrow eyebrow-light">Client Concierge</p>
              <h2>We are here to guide you.</h2>
              <p>
                Every enquiry is handled personally with the utmost discretion by a certified MAH diamond specialist.
              </p>
            </div>
            <div className="direct-links-list">
              <div className="direct-item">
                <Mail size={18} />
                <div>
                  <small>Private Concierge Email</small>
                  <strong>concierge@mahdiamonds.com</strong>
                </div>
              </div>
              <div className="direct-item">
                <Phone size={18} />
                <div>
                  <small>Telephone Direct</small>
                  <strong>+44 (0)20 7499 1234</strong>
                </div>
              </div>
              <div className="direct-item">
                <Clock size={18} />
                <div>
                  <small>Salon Hours</small>
                  <strong>Mon – Sat: 10:00 – 18:00 GMT</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
