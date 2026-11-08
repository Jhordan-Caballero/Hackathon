import { FiPhoneCall } from 'react-icons/fi';
import { NUMEROS_EMERGENCIA } from '../../lib/offline';

// Tarjeta con los números de emergencia del Perú.
// Funciona SIN internet (son llamadas normales). Ideal en la página Emergencias.
function NumerosEmergencia() {
    return (
        <section className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm text-left">
            <h3 className="font-serif text-2xl text-brand-dark mb-1">Números de emergencia</h3>
            <p className="text-sm text-brand-muted mb-4">
                Funcionan aunque no tengas internet. Toca para llamar.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
                {NUMEROS_EMERGENCIA.map((n) => (
                    <li key={n.numero}>
                        <a
                            href={`tel:${n.numero}`}
                            className="flex items-center gap-3 p-3 rounded-2xl border border-brand-border hover:bg-brand-soft transition-colors"
                        >
                            <span className="w-14 h-14 shrink-0 rounded-xl bg-brand-red text-white font-bold text-xl flex items-center justify-center">
                                {n.numero}
                            </span>
                            <span className="flex-1">
                                <span className="block font-semibold text-brand-dark">{n.nombre}</span>
                                <span className="block text-xs text-brand-muted">{n.para}</span>
                            </span>
                            <FiPhoneCall className="text-brand-red text-lg" />
                        </a>
                    </li>
                ))}
            </ul>
            <p className="text-xs text-brand-muted mt-4">
                El 911 por ahora solo funciona (en prueba) en Lima Metropolitana y Callao.
            </p>
        </section>
    );
}

export default NumerosEmergencia;
