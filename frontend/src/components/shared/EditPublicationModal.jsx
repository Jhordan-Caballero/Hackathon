import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi';
import FormModalOrCard from '../forms/FormModalOrCard';
import { PERU_LOCATIONS } from '../../datos/peruLocations';

function EditPublicationModal({
    editingPublication,
    onClose,
    onSave,
}) {
    if (!editingPublication) return null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [district, setDistrict] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('activo');
    const [price, setPrice] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [region, setRegion] = useState('');
    const [contactWithatsapp, setContactWhatsapp] = useState('');

    useEffect(() => {
        if (editingPublication) {
            setTitle(editingPublication.title || '');
            setDescription(editingPublication.description || '');
            setDistrict(editingPublication.district || '');
            setLocation(editingPublication.location || editingPublication.neighborhood || '');
            setStatus(editingPublication.status || 'activo');
            setPrice(editingPublication.price ?? '');
            setTags(editingPublication.tags || []);
            setRegion(editingPublication.region || '');

            // 🚀 AUTOMATIZACIÓN DE TELÉFONO: Si empieza con 51 y tiene 11 dígitos, le quitamos el 51 para mostrar solo los 9 dígitos limpios
            const rawPhone = String(editingPublication.contact_whatsapp || editingPublication.phone || '').replace(/\D/g, '');
            const cleanPhone = (rawPhone.length === 11 && rawPhone.startsWith('51')) ? rawPhone.slice(2) : rawPhone;
            setContactWhatsapp(cleanPhone);
        }
    }, [editingPublication]);

    const handleCityChangeLocal = (e) => {
        const selectedCity = e.target.value;
        setRegion(selectedCity);
        setDistrict('');
    };

    const handleAddTag = () => {
        const cleaned = tagInput.trim().replace(/^#+/, '');
        if (!cleaned) return;
        const formattedTag = `#${cleaned}`;
        if (!tags.includes(formattedTag)) {
            setTags([...tags, formattedTag]);
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
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };
    const handleSubmitLocal = (e) => {
        e.preventDefault();

        // 🚀 FORMATEO DE SALIDA DE TELÉFONO: Limpiamos y aseguramos que viaje con el 51 antes de enviar a Supabase
        const rawPhone = contactWithatsapp.replace(/\D/g, '');
        const formattedPhone = rawPhone.length === 9 ? `51${rawPhone}` : rawPhone;

        const updatedPublication = {
            ...editingPublication,
            title: title.trim(),
            description: description.trim(),
            district,
            location: location.trim(),
            status,
            tags,
            region,
            contact_whatsapp: formattedPhone, // 🚀 Viaja formateado correctamente
            price: (editingPublication.type === 'catalogo' || editingPublication.type === 'producto') ? Number(price) : null,
        };

        onSave(updatedPublication);
    };

    const inputClass =
        'w-full mt-1 rounded-xl border border-brand-border bg-white px-3 py-1.5 text-xs text-brand-dark outline-none focus:border-brand-accent transition-colors';
    const labelClass = 'block text-[11px] font-semibold text-brand-dark uppercase tracking-wider';

    return (
        <FormModalOrCard
            title="Editar publicación"
            subtitle="Modifica los campos necesarios."
            onSubmit={handleSubmitLocal}
            onClose={onClose}
            submitText="Guardar cambios"
            maxWidth="max-w-2xl"
        >
            {editingPublication.type === 'emergencia' && (
                <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-2 flex items-start gap-2 text-amber-900 text-[11px]">
                    <FiAlertTriangle className="text-base text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-tight text-amber-800">
                        Este reporte alerta directamente a los vecinos de tu zona.
                    </p>
                </div>
            )}

            <div className="space-y-2.5">
                <div>
                    <label className={labelClass}>Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`${inputClass} min-h-[50px] max-h-24 resize-y py-1`}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <label className={labelClass}>Ciudad / Departamento</label>
                        <select
                            value={region}
                            onChange={handleCityChangeLocal}
                            className={inputClass}
                            required
                        >
                            <option value="">Selecciona una ciudad</option>
                            {Object.keys(PERU_LOCATIONS).map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Distrito</label>
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className={inputClass}
                            disabled={!region}
                            required
                        >
                            <option value="">{region ? 'Selecciona un distrito' : 'Primero elige una ciudad'}</option>
                            {region &&
                                PERU_LOCATIONS[region].map((dist) => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Dirección o referencia</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>WhatsApp de contacto</label>
                        <input
                            type="tel"
                            value={contactWithatsapp}
                            onChange={(e) => setContactWhatsapp(e.target.value)}
                            placeholder="Ej. 946414833"
                            maxLength="9"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Estado de visibilidad</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={inputClass}
                        >
                            <option value="activo">Activo (Visible)</option>
                            <option value="inactivo">Inactivo (Oculto)</option>
                        </select>
                    </div>

                    {(editingPublication.type === 'catalogo' || editingPublication.type === 'producto') && (
                        <div>
                            <label className={labelClass}>Precio (S/)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={inputClass}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Etiquetas (#)</label>
                    <div className="flex gap-2 mt-1">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDownTag}
                            placeholder="Escribe y presiona Enter"
                            className="w-full rounded-xl border border-brand-border bg-white px-3 py-1.5 text-xs outline-none focus:border-brand-accent"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent-hover transition-colors flex items-center justify-center text-sm"
                        >
                            <FiPlus />
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 max-h-14 overflow-y-auto">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 bg-brand-soft text-brand-accent text-[10px] font-semibold px-2 py-0.5 rounded-full border border-brand-border/60"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-red-600 transition-colors"
                                    >
                                        <FiX className="text-[10px]" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FormModalOrCard>
    );
}

export default EditPublicationModal;
