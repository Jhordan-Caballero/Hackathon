import Reveal from '../ui/Reveal';
import ImageFrame from '../ui/ImageFrame';

function SectionHero({
    label = 'Una comunidad más conectada',
    title = 'Lo bueno de vivir en tu barrio está',
    highlight = 'más cerca',
    description = 'Descubre productos, servicios y oficios de tus vecinos. Comparte lo que sabes hacer y conecta al instante.',
    heroImage = '', 
}) {
    return (
        <Reveal>
            <section
                className="pt-8 pb-12 lg:pt-14 lg:pb-20 px-6 lg:px-12 max-w-7xl mx-auto relative"
                data-purpose="hero-section"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    
                    {/* Columna Izquierda: Textos */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left">
                        
                        {/* Tag/Etiqueta urbana */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-soft border border-brand-red/15 text-xs font-semibold text-brand-red mb-6 shadow-2xs">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
                            </span>
                            <span>{label}</span>
                        </div>

                        {/* Título Principal estilo Yape */}
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark leading-[1.15] mb-6">
                            {title}{' '}
                            {highlight && (
                                <span className="bg-brand-red text-white font-display font-bold rounded-2xl px-3 py-1 inline-block -rotate-1 shadow-md hover:rotate-0 transition-transform duration-200">
                                    {highlight}
                                </span>
                            )}
                        </h1>

                        {/* Descripción */}
                        <p className="text-base sm:text-lg text-brand-muted font-normal leading-relaxed max-w-xl">
                            {description}
                        </p>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-300">
                            <ImageFrame
                                src={heroImage}
                                alt="Vecinos conectados"
                                aspectRatio="aspect-4/3"
                                className="rounded-3xl border-4 border-white shadow-card"
                            />
                            
                            <div className="absolute -bottom-4 -left-4 bg-white px-4 py-3 rounded-2xl shadow-elevation border border-brand-border flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-red font-bold text-lg">
                                    ♥
                                </div>
                                <div>
                                    <p className="font-display font-bold text-xs text-brand-dark">Comunidad Mi Barrio</p>
                                    <p className="text-[11px] text-brand-muted">100% confiable y local</p>
                                </div>
                            </div>
                        </div>

                        {/* Fondo decorativo detrás de la foto */}
                        <div className="absolute inset-0 bg-brand-red/10 rounded-3xl transform -rotate-3 scale-105 z-0 blur-xs" />
                    </div>

                </div>
            </section>
        </Reveal>
    );
}

export default SectionHero;