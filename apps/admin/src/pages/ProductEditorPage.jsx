import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, Plus, Star, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useConfirm } from '../components/ConfirmProvider';
import { get, post, put, del, api } from '../lib/api';

const emptyForm = {
  name: '',
  category_id: '',
  description: '',
  price: 0,
  sale_price: '',
  on_sale: false,
  is_active: true,
  is_featured: false,
  sort_order: 0,
  variantType: 'Option',
  video_url: '',
  meta_title: '',
  meta_description: '',
};

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function variantsFromText(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [type, name] = line.split('|').map((part) => part.trim());
      return { type: type || 'Option', name: name || type || 'Option' };
    });
}

function textFromVariants(variants = []) {
  return variants.map((variant) => `${variant.type}|${variant.name}`).join('\n');
}

function createVariantRow(overrides = {}) {
  return {
    id: overrides.id || crypto.randomUUID(),
    name: overrides.name || '',
    image_url: overrides.image_url || overrides.imageUrl || '',
    is_active: overrides.is_active !== false && overrides.isActive !== false,
    stock: overrides.stock ?? 0,
  };
}

function rowsFromVariants(variants = []) {
  const rows = variants.map((variant) => createVariantRow(variant));
  return rows.length > 0 ? rows : [createVariantRow()];
}

function variantsFromRows(rows = [], type = 'Option') {
  return rows
    .map((row, index) => ({
      id: row.id,
      type: String(type || 'Option').trim() || 'Option',
      name: String(row.name || '').trim(),
      image_url: String(row.image_url || '').trim(),
      is_active: row.is_active !== false,
      stock: Number(row.stock ?? 0),
      sort_order: index,
    }))
    .filter((variant) => variant.name);
}

function ToggleField({ checked, onChange, label }) {
  return (
    <label className={`toggle-chip ${checked ? 'active' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function imageUrl(image) {
  return withCacheBust(image.cdn_url, `${image.id}-${image.sort_order}-${image.is_primary ? 1 : 0}-${image.created_at || ''}`);
}

function reorderImages(images, draggedId, targetId) {
  const items = [...images];
  const draggedIndex = items.findIndex((image) => image.id === draggedId);
  const targetIndex = items.findIndex((image) => image.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
    return images;
  }

  const [draggedItem] = items.splice(draggedIndex, 1);
  items.splice(targetIndex, 0, draggedItem);
  return items;
}


function withCacheBust(url, value) {
  if (!url) return '';
  const separator = String(url).includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(value)}`;
}

export function ProductEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [variantRows, setVariantRows] = useState([createVariantRow()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const dirty = useRef(false);
  const confirm = useConfirm();

  const markDirty = useCallback(() => { dirty.current = true; }, []);
  useEffect(() => {
    const handler = (e) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const title = useMemo(() => (isNew ? 'Create product' : `Edit ${product?.name || 'product'}`), [isNew, product]);
  const generatedSlug = useMemo(() => slugify(form.name), [form.name]);
  const orderedImages = useMemo(
    () => [...images].sort((a, b) => a.sort_order - b.sort_order || Number(b.is_primary) - Number(a.is_primary)),
    [images],
  );

  const formErrors = useMemo(() => {
    const errors = [];
    const price = Number(form.price);
    const salePrice = form.sale_price === '' ? null : Number(form.sale_price);

    if (form.name.trim().length < 3) errors.push('Product name should be at least 3 characters long.');
    if (!form.category_id) errors.push('Category is required.');
    if (!Number.isFinite(price) || price <= 0) errors.push('Price must be greater than zero.');
    if (salePrice != null && (!Number.isFinite(salePrice) || salePrice <= 0)) errors.push('Sale price must be greater than zero.');
    if (salePrice != null && Number.isFinite(price) && salePrice >= price) errors.push('Sale price should be lower than the regular price.');
    if (Number(form.sort_order) < 0) errors.push('Sort order cannot be negative.');

    return errors;
  }, [form, generatedSlug]);

  const loadImages = useCallback(async (productId) => {
    if (!productId) {
      setImages([]);
      return;
    }

    const imagesData = await get(`/api/product-images?productId=${productId}`);
    setImages(imagesData.images || []);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const categoryData = await get('/api/categories-admin');
      setCategories(categoryData.categories);

      if (!isNew) {
        const productData = await get(`/api/product?id=${id}`);
        setProduct(productData.product);
        setForm({
          name: productData.product.name,
          category_id: productData.product.category_id,
          description: productData.product.description || '',
          price: productData.product.price,
          sale_price: productData.product.sale_price ?? '',
          on_sale: productData.product.on_sale,
          is_active: productData.product.is_active,
          is_featured: productData.product.is_featured,
          sort_order: productData.product.sort_order,
          variantType: productData.variants?.[0]?.type || 'Option',
          video_url: productData.product.video_url || '',
          meta_title: productData.product.meta_title || '',
          meta_description: productData.product.meta_description || '',
        });
        setVariantRows(rowsFromVariants(productData.variants));
        await loadImages(productData.product.id);
      } else {
        setProduct(null);
        setImages([]);
        setVariantRows([createVariantRow()]);
        setForm(emptyForm);
      }
    } catch (loadError) {
      setError(loadError.message || 'Failed to load product data');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, loadImages]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (key, value) => {
    markDirty();
    setForm((currentValue) => ({ ...currentValue, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (formErrors.length > 0) {
      setError(formErrors[0]);
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      slug: generatedSlug,
      price: Number(form.price),
      sale_price: form.sale_price === '' ? null : Number(form.sale_price),
      sort_order: Number(form.sort_order),
      variants: variantsFromRows(variantRows, form.variantType),
    };

    try {
      const response = isNew ? await post('/api/products-admin', payload) : await put(`/api/product?id=${id}`, payload);
      setMessage(isNew ? 'Product created successfully.' : 'Product updated successfully.');
      dirty.current = false;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      if (isNew && response?.product?.id) {
        navigate(`/products/${response.product.id}`);
      } else {
        await loadData();
      }
    } catch (saveError) {
      setError(saveError.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const duplicateProduct = async () => {
    if (!id) return;
    setError('');
    setMessage('');
    try {
      const result = await post('/api/product-duplicate', { id });
      setMessage('Product duplicated.');
      navigate(`/products/${result.id}`);
    } catch (dupError) {
      setError(dupError.message || 'Failed to duplicate product');
    }
  };

  const uploadImages = async (selectedFiles = files) => {
    if (!selectedFiles.length || !product?.id) return;
    const unsupportedFile = selectedFiles.find((file) => !String(file.type || '').startsWith('image/'));
    if (unsupportedFile) {
      setError('Only image files can be uploaded.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('files', file));
      await api(`/api/product-images?productId=${product.id}`, { method: 'POST', body: formData });
      setFiles([]);
      setMessage(`Uploaded ${selectedFiles.length} image${selectedFiles.length === 1 ? '' : 's'}.`);
      await loadImages(product.id);
    } catch (uploadError) {
      setError(uploadError.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelection = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    uploadImages(selectedFiles);
    event.target.value = '';
  };

  const deleteImage = async (imageId) => {
    const ok = await confirm({ title: 'Delete image?', message: 'This image will be removed from the product.', confirmLabel: 'Delete' });
    if (!ok) return;

    try {
      await del(`/api/product-image?productId=${product.id}&imageId=${imageId}`);
      setMessage('Image deleted.');
      await loadImages(product.id);
    } catch (imageError) {
      setError(imageError.message || 'Failed to delete image');
    }
  };

  const persistImageOrder = async (nextOrder) => {
    if (!product?.id || nextOrder.length === 0) return;
    setImages(nextOrder.map((image, index) => ({ ...image, sort_order: index, is_primary: index === 0 ? 1 : 0 })));
    setReordering(true);
    setError('');

    try {
      await post(`/api/product-image-order?productId=${product.id}`, {
        imageIds: nextOrder.map((image) => image.id),
      });
      setMessage('Image order updated.');
      await loadImages(product.id);
    } catch (imageError) {
      setError(imageError.message || 'Failed to reorder images');
      await loadImages(product.id);
    } finally {
      setReordering(false);
    }
  };

  const moveImage = async (imageId, direction) => {
    const currentIndex = orderedImages.findIndex((image) => image.id === imageId);
    const nextIndex = currentIndex + direction;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= orderedImages.length) return;

    const nextOrder = [...orderedImages];
    const [item] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(nextIndex, 0, item);
    await persistImageOrder(nextOrder);
  };

  const handleDropImage = async (targetImageId) => {
    if (!draggedImageId || draggedImageId === targetImageId || !product?.id) {
      setDraggedImageId('');
      return;
    }

    const nextOrder = reorderImages(orderedImages, draggedImageId, targetImageId);
    setDraggedImageId('');
    await persistImageOrder(nextOrder);
  };


  const addVariantRow = () => {
    setVariantRows((current) => [...current, createVariantRow()]);
  };

  const updateVariantRow = (rowId, key, value) => {
    setVariantRows((current) => current.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)));
  };

  const removeVariantRow = (rowId) => {
    setVariantRows((current) => (current.length <= 1 ? [createVariantRow()] : current.filter((row) => row.id !== rowId)));
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={title}
        actions={
          <div className="row-actions">
            {!isNew ? (
              <button className="icon-action-link" type="button" onClick={duplicateProduct} aria-label="Duplicate product" title="Duplicate product">
                <Copy size={16} />
              </button>
            ) : null}
            <Link className="button button-secondary" to="/products">Back to products</Link>
          </div>
        }
      />

      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      {loading ? (
        <div className="panel-grid two-column product-editor-layout">
          <section className="panel skeleton-form-card"><div className="skeleton skeleton-field" /><div className="skeleton skeleton-field" /><div className="skeleton skeleton-field" /><div className="skeleton skeleton-textarea" /><div className="skeleton skeleton-field" /></section>
          <section className="panel"><div className="simple-image-manager"><div className="skeleton skeleton-image-tile" /><div className="skeleton skeleton-image-tile" /><div className="skeleton skeleton-image-tile" /></div></section>
        </div>
      ) : (
        <div className="panel-grid two-column product-editor-layout">
          <section className="panel">
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="product-basic-stack">
                <label className="product-name-field">
                  Product name
                  <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} required />
                </label>

                <div className="paired-field-row">
                  <label>
                    Category
                    <select value={form.category_id} onChange={(event) => handleChange('category_id', event.target.value)} required>
                      <option value="">Select a category</option>
                      {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </label>
                  <label>
                    Sort order
                    <input type="number" min="0" value={form.sort_order} onChange={(event) => handleChange('sort_order', event.target.value)} />
                  </label>
                </div>

                <div className="paired-field-row">
                  <label>
                    Price
                    <input type="number" min="1" value={form.price} onChange={(event) => handleChange('price', event.target.value)} required />
                  </label>
                  <label>
                    Sale price
                    <input type="number" min="0" value={form.sale_price} onChange={(event) => handleChange('sale_price', event.target.value)} />
                  </label>
                </div>
              </div>

              <label>
                Description
                <textarea rows="5" value={form.description} onChange={(event) => handleChange('description', event.target.value)} />
              </label>

              <label>
                Video URL (YouTube embed URL)
                <input value={form.video_url} onChange={(event) => handleChange('video_url', event.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </label>

              <label>
                Meta title (SEO)
                <input value={form.meta_title} onChange={(event) => handleChange('meta_title', event.target.value)} placeholder="Custom page title for search engines" />
              </label>

              <label>
                Meta description (SEO)
                <textarea rows="2" value={form.meta_description} onChange={(event) => handleChange('meta_description', event.target.value)} placeholder="Custom description for search engines" />
              </label>

              <section className="variant-manager">
                <div className="variant-manager-head">
                  <label>
                    Option label
                    <input value={form.variantType} onChange={(event) => handleChange('variantType', event.target.value)} placeholder="Color, Size, Style" />
                  </label>
                  <button className="icon-action-link" type="button" onClick={addVariantRow} aria-label="Add variant" title="Add option">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="variant-row-list">
                  {variantRows.map((row, index) => (
                    <div className="variant-row" key={row.id}>
                      <span className="variant-row-number">{index + 1}</span>
                      <input value={row.name} onChange={(event) => updateVariantRow(row.id, 'name', event.target.value)} placeholder="Option name" />
                      <select value={row.image_url} onChange={(event) => updateVariantRow(row.id, 'image_url', event.target.value)} title="Variant image">
                        <option value="">No image</option>
                        {orderedImages.map((image, imageIndex) => (
                          <option key={image.id} value={image.cdn_url}>Image {imageIndex + 1}{image.is_primary ? ' cover' : ''}</option>
                        ))}
                      </select>
                              <input type="number" min="0" value={row.stock ?? 0} onChange={(event) => updateVariantRow(row.id, 'stock', event.target.value)} placeholder="Stock" className="variant-stock-input" title="Stock quantity" />
                      <label className={`variant-stock-toggle ${row.is_active !== false ? 'active' : ''}`} title={row.is_active !== false ? 'Variant in stock' : 'Variant off'}>
                        <input type="checkbox" checked={row.is_active !== false} onChange={(event) => updateVariantRow(row.id, 'is_active', event.target.checked)} />
                        <span>{row.is_active !== false ? 'On' : 'Off'}</span>
                      </label>
                      <button className="icon-action-link icon-action-danger" type="button" onClick={() => removeVariantRow(row.id)} aria-label="Remove variant" title="Remove option">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {formErrors.length > 0 ? (
                <div className="notice-box">
                  <strong>Before saving:</strong>
                  <ul className="validation-list">
                    {formErrors.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ) : null}

              <div className="toggle-chip-row">
                <ToggleField checked={form.on_sale} onChange={(value) => handleChange('on_sale', value)} label="On sale" />
                <ToggleField checked={form.is_active} onChange={(value) => handleChange('is_active', value)} label="Active" />
                <ToggleField checked={form.is_featured} onChange={(value) => handleChange('is_featured', value)} label="Featured" />
              </div>

              <button className={`button button-primary ${saveSuccess ? 'button-success' : ''}`} type="submit" disabled={saving}>
                {saving ? <span className="save-indicator saving"><span className="save-spinner" /> Saving...</span> : saveSuccess ? <span className="save-indicator saved"><Check size={16} /> Saved</span> : isNew ? 'Create product' : 'Save changes'}
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-header"><h2>Images</h2></div>
            {isNew ? (
              <div className="empty-cell">Create the product first, then upload images.</div>
            ) : (
              <>
                <div className="simple-image-manager">
                  <label className={`image-upload-tile ${uploading ? 'uploading' : ''}`} title="Upload images">
                    <input type="file" multiple accept="image/*" onChange={handleImageSelection} disabled={uploading} />
                    <span className="image-upload-plus"><Plus size={22} /></span>
                    <strong>{uploading ? 'Uploading' : 'Add images'}</strong>
                  </label>

                  {orderedImages.map((image, index) => (
                    <article
                      key={image.id}
                      className={`image-card image-card-draggable simple-image-card ${draggedImageId === image.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={() => setDraggedImageId(image.id)}
                      onDragEnd={() => setDraggedImageId('')}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleDropImage(image.id)}
                    >
                      <button className="image-delete-button" type="button" onClick={() => deleteImage(image.id)} aria-label="Delete image" title="Delete image">
                        <Trash2 size={14} />
                      </button>
                      <div className="image-reorder-controls" aria-label="Image order controls">
                        <button className="image-reorder-button" type="button" onClick={() => moveImage(image.id, -1)} disabled={index === 0 || reordering} aria-label="Move image left" title="Move left">
                          <ArrowLeft size={14} />
                        </button>
                        <button className="image-reorder-button" type="button" onClick={() => moveImage(image.id, 1)} disabled={index === orderedImages.length - 1 || reordering} aria-label="Move image right" title="Move right">
                          <ArrowRight size={14} />
                        </button>
                      </div>
                      {image.is_primary ? <span className="image-primary-badge"><Star size={12} /> Cover</span> : null}
                      <img src={imageUrl(image)} alt={image.alt_text || product.name} />
                    </article>
                  ))}
                </div>

                {orderedImages.length === 0 ? <p className="image-help-text">Add images with the plus box.</p> : null}
                {reordering ? <p className="image-help-text">Saving image order…</p> : orderedImages.length > 1 ? <p className="image-help-text">Use arrows to reorder.</p> : null}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
