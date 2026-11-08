import { useEffect, useState } from 'react';
import { FiPhone, FiMessageCircle, FiStar, FiShield } from 'react-icons/fi';
import { callLink, listEmergencyDirectory, whatsappLink } from '../../lib/api';

// DIRECTORIO DE EMERGENCIA (lo pide el reto: "servicios y grupos de apoyo
// disponibles durante emergencias"). Muestra las publicaciones marcadas con
// "apoyo en emergencias", mejor calificadas primero. Funciona sin internet.
// Uso (en la página Emergencias):
//   <DirectorioEmergencia />                     → todos
//   <DirectorioEmergencia district="Cayma" />    → solo de un distrito
function DirectorioEmergencia({ region, district }) {
    const [items, setItems] = useState([]);
    const [estado, setEstado] = useState('cargando'); // cargando | listo | error

    useEffect(() => {
        let activo = true;
        setEstado('cargando');
        listEmergencyDirectory({ region, district })
            .then((data) => {
                if (!activo) return;
                setItems(data);
                setEstado('listo');
            })
            .catch(() => activo && setEstado('error'));
        return () => {
            activo = false;
        };
    }, [region, district]);

    return (
        <section className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm text-left">
            <h3 className="font-serif text-2xl text-brand-dark mb-1 flex items-center gap-2">
                <FiShield className="text-brand-red" /> Directorio de apoyo
            </h3>
            <p className="text-sm text-brand-muted mb-4">
                Vecinos y grupos que ayudan en emergencias{district ? ` en ${district}` : ''}.
            </p>

            {estado === 'cargando' && <p className="text-sm text-brand-muted">Cargando...</p>}
            {estado === 'error' && (
                <p className="text-sm text-brand-muted">
                    No se pudo cargar el directorio. Revisa tu conexión.
                </p>
            )}
            {estado === 'listo' && items.length === 0 && (
                <p className="text-sm text-brand-muted">
                    Aún no hay servicios de apoyo registrados{district ? ' en este distrito' : ''}.
                </p>
            )}

            <ul className="grid sm:grid-cols-2 gap-3">
                {items.map((p) => {
                    const telefono = p.contact_whatsapp;
                    const mensaje = `Hola, te contacto por "${p.title}" (Vecinos App).`;
                    return (
                        <li key={p.id} className="border border-brand-border rounded-2xl p-4">
                            <div className="flex items-start justify-between gap-2">
                                <p className="font-semibold text-brand-dark">{p.title}</p>
                                {p.visto_bueno && (
                                    <span className="shrink-0 text-[11px] font-semibold bg-brand-soft text-brand-red px-2 py-1 rounded-full">
                                        Visto Bueno
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-brand-muted mt-1">
                                {[p.author_name, p.category_name, p.district].filter(Boolean).join(' · ')}
                            </p>
                            {p.review_count > 0 && (
                                <p className="text-xs text-brand-dark mt-1 flex items-center gap-1">
                                    <FiStar className="text-yellow-500" /> {p.avg_rating} ({p.review_count})
                                </p>
                            )}
                            {telefono && (
                                <a
                                    href={p.has_whatsapp ? whatsappLink(telefono, mensaje) : callLink(telefono)}
                                    target={p.has_whatsapp ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white bg-brand-red hover:bg-brand-red-dark px-4 py-2 rounded-xl"
                                >
                                    {p.has_whatsapp ? <FiMessageCircle /> : <FiPhone />}
                                    {p.has_whatsapp ? 'WhatsApp' : 'Llamar'}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default DirectorioEmergencia;
