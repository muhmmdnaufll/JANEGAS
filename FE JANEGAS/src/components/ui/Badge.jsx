import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon: Icon,
  dot = true,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const variantStyles = {
    neutral: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200',
    brand: 'bg-[#F2F6EE] text-[#2E4420] ring-1 ring-inset ring-[#CAD8BC]',
    success: 'bg-emerald-50/70 text-emerald-800 ring-1 ring-inset ring-emerald-200',
    warning: 'bg-amber-50/70 text-amber-800 ring-1 ring-inset ring-amber-200',
    danger: 'bg-rose-50/70 text-rose-800 ring-1 ring-inset ring-rose-200',
    info: 'bg-sky-50/70 text-sky-800 ring-1 ring-inset ring-sky-200',
    purple: 'bg-purple-50/70 text-purple-800 ring-1 ring-inset ring-purple-200',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    brand: 'bg-[#3D5A2B]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.neutral} ${className}`}
      {...props}
    >
      {dot && !Icon && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || dotColors.neutral}`} />
      )}
      {Icon && <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" />}
      <span className="truncate">{children}</span>
    </span>
  );
};

export default Badge;
