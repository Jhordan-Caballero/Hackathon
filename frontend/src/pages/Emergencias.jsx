import { useMemo, useState, useEffect } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import SearchBar from '../components/shared/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import PromotionalBanner from '../components/shared/PromotionalBanner';
import { supabase } from '../supabaseClient';

function Emergencias() {
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('todas');
    const [selectedEmergency, setSelectedEmergency] = useState(null);

    // Estados reales para Supabase
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEmergencies() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('publications')
                    .select(`
                        *,
                        profiles (
                            full_name,
                            whatsapp
                        )
                    `)
                    .eq('section', 'comunidad') 
                    .eq('emergency_support', true)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error al traer emergencias:", error.message);
                    return;
                }

                const formattedData = (data || []).map(pub => ({
                    ...pub,
                    provider: pub.profiles?.full_name || 'Vecino alerta',
                    phone: pub.contact_whatsapp || pub.profiles?.whatsapp || '',
                    image: Array.isArray(pub.image_urls) ? pub.image_urls[0] : pub.image_urls,
                    typeLabel: 'Emergencia'
                }));

                setPublications(formattedData);
            } catch (err) {
                console.error("Error inesperado:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchEmergencies();
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
                        <Reveal
                            key={emergency.id}
                            className={`transition-delay-${index % 3}`}
                        >
                            <PublicationCard
                                publication={emergency}
                                categoryLabel={emergency.category || emergency.category_id} // 🚀 FIX: Asegura compatibilidad de etiquetas
                                typeLabel="Emergencia"
                                onDetails={setSelectedEmergency}
                            />
                        </Reveal>
                    ))}
                </div>
            ) : (
                <EmptyState
                    onAction={clearFilters}
                />
            )}

            {/* Modal de detalles */}
            <PublicationDetail
                publication={selectedEmergency}
                onClose={() => setSelectedEmergency(null)}
                variant="help"
            />

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
