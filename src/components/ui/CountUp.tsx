import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  separator?: string;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  separator = ','
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const increment = (end - start) / (duration * 60); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [start, end, duration, isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`countup-${Math.random()}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    if (separator && num >= 1000) {
      return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    return fixed;
  };

  return (
    <motion.span
      id={`countup-${Math.random()}`}
      className={`font-bold ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
};

export default CountUp;