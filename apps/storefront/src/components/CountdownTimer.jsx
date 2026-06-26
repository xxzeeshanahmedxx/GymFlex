import { useEffect, useState } from 'react';

function getTimeRemaining(endTime) {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ endTime, onExpire, compact }) {
  const [time, setTime] = useState(() => getTimeRemaining(endTime));

  useEffect(() => {
    const tick = () => {
      const remaining = getTimeRemaining(endTime);
      setTime(remaining);
      if (remaining.total <= 0) {
        onExpire?.();
        clearInterval(interval);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (time.total <= 0) return null;

  if (compact) {
    return (
      <span className="countdown-compact">
        {time.days > 0 ? `${time.days}d ` : ''}{String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
      </span>
    );
  }

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="countdown-timer">
      <span className="countdown-label">Sale ends in</span>
      <div className="countdown-units">
        {time.days > 0 ? <div className="countdown-unit"><span className="countdown-value">{time.days}</span><span className="countdown-unit-label">Days</span></div> : null}
        <div className="countdown-unit"><span className="countdown-value">{pad(time.hours)}</span><span className="countdown-unit-label">Hours</span></div>
        <div className="countdown-unit"><span className="countdown-value">{pad(time.minutes)}</span><span className="countdown-unit-label">Min</span></div>
        <div className="countdown-unit"><span className="countdown-value">{pad(time.seconds)}</span><span className="countdown-unit-label">Sec</span></div>
      </div>
    </div>
  );
}