import { Link } from 'react-router-dom';
import { footerSections } from '../data/navigation';

export default function Footer() {
  return (
    <footer className="font-sans mt-auto bg-[#fbf7ef] text-stone-800 border-t border-stone-200">
      <div className="h-1 w-full bg-gradient-to-r from-brand-pink to-brand-coral"></div>

      <div className="pt-8 pb-5 sm:pt-14 sm:pb-8">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-10 mb-6 sm:mb-10">
            <div>
              <Link to="/" className="text-xl sm:text-2xl font-heading font-[850] tracking-widest text-stone-900 mb-2 sm:mb-4 block hover:text-brand-pink transition-colors">GYMFLEX</Link>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Premium gym wear engineered for performance. Train harder, look better.
              </p>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-heading font-[850] text-sm sm:text-lg mb-2 sm:mb-4 tracking-wider uppercase text-stone-900">
                  {section.title}
                </h3>
                <ul className="space-y-1.5 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-stone-600 hover:text-brand-pink transition-colors text-xs sm:text-sm">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-4 sm:pt-6 text-center md:flex md:justify-between md:text-left">
            <p className="text-stone-500 text-xs sm:text-sm">&copy; {new Date().getFullYear()} GymFlex. All rights reserved.</p>
            <p className="text-stone-400 text-[11px] sm:text-xs mt-1 sm:mt-2 md:mt-0">Shipping across Pakistan · Prices in PKR · Cash on Delivery</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
