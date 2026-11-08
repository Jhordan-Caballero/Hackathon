import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import FormModalOrCard from '../components/forms/FormModalOrCard';
import logoImg from '../assets/Loge.png';
import { PERU_LOCATIONS } from '../datos/peruLocations';
import { supabase } from '../supabaseClient';

const PROFILE_KEY = 'community-profile';

function Registro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        city: '',
        district: '',
        location: '',
        phone: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Validando datos de registro...');

        // 🚀 LIMPIEZA DE TELÉFONO: Extraemos los 9 dígitos puros
        const rawPhone = form.phone.replace(/\D/g, '');
        if (rawPhone.length !== 9) {
            setMessage('El número de WhatsApp debe tener exactamente 9 dígitos.');
            return;
        }

        // Le anteponemos el prefijo '51' exigido por tu base de datos de producción
        const formattedPhone = `51${rawPhone}`;

        try {
            // 🚀 CANDADO DE SEGURIDAD: Consultamos a Supabase si el número ya existe en profiles
            const { data: existingUser, error: searchError } = await supabase
                .from('profiles')
                .select('id')
                .eq('whatsapp', formattedPhone)
                .maybeSingle();

            if (searchError) {
                console.error("Error validando teléfono:", searchError.message);
            }

            // Si encuentra una coincidencia, frenamos el registro de inmediato
            if (existingUser) {
                setMessage('⚠️ Este número de WhatsApp ya se encuentra registrado con otra cuenta.');
                return;
            }

            setMessage('Registrando en la base de datos...');
            const { data, error } = await supabase
                .from('profiles')
                .insert([
                    {
                        full_name: form.name.trim(),
                        region: form.city,
                        district: form.district,
                        neighborhood: form.location.trim(),
                        whatsapp: formattedPhone, // Guardamos el celular formateado de forma segura
                        has_whatsapp: true
                    }
                ])
                .select();

            if (error) {
                setMessage(`Error: ${error.message}`);
                return;
            }

            localStorage.setItem(PROFILE_KEY, JSON.stringify(data[0]));
            window.dispatchEvent(new Event('storage-update'));
            setMessage('¡Registro exitoso! Redirigiendo a tu perfil...');

            setTimeout(() => {
                navigate('/');
            }, 1200);

        } catch (err) {
            setMessage('Ocurrió un error inesperado al conectar.');
        }
    };

    const inputClass =
        'w-full px-4 py-3 pl-11 rounded-xl border border-brand-border bg-brand-cream/50 text-sm outline-none focus:border-brand-accent transition-colors text-brand-dark';
    const labelClass = 'block text-sm font-semibold text-brand-dark mb-2';

    return (
        <FormModalOrCard
            logoImg={logoImg}
            title="Únete a tu comunidad"
            subtitle="Regístrate para comenzar a participar y colaborar con tus vecinos."
            onSubmit={handleSubmit}
            submitText="Crear cuenta"
            message={message}
            footer={
                <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-brand-accent hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
            }
        >
            <div>
                <label className={labelClass}>Nombre completo</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiUser />
                    </span>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ej. María López"
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Ciudad / Departamento</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiMapPin />
                    </span>
                    <select
                        name="city"
                        value={form.city}
                        onChange={handleCityChange}
                        className={inputClass}
                        required
                    >
                        <option value="">Selecciona una ciudad</option>
                        {Object.keys(PERU_LOCATIONS).map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClass}>Distrito</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiMapPin />
                    </span>
                    <select
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        className={inputClass}
                        disabled={!form.city}
                        required
                    >
                        <option value="">
                            {form.city
                                ? 'Selecciona un distrito'
                                : 'Primero elige una ciudad'}
                        </option>
                        {form.city &&
                            PERU_LOCATIONS[form.city].map((dist) => (
                                <option key={dist} value={dist}>
                                    {dist}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClass}>Dirección o referencia de zona</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiMapPin />
                    </span>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Ej. Sector Las Palmas"
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Número de WhatsApp</label>
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
                        required
                        className={inputClass}
                    />
                </div>
            </div>
        </FormModalOrCard>
    );
}

export default Registro;
