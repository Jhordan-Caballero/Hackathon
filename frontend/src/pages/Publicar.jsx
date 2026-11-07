import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiImage } from 'react-icons/fi';

import FormModalOrCard from '../components/forms/FormModalOrCard';
import ImageFrame from '../components/ui/ImageFrame';

const STORAGE_KEY = 'community-publications';

const categoryOptions = {
    catalogo: ['Alimentos', 'Hogar', 'Educación', 'Mascotas', 'Tecnología', 'Otros'],
    ayuda: ['Apoyo comunitario', 'Hogar y jardín', 'Educación', 'Alimentos', 'Tecnología', 'Otros'],
    emergencia: ['Salud', 'Incendios', 'Seguridad', 'Accidentes', 'Servicios básicos', 'Otros'],
};

const initialForm = {
    title: '',
    description: '',
    category: '',
    location: '',
    price: '',
    publicationType: 'producto',
    helpType: 'ayuda',
    phone: '51987654321',
};

function Publicar() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialType = searchParams.get('tipo') || 'catalogo';

    const [type, setType] = useState(
        ['catalogo', 'ayuda', 'emergencia'].includes(initialType)
            ? initialType
            : 'catalogo'
    );

    const [form, setForm] = useState(initialForm);
    const [imagePreview, setImagePreview] = useState('');
    const [message, setMessage] = useState('');

    const handleTypeChange = (newType) => {
        setType(newType);
        setForm(initialForm);
        setImagePreview('');
        setMessage('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const publication = {
            id: Date.now(),
            type,
            estado: type === 'emergencia' ? 'emergencia' : 'publicada',
            typeLabel:
                type === 'catalogo'
                    ? form.publicationType === 'producto' ? 'Producto' : 'Servicio'
                    : type === 'ayuda'
                        ? form.helpType === 'ayuda' ? 'Solicito ayuda' : 'Intercambio'
                        : 'Emergencia',
            categoryId: form.category.toLowerCase().replaceAll(' ', '-'),
            category: form.category,
            icon: type === 'emergencia' ? '⚠️' : type === 'ayuda' ? '🤝' : '🥐',
            title: form.title.trim(),
            description: form.description.trim(),
            provider: 'María López',
            location: form.location.trim(),
            phone: form.phone,
            date: 'Ahora',
            image: imagePreview || null,
            price: type === 'catalogo' ? Number(form.price) : null,
            tags: [],
            ownerId: 'current-user',
        };

        const savedPublications = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        localStorage.setItem(STORAGE_KEY, JSON.stringify([publication, ...savedPublications]));

        setMessage('¡Tu publicación se ha creado correctamente!');

        setTimeout(() => {
            navigate('/perfil');
        }, 1000);
    };

    const inputClass =
        'w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 transition-colors';
    const labelClass = 'block text-sm font-semibold text-brand-dark mb-2';

    return (
        <FormModalOrCard
            title="Crear publicación"
            subtitle="Completa los datos para compartir tu publicación con los vecinos."
            onSubmit={handleSubmit}
            submitText="Publicar"
            message={message}
            maxWidth="max-w-2xl"
        >
            {/* Selector de tipo de publicación */}
            <div>
                <label className={labelClass}>¿Qué deseas publicar?</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: 'catalogo', label: 'Catálogo', icon: '🛍️' },
                        { value: 'ayuda', label: 'Ayuda vecinal', icon: '🤝' },
                        { value: 'emergencia', label: 'Emergencia', icon: '🚨' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleTypeChange(option.value)}
                            className={`rounded-xl border p-3 text-center transition ${type === option.value
                                    ? 'border-brand-accent bg-brand-soft text-brand-accent font-semibold'
                                    : 'border-brand-border hover:bg-brand-soft text-brand-dark'
                                }`}
                        >
                            <span className="block text-xl mb-1">{option.icon}</span>
                            <span className="text-xs">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Subtipos según selección */}
            {type === 'catalogo' && (
                <div>
                    <label className={labelClass}>Tipo de publicación</label>
                    <select
                        name="publicationType"
                        value={form.publicationType}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="producto">Producto</option>
                        <option value="servicio">Servicio</option>
                    </select>
                </div>
            )}

            {type === 'ayuda' && (
                <div>
                    <label className={labelClass}>Tipo de publicación</label>
                    <select
                        name="helpType"
                        value={form.helpType}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="ayuda">Solicito ayuda</option>
                        <option value="intercambio">Intercambio</option>
                    </select>
                </div>
            )}

            {type === 'emergencia' && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                    <p className="text-sm font-semibold text-red-800">
                        Importante: reporte de emergencia
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                        Si existe peligro inmediato, comunícate también con los servicios de emergencia correspondientes.
                    </p>
                </div>
            )}

            {/* Título */}
            <div>
                <label className={labelClass}>Título</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Escribe un título descriptivo"
                    className={inputClass}
                    required
                    maxLength={80}
                />
            </div>

            {/* Descripción */}
            <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Cuéntanos más detalles..."
                    className={`${inputClass} min-h-28 resize-y`}
                    required
                    maxLength={500}
                />
            </div>

            {/* Categoría */}
            <div>
                <label className={labelClass}>Categoría</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categoryOptions[type].map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Precio solo si es catálogo */}
            {type === 'catalogo' && (
                <div>
                    <label className={labelClass}>Precio (S/)</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={inputClass}
                        required
                    />
                </div>
            )}

            {/* Ubicación */}
            <div>
                <label className={labelClass}>Dirección o zona</label>
                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ej. Sector Las Palmas"
                    className={inputClass}
                    required
                />
            </div>

            {/* Subir Fotografía */}
            <div>
                <label className={labelClass}>Fotografía (opcional)</label>
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-border cursor-pointer overflow-hidden hover:bg-brand-soft/50 transition">
                    {imagePreview ? (
                        <ImageFrame
                            src={imagePreview}
                            alt="Vista previa"
                            aspectRatio="aspect-video"
                            className="w-full"
                        />
                    ) : (
                        <div className="py-8 flex flex-col items-center justify-center gap-2 text-brand-muted">
                            <FiImage className="text-3xl" />
                            <span className="text-sm">Selecciona una fotografía</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
            </div>

            {/* WhatsApp */}
            <div>
                <label className={labelClass}>WhatsApp de contacto</label>
                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Número de WhatsApp"
                    className={inputClass}
                    required
                />
            </div>
        </FormModalOrCard>
    );
}

export default Publicar;