import * as React from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

// Simple alternative to 'cn' utility
function classNames(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export function MultiSelect({
    options,
    defaultValues = [],
    onChange,
    placeholder = 'Selecciona una opción',
}: {
    options: { value: string; label: string }[];
    defaultValues?: string[];
    onChange?: (selected: string[]) => void;
    placeholder?: string;
}) {
    const [selected, setSelected] = React.useState<string[]>(defaultValues);
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    // Se actualiza el estado interno cuando defaultValues cambia
    React.useEffect(() => {
        setSelected(defaultValues);
    }, [defaultValues]);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        setSelected(newSelected);
        onChange?.(newSelected);
    };

    // Mapear los valores seleccionados a sus labels correspondientes
    const selectedLabels = selected.map(
        val => options.find(opt => opt.value === val)?.label || val
    );

    return (
        <div ref={ref} className="relative inline-block w-full">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={classNames(
                    'border-input flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                    'min-w-[200px] w-full' // tamaño mínimo agregado
                )}>
                <span className=" text-left w-0 flex-1 truncate">
                    {' '}
                    {/* Actualización */}
                    {selected.length > 0
                        ? selectedLabels.join(', ')
                        : placeholder}
                </span>
                <ChevronDownIcon className="size-4 opacity-50" />
            </button>
            {/* Options list */}
            {open && (
                <div
                    className={classNames(
                        'absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md z-50'
                    )}>
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => toggleOption(option.value)}
                            className={classNames(
                                'cursor-pointer px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground flex justify-between items-center',
                                selected.includes(option.value) &&
                                    'bg-accent text-accent-foreground'
                            )}>
                            {option.label}
                            {selected.includes(option.value) && (
                                <CheckIcon className="size-4" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
