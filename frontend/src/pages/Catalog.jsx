import { useMemo, useState, useEffect } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/shared/SearchBar';
import PromotionalBanner from '../components/shared/PromotionalBanner';
// Importamos el cliente de Supabase listo
import { supabase } from '../supabaseClient';

function Catalog() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [selectedLocation, setSelectedLocation] = useState('todas');
    const [selectedRating, setSelectedRating] = useState('todas');
    const [selectedPublication, setSelectedPublication] = useState(null);

    // Estado real para almacenar los datos que vienen del backend
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Jalamos los datos desde Supabase en tiempo real al montar el componente
    useEffect(() => {
        async function fetchPublications() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('publications')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error al traer publicaciones de Supabase:", error.message);
                    return;
                }
                setPublications(data || []);
            } catch (err) {
                console.error("Error inesperado:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPublications();
    }, []);

    // Obtener ubicaciones disponibles dinámicamente desde la BD real
    const locations = useMemo(() => {
        const locs = publications.map((publication) => publication.location || publication.neighborhood);
        return [...new Set(locs.filter(Boolean))];
    }, [publications]);

    // Tu lógica original exacta de filtrado adaptada a la data real
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

            const matchesCategory =
                selectedCategory === 'todas' ||
                publication.categoryId === selectedCategory ||
                publication.type === selectedCategory;

            const matchesLocation =
                selectedLocation === 'todas' ||
                location === selectedLocation;

            const matchesRating =
                selectedRating === 'todas' ||
                (publication.rating ?? 5) >= Number(selectedRating);

            const matchesStatus = publication.status !== 'inactivo';

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesRating &&
                matchesStatus
            );
        });
    }, [publications, search, selectedCategory, selectedLocation, selectedRating]);

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('todas');
        setSelectedLocation('todas');
        setSelectedRating('todas');
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

            {/* Buscador y filtros originales */}
            <Reveal>
                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar alimentos, reparaciones, clases, costura..."
                    selectedZone={selectedLocation}
                    onZoneChange={setSelectedLocation}
                    resultsCount={filteredPublications.length}
                />
            </Reveal>

            {/* Encabezado de resultados */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl text-brand-dark">
                    Productos y servicios
                </h3>
            </div>

            {/* Listado dinámico basado en la carga de Supabase */}
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

            {/* Modal de detalles original */}
            <PublicationDetail
                publication={selectedPublication}
                onClose={() => setSelectedPublication(null)}
                variant="catalog"
            />

            {/* Banner de invitación original */}
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
