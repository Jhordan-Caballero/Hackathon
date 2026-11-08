import { useMemo, useState, useEffect } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import SectionHero from '../components/shared/SectionHero';
import SearchBar from '../components/shared/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import PromotionalBanner from '../components/shared/PromotionalBanner';
import NumerosEmergencia from '../components/shared/NumerosEmergencia';
import DirectorioEmergencia from '../components/shared/DirectorioEmergencia';
import BotonYoAyudo from '../components/shared/BotonYoAyudo';
import { listEmergencies, subscribeToEmergencies, callLink, whatsappLink } from '../lib/api';
import { EMERGENCY_LABELS } from '../lib/types';

function Emergencias() {
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('todas');
    const [selectedEmergency, setSelectedEmergency] = useState(null);

    // Estados reales para Supabase
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lee la tabla de EMERGENCIAS (funciona sin internet con la última copia)
        async function fetchEmergencies() {
            try {
                const data = await listEmergencies();
                const formattedData = data.map((e) => ({
                    ...e,
                    title: EMERGENCY_LABELS[e.emergency_type] || 'Emergencia',
                    provider: e.reporter_name || 'Vecino alerta',
                    phone: e.contact_phone || '',
                    contact_whatsapp: e.contact_phone || '',
                    image: Array.isArray(e.image_urls) ? e.image_urls[0] : e.image_urls,
                    tags: [],
                    typeLabel: 'Emergencia',
                }));
                setPublications(formattedData);
            } catch (err) {
                console.error('Error al traer emergencias:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchEmergencies();
        // Tiempo real: se actualiza solo cuando alguien reporta o responde "Yo ayudo"
        return subscribeToEmergencies(fetchEmergencies);
    }, []);

    const locations = useMemo(() => {
        const locs = publications.map((pub) => pub.district);
        return [...new Set(locs.filter(Boolean))];
    }, [publications]);

    const filteredEmergencies = useMemo(() => {
        return publications.filter((emergency) => {
            const searchText = search.toLowerCase().trim();

            const title = emergency.title || '';
            const description = emergency.description || '';
            const provider = emergency.provider || '';
            const district = emergency.district || '';
            const region = emergency.region || '';

            const matchesSearch = [title, description, provider, district]
                .join(' ')
                .toLowerCase()
                .includes(searchText);

            const matchesCity =
                !selectedCity ||
                selectedCity === 'todas' ||
                emergency.region === selectedCity;

            const matchesLocation =
                selectedLocation === 'todas' ||
                emergency.district === selectedLocation;

            const matchesStatus = !description.includes('[OCULTO]');

            return matchesSearch && matchesLocation && matchesCity && matchesStatus;
        });
    }, [publications, search, selectedCity, selectedLocation]);



    const clearFilters = () => {
        setSearch('');
        setSelectedCity('');
        setSelectedLocation('todas');
    };
    return (
        <section
            id="emergencias"
            className="max-w-7xl mx-auto px-5 lg:px-10 py-12"
        >
            <SectionHero
                label="Información y prevención comunitaria"
                title="Ante una emergencia,"
                highlight="nos ayudamos"
                description="Comparte situaciones de emergencia de tu comunidad para mantener informados a los vecinos y promover una respuesta oportuna."
                heroImage="https://zdfuicwxrjafndzuappx.supabase.co/storage/v1/object/public/images/demo/hero-emergencias.jpg"
            />

            <Reveal>
                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar emergencias, accidentes, reportes..."
                    selectedCity={selectedCity}
                    onCityChange={setSelectedCity}
                    selectedZone={selectedLocation}
                    onZoneChange={setSelectedLocation}
                    resultsCount={filteredEmergencies.length}
                />
            </Reveal>

            <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl text-brand-dark">
                    Reportes de emergencia
                </h3>
            </div>

            {/* Renderizado condicional basado en la carga del backend */}
            {loading ? (
                <div className="text-center py-16">
                    <p className="text-brand-muted animate-pulse text-sm">Cargando reportes de riesgo comunitarios...</p>
                </div>
            ) : filteredEmergencies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredEmergencies.map((emergency, index) => (
                            <PublicationCard
                            publication={emergency}
                            categoryLabel={emergency.title}
                            typeLabel="Emergencia"
                            onDetails={setSelectedEmergency}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    onAction={clearFilters}
                />
            )}

            {/* Detalle de la emergencia + "Yo ayudo" */}
            {selectedEmergency && (
                <div
                    className="fixed inset-0 z-[90] bg-black/50 flex items-end sm:items-center justify-center p-4"
                    onClick={() => setSelectedEmergency(null)}
                >
                    <div
                        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-xl text-left space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold text-brand-red uppercase tracking-wider">
                                    {selectedEmergency.status}
                                </p>
                                <h3 className="font-serif text-2xl text-brand-dark">{selectedEmergency.title}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedEmergency(null)}
                                aria-label="Cerrar"
                                className="w-9 h-9 shrink-0 rounded-full bg-brand-soft text-brand-dark hover:bg-brand-border"
                            >
                                ✕
                            </button>
                        </div>
                        {selectedEmergency.image && (
                            <img src={selectedEmergency.image} alt="" className="w-full rounded-2xl object-cover max-h-60" />
                        )}
                        <p className="text-sm text-brand-dark leading-relaxed">{selectedEmergency.description}</p>
                        <p className="text-sm text-brand-muted">
                            📍 {[selectedEmergency.location, selectedEmergency.district, selectedEmergency.region].filter(Boolean).join(' · ')}
                            <br />
                            Reportó: {selectedEmergency.provider} ·{' '}
                            {new Date(selectedEmergency.created_at).toLocaleString('es-PE')}
                        </p>
                        {selectedEmergency.phone && (
                            <div className="flex gap-2">
                                <a
                                    href={callLink(selectedEmergency.phone)}
                                    className="flex-1 text-center py-3 rounded-xl border border-brand-border text-brand-dark text-sm font-semibold hover:bg-brand-soft"
                                >
                                    📞 Llamar
                                </a>
                                <a
                                    href={whatsappLink(selectedEmergency.phone, 'Hola, vi tu reporte de emergencia en la app del barrio.')}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 text-center py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold"
                                >
                                    WhatsApp
                                </a>
                            </div>
                        )}
                        <BotonYoAyudo emergencyId={selectedEmergency.id} status={selectedEmergency.status} />
                    </div>
                </div>
            )}

            {/* Directorio de apoyo y números de emergencia (funcionan sin internet) */}
            <div className="grid lg:grid-cols-2 gap-6 my-10">
                <Reveal>
                    <DirectorioEmergencia
                        region={selectedCity && selectedCity !== 'todas' ? selectedCity : undefined}
                        district={selectedLocation !== 'todas' ? selectedLocation : undefined}
                    />
                </Reveal>
                <Reveal>
                    <NumerosEmergencia />
                </Reveal>
            </div>

            <Reveal>
                <PromotionalBanner
                    title="¿Observas alguna situación de riesgo?"
                    description="Reporta emergencias o imprevistos rápidamente para alertar a los vecinos."
                    buttonText="Reportar emergencia"
                    buttonHref="/publicar?tipo=emergencia"
                />
            </Reveal>
        </section>
    );
}

export default Emergencias;
