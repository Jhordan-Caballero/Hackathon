
import Reveal from '../ui/Reveal';

function SectionHero({
    label = 'Una comunidad más conectada',
    title = 'Lo bueno de vivir en comunidad está',
    highlight = 'más cerca',
    description = 'Descubre productos, servicios y oficios de tus vecinos. Comparte lo que sabes hacer y conecta con las personas de tu comunidad.',
}) {
    return (
        <Reveal>
            <section
                className="pt-12 pb-8 lg:pt-16 lg:pb-10 px-6 lg:px-12 max-w-7xl mx-auto relative"
                data-purpose="hero-section"
            >
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

                    {/* Etiqueta destacada */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface/90 backdrop-blur border border-brand-border text-xs font-medium text-brand-muted mb-8 shadow-2xs hover:border-brand-muted/40 hover:shadow-sm transition-all duration-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                        </span>

                        <span>{label}</span>
                    </div>

                    {/* Título principal */}
                    <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-brand-dark max-w-4xl leading-[1.15]">
                        {title}

                        {highlight && (
                            <span className="bg-amber-100/90 hover:bg-amber-100 text-amber-950 font-editorial-italic italic font-serif text-4xl sm:text-5xl lg:text-6xl rounded-full px-5 py-0.5 inline-flex items-center align-middle mx-1 border border-amber-200/80 shadow-xs hover:scale-105 transition-transform duration-200 cursor-default">
                                {highlight}
                            </span>
                        )}
                    </h1>

                    {/* Descripción */}
                    <p className="mt-6 text-lg sm:text-xl text-brand-muted max-w-2xl font-light leading-relaxed">
                        {description}
                    </p>

                </div>
            </section>
        </Reveal>
    );
}

export default SectionHero;
