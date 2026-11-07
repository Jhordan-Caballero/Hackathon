import Button from '../ui/Button';
import Reveal from '../ui/Reveal';

function CallToActionSection() {
    return (
        <Reveal>
            <section
                className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto"
                data-purpose="cta-section"
                id="cta"
            >
                <div className="relative bg-brand-dark text-white rounded-3xl p-10 sm:p-16 lg:p-20 overflow-hidden shadow-elevation hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center group">

                    {/* Fondos decorativos */}
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-accent/40 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

                    <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Etiqueta */}
                    <span className="relative z-10 text-xs font-semibold uppercase tracking-widest text-brand-border/70 mb-4 inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        [etiqueta / tag]
                    </span>

                    {/* Título */}
                    <h2 className="relative z-10 font-serif text-4xl sm:text-5xl lg:text-6xl max-w-3xl leading-[1.15] font-light">
                        [título de llamada a la acción]{' '}
                        <span className="font-editorial-italic">
                            [énfasis en cursiva]
                        </span>
                    </h2>

                    {/* Descripción */}
                    <p className="relative z-10 mt-6 text-brand-border/80 text-base sm:text-lg max-w-xl font-light">
                        [texto persuasivo breve]
                    </p>

                    {/* Botones */}
                    <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Button variant="cta">
                            [botón de acción principal]
                        </Button>

                        <a
                            className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider text-brand-border hover:text-white px-6 py-3.5 transition-all duration-200 hover:translate-x-1 inline-flex items-center justify-center gap-1.5"
                            href="#"
                        >
                            [enlace secundario]
                            <span>→</span>
                        </a>
                    </div>

                </div>
            </section>
        </Reveal>
    );
}

export default CallToActionSection;
