import { useEffect } from 'react';

const SITE_NAME = 'GymFlex';

/**
 * Sets the document title for a page.
 * Pass a page-specific string (e.g. "Checkout") -> "Checkout | GymFlex".
 * Pass null/empty for the home page -> just "GymFlex".
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}

export { SITE_NAME };
