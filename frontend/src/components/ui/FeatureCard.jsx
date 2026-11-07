
function FeatureCard({
    icon,
    number,
    title,
    description,
    className = '',
}) {
    return (
        <article className={`group relative bg-white/80 border border-brand-border rounded-2xl p-7 shadow-card hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-brand-soft text-brand-accent">
                    {icon}
                </div>

                {number && (
                    <span className="text-xs font-medium text-brand-muted tracking-widest">
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

export default FeatureCard;
