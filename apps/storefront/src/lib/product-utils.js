export function getEffectivePrice(product) {
  if (!product) {
    return 0;
  }

  if (product.onSale && product.salePrice != null) {
    return Number(product.salePrice);
  }

  if (product.on_sale && product.sale_price != null) {
    return Number(product.sale_price);
  }

  return Number(product.price || 0);
}

export function getProductCategoryName(product) {
  return product?.category || product?.category_name || 'Product';
}

export function getProductCategorySlug(product) {
  return product?.categorySlug || product?.category_slug || product?.slug || '';
}

export function getProductPrimaryImage(product) {
  return product?.primaryImageUrl || product?.primary_image_url || product?.images?.find((image) => image.isPrimary)?.cdnUrl || product?.images?.find((image) => image.is_primary)?.cdn_url || product?.images?.[0]?.cdnUrl || product?.images?.[0]?.cdn_url || null;
}

export function getProductPath(product) {
  const slug = product?.productSlug || product?.slug || product?.id || '';
  return `/product/${slug}`;
}

export function normalizeApiImage(image) {
  return {
    id: image.id,
    r2Key: image.r2_key,
    cdnUrl: image.cdn_url,
    altText: image.alt_text || '',
    sortOrder: Number(image.sort_order || 0),
    isPrimary: Boolean(image.is_primary),
  };
}

export function normalizeApiVariant(variant) {
  return {
    id: variant.id,
    type: variant.type,
    name: variant.name,
    imageUrl: variant.image_url || variant.imageUrl || '',
    image_url: variant.image_url || variant.imageUrl || '',
    isActive: Boolean(variant.is_active ?? variant.isActive ?? true),
    is_active: Boolean(variant.is_active ?? variant.isActive ?? true),
    sortOrder: Number(variant.sort_order || 0),
  };
}

export function normalizeApiProduct(product, variants = [], images = [], lookProducts = []) {
  return {
    id: product.id,
    name: product.name,
    category: product.category_name || product.category || 'Product',
    categorySlug: product.category_slug || product.categorySlug || '',
    productSlug: product.slug || product.productSlug || '',
    description: product.description || '',
    price: Number(product.price || 0),
    onSale: Boolean(product.on_sale ?? product.onSale),
    salePrice: product.sale_price == null ? null : Number(product.sale_price),
    isActive: Boolean(product.is_active ?? product.isActive),
    isFeatured: Boolean(product.is_featured ?? product.isFeatured),
    sortOrder: Number(product.sort_order || 0),
    primaryImageUrl: product.primary_image_url || product.primaryImageUrl || null,
    video_url: product.video_url || '',
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    avg_rating: product.avg_rating ? Number(product.avg_rating) : 0,
    review_count: Number(product.review_count || 0),
    variants: variants.map(normalizeApiVariant),
    images: images.map(normalizeApiImage),
    lookProducts: lookProducts.map(normalizeApiProduct),
  };
}
