export function PageHero({ kicker, title, subtitle }) {
  return (
    <div className="collection-hero py-16 sm:py-24 text-center relative overflow-hidden">
      <div className="collection-hero-glow pointer-events-none" />

      {kicker && (
        <span className="text-xs sm:text-sm font-semibold tracking-wide block mb-1 relative z-10">
          {kicker}
        </span>
      )}

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-[850] tracking-normal relative z-10">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 sm:mt-3 font-sans max-w-2xl mx-auto text-sm sm:text-lg relative z-10 px-4">
          {subtitle}
        </p>
      )}
    </div>
  );
}
