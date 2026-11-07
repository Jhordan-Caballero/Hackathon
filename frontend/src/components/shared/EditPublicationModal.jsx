import FormModalOrCard from '../forms/FormModalOrCard';

function EditPublicationModal({
    editingPublication,
    editForm,
    onClose,
    onChange,
    onSubmit,
}) {
    if (!editingPublication) return null;

    const inputClass =
        'w-full mt-1.5 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 transition-colors';
    const labelClass = 'block text-xs font-semibold text-brand-dark uppercase tracking-wider';

    return (
        <FormModalOrCard
            title="Editar publicación"
            subtitle="Modifica los campos que necesites."
            onSubmit={onSubmit}
            onClose={onClose}
            submitText="Guardar cambios"
        >
            <div>
                <label className={labelClass}>Título</label>
                <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={onChange}
                    className={inputClass}
                    required
                />
            </div>

            <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                    name="description"
                    value={editForm.description}
                    onChange={onChange}
                    className={`${inputClass} min-h-28 resize-y`}
                    required
                />
            </div>

            <div>
                <label className={labelClass}>Ubicación</label>
                <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={onChange}
                    className={inputClass}
                    required
                />
            </div>

            {/* Selector de Estado Activo / Inactivo */}
            <div>
                <label className={labelClass}>Estado de visibilidad</label>
                <select
                    name="status"
                    value={editForm.status || 'activo'}
                    onChange={onChange}
                    className={inputClass}
                >
                    <option value="activo">Activo (Visible en el vecindario)</option>
                    <option value="inactivo">Inactivo (Oculto)</option>
                </select>
            </div>

            {editingPublication.type === 'catalogo' && (
                <div>
                    <label className={labelClass}>Precio (S/)</label>
                    <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={onChange}
                        className={inputClass}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            )}
        </FormModalOrCard>
    );
}

export default EditPublicationModal;