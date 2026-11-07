import Reveal from '../ui/Reveal';

function ModulesSection() {
    const modules = [
        {
            number: '01',
            title: '[módulo lavanda]',
            description: '[calibración perceptual y registro de bienestar preventivo.]',
            status: '[fase alpha]',
            style: 'bg-[#F2EEFB] border-purple-200/80 hover:border-purple-300 hover:shadow-purple-200/50',
            badge: 'bg-white/80 text-brand-dark',
            titleColor: 'text-brand-dark',
            descriptionColor: 'text-brand-dark/70',
            footerColor: 'text-brand-dark/80 border-brand-dark/10',
        },
        {
            number: '02',
            title: '[módulo profundo]',
            description: '[arquitectura central con procesamiento confidencial de datos.]',
            status: '[escala 1:1]',
            style: 'bg-brand-dark border-brand-dark hover:border-neutral-700 hover:shadow-neutral-900/40',
            badge: 'bg-white/10 text-brand-border',
            titleColor: 'text-white',
            descriptionColor: 'text-brand-border/80',
            footerColor: 'text-brand-border border-white/15',
        },
        {
            number: '03',
            title: '[módulo rubor]',
            description: '[comunicación directa con especialistas y retroalimentación periódica.]',
            status: '[asincrónico]',
            style: 'bg-[#FDF4F5] border-rose-200/80 hover:border-rose-300 hover:shadow-rose-200/50',
            badge: 'bg-white/80 text-brand-dark',
            titleColor: 'text-brand-dark',
            descriptionColor: 'text-brand-dark/70',
            footerColor: 'text-brand-dark/80 border-brand-dark/10',
        },
        {
            number: '04',
            title: '[módulo ámbar]',
            description: '[trazabilidad longitudinal con reportes descargables certificados.]',
            status: '[exportable]',
            style: 'bg-[#FDF9EE] border-amber-200/80 hover:border-amber-300 hover:shadow-amber-200/50',
            badge: 'bg-white/80 text-brand-dark',
            titleColor: 'text-brand-dark',
            descriptionColor: 'text-brand-dark/70',
            footerColor: 'text-brand-dark/80 border-brand-dark/10',
        },
    ];

    const metrics = [
        {
            value: '48:00',
            label: '[tiempo promedio de síntesis analítica]',
        },
        {
            value: '500+',
            label: '[biomarcadores y variables correlacionadas]',
        },
        {
            value: '∞',
            label: '[persistencia y soberanía de registros]',
            italic: true,
        },
    ];

    return (
        <Reveal>
            <section
                className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto border-t border-brand-border"
                data-purpose="pastel-highlights"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-xs uppercase font-semibold tracking-wider text-brand-accent">
                            [colección de módulos]
                        </span>

                        <h2 className="font-serif text-4xl sm:text-5xl text-brand-dark mt-3 leading-tight">
                            [experiencias diseñadas{' '}
                            <span className="font-editorial-italic text-brand-muted">
                                con propósito]
                            </span>
                        </h2>

                        <p className="mt-3 text-brand-muted text-base max-w-xl font-light">
                            [una suite armónica adaptada a los requerimientos contemporáneos más exigentes.]
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Anterior"
                            className="w-10 h-10 rounded-full border border-brand-border bg-brand-surface flex items-center justify-center text-brand-dark hover:bg-brand-soft hover:scale-105 active:scale-95 transition-all shadow-2xs font-mono text-xs"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            aria-label="Siguiente"
                            className="w-10 h-10 rounded-full border border-brand-border bg-brand-surface flex items-center justify-center text-brand-dark hover:bg-brand-soft hover:scale-105 active:scale-95 transition-all shadow-2xs font-mono text-xs"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module) => (
                        <article
                            key={module.number}
                            className={`rounded-2xl border p-7 flex flex-col justify-between h-80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${module.style}`}
                        >
                            <div>
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-mono mb-6 shadow-2xs group-hover:scale-105 transition-transform ${module.badge}`}>
                                    {module.number}
                                </span>

                                <h3 className={`font-serif text-2xl mb-2 leading-snug ${module.titleColor}`}>
                                    {module.title}
                                </h3>

                                <p className={`text-xs font-light leading-relaxed ${module.descriptionColor}`}>
                                    {module.description}
                                </p>
                            </div>

                            <div className={`pt-4 border-t flex items-center justify-between text-xs font-mono ${module.footerColor}`}>
                                <span>{module.status}</span>
                                <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                    ↗
                                </span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Métricas inferiores */}
                <div className="mt-16 border border-brand-border rounded-2xl bg-brand-surface/90 backdrop-blur-sm p-8 shadow-subtle hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-border text-center">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="py-4 px-6 group">
                                <div className={`font-serif text-4xl lg:text-5xl font-normal text-brand-dark group-hover:scale-105 transition-transform duration-200 ${metric.italic ? 'font-editorial-italic italic group-hover:scale-110' : ''}`}>
                                    {metric.value}
                                </div>
                                <div className="text-xs font-mono uppercase tracking-wider text-brand-muted mt-2">
                                    {metric.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Reveal>
    );
}

export default ModulesSection;
