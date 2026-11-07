function SelectFilter({
    id,
    label,
    icon,
    value,
    onChange,
    options,
}) {
    return (
        <div className="flex items-center gap-3">
            <label
                htmlFor={id}
                className="text-sm font-semibold text-brand-dark whitespace-nowrap"
            >
                {icon && <span className="text-brand-accent mr-1">{icon}</span>}
                {label}
            </label>

            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="max-w-[200px] rounded-lg border border-brand-border bg-brand-cream/50 px-3 py-2.5 text-sm text-brand-muted outline-none focus:border-brand-accent"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectFilter;