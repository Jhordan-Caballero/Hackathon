import { useState, useEffect } from 'react';
import { FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import FormModalOrCard from '../forms/FormModalOrCard';
import { PERU_LOCATIONS } from '../../datos/peruLocations';

function EditProfileModal({ profile, isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    // Ajustamos para leer las columnas reales de Supabase: region y district
    const [selectedCity, setSelectedCity] = useState(profile?.region || profile?.city || '');
    const [selectedDistrict, setSelectedDistrict] = useState(profile?.district || '');

    useEffect(() => {
        if (profile) {
            setSelectedCity(profile.region || profile.city || '');
            setSelectedDistrict(profile.district || '');
        }
    }, [profile]);

    const handleCityChange = (e) => {
        const newCity = e.target.value;
        setSelectedCity(newCity);
        setSelectedDistrict(''); 
    };

    const getLocalPhone = (phone) => {
        if (!phone) return '';
        const cleaned = String(phone).replace(/\D/g, '');
        if (cleaned.length === 11 && cleaned.startsWith('51')) {
            return cleaned.slice(2);
        }
        return cleaned;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rawPhone = formData.get('phone').replace(/\D/g, '');

        // Construimos el objeto final usando las columnas exactas de Supabase
        const updatedProfile = {
            id: profile.id, // Pasamos el ID para saber a qué usuario actualizar
            full_name: formData.get('name'),
            region: selectedCity,
            district: selectedDistrict,
            neighborhood: formData.get('location'),
            whatsapp: rawPhone,
        };
        onSave(updatedProfile);
    };

    const inputClass =
        'w-full px-4 py-3 pl-11 rounded-xl border border-brand-border bg-white text-sm outline-none focus:border-brand-accent transition-colors text-brand-dark';
    const labelClass = 'block text-sm font-semibold text-brand-dark mb-2';

    return (
        <FormModalOrCard
            title="Editar datos personales"
            subtitle="Mantén tu información de contacto actualizada."
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText="Guardar cambios"
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
                        defaultValue={profile.full_name || profile.name}
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Ciudad / Departamento */}
            <div>
                <label className={labelClass}>Ciudad / Departamento</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiMapPin />
                    </span>
                    <select
                        name="city"
                        value={selectedCity}
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

            {/* Distrito */}
            <div>
                <label className={labelClass}>Distrito</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiMapPin />
                    </span>
                    <select
                        name="district"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className={inputClass}
                        disabled={!selectedCity}
                        required
                    >
                        <option value="">
                            {selectedCity ? 'Selecciona un distrito' : 'Primero elige una ciudad'}
                        </option>
                        {selectedCity &&
                            PERU_LOCATIONS[selectedCity].map((dist) => (
                                <option key={dist} value={dist}>
                                    {dist}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Dirección o referencia */}
            <div>
                <label className={labelClass}>Dirección o referencia de zona</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiMapPin />
                    </span>
                    <input
                        type="text"
                        name="location"
                        defaultValue={profile.neighborhood || profile.location}
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            {/* WhatsApp */}
            <div>
                <label className={labelClass}>Número de WhatsApp</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiPhone />
                    </span>
                    <input
                        type="tel"
                        name="phone"
                        defaultValue={getLocalPhone(profile.whatsapp || profile.phone)}
                        placeholder="946414833"
                        maxLength="9"
                        required
                        className={inputClass}
                    />
                </div>
            </div>
        </FormModalOrCard>
    );
}

export default EditProfileModal;
