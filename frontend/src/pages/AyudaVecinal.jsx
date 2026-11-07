import { useMemo, useState } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/shared/SearchBar';
import PromotionalBanner from '../components/shared/PromotionalBanner';
// Categorías de ayuda vecinal
const categories = [
    { id: 'todas', label: 'Todas', icon: '✹' },
    { id: 'apoyo', label: 'Apoyo comunitario', icon: '🤝' },
    { id: 'hogar', label: 'Hogar y jardín', icon: '🌿' },
    { id: 'educacion', label: 'Educación', icon: '📚' },
    { id: 'alimentos', label: 'Alimentos', icon: '🥐' },
    { id: 'tecnologia', label: 'Tecnología', icon: '💻' },
    { id: 'otros', label: 'Otros', icon: '✨' },
];

// Datos de ejemplo
const requests = [
    {
        id: 1,
        type: 'ayuda',
        typeLabel: 'Solicito ayuda',
        categoryId: 'apoyo',
        category: 'Apoyo comunitario',
        icon: '🤝',
        title: 'Apoyo para realizar compras',
        description:
            'Busco una persona que pueda ayudarme con las compras del mercado, ya que por motivos personales se me dificulta salir de casa.',
        provider: 'Rosa M.',
        location: 'Sector Las Palmas',
        phone: '51987654321',
        date: 'Hace 2 horas',
        image: null,
        tags: ['#Apoyo', '#Compras', '#Vecinos'],
    },
    {
        id: 2,
        type: 'intercambio',
        typeLabel: 'Intercambio',
        categoryId: 'hogar',
        category: 'Hogar y jardín',
        icon: '🌿',
        title: 'Intercambio de plantas',
        description:
            'Tengo algunas plantas ornamentales y quisiera intercambiarlas por plantas aromáticas o medicinales para mi pequeño jardín.',
        provider: 'Carlos R.',
        location: 'Calle Los Aromos',
        phone: '51987654322',
        date: 'Hace 5 horas',
        image: '/images/plantas.jpg',
        tags: ['#Plantas', '#Jardinería', '#Intercambio'],
    },
    {
        id: 3,
        type: 'ayuda',
        typeLabel: 'Solicito ayuda',
        categoryId: 'educacion',
        category: 'Educación',
        icon: '📚',
        title: 'Apoyo escolar para mi hijo',
        description:
            'Estoy buscando a alguien que pueda brindar orientación en matemáticas para un estudiante de secundaria. Agradecería mucho su apoyo.',
        provider: 'María L.',
        location: 'Sector 1',
        phone: '51987654323',
        date: 'Ayer',
        image: null,
        tags: ['#Educación', '#Matemáticas', '#ApoyoEscolar'],
    },
    {
        id: 4,
        type: 'intercambio',
        typeLabel: 'Intercambio',
        categoryId: 'hogar',
        category: 'Hogar y jardín',
        icon: '🧰',
        title: 'Ofrezco herramientas de jardinería',
        description:
            'Tengo herramientas de jardinería que ya no utilizo. Me gustaría intercambiarlas por libros o materiales escolares en buen estado.',
        provider: 'Miguel P.',
        location: 'Sector Las Palmas',
        phone: '51987654324',
        date: 'Hace 2 días',
        image: null,
        tags: ['#Herramientas', '#Libros', '#Intercambio'],
    },
    {
        id: 5,
        type: 'ayuda',
        typeLabel: 'Solicito ayuda',
        categoryId: 'alimentos',
        category: 'Alimentos',
        icon: '🥐',
        title: 'Busco apoyo con alimentos',
        description:
            'Estoy buscando apoyo con algunos alimentos no perecibles para una familia que está pasando por una situación complicada.',
        provider: 'Elena G.',
        location: 'Sector 2',
        phone: '51987654325',
        date: 'Hace 3 días',
        image: null,
        tags: ['#Solidaridad', '#Alimentos', '#Apoyo'],
    },
    {
        id: 6,
        type: 'intercambio',
        typeLabel: 'Intercambio',
        categoryId: 'educacion',
        category: 'Educación',
        icon: '📚',
        title: 'Intercambio de libros escolares',
        description:
            'Tengo libros escolares de secundaria en buen estado. Me gustaría intercambiarlos por otros materiales educativos.',
        provider: 'Luis A.',
        location: 'Calle Los Pinos',
        phone: '51987654326',
        date: 'Hace 4 días',
        image: null,
        tags: ['#Libros', '#Educación', '#Intercambio'],
    },
];

function AyudaVecinal() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [selectedLocation, setSelectedLocation] = useState('todas');
    const [selectedType, setSelectedType] = useState('todas');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Obtener ubicaciones disponibles
    const locations = useMemo(
        () => [
            ...new Set(
                requests.map((request) => request.location)
            ),
        ],
        []
    );

    // Filtrar solicitudes
    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch = [
                request.title,
                request.description,
                request.provider,
                request.location,
                request.category,
                request.typeLabel,
                ...request.tags,
            ]
                .join(' ')
                .toLowerCase()
                .includes(searchText);

            const matchesCategory =
                selectedCategory === 'todas' ||
                request.categoryId === selectedCategory;

            const matchesLocation =
                selectedLocation === 'todas' ||
                request.location === selectedLocation;

            const matchesType =
                selectedType === 'todas' ||
                request.type === selectedType;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesType
            );
        });
    }, [search, selectedCategory, selectedLocation, selectedType]);

    // Limpiar filtros
    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('todas');
        setSelectedLocation('todas');
        setSelectedType('todas');
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

            {/* Buscador y filtros */}
            <Reveal>
                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar solicitudes, intercambios, apoyo..."
                    selectedZone={selectedLocation}
                    onZoneChange={setSelectedLocation}
                    resultsCount={filteredRequests.length}
                />
            </Reveal>

            {/* Encabezado de resultados */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl text-brand-dark">
                    Apoyo entre vecinos
                </h3>
            </div>

            {/* Listado */}
            {filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredRequests.map((request, index) => (
                        <Reveal
                            key={request.id}
                            className={`transition-delay-${index % 3}`}
                        >
                            <PublicationCard
                                publication={request}
                                categoryLabel={request.category}
                                typeLabel={request.typeLabel}
                                onDetails={setSelectedRequest}
                            />
                        </Reveal>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="volunteer_activism"
                    title="No encontramos solicitudes"
                    description="Prueba con otra búsqueda o modifica los filtros."
                    actionLabel="Limpiar filtros"
                    onAction={clearFilters}
                />
            )}

            {/* Modal de detalles */}
            <PublicationDetail
                publication={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                variant="help"
            />

            {/* Crear publicación */}
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