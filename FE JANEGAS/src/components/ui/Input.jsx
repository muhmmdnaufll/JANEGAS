import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-white border rounded-lg text-sm text-slate-900 transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[#3D5A2B]/15 focus:border-[#3D5A2B] disabled:bg-slate-50 disabled:text-slate-400 ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } py-2.5 ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
