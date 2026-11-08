import { FiSearch } from 'react-icons/fi';
import Button from './Button';

function EmptyState({
    title = 'No encontramos publicaciones',
    description = 'Prueba con otra búsqueda o modifica los filtros.',
    actionLabel = 'Limpiar filtros',
    onAction,
}) {
    return (
        <div className="text-center py-16 px-5 bg-white rounded-2xl border border-brand-border">
            {/* 🚀 LOGO MEJORADO: Icono de react-icons centrado y estético */}
            <div className="w-12 h-12 rounded-full bg-brand-soft text-brand-muted flex items-center justify-center text-xl mx-auto mb-3 shadow-3xs">
                <FiSearch />
            </div>

            <h3 className="font-serif text-xl text-brand-dark">
                {title}
            </h3>

            <p className="text-sm text-brand-muted mt-2">
                {description}
            </p>

            {onAction && (
                <Button
                    variant="secondary"
                    onClick={onAction}
                    className="mt-5"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

export default EmptyState;
