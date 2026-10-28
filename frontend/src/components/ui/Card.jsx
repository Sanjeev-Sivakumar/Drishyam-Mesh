import React from 'react';

export const Card = ({ children, className = '', title, subtitle, action, footer, onClick }) => {
  const hasHeader = Boolean(title || action);

  return (
    <div
      onClick={onClick}
      className={`bento-card border border-slate-200 hover:border-slate-300 transition-all duration-200 overflow-hidden text-slate-900 bg-white shadow-xs ${className}`}
    >
      {hasHeader && (
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 backdrop-blur-xs">
          <div className="min-w-0 pr-2">
            {title && <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={hasHeader ? 'p-5' : ''}>{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
};
