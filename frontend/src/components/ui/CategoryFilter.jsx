function CategoryFilter({ items, selected, onChange }) {
    return (
        <div className="flex items-center gap-3 overflow-x-auto py-5 scrollbar-hide">
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange(item.id)}
                    className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                        selected === item.id
                            ? 'bg-brand-dark text-white'
                            : 'bg-brand-soft text-brand-muted hover:bg-brand-border'
                    }`}
                >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    {item.label}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;