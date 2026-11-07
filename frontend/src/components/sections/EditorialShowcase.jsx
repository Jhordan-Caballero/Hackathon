import Reveal from '../ui/Reveal';
import ImageFrame from '../ui/ImageFrame';

function EditorialShowcase() {
    return (
        <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
            <Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Imagen principal */}
                    <ImageFrame
                        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
                        alt="Espacio de trabajo moderno"
                        aspectRatio="aspect-[4/5]"
                    />

                    {/* Contenido de prueba */}
                    <div className="flex flex-col justify-center">
                        <span className="text-xs uppercase tracking-widest text-brand-muted mb-4">
                            [etiqueta de sección]
                        </span>

                        <h2 className="font-serif text-4xl lg:text-5xl text-brand-dark leading-tight">
                            Un espacio para mostrar contenido visual.
                        </h2>

                        <p className="mt-6 text-brand-muted leading-relaxed">
                            Este es un ejemplo de cómo puedes combinar fotografías
                            con texto dentro de una sección de tu página.
                        </p>

                        <div className="mt-8">
                            <ImageFrame
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c"
                                alt="Oficina luminosa"
                                aspectRatio="aspect-video"
                            />
                        </div>
                    </div>

                </div>
            </Reveal>
        </section>
    );
}

export default EditorialShowcase;