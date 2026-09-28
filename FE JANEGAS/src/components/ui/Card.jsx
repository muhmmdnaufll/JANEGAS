import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-4 sm:p-6',
  ...props
}) => {
  // If padding is explicitly passed as 'p-6', adapt it responsively so mobile devices are not squeezed
  const responsivePadding = padding === 'p-6' ? 'p-4 sm:p-6' : padding;

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-xl shadow-xs min-w-0 max-w-full overflow-x-clip ${
        hover ? 'transition-all duration-200 hover:border-slate-300 hover:shadow-md' : ''
      } ${responsivePadding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100 mb-4 sm:mb-5 min-w-0 max-w-full ${className}`}>
    <div className="min-w-0 flex-1">
      <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight truncate">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5 break-words">{subtitle}</p>}
    </div>
    {action && <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">{action}</div>}
  </div>
);

export default Card;
