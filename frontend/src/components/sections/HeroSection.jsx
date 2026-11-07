
import Reveal from '../ui/Reveal';
import MetricItem from '../ui/MetricItem';

function HeroSection() {
    return (
        <Reveal>
            <section
                className="pt-16 pb-20 lg:pt-24 lg:pb-32 px-6 lg:px-12 max-w-7xl mx-auto relative"
                data-purpose="hero-section"
            >
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

                    {/* Etiqueta destacada */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface/90 backdrop-blur border border-brand-border text-xs font-medium text-brand-muted mb-8 shadow-2xs hover:border-brand-muted/40 hover:shadow-sm transition-all duration-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                        </span>

                        <span>[tag destacado / anuncio]</span>
                    </div>

                    {/* Título principal */}
                    <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-brand-dark max-w-4xl leading-[1.15]">
                        [título principal con

                        <span className="bg-amber-100/90 hover:bg-amber-100 text-amber-950 font-editorial-italic italic font-serif text-4xl sm:text-5xl lg:text-6xl rounded-full px-5 py-0.5 inline-flex items-center align-middle mx-1 border border-amber-200/80 shadow-xs hover:scale-105 transition-transform duration-200 cursor-default">
                            [etiqueta / acento]
                        </span>

                        <span className="font-editorial-italic italic font-serif">
                            y modular
                        </span>
                        ]
                    </h1>

                    {/* Descripción */}
                    <p className="mt-6 text-lg sm:text-xl text-brand-muted max-w-2xl font-light leading-relaxed">
                        [texto descriptivo breve y conciso]
                    </p>

                    {/* Botones */}
                    <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <button className="btn-shimmer w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-dark hover:bg-neutral-900 text-white text-sm font-medium tracking-normal transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                            [botón de acción principal]
                        </button>

                        <button className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white/95 hover:bg-brand-soft border border-brand-border hover:border-brand-muted/40 text-brand-dark text-sm font-medium tracking-normal transition-all duration-200 shadow-2xs hover:shadow hover:-translate-y-0.5 active:translate-y-0">
                            [botón de acción secundario]
                        </button>
                    </div>

                    {/* Métricas */}
                    <div className="mt-14 w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-border border-y border-brand-border py-4 text-center bg-brand-surface/40 backdrop-blur-xs rounded-xl">

                        <MetricItem
                            value="[métrica 1]"
                            label="[etiqueta 1]"
                        />

                        <MetricItem
                            value="[métrica 2]"
                            label="[etiqueta 2]"
                        />

                        <MetricItem
                            value="[métrica 3]"
                            label="[etiqueta 3]"
                        />

                    </div>
                </div>
            </section>
        </Reveal>
    );
}

export default HeroSection;
