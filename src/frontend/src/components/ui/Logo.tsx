import React from "react";

interface LogoProps {
  size?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 80, className = "" }) => {
  return (
    <svg 
      viewBox='0 0 100 100' 
      className={className} 
      style={{ 
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size 
      }}
    >
      <circle cx='50' cy='50' r='48' fill='black' stroke='#6366F1' strokeWidth='1' />
      <g transform='translate(50, 50)'>
        <circle cx='0' cy='0' r='40' fill='none' stroke='#6366F1' strokeWidth='2.5' />
        <circle cx='0' cy='0' r='34' fill='none' stroke='#8B5CF6' strokeWidth='2' strokeOpacity='0.8' />
        <circle cx='0' cy='0' r='28' fill='none' stroke='#6366F1' strokeWidth='2.5' />
        <circle cx='0' cy='0' r='22' fill='none' stroke='#8B5CF6' strokeWidth='2' strokeOpacity='0.8' />
        <circle cx='0' cy='0' r='16' fill='none' stroke='#6366F1' strokeWidth='2.5' />
        <circle cx='0' cy='0' r='12' fill='none' stroke='#8B5CF6' strokeWidth='2' strokeOpacity='0.8' />
        <circle cx='0' cy='0' r='6' fill='#6366F1' />
        <circle cx='0' cy='0' r='3' fill='black' />
      </g>
    </svg>
  );
};

export default Logo;