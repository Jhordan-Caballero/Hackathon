import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import FormModalOrCard from '../components/forms/FormModalOrCard';
import logoImg from '../assets/Loge.png';

const PROFILE_KEY = 'community-profile';

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

function Registro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        district: 'Cerro Colorado',
        location: '',
        phone: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Guardar el nuevo perfil localmente incluyendo el distrito
        localStorage.setItem(PROFILE_KEY, JSON.stringify(form));
        setMessage('¡Registro exitoso! Redirigiendo a tu perfil...');

        setTimeout(() => {
            navigate('/perfil');
        }, 1200);
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
            {/* Nombre completo */}
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

            {/* Distrito */}
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
                        required
                    >
                        {districtOptions.map((dist) => (
                            <option key={dist} value={dist}>
                                {dist}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Dirección / Zona */}
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

            {/* Número de WhatsApp */}
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