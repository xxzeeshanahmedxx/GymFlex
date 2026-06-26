import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page Not Found');
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-32 animate-fade-in-up">
      <h1 className="text-7xl sm:text-9xl font-heading font-[850] text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-coral mb-4 leading-none">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-heading font-[850] text-gray-900 uppercase tracking-widest mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md font-sans">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-4 bg-gradient-to-r from-brand-pink to-brand-coral text-white font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}
