import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, FilterX, Percent, PencilLine, Plus, Star, Trash2, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useConfirm } from '../components/ConfirmProvider';
import { del, get } from '../lib/api';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'featured', label: 'Featured' },
  { value: 'missing-images', label: 'No image' },
  { value: 'on-sale', label: 'Sale' },
];

const sortOptions = [
  { value: 'name-asc', label: 'A–Z' },
  { value: 'name-desc', label: 'Z–A' },
  { value: 'price-low', label: 'Low price' },
  { value: 'price-high', label: 'High price' },
  { value: 'featured-first', label: 'Featured' },
];


function productThumbUrl(product) {
  if (!product.primary_image_url) return '';
  return withCacheBust(product.primary_image_url, `${product.id}-${product.image_count}-${product.updated_at || ''}`);
}

function sortProducts(products, sortBy) {
  const items = [...products];
  switch (sortBy) {
    case 'name-desc': return items.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-low': return items.sort((a, b) => a.effective_price - b.effective_price);
    case 'price-high': return items.sort((a, b) => b.effective_price - a.effective_price);
    case 'featured-first': return items.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.name.localeCompare(b.name));
    case 'name-asc':
    default: return items.sort((a, b) => a.name.localeCompare(b.name));
  }
}


function withCacheBust(url, value) {
  if (!url) return '';
  const separator = String(url).includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(value)}`;
}

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/api/products-admin');
      setProducts(data.products);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category_name))).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase();
    const nextProducts = products.filter((product) => {
      const matchesQuery = !value || [product.name, product.category_name].some((field) => field?.toLowerCase().includes(value));
      const matchesCategory = category === 'all' || product.category_name === category;
      const matchesStatus = (() => {
        switch (status) {
          case 'active': return product.is_active;
          case 'inactive': return !product.is_active;
          case 'featured': return product.is_featured;
          case 'missing-images': return product.image_count === 0;
          case 'on-sale': return product.on_sale;
          default: return true;
        }
      })();
      return matchesQuery && matchesCategory && matchesStatus;
    });
    return sortProducts(nextProducts, sortBy);
  }, [products, query, category, status, sortBy]);

  const hasActiveFilters = query.trim() || category !== 'all' || status !== 'all' || sortBy !== 'name-asc';
  const clearFilters = () => { setQuery(''); setCategory('all'); setStatus('all'); setSortBy('name-asc'); };

  const handleDelete = async (productId) => {
    const ok = await confirm({ title: 'Delete product?', message: 'This removes the product and its images if it has no order history.', confirmLabel: 'Delete' });
    if (!ok) return;
    try {
      await del(`/api/product?id=${productId}`);
      await loadProducts();
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete product');
    }
  };

  return (
    <div className="page-stack products-minimal-page">
      <PageHeader
        title="Products"
        actions={
          <Link className="button button-primary button-compact" to="/products/new" aria-label="New product" title="New product">
            <Plus size={16} />
            New
          </Link>
        }
      />

      <div className="toolbar product-toolbar-minimal">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">Category</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        {hasActiveFilters ? (
          <button className="icon-action-link" type="button" onClick={clearFilters} aria-label="Clear filters" title="Clear filters">
            <FilterX size={16} />
          </button>
        ) : null}
        <span className="toolbar-count compact-count">{filteredProducts.length}</span>
      </div>

      {error ? <div className="error-box">{error}</div> : null}

      <section className="panel panel-compact">
        <div className="table-wrap">
          <table className="dense-table responsive-table product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="align-right">Price</th>
                <th className="align-right">Variants</th>
                <th className="align-right">Status</th>
                <th className="icon-column" />
                <th className="icon-column" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }, (_, index) => (
                  <tr key={`loading-${index}`} className="skeleton-table-row">
                    <td data-label="Product"><div className="skeleton-row-title"><div className="skeleton skeleton-thumb" /><div className="skeleton-card-grid" style={{ flex: 1 }}><div className="skeleton skeleton-line medium" /><div className="skeleton skeleton-line short" /></div></div></td>
                    <td className="align-right" data-label="Price"><div className="skeleton skeleton-line short" /></td>
                    <td className="align-right" data-label="Variants"><div className="skeleton skeleton-line short" /></td>
                    <td className="align-right" data-label="Status"><div className="skeleton skeleton-line short" /></td>
                    <td className="icon-column actions-cell"><div className="skeleton skeleton-thumb" style={{ width: 30, height: 30 }} /></td>
                    <td className="icon-column actions-cell"><div className="skeleton skeleton-thumb" style={{ width: 30, height: 30 }} /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="empty-cell">No products found.</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td data-label="Product">
                    <div className="table-title-cell table-title-cell-compact">
                      <div className="mini-thumb mini-thumb-compact">
                        {product.primary_image_url ? <img src={productThumbUrl(product)} alt={product.name} /> : <span>No image</span>}
                        <span className="image-count-badge">{product.image_count}</span>
                      </div>
                      <div>
                        <strong title={product.name}>{product.name}</strong>
                        <span className="table-subtext">{product.category_name} · {product.variant_count} variants</span>
                        <div className="mobile-product-category">{product.category_name}</div>
                        <div className="mobile-product-meta-row">
                          <span><b>Price:</b> {product.effective_price}</span>
                          <span><b>Variants:</b> {product.variant_count}</span>
                        </div>
                        <div className="mobile-product-bottom-row">
                          <div className="status-icon-row" aria-label="product status icons">
                            {product.is_featured ? <span className="status-icon status-icon-featured" title="Featured"><Star size={15} /></span> : null}
                            {product.on_sale ? <span className="status-icon status-icon-sale" title="On sale"><Percent size={15} /></span> : null}
                            {product.is_active ? <span className="status-icon status-icon-active" title="Active"><Check size={15} /></span> : <span className="status-icon status-icon-inactive" title="Inactive"><X size={15} /></span>}
                          </div>
                          <div className="mobile-product-actions">
                            <Link className="icon-action-link" to={`/products/${product.id}`} aria-label={`Edit ${product.name}`} title="Edit">
                              <PencilLine size={16} />
                            </Link>
                            <button className="icon-action-link icon-action-danger" type="button" onClick={() => handleDelete(product.id)} aria-label={`Delete ${product.name}`} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="align-right" data-label="Price">{product.effective_price}</td>
                  <td className="align-right" data-label="Variants">{product.variant_count}</td>
                  <td className="align-right" data-label="Status">
                    <div className="status-icon-row status-icon-row-right" aria-label="product status icons">
                      {product.is_featured ? <span className="status-icon status-icon-featured" title="Featured"><Star size={15} /></span> : null}
                      {product.on_sale ? <span className="status-icon status-icon-sale" title="On sale"><Percent size={15} /></span> : null}
                      {product.is_active ? <span className="status-icon status-icon-active" title="Active"><Check size={15} /></span> : <span className="status-icon status-icon-inactive" title="Inactive"><X size={15} /></span>}
                    </div>
                  </td>
                  <td className="icon-column actions-cell" data-label="Edit">
                    <Link className="icon-action-link" to={`/products/${product.id}`} aria-label={`Edit ${product.name}`} title="Edit">
                      <PencilLine size={16} />
                    </Link>
                  </td>
                  <td className="icon-column actions-cell" data-label="Delete">
                    <button className="icon-action-link icon-action-danger" type="button" onClick={() => handleDelete(product.id)} aria-label={`Delete ${product.name}`} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
