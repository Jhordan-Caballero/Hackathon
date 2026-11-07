
function MetricItem({ value, label }) {
    return (
        <div className="py-3 md:py-1 px-4 group hover:bg-brand-surface/60 transition-colors rounded-lg">
            <div className="font-serif text-2xl lg:text-3xl font-medium text-brand-dark group-hover:scale-105 transition-transform duration-200">
                <span className="font-editorial-italic italic font-serif">
                    {value}
                </span>
            </div>

            <div className="text-xs text-brand-muted uppercase tracking-wider mt-1">
                {label}
            </div>
        </div>
    );
}

export default MetricItem;
