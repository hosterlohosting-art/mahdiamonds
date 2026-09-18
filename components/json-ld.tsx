export function MaisonStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JewelryStore",
        "@id": "https://mahdiamonds.co.uk/#mayfair-salon",
        "name": "MAH Diamonds — Mayfair Flagship Salon",
        "description": "British haute joaillerie maison crafting GIA and IGI certified diamond engagement rings, bespoke commissions and high jewellery in London.",
        "url": "https://mahdiamonds.co.uk",
        "logo": "https://mahdiamonds.co.uk/images/brand/mah-crest.png",
        "image": "https://mahdiamonds.co.uk/images/mah-hero-concept.png",
        "telephone": "+44 (0)20 7946 0920",
        "email": "concierge@mahdiamonds.co.uk",
        "priceRange": "££££",
        "currenciesAccepted": "GBP, USD, EUR, AED",
        "paymentAccepted": "Credit Card, Apple Pay, Bank Wire Transfer",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "14 New Bond Street, Mayfair",
          "addressLocality": "London",
          "postalCode": "W1S 3PF",
          "addressCountry": "GB"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 51.5113,
          "longitude": -0.1444
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      },
      {
        "@type": "JewelryStore",
        "@id": "https://mahdiamonds.co.uk/#hatton-garden-atelier",
        "name": "MAH Diamonds — Hatton Garden Atelier",
        "description": "London diamond district workshop and private appointment consultation salon with direct master goldsmith bench access.",
        "url": "https://mahdiamonds.co.uk/contact",
        "telephone": "+44 (0)20 7946 0921",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "32 Hatton Garden, Holborn",
          "addressLocality": "London",
          "postalCode": "EC1N 8DL",
          "addressCountry": "GB"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 51.5186,
          "longitude": -0.1077
        }
      },
      {
        "@type": "Organization",
        "@id": "https://mahdiamonds.co.uk/#organization",
        "name": "MAH Diamonds Ltd",
        "url": "https://mahdiamonds.co.uk",
        "logo": "https://mahdiamonds.co.uk/images/brand/mah-crest.png",
        "sameAs": [
          "https://instagram.com/mahdiamonds",
          "https://pinterest.com/mahdiamonds"
        ],
        "knowsAbout": [
          "Diamond Engagement Rings",
          "GIA & IGI Certified Diamonds",
          "Bespoke High Jewellery Commissions",
          "British Hallmarking Act 1973"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://mahdiamonds.co.uk/#website",
        "url": "https://mahdiamonds.co.uk",
        "name": "MAH Diamonds London",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://mahdiamonds.co.uk/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
