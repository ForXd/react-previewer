import { useId, type ReactNode } from 'react';

interface TabListProps<T extends string> {
  label: string;
  value: T;
  items: ReadonlyArray<{
    value: T;
    label: string;
    icon?: ReactNode;
    changed?: boolean;
    panelId?: string;
    id?: string;
  }>;
  onChange: (value: T) => void;
  className: string;
}

export function TabList<T extends string>({
  label,
  value,
  items,
  onChange,
  className
}: TabListProps<T>) {
  const id = useId();
  return (
    <div className={className} role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.value}
          id={item.id ?? `${id}-${index}`}
          type="button"
          role="tab"
          aria-label={item.label}
          aria-selected={value === item.value}
          aria-controls={item.panelId}
          tabIndex={value === item.value ? 0 : -1}
          className={value === item.value ? 'is-active' : undefined}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => {
            let next: number;
            if (event.key === 'ArrowRight') next = (index + 1) % items.length;
            else if (event.key === 'ArrowLeft')
              next = (index - 1 + items.length) % items.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = items.length - 1;
            else return;
            event.preventDefault();
            onChange(items[next].value);
            const buttons =
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]'
              );
            buttons?.[next]?.focus();
          }}
        >
          {item.icon}
          <span>{item.label}</span>
          {item.changed && <i className="modified-dot" aria-label="已修改" />}
        </button>
      ))}
    </div>
  );
}
