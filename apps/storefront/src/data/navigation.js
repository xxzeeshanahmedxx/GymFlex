export const mainNavigation = [
  { label: 'Shop All', to: '/shop' },
  { label: "Men's", to: '/collections/mens' },
  { label: 'Sale', to: '/sale', highlight: true },
];

export const footerSections = [
  {
    title: 'Shop',
    links: [
      { label: 'Shop All', to: '/shop' },
      { label: 'Sale', to: '/sale' },
      { label: 'Track Order', to: '/track-order' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
];
