import { useEffect } from 'react';

const SITE_NAME = 'GymFlex';
const DEFAULT_DESC = 'Premium gym wear engineered for performance. Train harder, look better. Shop GymFlex Pakistan.';

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (name.startsWith('og:')) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageTitle(title, description) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;
    setMeta('og:title', fullTitle);
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description);
    }
  }, [title, description]);
}

export { SITE_NAME };
