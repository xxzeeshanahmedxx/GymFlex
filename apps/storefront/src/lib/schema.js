const SITE_URL = 'https://gymflex-bg2.pages.dev';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GymFlex',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GymFlex',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productSchema(product) {
  const primaryImage = product?.primaryImageUrl || product?.primary_image_url || product?.images?.[0]?.cdnUrl || product?.images?.[0]?.cdn_url || '';
  const price = product?.salePrice ?? product?.sale_price ?? product?.price ?? 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    image: primaryImage,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: Number(price),
      availability: 'https://schema.org/InStock',
    },
  };
}
