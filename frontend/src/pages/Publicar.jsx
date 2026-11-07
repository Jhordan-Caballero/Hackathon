import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiImage, FiPlus, FiX, FiPhone, FiAlertTriangle } from 'react-icons/fi';

import FormModalOrCard from '../components/forms/FormModalOrCard';
import ImageFrame from '../components/ui/ImageFrame';

const STORAGE_KEY = 'community-publications';
const PROFILE_KEY = 'community-profile';

const categoryOptions = {
    catalogo: ['Alimentos', 'Hogar', 'Educación', 'Mascotas', 'Tecnología', 'Otros'],
    ayuda: ['Apoyo comunitario', 'Hogar y jardín', 'Educación', 'Alimentos', 'Tecnología', 'Otros'],
    emergencia: ['Salud', 'Incendios', 'Seguridad', 'Accidentes', 'Servicios básicos', 'Otros'],
};

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

const initialForm = {
    title: '',
    description: '',
    category: '',
    district: 'Cerro Colorado',
    location: '',
    price: '',
    phone: '',
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
    const [userName, setUserName] = useState('María López');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [message, setMessage] = useState('');

    // Cargar datos del perfil como valor inicial predeterminado
    useEffect(() => {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            if (parsed.name) setUserName(parsed.name);
            if (parsed.phone) {
                // Si el perfil tiene 11 dígitos con '51', obtenemos solo los 9 locales para el input
                const cleaned = String(parsed.phone).replace(/\D/g, '');
                const localPhone = cleaned.length === 11 && cleaned.startsWith('51') ? cleaned.slice(2) : cleaned;
                setForm((prev) => ({ ...prev, phone: localPhone }));
            }
        }
    }, []);

    const handleTypeChange = (newType) => {
        setType(newType);
        setForm((prev) => ({ ...initialForm, phone: prev.phone }));
        setTags([]);
        setTagInput('');
        setImagePreview('');
        setMessage('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Limpiar y asegurar prefijo de 11 dígitos para el guardado interno (51 + 9 dígitos)
        const rawPhone = form.phone.replace(/\D/g, '');
        const formattedPhone = rawPhone.length === 9 ? `51${rawPhone}` : rawPhone;

        const publication = {
            id: Date.now(),
            type,
            estado: type === 'emergencia' ? 'emergencia' : 'publicada',
            status: 'activo',
            typeLabel:
                type === 'catalogo'
                    ? 'Catálogo'
                    : type === 'ayuda'
                        ? 'Ayuda vecinal'
                        : 'Emergencia',
            categoryId: form.category.toLowerCase().replaceAll(' ', '-'),
            category: form.category,
            icon: type === 'emergencia' ? '🚨' : type === 'ayuda' ? '🤝' : '🥐',
            title: form.title.trim(),
            description: form.description.trim(),
            provider: userName,
            district: form.district,
            location: form.location.trim(),
            phone: formattedPhone,
            date: 'Ahora',
            image: imagePreview || null,
            price: type === 'catalogo' ? Number(form.price) : null,
            tags: tags,
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

            {/* Aviso de emergencia */}
            {type === 'emergencia' && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 text-lg shrink-0 mt-0.5">
                        <FiAlertTriangle />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-red-900">
                            Aviso importante de emergencia
                        </p>
                        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                            Reporta situaciones de riesgo con responsabilidad. Si se trata de un peligro inminente, contacta también a las autoridades locales.
                        </p>
                    </div>
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

            {/* Distrito */}
            <div>
                <label className={labelClass}>Distrito</label>
                <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
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

            {/* Dirección / Zona específica */}
            <div>
                <label className={labelClass}>Dirección o referencia de zona</label>
                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ej. Sector Las Palmas, Urb. Los Pinos"
                    className={inputClass}
                    required
                />
            </div>

            {/* Etiquetas (#) dinámicas */}
            <div>
                <label className={labelClass}>Etiquetas (#)</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDownTag}
                        placeholder="Ej. Alimentos (Presiona Enter o +)"
                        className={inputClass}
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

            {/* WhatsApp de contacto editable */}
            <div>
                <label className={labelClass}>WhatsApp de contacto</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiPhone />
                    </span>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Ej. 946414833"
                        maxLength="9"
                        className="w-full px-4 py-3 pl-11 rounded-xl border border-brand-border bg-white text-sm outline-none focus:border-brand-accent transition-colors text-brand-dark"
                        required
                    />
                </div>
                <p className="text-[11px] text-brand-muted mt-1.5">
                    Viene cargado con el número de tu perfil, pero puedes cambiarlo si prefieres usar otro.
                </p>
            </div>
        </FormModalOrCard>
    );
}

export default Publicar;