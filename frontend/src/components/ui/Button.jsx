import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
