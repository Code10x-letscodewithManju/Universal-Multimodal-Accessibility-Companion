import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  large?: boolean;
  icon?: string;
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  large = false, 
  icon, 
  label, 
  className = '',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 font-bold tracking-wide focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-black shadow-lg active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-yellow-500/20 hover:shadow-yellow-500/40",
    accent: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50",
    secondary: "bg-zinc-800/80 backdrop-blur-md text-zinc-100 border border-zinc-700 hover:bg-zinc-700",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/20",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50"
  };

  const sizes = large ? "py-5 px-8 text-lg" : "py-3 px-5 text-sm";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`}
      aria-label={label}
      {...props}
    >
      {icon && <span className="material-icons text-[1.2em]">{icon}</span>}
      <span className="z-10">{label}</span>
    </button>
  );
};