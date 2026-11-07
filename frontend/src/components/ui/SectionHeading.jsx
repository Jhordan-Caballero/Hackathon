
function SectionHeading({
    eyebrow,
    title,
    description,
    align = 'center',
    className = '',
}) {
    const alignment = align === 'left' ? 'text-left' : 'text-center';

    return (
        <div className={`${alignment} ${className}`}>
            {eyebrow && (
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent mb-4">
                    {eyebrow}
                </span>
            )}

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-brand-dark leading-[1.1]">
                {title}
            </h2>

            {description && (
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-brand-muted max-w-2xl mx-auto">
                    {description}
                </p>
            )}
        </div>
    );
}

export default SectionHeading;
