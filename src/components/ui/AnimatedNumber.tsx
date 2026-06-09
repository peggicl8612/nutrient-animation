import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

type Format = 'percent' | 'integer' | 'decimal';

interface Props {
  value: number;
  format?: Format;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

function formatValue(value: number, format: Format, decimals: number) {
  if (format === 'percent') return `${Math.round(value * 100)}%`;
  if (format === 'integer') return `${Math.round(value)}`;
  return value.toFixed(decimals);
}

export function AnimatedNumber({
  value,
  format = 'decimal',
  decimals = 1,
  suffix = '',
  prefix = '',
  className,
}: Props) {
  const spring = useSpring(value, { stiffness: 90, damping: 18, mass: 0.6 });
  const display = useTransform(spring, (v) => `${prefix}${formatValue(v, format, decimals)}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return display.on('change', (text) => {
      if (ref.current) ref.current.textContent = text;
    });
  }, [display]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}{formatValue(spring.get(), format, decimals)}{suffix}
    </motion.span>
  );
}

interface GramsPairProps {
  intake: number;
  target: number;
  className?: string;
}

export function AnimatedGramsPair({ intake, target, className }: GramsPairProps) {
  return (
    <span className={className}>
      <AnimatedNumber value={intake} format="integer" suffix="g" />
      {' / '}
      <AnimatedNumber value={target} format="integer" suffix="g" />
    </span>
  );
}
