import BrandLogo from '../layout/BrandLogo';

const footerGroups = [
    {
        title: '[BLOQUE DE CONTENIDO]',
        links: [
            '[enlace de navegación]',
            '[enlace de navegación]',
            '[enlace de navegación]',
        ],
    },
    {
        title: '[BLOQUE DE CONTENIDO]',
        links: [
            '[enlace de navegación]',
            '[enlace de navegación]',
            '[enlace de navegación]',
        ],
    },
];

function Footer() {
    return (
        <footer className="border-t border-brand-border bg-brand-surface pt-16 pb-12 px-6 lg:px-12 relative z-10">

            <div className="max-w-7xl mx-auto">

                {/* Columnas principales */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">

                    {/* Información de marca */}
                    <div className="md:col-span-4">
                        <div className="mb-5">
                            <BrandLogo />
                        </div>

                        <p className="text-brand-muted text-sm max-w-sm font-light leading-relaxed">
                            [texto de pie de página]
                        </p>
                    </div>

                    {/* Grupos de navegación */}
                    {footerGroups.map((group, index) => (
                        <div key={index} className="md:col-span-2">

                            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
                                {group.title}
                            </h4>

                            <ul className="space-y-3 text-xs text-brand-muted font-light">
                                {group.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href="#"
                                            className="hover:text-brand-dark transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Información adicional */}
                    <div className="md:col-span-4">

                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
                            [BLOQUE DE CONTENIDO]
                        </h4>

                        <p className="text-xs text-brand-muted font-light leading-relaxed mb-3">
                            [subtítulo o texto descriptivo breve]
                        </p>

                        <p className="text-xs text-brand-muted font-light leading-relaxed">
                            [texto de pie de página]
                        </p>
                    </div>
                </div>

                {/* Pie inferior */}
                <div className="pt-8 border-t border-brand-border/70 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted font-light gap-4">

                    <div>
                        [texto de pie de página]
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-brand-dark transition-colors">
                            [enlace de navegación]
                        </a>

                        <a href="#" className="hover:text-brand-dark transition-colors">
                            [enlace de navegación]
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
