import Button from '../ui/Button';
import { FiX } from 'react-icons/fi';

function FormModalOrCard({
    title,
    subtitle,
    logoImg,
    onSubmit,
    onClose,
    children,
    submitText = 'Guardar',
    message,
    footer,
    maxWidth = 'max-w-md',
}) {
    const isModal = Boolean(onClose);

    const formContent = (
        <div className={`bg-white border border-brand-border rounded-3xl p-7 md:p-9 shadow-xl w-full ${maxWidth} relative text-left`}>

            {/* Botón de cerrar para modales */}
            {isModal && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand-dark hover:bg-brand-border transition-colors text-lg z-10"
                >
                    <FiX />
                </button>
            )}

            {/* Encabezado centrado */}
            <div className="text-center mb-8 flex flex-col items-center justify-center">
                {logoImg && (
                    <div className="mb-4 w-full flex justify-center items-center">
                        <img
                            src={logoImg}
                            alt="Logo Comunify"
                            className="h-14 w-auto object-contain mx-auto block"
                        />
                    </div>
                )}

                <h2 className="font-serif text-3xl text-brand-dark w-full text-center">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-sm text-brand-muted mt-2 w-full text-center">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Formulario alineado a la izquierda */}
            <form onSubmit={onSubmit} className="space-y-5 text-left">
                {children}

                {message && (
                    <p className="text-xs text-brand-accent text-center bg-brand-soft p-2.5 rounded-xl">
                        {message}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-border">
                    {isModal && (
                        <Button type="button" variant="secondary" onClick={onClose} className="justify-center">
                            Cancelar
                        </Button>
                    )}
                    <Button type="submit" className="flex-1 justify-center">
                        {submitText}
                    </Button>
                </div>
            </form>

            {/* Pie de página centrado */}
            {footer && (
                <div className="mt-6 text-center text-sm text-brand-muted border-t border-brand-border pt-5">
                    {footer}
                </div>
            )}
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                {formContent}
            </div>
        );
    }

    return (
        <section className="min-h-[80vh] flex items-center justify-center px-5 py-12">
            {formContent}
        </section>
    );
}

export default FormModalOrCard;