import { useCallback, useEffect, useState } from 'react';
import { FiUsers, FiCheckCircle } from 'react-icons/fi';
import {
    getUserId,
    listVolunteers,
    volunteerForEmergency,
    withdrawVolunteer,
} from '../../lib/api';

// Botón "Yo ayudo" + lista de vecinos que ya respondieron.
// Uso (en el detalle de una emergencia):
//   <BotonYoAyudo emergencyId={emergencia.id} status={emergencia.status} />
// Funciona aunque la persona no tenga cuenta (se crea una sesión anónima).
function BotonYoAyudo({ emergencyId, status = 'activa' }) {
    const [voluntarios, setVoluntarios] = useState([]);
    const [miId, setMiId] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const [aviso, setAviso] = useState('');

    const cerrada = status === 'resuelta' || status === 'cancelada';
    const yaAyudo = miId !== null && voluntarios.some((v) => v.user_id === miId);

    const recargar = useCallback(async () => {
        try {
            const [lista, id] = await Promise.all([listVolunteers(emergencyId), getUserId()]);
            setVoluntarios(lista);
            setMiId(id);
        } catch {
            setAviso('No se pudo cargar la lista (¿sin conexión?).');
        }
    }, [emergencyId]);

    useEffect(() => {
        recargar();
    }, [recargar]);

    const ofrecer = async () => {
        setCargando(true);
        setAviso('');
        try {
            await volunteerForEmergency(emergencyId, mensaje.trim() || undefined);
            setMensaje('');
            setAviso('¡Gracias! Quien reportó la emergencia verá que vas a ayudar.');
            await recargar();
        } catch (e) {
            setAviso(e.message || 'No se pudo registrar tu ayuda. Revisa tu conexión.');
        } finally {
            setCargando(false);
        }
    };

    const retirar = async () => {
        setCargando(true);
        setAviso('');
        try {
            await withdrawVolunteer(emergencyId);
            await recargar();
        } catch (e) {
            setAviso(e.message || 'No se pudo retirar tu ayuda.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="border border-brand-border rounded-2xl p-4 bg-white text-left">
            <div className="flex items-center gap-2 text-brand-dark font-semibold mb-3">
                <FiUsers className="text-brand-red" />
                {voluntarios.length === 0
                    ? 'Nadie ha respondido todavía'
                    : voluntarios.length === 1
                      ? '1 vecino va a ayudar'
                      : `${voluntarios.length} vecinos van a ayudar`}
            </div>

            {voluntarios.length > 0 && (
                <ul className="space-y-2 mb-4">
                    {voluntarios.map((v) => (
                        <li key={v.user_id} className="text-sm bg-brand-cream rounded-xl px-3 py-2">
                            <span className="font-medium text-brand-dark">{v.full_name}</span>
                            {v.message && <span className="text-brand-muted"> — {v.message}</span>}
                        </li>
                    ))}
                </ul>
            )}

            {cerrada ? (
                <p className="text-sm text-brand-muted">Esta emergencia ya fue {status}.</p>
            ) : yaAyudo ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="flex items-center gap-2 text-sm text-green-700 font-medium">
                        <FiCheckCircle /> Te ofreciste a ayudar
                    </span>
                    <button
                        type="button"
                        onClick={retirar}
                        disabled={cargando}
                        className="text-sm text-brand-muted underline hover:text-brand-dark disabled:opacity-50"
                    >
                        Ya no puedo ir
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        maxLength={120}
                        placeholder="Opcional: ¿cómo ayudas? Ej. Tengo bidones de agua"
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-cream/50 text-sm outline-none focus:border-brand-red"
                    />
                    <button
                        type="button"
                        onClick={ofrecer}
                        disabled={cargando}
                        className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-semibold disabled:opacity-60"
                    >
                        {cargando ? 'Enviando...' : '🙋 Yo ayudo'}
                    </button>
                </div>
            )}

            {aviso && <p className="text-xs text-brand-muted mt-3">{aviso}</p>}
        </div>
    );
}

export default BotonYoAyudo;
