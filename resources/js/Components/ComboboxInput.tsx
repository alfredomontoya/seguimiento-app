import { useMemo, useRef, useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover'

interface Option {
  value: string | number
  label: string
}

interface ComboboxInputProps {
  options: Option[]
  value?: string | number | null
  onChange: (value: string | number) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function ComboboxInput({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder: _searchPlaceholder,
  emptyMessage = 'No hay coincidencias.',
  className,
  disabled = false,
}: ComboboxInputProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasValue = value !== '' && value !== null && value !== undefined
  const selected = hasValue
    ? options.find((o) => String(o.value) === String(value))
    : undefined

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [options, searchQuery],
  )

  const exactMatch = useMemo(
    () =>
      searchQuery.length > 0 &&
      filtered.length === 1 &&
      filtered[0].label.toLowerCase() === searchQuery.toLowerCase(),
    [filtered, searchQuery],
  )

  function resetHighlight() {
    setHighlightedIndex(-1)
  }

  function handleSelect(optionValue: string | number) {
    onChange(optionValue)
    setSearchQuery('')
    setOpen(false)
    resetHighlight()
    inputRef.current?.blur()
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (val && hasValue) {
      onChange('')
    }
    setSearchQuery(val)
    resetHighlight()
    if (!open) setOpen(true)
  }

  function handleClear() {
    onChange('')
    setSearchQuery('')
    resetHighlight()
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1,
      )
    } else if (e.key === 'Enter' && !e.defaultPrevented) {
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        handleSelect(filtered[highlightedIndex].value)
        e.preventDefault()
      } else if (exactMatch) {
        handleSelect(filtered[0].value)
        e.preventDefault()
      }
    }
  }

  const popoverChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) resetHighlight()
  }

  return (
    <Popover open={open} onOpenChange={popoverChange}>
      <PopoverAnchor>
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setOpen(true)}
              onBlur={() => { setTimeout(() => setOpen(false), 200) }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-green-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
                className,
              )}
            />
          </div>
          {selected && (
            <div className="mt-2 flex items-center gap-1.5 rounded-md bg-green-100 px-2.5 py-1.5 text-sm text-green-800">
              <span>{selected.label}</span>
              <button
                type="button"
                onClick={handleClear}
                className="ml-auto rounded p-0.5 text-green-600 hover:bg-green-200 hover:text-green-900"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            {filtered.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filtered.map((option, i) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    className={cn(
                      highlightedIndex === i && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        String(value) === String(option.value)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
