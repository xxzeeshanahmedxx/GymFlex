export function filterProducts(products, { query = '', category = '', saleOnly = false, minPrice, maxPrice }) {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesQuery = !normalizedQuery || [product.name, product.category, product.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesCategory = !category || product.categorySlug === category;
    const matchesSale = !saleOnly || product.onSale;
    const effectivePrice = product.salePrice ?? product.price;
    const matchesMinPrice = minPrice == null || minPrice === '' || effectivePrice >= Number(minPrice);
    const matchesMaxPrice = maxPrice == null || maxPrice === '' || effectivePrice <= Number(maxPrice);

    return matchesQuery && matchesCategory && matchesSale && matchesMinPrice && matchesMaxPrice;
  });
}

export function sortProducts(products, sortBy = 'featured') {
  const items = [...products];

  switch (sortBy) {
    case 'price-low':
      return items.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case 'price-high':
      return items.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case 'name-asc':
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return items.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return items.sort((a, b) => {
        if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
        return (b.sortOrder ?? 0) - (a.sortOrder ?? 0);
      });
    default:
      return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }
}
