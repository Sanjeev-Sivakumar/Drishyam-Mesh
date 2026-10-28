import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white shadow-sm border border-purple-500/30';
      case 'secondary':
        return 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-xs';
      case 'cyan':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-sm';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-500/30';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm border border-rose-500/30';
      case 'ghost':
        return 'hover:bg-slate-100 text-slate-700 border-transparent';
      default:
        return 'bg-purple-600 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-semibold';
      case 'lg':
        return 'px-5 py-2.5 text-sm font-bold';
      default:
        return 'px-4 py-2 text-xs font-semibold';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

