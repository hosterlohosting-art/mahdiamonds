import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DemoStoreProvider } from "@/components/demo-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { MaisonStructuredData } from "@/components/json-ld";
import { MaisonPreviewGate } from "@/components/maison-preview-gate";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const editorial = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mahdiamonds.co.uk"),
  title: {
    default: "MAH Diamonds | Maison de Haute Joaillerie London",
    template: "%s · MAH Diamonds London",
  },
  description:
    "Parisian poetry, British royal heraldry, and Hatton Garden diamond mastery united in certified milestone engagement rings, bespoke commissions and high jewellery.",
  keywords: [
    "diamond engagement rings london",
    "mayfair fine jewellery",
    "hatton garden diamonds",
    "GIA certified diamonds",
    "IGI lab grown diamonds",
    "bespoke engagement ring london",
    "british hallmarking act 1973",
    "haute joaillerie",
  ],
  authors: [{ name: "MAH Diamonds Ltd" }],
  creator: "MAH Diamonds London",
  publisher: "MAH Diamonds Ltd",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://mahdiamonds.co.uk",
    siteName: "MAH Diamonds London",
    title: "MAH Diamonds | Maison de Haute Joaillerie London",
    description:
      "Parisian poetry, British royal heraldry, and Hatton Garden diamond mastery united in certified milestone creations.",
    images: [
      {
        url: "/images/mah-hero-concept.png",
        width: 1200,
        height: 630,
        alt: "MAH Diamonds Solitaire Ring Presentation Box",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAH Diamonds | Maison de Haute Joaillerie London",
    description:
      "Parisian poetry, British royal heraldry, and Hatton Garden diamond mastery united in certified milestone creations.",
    images: ["/images/mah-hero-concept.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://use.typekit.net/eqs8npe.css" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-display-stack: "Cormorant Garamond", "Bodoni Moda", "Didot", "Bodoni MT", "Playfair Display", Georgia, serif;
                --font-editorial-stack: "Cormorant Garamond", "Bodoni Moda", "Playfair Display", Didot, serif;
                --font-sans-stack: "Montserrat", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                --font-serif: var(--font-display-stack);
                --font-sans: var(--font-sans-stack);
              }
              html, body {
                font-family: "Montserrat", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              h1, h2, h3, h4, h5, h6,
              .font-serif,
              .font-display,
              [class*="font-serif"],
              [class*="font-display"],
              .brand-mah,
              .category-title,
              .route-section-number,
              .lux-collection-content strong,
              .lux-story strong,
              .lux-signature-copy h2,
              .qs-pdp-title,
              .qs-pdp-section-title,
              .qs-atelier-content h3,
              .qs-editorial-feature h2,
              .qs-love-header h2 {
                font-family: "Cormorant Garamond", "Bodoni Moda", "Didot", "Bodoni MT", "Playfair Display", Georgia, serif !important;
                font-weight: 300;
                letter-spacing: 0.025em;
              }
              button, input, select, textarea,
              .button,
              .text-link,
              .eyebrow,
              .nav-link,
              .appointment-bar,
              .footer-links,
              .font-sans,
              [class*="font-sans"] {
                font-family: "Montserrat", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              }
              .eyebrow {
                letter-spacing: 0.28em !important;
                font-size: 0.65rem !important;
                text-transform: uppercase !important;
                font-weight: 500 !important;
              }
              .nav-link,
              .desktop-nav a {
                letter-spacing: 0.18em !important;
                font-size: 0.72rem !important;
                text-transform: uppercase !important;
                font-weight: 400 !important;
              }
              .button,
              .qs-primary-cta {
                letter-spacing: 0.16em !important;
                font-size: 0.72rem !important;
                text-transform: uppercase !important;
                font-weight: 500 !important;
              }
              .appointment-bar {
                letter-spacing: 0.16em !important;
                font-size: 0.65rem !important;
                text-transform: uppercase !important;
              }
              svg:not(.svg-raw),
              .lucide,
              [class*="lucide-"] {
                stroke-width: 1.15px !important;
                vector-effect: non-scaling-stroke;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var o = new MutationObserver(function(m) {
                  for (var i = 0; i < m.length; i++) {
                    if (m[i].type === 'attributes' && m[i].attributeName && m[i].attributeName.indexOf('bis_') === 0) {
                      m[i].target.removeAttribute(m[i].attributeName);
                    }
                  }
                });
                o.observe(document.documentElement, { attributes: true, subtree: true });
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={[display.variable, editorial.variable, sans.variable].join(" ")} suppressHydrationWarning>
        <MaisonStructuredData />
        <MaisonPreviewGate>
          <DemoStoreProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <Toaster position="top-right" />
          </DemoStoreProvider>
        </MaisonPreviewGate>
      </body>
    </html>
  );
}
