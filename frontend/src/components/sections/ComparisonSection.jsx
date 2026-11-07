import Reveal from '../ui/Reveal';

function ComparisonSection() {
    const comparisons = [
        {
            title: '[bloque de beneficio 1]',
            description: '[descripción breve del beneficio 1]',
            platform: '[incluido / 100%]',
            traditional: '[limitado]',
        },
        {
            title: '[bloque de beneficio 2]',
            description: '[descripción breve del beneficio 2]',
            platform: '[tiempo real]',
            traditional: '[días o semanas]',
        },
        {
            title: '[bloque de beneficio 3]',
            description: '[descripción breve del beneficio 3]',
            platform: '[integración nativa]',
            traditional: '[fragmentado]',
        },
    ];

    return (
        <Reveal>
            <section
                className="py-20 lg:py-28 bg-brand-surface/90 backdrop-blur-sm border-y border-brand-border"
                data-purpose="comparison-section"
                id="comparison"
            >
                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs uppercase font-semibold tracking-wider text-brand-accent">
                            [sección de beneficios]
                        </span>

                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-dark mt-3">
                            [título de propuesta de{' '}
                            <span className="font-editorial-italic italic font-serif text-brand-muted">
                                valor
                            </span>
                            ]
                        </h2>
                    </div>

                    <div className="border border-brand-border rounded-2xl overflow-hidden shadow-subtle hover:shadow-lg transition-shadow duration-300 bg-white">
                        {/* Encabezados */}
                        <div className="grid grid-cols-12 bg-brand-soft/80 px-6 py-4 border-b border-brand-border text-xs uppercase font-semibold tracking-wider text-brand-muted">
                            <div className="col-span-6 sm:col-span-7">
                                [criterio / especificación]
                            </div>
                            <div className="col-span-3 sm:col-span-3 text-center text-brand-dark font-bold">
                                [nuestra plataforma]
                            </div>
                            <div className="col-span-3 sm:col-span-2 text-center">
                                [enfoque tradicional]
                            </div>
                        </div>

                        {/* Filas */}
                        {comparisons.map((item, index) => (
                            <div
                                key={item.title}
                                className={`grid grid-cols-12 px-6 py-5 items-center hover:bg-amber-50/40 hover:translate-x-1 transition-all duration-200 group ${index !== comparisons.length - 1
                                        ? 'border-b border-brand-border'
                                        : ''
                                    }`}
                            >
                                <div className="col-span-6 sm:col-span-7">
                                    <p className="font-medium text-sm text-brand-dark group-hover:text-brand-accent transition-colors">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-brand-muted hidden sm:block mt-0.5">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="col-span-3 sm:col-span-3 text-center font-serif text-brand-accent font-semibold group-hover:scale-105 transition-transform">
                                    <span className="font-editorial-italic italic font-serif text-brand-accent">
                                        {item.platform}
                                    </span>
                                </div>

                                <div className="col-span-3 sm:col-span-2 text-center text-xs text-brand-muted font-light">
                                    {item.traditional}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Reveal>
    );
}

export default ComparisonSection;
