interface FilterDropdownProps<T extends string | number> {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}

const FilterDropdown = <T extends string | number>({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-card-foreground)] mb-1">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="
        w-full
        bg-[var(--color-background)]
        border border-[var(--color-border)]
        rounded-lg
        px-3 py-2
        text-sm
        text-[var(--color-foreground)]
        focus:outline-none
        focus:ring-2
        focus:ring-[var(--color-primary)]
        transition
        "
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-[var(--color-card)] text-[var(--color-foreground)]"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
