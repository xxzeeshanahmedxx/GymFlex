export function SectionState({ message, tone = 'muted' }) {
  const toneClassName = tone === 'error'
    ? 'border-red-200 bg-red-50 text-red-600'
    : 'border-gray-200 bg-white text-gray-500';

  return (
    <div className={`rounded-3xl border px-6 py-12 text-center font-sans font-semibold ${toneClassName}`}>
      {message}
    </div>
  );
}
