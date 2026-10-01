import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in ms
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (val: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formatter,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const startTimestamp = useRef<number | null>(null);
  const startVal = useRef<number>(0);
  const endVal = useRef<number>(value);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    startVal.current = displayValue;
    endVal.current = value;
    startTimestamp.current = null;

    const step = (timestamp: number) => {
      if (!startTimestamp.current) startTimestamp.current = timestamp;
      const progress = Math.min((timestamp - startTimestamp.current) / duration, 1);

      // Ease-out cubic formula: 1 - Math.pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal.current + (endVal.current - startVal.current) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal.current);
      }
    };

    rafId.current = requestAnimationFrame(step);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration]);

  const formattedNumber = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
