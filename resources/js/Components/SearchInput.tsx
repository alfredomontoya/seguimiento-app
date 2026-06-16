import { useCallback } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
    placeholder?: string;
}

export default function SearchInput({ value, onChange, onSearch, onClear, placeholder = 'Buscar...' }: SearchInputProps) {
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                onSearch();
            }
        },
        [onSearch],
    );

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-20 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
                onClick={onSearch}
                className="absolute left-0 top-0 flex h-full items-center pl-3 text-gray-400 hover:text-gray-600"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            {value && (
                <button
                    onClick={onClear}
                    className="absolute right-10 top-1/2 -translate-y-1/2 flex h-full items-center pr-1 text-gray-400 hover:text-gray-600"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            <button
                onClick={onSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-gray-800 p-1.5 text-white shadow-sm transition-opacity hover:opacity-90"
            >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    );
}
