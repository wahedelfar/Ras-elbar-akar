// Schema Markup for SEO

interface PropertySchemaProps {
  property: any;
}

export function PropertySchema({ property }: PropertySchemaProps) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "RealEstateAgent",
    "name": property.title,
    "description": property.description,
    "image": property.images?.[0]?.imageUrl,
    "url": `https://raselbarrealtor-6ucdba76.manus.space/property/${property.id}`,
    "telephone": property.phoneNumber,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.location,
      "addressLocality": "رأس البر",
      "addressRegion": "الدقهلية",
      "addressCountry": "EG"
    },
    "priceRange": property.operationType === "sale" ? `${property.price}` : `${property.price}/month`,
    "areaServed": "Ras El Bar",
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "EGP",
      "availability": "https://schema.org/InStock",
      "description": `${property.type === "apartment" ? "شقة" : property.type === "villa" ? "فيلا" : property.type === "house" ? "منزل" : property.type === "land" ? "أرض" : "عقار"} - ${property.operationType === "sale" ? "للبيع" : "للإيجار"}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": property.viewCount || 0
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PropertyListSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "عقارات رأس البر",
    "image": "https://raselbarrealtor-6ucdba76.manus.space/og-image.jpg",
    "description": "منصة متخصصة في بيع وإيجار العقارات في رأس البر",
    "telephone": "+20",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "رأس البر",
      "addressRegion": "الدقهلية",
      "addressCountry": "EG"
    },
    "url": "https://raselbarrealtor-6ucdba76.manus.space",
    "sameAs": [
      "https://www.facebook.com",
      "https://www.twitter.com",
      "https://www.instagram.com"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
