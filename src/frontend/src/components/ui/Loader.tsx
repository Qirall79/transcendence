import { HTMLAttributes } from 'react';
import { Loader as LucideLoader } from 'lucide-react';

type LoaderProps = {
  size?: number;
  text?: string;
  color?: string;
  centered?: boolean;
  className?: string | undefined;
} 

function Loader({ 
  size = 24, 
  text, 
  color = 'text-white',
  centered = false,
  className = '',
  ...props
}: LoaderProps) {
  return (
    <div 
      className={`
        flex flex-col items-center 
        ${centered ? 'justify-center h-full w-full' : ''} 
        ${className}
      `} 
      {...props}
    >
      <LucideLoader className={`animate-spin ${color}`} size={size} />
      
      {text && (
        <p className="mt-3 text-gray-400">{text}</p>
      )}
    </div>
  );
}

export default Loader;