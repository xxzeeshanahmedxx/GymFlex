const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price low' },
  { value: 'price-high', label: 'Price high' },
  { value: 'name-asc', label: 'A to Z' },
  { value: 'name-desc', label: 'Z to A' },
  { value: 'newest', label: 'Newest' },
];

export function CatalogControls({
  sortBy,
  onSortChange,
  category,
  onCategoryChange,
  categories = [],
  showCategoryFilter = false,
  saleOnly = false,
  onSaleOnlyChange,
  showSaleToggle = false,
  onResetFilters,
  hasActiveFilters,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}) {
  return (
    <div className="catalog-controls mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap sm:justify-end">
      {showCategoryFilter ? (
        <label className="catalog-filter-label text-xs font-bold uppercase tracking-widest text-gray-500 sm:w-52">
          Category
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-pink focus:bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="catalog-filter-label text-xs font-bold uppercase tracking-widest text-gray-500 sm:w-36">
        Min Price
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          placeholder="Min"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-pink focus:bg-white"
        />
      </label>

      <label className="catalog-filter-label text-xs font-bold uppercase tracking-widest text-gray-500 sm:w-36">
        Max Price
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          placeholder="Max"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-pink focus:bg-white"
        />
      </label>

      <label className="catalog-sort-inline text-xs font-bold text-gray-500">
        <span>Sort by</span>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-36 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-brand-pink focus:bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      {showSaleToggle ? (
        <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-600">
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={(event) => onSaleOnlyChange(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
          />
          Sale Only
        </label>
      ) : null}

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 transition hover:border-brand-pink hover:text-brand-pink"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
