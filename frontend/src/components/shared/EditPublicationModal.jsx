import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi';
import FormModalOrCard from '../forms/FormModalOrCard';

const districtOptions = [
    'Cerro Colorado',
    'Arequipa (Cercado)',
    'Cayma',
    'Yanahuara',
    'Alto Selva Alegre',
    'Miraflores',
    'José Luis Bustamante y Rivero',
    'Paucarpata',
];

function EditPublicationModal({
    editingPublication,
    editForm,
    onClose,
    onChange,
    onSubmit,
}) {
    if (!editingPublication) return null;

    const [tags, setTags] = useState(editingPublication.tags || []);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (editingPublication) {
            setTags(editingPublication.tags || []);
        }
    }, [editingPublication]);

    const handleAddTag = () => {
        const cleaned = tagInput.trim().replace(/^#+/, '');
        if (!cleaned) return;
        const formattedTag = `#${cleaned}`;
        if (!tags.includes(formattedTag)) {
            const updatedTags = [...tags, formattedTag];
            setTags(updatedTags);
            onChange({ target: { name: 'tags', value: updatedTags } });
        }
        setTagInput('');
    };

    const handleKeyDownTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(updatedTags);
        onChange({ target: { name: 'tags', value: updatedTags } });
    };

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
            {editingPublication.type === 'emergencia' && (
                <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-3.5 flex items-start gap-3 text-amber-900">
                    <FiAlertTriangle className="text-xl text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed text-amber-800">
                        Recordatorio: Este reporte alerta directamente a los vecinos de tu zona.
                    </p>
                </div>
            )}

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

            {/* Distrito */}
            <div>
                <label className={labelClass}>Distrito</label>
                <select
                    name="district"
                    value={editForm.district || 'Cerro Colorado'}
                    onChange={onChange}
                    className={inputClass}
                    required
                >
                    {districtOptions.map((dist) => (
                        <option key={dist} value={dist}>
                            {dist}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className={labelClass}>Dirección o zona</label>
                <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={onChange}
                    className={inputClass}
                    required
                />
            </div>

            {/* Interfaz dinámica de etiquetas */}
            <div>
                <label className={labelClass}>Etiquetas (#)</label>
                <div className="flex gap-2 mt-1.5">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDownTag}
                        placeholder="Escribe y presiona Enter o +"
                        className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-accent"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 bg-brand-accent text-white rounded-xl hover:bg-brand-accent-hover transition-colors flex items-center justify-center text-lg"
                    >
                        <FiPlus />
                    </button>
                </div>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 bg-brand-soft text-brand-accent text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-border/60"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-red-600 transition-colors"
                                >
                                    <FiX className="text-sm" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
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