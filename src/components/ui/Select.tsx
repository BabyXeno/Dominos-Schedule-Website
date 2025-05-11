import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <select
          className={cn(
            'px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-dominos-blue focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500',
            fullWidth && 'w-full',
            className
          )}
          ref={ref}
          {...props}
        >
          {props.placeholder && (
            <option value="" disabled>
              {props.placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;