
function ModuleCard({
    icon,
    number,
    title,
    description,
    className = '',
}) {
    return (
        <article className={`group relative overflow-hidden rounded-2xl border border-brand-border bg-white/80 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation ${className}`}>
            <div className="flex items-center justify-between mb-7">
                <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-accent flex items-center justify-center">
                    {icon}
                </div>

                {number && (
                    <span className="text-xs tracking-widest text-brand-muted">
                        {number}
                    </span>
                )}
            </div>

            <h3 className="font-serif text-xl font-medium text-brand-dark mb-3">
                {title}
            </h3>

            <p className="text-sm text-brand-muted leading-relaxed">
                {description}
            </p>
        </article>
    );
}

export default ModuleCard;
