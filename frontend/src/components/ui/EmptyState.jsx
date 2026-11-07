
import Button from './Button';

function EmptyState({
    icon = 'search_off',
    title = 'No encontramos publicaciones',
    description = 'Prueba con otra búsqueda o modifica los filtros.',
    actionLabel = 'Limpiar filtros',
    onAction,
}) {
    return (
        <div className="text-center py-16 px-5 bg-white rounded-2xl border border-brand-border">
            <span className="material-symbols-outlined text-4xl text-brand-muted">
                {icon}
            </span>

            <h3 className="font-serif text-xl text-brand-dark mt-3">
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
