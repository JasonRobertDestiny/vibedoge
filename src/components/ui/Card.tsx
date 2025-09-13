import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  glass = false,
  padding = 'md',
  onClick,
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const backgroundClasses = glass
    ? 'bg-white/10 backdrop-blur-lg border border-white/20'
    : gradient
    ? 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg'
    : 'bg-white border border-gray-200 shadow-md';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const hoverClasses = hover
    ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
    : '';
  
  const classes = `${baseClasses} ${backgroundClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`;
  
  return (
    <motion.div
      className={classes}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;