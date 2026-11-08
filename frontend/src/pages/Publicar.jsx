import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiImage, FiPlus, FiX, FiPhone, FiAlertTriangle } from 'react-icons/fi';

import FormModalOrCard from '../components/forms/FormModalOrCard';
import ImageFrame from '../components/ui/ImageFrame';
import { PERU_LOCATIONS } from '../datos/peruLocations';
import { supabase } from '../supabaseClient';

const PROFILE_KEY = 'community-profile';

const initialForm = {
    title: '',
    description: '',
    city: '',
    district: '',
    location: '',
    price: '',
    phone: '',
};

function Publicar() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialType = searchParams.get('tipo') || 'catalogo';

    const [type, setType] = useState(
        ['catalogo', 'ayuda', 'emergencia'].includes(initialType) ? initialType : 'catalogo'
    );

    const [form, setForm] = useState(initialForm);
    const [profileData, setProfileData] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [message, setMessage] = useState('');
    useEffect(() => {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            setProfileData(parsed);

            let localPhone = '';
            if (parsed.whatsapp) {
                const cleaned = String(parsed.whatsapp).replace(/\D/g, '');
                localPhone = cleaned.length === 11 && cleaned.startsWith('51') ? cleaned.slice(2) : cleaned;
            }

            setForm((prev) => ({
                ...prev,
                phone: localPhone || prev.phone,
                city: parsed.region || '',
                district: parsed.district || '',
                location: parsed.neighborhood || '',
            }));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleTypeChange = (newType) => {
        setType(newType);
        setForm((prev) => ({
            ...initialForm,
            phone: prev.phone,
            city: prev.city,
            district: prev.district,
            location: prev.location
        }));
        setTags([]);
        setTagInput('');
        setImagePreview('');
        setMessage('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setForm((prev) => ({
            ...prev,
            city: selectedCity,
            district: '',
        }));
    };

    //parte 3
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
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('Enviando publicación al vecindario...');

        const rawPhone = form.phone.replace(/\D/g, '');
        const formattedPhone = rawPhone.length === 9 ? `51${rawPhone}` : rawPhone;

        // 1. Definimos las variables de control para mapear tu base de datos unificada
        let dbSection = 'servicios';
        let dbType = 'servicio';
        let dbIntent = 'ofrezco';
        let dbStatus = 'activa'; // Requisito estricto de pub_status_chk

        if (type === 'catalogo') {
            dbSection = 'servicios';
            dbType = 'producto';
            dbIntent = 'ofrezco';
        } else if (type === 'ayuda') {
            dbSection = 'comunidad';
            dbType = 'ayuda';
            dbIntent = 'solicito';
        } else if (type === 'emergencia') {
            dbSection = 'comunidad';
            dbType = 'ayuda';       // Mapeamos temporalmente a ayuda social para pasar el check
            dbIntent = 'solicito';
        }

        try {
            // 2. Inserción en Supabase enviando las columnas unificadas correspondientes
            const { error } = await supabase
                .from('publications')
                .insert([
                    // Busca el objeto insertado dentro de tu handleSubmit y déjalo así:
                    {
                        user_id: profileData?.id,
                        title: form.title.trim(),
                        description: form.description.trim(),
                        type: dbType,
                        section: dbSection,
                        intent: dbIntent,
                        price: type === 'catalogo' ? Number(form.price) : null,
                        region: form.city,      
                        district: form.district, 
                        location: form.location.trim(),
                        contact_whatsapp: formattedPhone, 
                        tags: tags.map(tag => tag.replace('#', '').toLowerCase().trim()),
                        emergency_support: type === 'emergencia'
                    }

                ]);

            if (error) {
                setMessage(`Error de base de datos: ${error.message}`);
                return;
            }

            setMessage('¡Tu publicación se ha guardado con éxito!');
            setTimeout(() => { navigate('/perfil'); }, 1200);
        } catch (err) {
            setMessage('Ocurrió un error de red al intentar publicar.');
        }
    };

    const inputClass = 'w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-accent transition-colors';
    const labelClass = 'block text-sm font-semibold text-brand-dark mb-2';

    //parte 3
    return (
        <FormModalOrCard
            title="Crear publicación"
            subtitle="Completa los datos para compartir tu publicación con los vecinos."
            onSubmit={handleSubmit}
            submitText="Publicar"
            message={message}
            maxWidth="max-w-2xl"
        >
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
                            className={`rounded-xl border p-3 text-center transition ${type === option.value ? 'border-brand-accent bg-brand-soft text-brand-accent font-semibold' : 'border-brand-border hover:bg-brand-soft text-brand-dark'}`}
                        >
                            <span className="block text-xl mb-1">{option.icon}</span>
                            <span className="text-xs">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {type === 'emergencia' && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 text-lg shrink-0 mt-0.5"><FiAlertTriangle /></div>
                    <div>
                        <p className="text-sm font-semibold text-red-900">Aviso importante de emergencia</p>
                        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">Reporta situaciones de riesgo con responsabilidad. Si se trata de un peligro inminente, contacta también a las autoridades locales.</p>
                    </div>
                </div>
            )}

            <div>
                <label className={labelClass}>Título</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Escribe un título descriptivo" className={inputClass} required maxLength={80} />
            </div>

            <div>
                <label className={labelClass}>Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Cuéntanos más detalles..." className={`${inputClass} min-h-28 resize-y`} required maxLength={500} />
            </div>

            {type === 'catalogo' && (
                <div>
                    <label className={labelClass}>Precio (S/)</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className={inputClass} required />
                </div>
            )}
            <div>
                <label className={labelClass}>Ciudad / Departamento</label>
                <select
                    name="city"
                    value={form.city}
                    onChange={handleCityChange}
                    className={inputClass}
                    required
                >
                    <option value="">Selecciona una ciudad</option>
                    {Object.keys(PERU_LOCATIONS).map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
            </div>

            <div>
                <label className={labelClass}>Distrito</label>
                <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={!form.city}
                    required
                >
                    <option value="">{form.city ? 'Selecciona un distrito' : 'Primero elige una ciudad'}</option>
                    {form.city && PERU_LOCATIONS[form.city].map((dist) => <option key={dist} value={dist}>{dist}</option>)}
                </select>
            </div>

            <div>
                <label className={labelClass}>Dirección o referencia de zona</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Ej. Sector Las Palmas, Urb. Los Pinos" className={inputClass} required />
            </div>

            <div>
                <label className={labelClass}>Etiquetas (#)</label>
                <div className="flex gap-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleKeyDownTag} placeholder="Ej. Alimentos (Presiona Enter o +)" className={inputClass} />
                    <button type="button" onClick={handleAddTag} className="px-4 bg-brand-accent text-white rounded-xl hover:bg-brand-accent-hover transition-colors flex items-center justify-center text-lg"><FiPlus /></button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1.5 bg-brand-soft text-brand-accent text-xs font-semibold px-3 py-1.5 rounded-full border">
                                {tag}
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-600 transition-colors"><FiX className="text-sm" /></button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className={labelClass}>Fotografía (opcional)</label>
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-border cursor-pointer overflow-hidden hover:bg-brand-soft/50 transition">
                    {imagePreview ? <ImageFrame src={imagePreview} alt="Vista previa" aspectRatio="aspect-video" className="w-full" /> : (
                        <div className="py-8 flex flex-col items-center justify-center gap-2 text-brand-muted">
                            <FiImage className="text-3xl" />
                            <span className="text-sm">Selecciona una fotografía</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            </div>

            <div>
                <label className={labelClass}>WhatsApp de contacto</label>
                {/* REEMPLÁZALO PARA QUE QUEDE ASÍ: */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none"><FiPhone /></span>
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

                <p className="text-[11px] text-brand-muted mt-1.5">Viene cargado con el número de tu perfil, pero puedes cambiarlo si prefieres usar otro.</p>
            </div>
        </FormModalOrCard>
    );
}

export default Publicar;
