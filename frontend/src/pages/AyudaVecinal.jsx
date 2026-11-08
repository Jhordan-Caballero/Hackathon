import { useMemo, useState, useEffect } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/shared/SearchBar';
import PromotionalBanner from '../components/shared/PromotionalBanner';
import { supabase } from '../supabaseClient';

function AyudaVecinal() {
    const [search, setSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('todas');
    const [selectedPublication, setSelectedPublication] = useState(null);

    // Estados reales para conectar a Supabase
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Jalamos la data real filtrando únicamente por la sección 'social' (ayuda/intercambio)
    useEffect(() => {
        async function fetchSocialPublications() {
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
                    .eq('section', 'social') // Trae la ayuda vecinal e intercambios
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error al traer publicaciones sociales:", error.message);
                    return;
                }

                // Mapeamos los campos para acoplar la data de Supabase a tus tarjetas
                const formattedData = (data || []).map(pub => ({
                    ...pub,
                    provider: pub.profiles?.full_name || 'Vecino solidario',
                    phone: pub.contact_whatsapp || pub.profiles?.whatsapp || '',
                    image: Array.isArray(pub.image_urls) ? pub.image_urls[0] : pub.image_urls
                }));

                setPublications(formattedData);
            } catch (err) {
                console.error("Error inesperado:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSocialPublications();
    }, []);

    // Extrae dinámicamente las zonas/ubicaciones de la base de datos para tu select
    const locations = useMemo(() => {
        const locs = publications.map((pub) => pub.location || pub.neighborhood);
        return [...new Set(locs.filter(Boolean))];
    }, [publications]);

    // Filtro exacto de tu barra de búsqueda y zonas
    const filteredPublications = useMemo(() => {
        return publications.filter((publication) => {
            const searchText = search.toLowerCase().trim();

            const title = publication.title || '';
            const description = publication.description || '';
            const provider = publication.provider || '';
            const location = publication.location || publication.neighborhood || '';
            const tags = Array.isArray(publication.tags) ? publication.tags : [];

            const matchesSearch = [title, description, provider, location, ...tags]
                .join(' ')
                .toLowerCase()
                .includes(searchText);

            const matchesLocation =
                selectedLocation === 'todas' ||
                location === selectedLocation;

            // Filtro de privacidad por bypass del tag oculto
            const matchesStatus = !publication.description?.includes('[OCULTO]'); 

            return matchesSearch && matchesLocation && matchesStatus;
        });
    }, [publications, search, selectedLocation]);

    const clearFilters = () => {
        setSearch('');
        setSelectedLocation('todas');
    };
    return (
        <section
            id="ayuda-vecinal"
            className="max-w-7xl mx-auto px-5 lg:px-10 py-12"
        >
            <SectionHero
                label="Una comunidad que se apoya"
                title="La ayuda comienza"
                highlight="entre vecinos"
                description="Comparte lo que necesitas, ofrece tu apoyo e intercambia recursos con las personas de tu comunidad."
            />

            {/* 🚀 TU BARRA DE BÚSQUEDA ORIGINAL EXACTA */}
            <Reveal>
                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar solicitudes, intercambios, apoyo..."
                    selectedZone={selectedLocation}
                    onZoneChange={setSelectedLocation}
                    resultsCount={filteredPublications.length}
                />
            </Reveal>

            <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl text-brand-dark">
                    Apoyo entre vecinos
                </h3>
            </div>

            {/* Renderizado condicional basado en la carga del backend */}
            {loading ? (
                <div className="text-center py-16">
                    <p className="text-brand-muted animate-pulse text-sm">Cargando la red de apoyo vecinal desde Supabase...</p>
                </div>
            ) : filteredPublications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPublications.map((publication, index) => (
                        <Reveal
                            key={publication.id}
                            className={`transition-delay-${index % 3}`}
                        >
                            <PublicationCard
                                publication={publication}
                                categoryLabel={publication.category || publication.category_id}
                                typeLabel="Ayuda vecinal"
                                onDetails={setSelectedPublication}
                            />
                        </Reveal>
                    ))}
                </div>
            ) : (
                <EmptyState
                    onAction={clearFilters}
                />
            )}

            <PublicationDetail
                publication={selectedPublication}
                onClose={() => setSelectedPublication(null)}
                variant="help"
            />

            <Reveal>
                <PromotionalBanner
                    title="¿Necesitas ayuda o quieres colaborar?"
                    description="Publica una solicitud o comparte algo que quieras intercambiar."
                    buttonHref="/publicar?tipo=ayuda"
                />
            </Reveal>
        </section>
    );
}

export default AyudaVecinal;

