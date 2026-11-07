import Reveal from '../ui/Reveal';

function FeaturesSection() {
    return (
        <Reveal>
            <section
                className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto"
                data-purpose="features-grid"
                id="features"
            >
                <div className="max-w-3xl mb-16">
                    <span className="text-xs uppercase font-semibold tracking-wider text-brand-accent">
                        [etiqueta de sección]
                    </span>

                    <h2 className="font-serif text-4xl sm:text-5xl text-brand-dark mt-3 leading-tight">
                        [título de características]{' '}
                        <span className="font-editorial-italic text-brand-muted">
                            [acento editorial]
                        </span>
                    </h2>

                    <p className="mt-4 text-brand-muted text-base sm:text-lg max-w-2xl font-light">
                        [descripción de la sección]
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Tarjeta 1 */}
                    <div className="bg-brand-surface rounded-2xl border border-brand-border p-8 flex flex-col justify-between shadow-subtle hover:border-brand-muted/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono font-medium text-brand-muted group-hover:text-brand-dark transition-colors">
                                    [01]
                                </span>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-soft border border-brand-border text-brand-dark font-medium group-hover:bg-amber-100 group-hover:border-amber-200 transition-colors">
                                    [tag destacado]
                                </span>
                            </div>

                            <h3 className="font-serif text-2xl text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">
                                [tarjeta 1:{' '}
                                <span className="font-editorial-italic italic font-serif text-brand-muted">
                                    título
                                </span>
                                ]
                            </h3>

                            <p className="text-brand-muted text-sm leading-relaxed font-light mb-6">
                                [tarjeta 1: descripción]
                            </p>
                        </div>

                        <div className="w-full h-36 bg-brand-soft rounded-xl border border-dashed border-brand-border flex items-center justify-center p-4 group-hover:bg-white group-hover:border-brand-muted/40 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="text-xs font-mono text-brand-muted relative z-10 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                [gráfico / visual minimalista]
                            </span>
                        </div>
                    </div>

                    {/* Tarjeta 2 */}
                    <div className="bg-brand-surface rounded-2xl border border-brand-border p-8 flex flex-col justify-between shadow-subtle hover:border-brand-muted/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono font-medium text-brand-muted group-hover:text-brand-dark transition-colors">
                                    [02]
                                </span>
                            </div>

                            <h3 className="font-serif text-2xl text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">
                                [tarjeta 2:{' '}
                                <span className="font-editorial-italic italic font-serif text-brand-muted">
                                    título
                                </span>
                                ]
                            </h3>

                            <p className="text-brand-muted text-sm leading-relaxed font-light mb-6">
                                [tarjeta 2: descripción]
                            </p>
                        </div>

                        <div className="pt-6 border-t border-brand-border flex flex-wrap gap-2">
                            <span className="text-xs px-3 py-1 rounded-md bg-brand-soft text-brand-dark hover:bg-amber-100/70 hover:scale-105 transition-all duration-200 cursor-default">[etiqueta A]</span>
                            <span className="text-xs px-3 py-1 rounded-md bg-brand-soft text-brand-dark hover:bg-emerald-100/70 hover:scale-105 transition-all duration-200 cursor-default">[etiqueta B]</span>
                            <span className="text-xs px-3 py-1 rounded-md bg-brand-soft text-brand-dark hover:bg-purple-100/70 hover:scale-105 transition-all duration-200 cursor-default">[etiqueta C]</span>
                        </div>
                    </div>

                    {/* Tarjeta 3 */}
                    <div className="bg-brand-surface rounded-2xl border border-brand-border p-8 flex flex-col justify-between shadow-subtle hover:border-brand-muted/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono font-medium text-brand-muted group-hover:text-brand-dark transition-colors">
                                    [03]
                                </span>
                            </div>

                            <h3 className="font-serif text-2xl text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">
                                [tarjeta 3:{' '}
                                <span className="font-editorial-italic italic font-serif text-brand-muted">
                                    título
                                </span>
                                ]
                            </h3>

                            <p className="text-brand-muted text-sm leading-relaxed font-light mb-6">
                                [tarjeta 3: descripción]
                            </p>
                        </div>

                        <div className="pt-6 border-t border-brand-border">
                            <a
                                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent hover:text-brand-accent-hover group-hover:gap-3 transition-all duration-200"
                                href="#"
                            >
                                <span>[enlace de tarjeta]</span>
                                <svg className="w-3.5 h-3.5 stroke-current transition-transform duration-200 group-hover:translate-x-1" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>
            </section>
        </Reveal>
    );
}

export default FeaturesSection;