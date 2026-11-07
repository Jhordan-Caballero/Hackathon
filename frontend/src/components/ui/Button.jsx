
function Button({
    children,
    variant = 'primary',
    href,
    className = '',
    type = 'button',
    onClick,
    arrow = false,
}) {
    const variants = {
        nav: `
      btn-shimmer inline-flex items-center justify-center
      text-xs font-semibold uppercase tracking-wider
      bg-brand-accent hover:bg-brand-accent-hover text-white
      px-5 py-2.5 rounded-full
      transition-all duration-300 shadow-sm
      hover:shadow-md hover:-translate-y-0.5
    `,
        primary: `
      btn-shimmer w-full sm:w-auto px-7 py-3 rounded-xl
      bg-brand-dark hover:bg-neutral-900 text-white
      text-sm font-medium tracking-normal
      transition-all duration-200 shadow-sm
      hover:shadow-lg hover:-translate-y-0.5
      active:translate-y-0
    `,
        secondary: `
      w-full sm:w-auto px-7 py-3 rounded-xl
      bg-white/95 hover:bg-brand-soft
      border border-brand-border hover:border-brand-muted/40
      text-brand-dark text-sm font-medium tracking-normal
      transition-all duration-200 shadow-2xs
      hover:shadow hover:-translate-y-0.5
      active:translate-y-0
    `,
        cta: `
      btn-shimmer w-full sm:w-auto px-8 py-3.5 rounded-full
      bg-white text-brand-dark hover:bg-brand-cream
      text-xs font-semibold uppercase tracking-wider
      transition-all duration-300 shadow-md
      hover:shadow-xl hover:-translate-y-0.5
      active:translate-y-0
    `,
        link: `
      inline-flex items-center gap-2
      text-white/80 hover:text-white
      text-xs font-medium uppercase tracking-wider
      transition-colors duration-200
    `,
    };

    const classes = `${variants[variant] || variants.primary} ${className}`;

    const content = (
        <>
            {children}
            {arrow && <span aria-hidden="true">→</span>}
        </>
    );

    if (href) {
        return (
            <a href={href} className={classes}>
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}
        >
            {content}
        </button>
    );
}

export default Button;
