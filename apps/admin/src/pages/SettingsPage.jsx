import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ImageUp, Trash2, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { api, get, put } from '../lib/api';

const defaultHeroBanner = {
  animation: 'fade',
  animationDuration: 600,
  slideDuration: 4500,
  desktopImages: ['', '', ''],
  mobileImages: ['', '', ''],
};

const defaultHomepage = {
  heroTitle: 'GymFlex',
  heroAccent: 'for your next brand',
  heroSubtitle: 'Discover our exclusive collection of luxury collection-one, professional makeup boxes, and elegant organizers.',
  heroButtonText: 'Shop The Collection',
  heroButtonLink: '/shop',
  featuredProductId: 'h4',
  featuredEyebrow: 'Featured',
  featuredTitle: 'Featured Products',
  collectionKicker: 'COLLECTION',
  recentTitle: 'Recently Viewed',
  headerCollectionSlugs: ['collection-one', 'collection-two', 'collection-three'],
  heroBanner: defaultHeroBanner,
  shippingFee: 250,
  freeShippingMinimum: 0,
  taxRate: 0,
};

function normalizeHeroBanner(homepage) {
  return { ...defaultHeroBanner, ...(homepage.heroBanner || {}) };
}


function withCacheBust(url, value) {
  if (!url) return '';
  const separator = String(url).includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(value)}`;
}

function getHeroImages(homepage, device) {
  const heroBanner = normalizeHeroBanner(homepage);
  const images = device === 'mobile' ? heroBanner.mobileImages : heroBanner.desktopImages;
  return [0, 1, 2].map((index) => images?.[index] || '');
}

export function SettingsPage() {
  const [homepage, setHomepage] = useState(defaultHomepage);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploadingSlot, setUploadingSlot] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingHomepage, setSavingHomepage] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const [settingsData, productsData, categoriesData] = await Promise.all([
          get('/api/site-settings'),
          get('/api/products-admin'),
          get('/api/categories-admin'),
        ]);
        if (!cancelled) {
          const nextHomepage = { ...defaultHomepage, ...(settingsData.homepage || {}) };
          setHomepage({ ...nextHomepage, heroBanner: normalizeHeroBanner(nextHomepage) });
          setProducts(productsData.products || []);
          setCategories(categoriesData.categories || []);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'Failed to load settings');
      }
    }

    loadSettings();
    return () => { cancelled = true; };
  }, []);

  const heroBanner = normalizeHeroBanner(homepage);
  const headerSlugs = Array.isArray(homepage.headerCollectionSlugs)
    ? homepage.headerCollectionSlugs
    : String(homepage.headerCollectionSlugs || '').split(',').map((item) => item.trim()).filter(Boolean);
  const availableHeaderCategories = categories.filter((category) => !headerSlugs.includes(category.slug));

  const homepageErrors = useMemo(() => {
    const errors = [];
    if (!products.some((product) => product.id === homepage.featuredProductId)) errors.push('Choose a valid featured product.');
    if (headerSlugs.length === 0) errors.push('Add at least one header collection.');
    return errors;
  }, [homepage.featuredProductId, headerSlugs.length, products]);

  const setHeroField = (key, value) => {
    setHomepage((current) => ({
      ...current,
      heroBanner: { ...normalizeHeroBanner(current), [key]: value },
    }));
  };

  const setHeroImage = (device, index, url) => {
    setHomepage((current) => {
      const currentHero = normalizeHeroBanner(current);
      const key = device === 'mobile' ? 'mobileImages' : 'desktopImages';
      const nextImages = [0, 1, 2].map((slot) => currentHero[key]?.[slot] || '');
      nextImages[index] = url;
      return { ...current, heroBanner: { ...currentHero, [key]: nextImages } };
    });
  };

  const uploadHeroImage = async (device, index, file) => {
    if (!file) return;
    setUploadingSlot(`${device}-${index}`);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('area', 'hero');
      formData.append('device', device);
      formData.append('slot', String(index + 1));
      const data = await api('/api/site-asset', { method: 'POST', body: formData });
      setHeroImage(device, index, data.url);
      setMessage('Hero image uploaded. Save settings to publish it.');
    } catch (uploadError) {
      setError(uploadError.message || 'Failed to upload hero image');
    } finally {
      setUploadingSlot('');
    }
  };

  const updateHeaderSlugs = (nextSlugs) => setHomepage((current) => ({ ...current, headerCollectionSlugs: nextSlugs }));
  const moveHeaderSlug = (index, direction) => {
    const nextSlugs = [...headerSlugs];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextSlugs.length) return;
    const [item] = nextSlugs.splice(index, 1);
    nextSlugs.splice(targetIndex, 0, item);
    updateHeaderSlugs(nextSlugs);
  };
  const removeHeaderSlug = (slug) => updateHeaderSlugs(headerSlugs.filter((item) => item !== slug));
  const addHeaderSlug = (slug) => {
    if (!slug || headerSlugs.includes(slug)) return;
    updateHeaderSlugs([...headerSlugs, slug]);
  };

  const handleHomepageSubmit = async (event) => {
    event.preventDefault();
    setSavingHomepage(true);
    setMessage('');
    setError('');

    if (homepageErrors.length > 0) {
      setError(homepageErrors[0]);
      setSavingHomepage(false);
      return;
    }

    try {
      const data = await put('/api/site-settings', { homepage });
      const nextHomepage = { ...defaultHomepage, ...(data.homepage || {}) };
      setHomepage({ ...nextHomepage, heroBanner: normalizeHeroBanner(nextHomepage) });
      setMessage('Settings saved.');
    } catch (submitError) {
      setError(submitError.message || 'Failed to save settings');
    } finally {
      setSavingHomepage(false);
    }
  };

  const renderHeroSlot = (device, index) => {
    const imageUrl = getHeroImages(homepage, device)[index];
    const uploadKey = `${device}-${index}`;
    return (
      <div key={uploadKey} className="hero-slot-card">
        <div className="hero-slot-preview">
          {imageUrl ? <img src={withCacheBust(imageUrl, imageUrl)} alt={`${device} hero ${index + 1}`} /> : <span>{index + 1}</span>}
        </div>
        <div className="row-actions row-actions-compact">
          <label className="icon-action-link" aria-label={`Upload ${device} image ${index + 1}`} title="Upload">
            <ImageUp size={15} />
            <input type="file" accept="image/*" className="visually-hidden-file" onChange={(event) => uploadHeroImage(device, index, event.target.files?.[0])} disabled={uploadingSlot === uploadKey} />
          </label>
          {imageUrl ? (
            <button className="icon-action-link icon-action-danger" type="button" onClick={() => setHeroImage(device, index, '')} aria-label="Remove image" title="Remove">
              <X size={15} />
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="page-stack settings-desktop-page">
      <PageHeader title="Settings" />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      <form className="panel page-stack settings-main-panel" onSubmit={handleHomepageSubmit}>
        <div className="panel-header"><h2>Hero banner</h2></div>

        <div className="field-grid three-column">
          <label>
            Animation
            <select value={heroBanner.animation} onChange={(event) => setHeroField('animation', event.target.value)}>
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="zoom">Zoom</option>
              <option value="none">None</option>
            </select>
          </label>
          <label>
            Animation ms
            <input type="number" min="0" max="3000" step="50" value={heroBanner.animationDuration} onChange={(event) => setHeroField('animationDuration', Number(event.target.value))} />
          </label>
          <label>
            Time each image ms
            <input type="number" min="1000" max="20000" step="250" value={heroBanner.slideDuration} onChange={(event) => setHeroField('slideDuration', Number(event.target.value))} />
          </label>
        </div>

        <div className="hero-image-manager settings-hero-manager">
          <section>
            <h3>Desktop</h3>
            <div className="hero-slot-grid">{[0, 1, 2].map((index) => renderHeroSlot('desktop', index))}</div>
          </section>
          <section>
            <h3>Mobile</h3>
            <div className="hero-slot-grid">{[0, 1, 2].map((index) => renderHeroSlot('mobile', index))}</div>
          </section>
        </div>

        <div className="panel-header"><h2>Storefront</h2></div>
        <div className="field-grid two-column shipping-settings-grid">
          <label>
            Shipping fee
            <input type="number" min="0" value={homepage.shippingFee ?? 0} onChange={(event) => setHomepage((current) => ({ ...current, shippingFee: Number(event.target.value) }))} />
          </label>
          <label>
            Free shipping minimum
            <input type="number" min="0" value={homepage.freeShippingMinimum ?? 0} onChange={(event) => setHomepage((current) => ({ ...current, freeShippingMinimum: Number(event.target.value) }))} />
          </label>
          <label>
            Tax rate %
            <input type="number" min="0" max="100" step="0.01" value={homepage.taxRate ?? 0} onChange={(event) => setHomepage((current) => ({ ...current, taxRate: Number(event.target.value) }))} />
          </label>
        </div>

        <div className="field-grid two-column">
          <label>
            Featured eyebrow
            <input value={homepage.featuredEyebrow} onChange={(event) => setHomepage((current) => ({ ...current, featuredEyebrow: event.target.value }))} />
          </label>
          <label>
            Featured title
            <input value={homepage.featuredTitle} onChange={(event) => setHomepage((current) => ({ ...current, featuredTitle: event.target.value }))} />
          </label>
          <label>
            Collection kicker
            <input value={homepage.collectionKicker} onChange={(event) => setHomepage((current) => ({ ...current, collectionKicker: event.target.value }))} />
          </label>
          <label>
            Recently viewed title
            <input value={homepage.recentTitle} onChange={(event) => setHomepage((current) => ({ ...current, recentTitle: event.target.value }))} />
          </label>
        </div>

        <div className="form-card settings-header-collections">
          <div><h3 className="upload-card-title">Header collections</h3></div>
          <div className="stack-list">
            {headerSlugs.length === 0 ? <div className="empty-cell">No header collections selected.</div> : null}
            {headerSlugs.map((slug, index) => {
              const category = categories.find((item) => item.slug === slug);
              return (
                <div key={slug} className="stack-item">
                  <div>
                    <strong>{category?.name || slug}</strong>
                    <span className="table-subtext">/collections/{slug}</span>
                  </div>
                  <div className="row-actions row-actions-compact">
                    <button className="icon-action-link" type="button" onClick={() => moveHeaderSlug(index, -1)} disabled={index === 0} aria-label="Move up" title="Move up"><ArrowUp size={15} /></button>
                    <button className="icon-action-link" type="button" onClick={() => moveHeaderSlug(index, 1)} disabled={index === headerSlugs.length - 1} aria-label="Move down" title="Move down"><ArrowDown size={15} /></button>
                    <button className="icon-action-link icon-action-danger" type="button" onClick={() => removeHeaderSlug(slug)} aria-label="Remove" title="Remove"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
          </div>
          <label>
            Add collection
            <select value="" onChange={(event) => addHeaderSlug(event.target.value)}>
              <option value="">Choose a collection</option>
              {availableHeaderCategories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
          </label>
        </div>

        <label>
          Featured product
          <select value={homepage.featuredProductId} onChange={(event) => setHomepage((current) => ({ ...current, featuredProductId: event.target.value }))}>
            <option value="">Select featured product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </label>

        {homepageErrors.length > 0 ? (
          <div className="notice-box"><strong>Before saving:</strong><ul className="validation-list">{homepageErrors.map((item) => <li key={item}>{item}</li>)}</ul></div>
        ) : null}
        <button className="button button-primary" type="submit" disabled={savingHomepage}>{savingHomepage ? 'Saving...' : 'Save settings'}</button>
      </form>
    </div>
  );
}
