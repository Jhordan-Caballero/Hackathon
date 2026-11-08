import { useMemo, useState, useEffect } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/shared/SearchBar';
import PromotionalBanner from '../components/shared/PromotionalBanner';
import { supabase } from '../supabaseClient';

function Catalog() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('todas'); 
    const [selectedRating, setSelectedRating] = useState('todas');
    const [selectedPublication, setSelectedPublication] = useState(null);

    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPublications() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('publications')
                    .select(`
                        *,
                        profiles (
                            full_name,
                            whatsapp
                        ),
                        reviews:reviews!publication_id (
                            id,
                            rating,
                            comment,
                            created_at,
                            author:profiles!author_id (
                                full_name
                            )
                        )
                    `)
                    .eq('section', 'servicios')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error al traer publicaciones de Supabase:", error.message);
                    return;
                }

                const formattedData = (data || []).map(pub => ({
                    ...pub,
                    provider: pub.profiles?.full_name || 'Vecino anónimo',
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
        fetchPublications();
    }, []);

    const locations = useMemo(() => {
        const locs = publications.map((pub) => pub.district);
        return [...new Set(locs.filter(Boolean))];
    }, [publications]);
    const filteredPublications = useMemo(() => {
        return publications.filter((publication) => {
            const searchText = search.toLowerCase().trim();

            const title = publication.title || '';
            const description = publication.description || '';
            const provider = publication.provider || '';

            const locationText = [publication.district, publication.region].filter(Boolean).join(' ');
            const tags = Array.isArray(publication.tags) ? publication.tags : [];

            const matchesSearch = [title, description, provider, locationText, ...tags]
                .join(' ')
                .toLowerCase()
                .includes(searchText);

            const matchesCategory =
                selectedCategory === 'todas' ||
                publication.category_id === selectedCategory ||
                publication.type === selectedCategory;

            const matchesCity =
                !selectedCity ||
                selectedCity === 'todas' ||
                publication.region === selectedCity;

            const matchesLocation =
                selectedLocation === 'todas' ||
                publication.district === selectedLocation;

            const matchesRating =
                selectedRating === 'todas' ||
                (publication.rating ?? 5) >= Number(selectedRating);

            const matchesType = publication.type === 'producto' || publication.type === 'servicio';

            const matchesStatus = !publication.description?.includes('[OCULTO]');

            return matchesSearch && matchesLocation && matchesCity && matchesType && matchesStatus;
        });
    }, [publications, search, selectedCategory, selectedCity, selectedLocation, selectedRating]);

    const clearFilters = () => {
        setSearch('');
        setSelectedCity('');
        setSelectedLocation('todas');
    };

    return (
        <section
            id="catalogo"
            className="max-w-7xl mx-auto px-5 lg:px-10 py-12"
        >
            <SectionHero
                label="Explora tu comunidad"
                title="Encuentra lo que necesitas"
                highlight="cerca de ti"
                description="Descubre productos, servicios y oficios ofrecidos por personas de tu vecindario."
            />

            <Reveal>
                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar alimentos, reparaciones, clases, costura..."
                    selectedCity={selectedCity}
                    onCityChange={setSelectedCity}
                    selectedZone={selectedLocation}
                    onZoneChange={setSelectedLocation}
                    resultsCount={filteredPublications.length}
                />
            </Reveal>

            <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl text-brand-dark">
                    Productos y servicios
                </h3>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <p className="text-brand-muted animate-pulse text-sm">Cargando catálogo comunitario desde Supabase...</p>
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
                                typeLabel="Producto o servicio"
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
                variant="catalog"
            />

            <Reveal>
                <PromotionalBanner
                    title="¿Tienes algún producto o servicio para ofrecer?"
                    description="Únete a la comunidad y llega a tus vecinos publicando tus productos o servicios."
                    buttonHref="/publicar?tipo=producto"
                />
            </Reveal>
        </section>
    );
}

export default Catalog;
