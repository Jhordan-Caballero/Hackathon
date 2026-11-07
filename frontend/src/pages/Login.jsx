import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import FormModalOrCard from '../components/forms/FormModalOrCard';
import logoImg from '../assets/Loge.png';

function Login() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Inicio de sesión simulado correctamente.');
    };

    const inputClass =
        'w-full px-4 py-3 pl-11 rounded-xl border border-brand-border bg-brand-cream/50 text-sm outline-none focus:border-brand-accent transition-colors text-brand-dark';

    return (
        <FormModalOrCard
            logoImg={logoImg}
            title="¡Qué bueno verte!"
            subtitle="Ingresa con tu nombre para continuar."
            onSubmit={handleSubmit}
            submitText="Iniciar sesión"
            message={message}
            footer={
                <p>
                    ¿Todavía no tienes una cuenta?{' '}
                    <Link
                        to="/registro"
                        className="font-semibold text-brand-accent hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            }
        >
            <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Nombre completo
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                        <FiUser />
                    </span>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. María López"
                        required
                        className={inputClass}
                    />
                </div>
            </div>
        </FormModalOrCard>
    );
}

export default Login;