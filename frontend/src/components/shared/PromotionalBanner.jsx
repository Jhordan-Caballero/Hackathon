import Reveal from '../ui/Reveal';
import Button from '../ui/Button';

function PromotionalBanner({
    title = "¿Necesitas ayuda o quieres colaborar?",
    description = "Publica una solicitud o comparte algo que quieras intercambiar.",
    buttonText = "Crear publicación",
    buttonHref = "/publicar?tipo=ayuda",
    variant = "cta"
}) {
    return (
        <Reveal>
            <div className="mt-12 bg-brand-accent rounded-2xl p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-5">
                <div>
                    <h3 className="font-serif text-2xl text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-sm text-white/75">
                        {description}
                    </p>
                </div>

                <Button
                    href={buttonHref}
                    variant={variant}
                >
                    {buttonText}
                </Button>
            </div>
        </Reveal>
    );
}

export default PromotionalBanner;