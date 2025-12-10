import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  // Stile "Cartoon/Toy": Bordi neri spessi, ombra solida che si schiaccia al click
  const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-wide border-2 sm:border-[3px] border-black rounded-xl transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  
  // Shadow effect standard (non attivo)
  const shadowClass = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5";

  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300", // Giallo Banana
    secondary: "bg-white text-black hover:bg-slate-50",
    danger: "bg-red-500 text-white hover:bg-red-400",
    success: "bg-green-400 text-black hover:bg-green-300", // Verde Lime
    ghost: "bg-transparent border-transparent shadow-none hover:bg-black/5 text-slate-800 hover:shadow-none hover:translate-y-0 active:translate-y-0",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs sm:text-sm",
    md: "px-4 py-2 text-sm sm:text-base",
    lg: "px-6 py-3 text-base sm:text-lg",
    xl: "px-8 py-4 text-xl sm:text-2xl h-20", // Extra large per il tasto estrai
  };

  const widthClass = fullWidth ? "w-full" : "";
  const variantClass = variants[variant];
  // Applica l'ombra solo se non è ghost
  const finalShadow = variant === 'ghost' ? '' : shadowClass;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantClass} ${sizes[size]} ${widthClass} ${finalShadow} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};