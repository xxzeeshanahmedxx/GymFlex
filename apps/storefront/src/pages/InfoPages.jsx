import { useEffect, useState } from 'react';
import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const contactItems = [
  { icon: Mail, label: 'Email', value: 'support@gymflex.pk' },
  { icon: Phone, label: 'Phone', value: '+92 300 1234567' },
  { icon: MapPin, label: 'Location', value: 'Pakistan' },
];

const pageContent = {
  about: {
    title: 'About GymFlex',
    body: [
      'GymFlex is Pakistan\'s premier gym wear brand, engineered for performance and designed for style.',
      'Our mission is to equip every athlete with gear that moves as hard as they do. From moisture-wicking fabrics to ergonomic fits, every piece is built to help you train harder and look better.',
    ],
  },
  shipping: {
    title: 'Shipping',
    body: ['We offer Cash on Delivery (COD) across all major cities in Pakistan.', 'Free shipping on orders over 1,000 PKR. Standard shipping fee of 250 PKR applies to orders below 1,000 PKR.', 'Orders are processed within 24-48 hours and delivered within 3-5 business days.'],
  },
  returns: {
    title: 'Returns & Exchanges',
    body: ['We want you to love your GymFlex gear. If something isn\'t right, you can return or exchange unused items within 7 days of delivery.', 'Items must be unworn, unwashed, and in original packaging. Contact our support team to initiate a return.'],
  },
  privacy: {
    title: 'Privacy Policy',
    body: ['Your privacy matters to us. We only collect information necessary to process your orders and improve your shopping experience.', 'We do not share your personal data with third parties. Your payment information is processed securely and never stored on our servers.'],
  },
  terms: {
    title: 'Terms of Service',
    body: ['By using GymFlex, you agree to our terms. All products are subject to availability. Prices are listed in PKR and may change without notice.', 'We reserve the right to cancel any order due to pricing errors or stock unavailability. Delivery times are estimates and not guaranteed.'],
  },
};

export function InfoPage({ type }) {
  const content = pageContent[type] || pageContent.about;
  usePageTitle(content.title);
  return (
    <main className="flex-grow bg-white px-4 py-14 sm:py-20">
      <section className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-pink">GymFlex</p>
        <h1 className="mt-3 font-heading text-4xl font-[850] text-gray-900">{content.title}</h1>
        <div className="mt-6 space-y-4 text-base leading-8 text-gray-600">
          {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
    </main>
  );
}

export function FAQ() {
  usePageTitle('FAQ');
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/faq').then((r) => r.json()).then((data) => { if (!cancelled) setItems(data.items || []); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return (
    <main className="flex-grow bg-white px-4 py-14 sm:py-20">
      <section className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-pink">GymFlex</p>
        <h1 className="mt-3 font-heading text-4xl font-[850] text-gray-900">FAQ</h1>
        <div className="mt-8 space-y-3">
          {items.length === 0 ? <p className="text-gray-500">No FAQs yet.</p>
            : items.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenId(openId === item.id ? null : item.id)} className="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                  <span>{item.question}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${openId === item.id ? 'rotate-180' : ''}`} />
                </button>
                {openId === item.id ? <div className="px-5 pb-4 text-gray-600 leading-relaxed">{item.answer}</div> : null}
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
export function About() { return <InfoPage type="about" />; }
export function Terms() { return <InfoPage type="terms" />; }
export function Shipping() { return <InfoPage type="shipping" />; }
export function Returns() { return <InfoPage type="returns" />; }
export function Privacy() { return <InfoPage type="privacy" />; }

export function ContactPage() {
  usePageTitle('Contact');
  return (
    <main className="flex-grow bg-white px-4 py-14 sm:py-20">
      <section className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-pink">Contact</p>
        <h1 className="mt-3 font-heading text-4xl font-[850] text-gray-900">Contact the store</h1>
        <p className="mt-4 text-gray-600">Reach out to us anytime — we are here to help.</p>
        <div className="mt-8 grid gap-4">
          {contactItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <Icon className="h-5 w-5 text-brand-pink" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <p className="font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
