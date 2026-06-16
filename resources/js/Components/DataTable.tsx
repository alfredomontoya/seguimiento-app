import SearchInput from '@/Components/SearchInput';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';

export function highlightText(text: string, query: string): ReactNode {
    if (!query.trim() || !text) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="rounded bg-yellow-200 px-0.5">{part}</mark>
            : part,
    );
}

export interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render: (item: T, searchQuery: string) => ReactNode;
    cellClassName?: string;
    headerClassName?: string;
    sortValue?: (item: T) => string;
}

export interface PaginatedMeta {
    from: number;
    to: number;
    total: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    meta: PaginatedMeta;
    searchPlaceholder?: string;
    createRoute?: string;
    createLabel?: string;
    emptyMessage?: string;
    noResultsMessage?: string;
    filterFn?: (item: T, query: string) => boolean;
}

export default function DataTable<T extends { id: number | string }>({
    data,
    columns,
    meta,
    searchPlaceholder,
    createRoute,
    createLabel = 'Nuevo',
    emptyMessage = 'No hay registros.',
    noResultsMessage = 'No se encontraron resultados.',
    filterFn,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const hasSearch = !!searchPlaceholder && !!filterFn;

    const handleSearch = useCallback(() => {
        setSearchQuery(search);
    }, [search]);

    const handleClear = useCallback(() => {
        setSearch('');
        setSearchQuery('');
    }, []);

    const handleSort = useCallback(
        (field: string) => {
            if (sortField === field) {
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            } else {
                setSortField(field);
                setSortDirection('asc');
            }
        },
        [sortField],
    );

    const filteredItems = useMemo(() => {
        let result = data;
        if (searchQuery.trim() && filterFn) {
            const q = searchQuery;
            result = data.filter((item) => filterFn(item, q));
        }
        if (sortField) {
            const col = columns.find((c) => c.key === sortField);
            result = [...result].sort((a, b) => {
                const getVal = col?.sortValue ?? ((item: T) => String(item[sortField as keyof T] ?? ''));
                const aVal = getVal(a).toLowerCase();
                const bVal = getVal(b).toLowerCase();
                const cmp = aVal.localeCompare(bVal);
                return sortDirection === 'asc' ? cmp : -cmp;
            });
        }
        return result;
    }, [searchQuery, data, sortField, sortDirection, columns, filterFn]);

    return (
        <>
            {(hasSearch || createRoute) && (
                <div className="mb-6 flex items-center justify-between">
                    {hasSearch && (
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSearch={handleSearch}
                            onClear={handleClear}
                            placeholder={searchPlaceholder}
                        />
                    )}
                    {createRoute && (
                        <Link
                            href={createRoute}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {createLabel}
                        </Link>
                    )}
                </div>
            )}

            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="overflow-x-auto p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-b from-green-800 to-green-600">
                            <tr>
                                {columns.map((col) => {
                                    const isSorted = sortField === col.key;
                                    return (
                                        <th
                                            key={col.key}
                                            onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                            className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white ${
                                                col.sortable ? 'cursor-pointer select-none transition-colors hover:text-green-100' : ''
                                            } ${col.headerClassName ?? ''}`}
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                {col.label}
                                                {isSorted ? (
                                                    sortDirection === 'asc' ? (
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )
                                                ) : null}
                                            </span>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                                        {searchQuery ? noResultsMessage : emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, rowIdx) => (
                                    <tr key={item.id ?? rowIdx} className="group transition-all hover:bg-green-50">
                                        {columns.map((col, colIdx) => {
                                            const isFirst = colIdx === 0;
                                            const isLast = colIdx === columns.length - 1;
                                            const shadowClasses = isFirst
                                                ? 'lg:group-hover:rounded-l-lg lg:group-hover:shadow-[inset_1px_0_0_0_#16a34a,inset_0_-1px_0_0_#16a34a,inset_0_1px_0_0_#16a34a]'
                                                : isLast
                                                  ? 'lg:group-hover:rounded-r-lg lg:group-hover:shadow-[inset_-1px_0_0_0_#16a34a,inset_0_-1px_0_0_#16a34a,inset_0_1px_0_0_#16a34a]'
                                                  : 'lg:group-hover:shadow-[inset_0_-1px_0_0_#16a34a,inset_0_1px_0_0_#16a34a]';
                                            const textClasses = isFirst
                                                ? 'text-sm font-medium text-gray-900'
                                                : 'text-sm text-gray-500';
                                            return (
                                                <td
                                                    key={col.key}
                                                    className={`px-4 py-3 ${textClasses} ${shadowClasses} ${col.cellClassName ?? ''}`}
                                                >
                                                    {col.render(item, searchQuery)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {!searchQuery && meta.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando {meta.from} a {meta.to} de {meta.total} registros
                            </div>
                            <div className="flex gap-1">
                                {meta.links.map((link, i) => {
                                    const isPrev = link.label.toLowerCase().includes('previous');
                                    const isNext = link.label.toLowerCase().includes('next');
                                    return (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url);
                                                }
                                            }}
                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                                                link.active
                                                    ? 'bg-gray-800 text-white'
                                                    : link.url
                                                      ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                      : 'cursor-not-allowed text-gray-400'
                                            }`}
                                        >
                                            {isPrev ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            ) : isNext ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
