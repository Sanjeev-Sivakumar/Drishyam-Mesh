import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
      case 'VERIFIED':
      case 'VALID':
      case 'APPROVED':
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'warning':
      case 'PENDING_REVIEW':
      case 'UNDER_REVIEW':
      case 'NEEDS_CORRECTION':
      case 'DUPLICATE_CANDIDATE':
      case 'PROVISIONAL':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'danger':
      case 'FLAGGED':
      case 'REJECTED':
      case 'INVALID':
      case 'FAILED':
      case 'TAMPERED':
      case 'SUSPENDED':
      case 'CONFIRMED_DUPLICATE':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'info':
      case 'READY_TO_COMMIT':
      case 'UPLOADED':
      case 'ADMITTED':
      case 'ENROLLED':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'purple':
      case 'COMMITTED':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getSizeStyles = () => {
    return size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs font-semibold';
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {children}
    </span>
  );
};
