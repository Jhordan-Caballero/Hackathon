function BrandLogo() {
    return (
        <a
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Ir al inicio"
        >
            <div className="flex items-center gap-1">
                {[1, 2, 3].map((bar) => (
                    <span
                        key={bar}
                        className="w-1.5 h-5 bg-brand-dark transform -skew-x-12 rounded-xs inline-block transition-transform group-hover:scale-y-110 duration-200"
                        style={{ transitionDelay: `${(bar - 1) * 75}ms` }}
                    />
                ))}
            </div>

            <span className="font-sans text-lg font-bold tracking-tight text-brand-dark uppercase group-hover:tracking-wider transition-all duration-200">
                [LOGO]
            </span>
        </a>
    );
}

export default BrandLogo;