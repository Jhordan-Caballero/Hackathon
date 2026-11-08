import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FiUser, FiPhone } from 'react-icons/fi';
import FormModalOrCard from '../components/forms/FormModalOrCard';
import logoImg from '../assets/Loge.png';
import { supabase } from '../supabaseClient'; 

const PROFILE_KEY = 'community-profile'; 

function Login() {
    const navigate = useNavigate(); 
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Verificando credenciales...');

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('full_name', name.trim())
                .eq('whatsapp', phone.trim());

            if (error) {
                setMessage(`Error: ${error.message}`);
                return;
            }

            if (data.length === 0) {
                setMessage('Usuario o número de WhatsApp incorrectos.');
                return;
            }

            localStorage.setItem(PROFILE_KEY, JSON.stringify(data[0]));
            window.dispatchEvent(new Event('storage-update')); 
            setMessage('¡Inicio de sesión exitoso! Redirigiendo...');

            setTimeout(() => {
                navigate('/perfil');
            }, 1200);

        } catch (err) {
            setMessage('Error al intentar conectar.');
        }
    };

    const inputClass =
        'w-full px-4 py-3 pl-11 rounded-xl border border-brand-border bg-brand-cream/50 text-sm outline-none focus:border-brand-red focus:bg-white transition-all text-brand-dark';

    return (
        <FormModalOrCard
            logoImg={logoImg}
            title="¡Qué bueno verte!"
            subtitle="Ingresa con tu nombre y teléfono para continuar."
            onSubmit={handleSubmit}
            submitText="Iniciar sesión"
            message={message}
            footer={
                <p>
                    ¿Todavía no tienes una cuenta?{' '}
                    <Link
                        to="/registro"
                        className="font-semibold text-brand-red hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            }
        >
            <div className="space-y-4">
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

                <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                        Número de celular
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-lg pointer-events-none">
                            <FiPhone />
                        </span>
                        <input
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ej. 987 654 321"
                            required
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>
        </FormModalOrCard>
    );
}

export default Login;

