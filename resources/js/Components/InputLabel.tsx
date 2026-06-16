import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    required,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string; required?: boolean }) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
            {required && <span className="ml-1 text-xs text-red-500">(requerido)</span>}
        </label>
    );
}
