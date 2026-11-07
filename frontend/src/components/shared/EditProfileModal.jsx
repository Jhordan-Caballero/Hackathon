import { FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import FormModalOrCard from '../forms/FormModalOrCard';

function EditProfileModal({ profile, isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedProfile = {
            name: formData.get('name'),
            location: formData.get('location'),
            phone: formData.get('phone'),
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
            <div>
                <label className={labelClass}>Nombre completo</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiUser />
                    </span>
                    <input
                        type="text"
                        name="name"
                        defaultValue={profile.name}
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Dirección o zona de residencia</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiMapPin />
                    </span>
                    <input
                        type="text"
                        name="location"
                        defaultValue={profile.location}
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
                        defaultValue={profile.phone}
                        required
                        className={inputClass}
                    />
                </div>
            </div>
        </FormModalOrCard>
    );
}

export default EditProfileModal;