import Reveal from '../ui/Reveal';

function TrustLogosSection() {
    const logos = [
        '[logo colaborador 1]',
        '[logo colaborador 2]',
        '[logo colaborador 3]',
        '[logo colaborador 4]',
        '[logo colaborador 5]',
    ];

    return (
        <Reveal>
            <section className="border-y border-brand-border bg-brand-surface/70 backdrop-blur-sm py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-8">
                        [respaldado por / colaboradores]
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
                        {logos.map((logo, index) => (
                            <div
                                key={index}
                                className={`font-serif text-lg tracking-tight text-brand-dark/70 hover:opacity-100 hover:text-brand-dark hover:scale-105 transition-all duration-200 cursor-default ${index === 4 ? 'col-span-2 md:col-span-1' : ''
                                    }`}
                            >
                                {logo}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Reveal>
    );
}

export default TrustLogosSection;
