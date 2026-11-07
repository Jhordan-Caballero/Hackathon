
import { useMemo, useState } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import SearchBar from '../components/shared/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import PromotionalBanner from '../components/shared/PromotionalBanner';

// Categorías de emergencias
const categories = [
    { id: 'todas', label: 'Todas', icon: '✹' },
    { id: 'salud', label: 'Salud', icon: '🚑' },
    { id: 'incendio', label: 'Incendios', icon: '🔥' },
    { id: 'seguridad', label: 'Seguridad', icon: '🚨' },
    { id: 'accidente', label: 'Accidentes', icon: '🚗' },
    { id: 'servicios', label: 'Servicios básicos', icon: '⚡' },
    { id: 'otros', label: 'Otros', icon: '⚠️' },
];

// Datos de ejemplo
const emergencies = [
    {
        id: 1,
        estado: 'emergencia',
        type: 'emergencia',
        typeLabel: 'Emergencia',
        categoryId: 'incendio',
        category: 'Incendios',
        icon: '🔥',
        title: 'Incendio en vivienda',
        description:
            'Se observa humo y fuego en una vivienda cercana. Los vecinos solicitan apoyo para atender la situación.',
        provider: 'Carlos R.',
        location: 'Sector Las Palmas',
        phone: '51987654321',
        date: 'Hace 20 minutos',
        image: null,
        tags: ['#Incendio', '#Urgente', '#Seguridad'],
    },
    {
        id: 2,
        estado: 'emergencia',
        type: 'emergencia',
        typeLabel: 'Emergencia',
        categoryId: 'salud',
        category: 'Salud',
        icon: '🚑',
        title: 'Solicitud de atención médica',
        description:
            'Una persona adulta mayor necesita atención médica debido a que presenta dificultades para respirar.',
        provider: 'María L.',
        location: 'Sector 1',
        phone: '51987654322',
        date: 'Hace 45 minutos',
        image: null,
        tags: ['#Salud', '#AtenciónMédica', '#Urgente'],
    },
    {
        id: 3,
        estado: 'emergencia',
        type: 'emergencia',
        typeLabel: 'Emergencia',
        categoryId: 'accidente',
        category: 'Accidentes',
        icon: '🚗',
        title: 'Accidente de tránsito',
        description:
            'Se produjo un accidente entre dos vehículos. Se solicita apoyo para atender a las personas involucradas.',
        provider: 'José M.',
        location: 'Calle Los Aromos',
        phone: '51987654323',
        date: 'Hace 1 hora',
        image: null,
        tags: ['#Accidente', '#Tránsito', '#Precaución'],
    },
    {
        id: 4,
        estado: 'emergencia',
        type: 'emergencia',
        typeLabel: 'Emergencia',
        categoryId: 'seguridad',
        category: 'Seguridad',
        icon: '🚨',
        title: 'Robo reportado en la zona',
        description:
            'Vecinos reportan un robo ocurrido cerca del parque principal. Se recomienda tomar precauciones.',
        provider: 'Rosa M.',
        location: 'Sector 2',
        phone: '51987654324',
        date: 'Hace 2 horas',
        image: null,
        tags: ['#Seguridad', '#Robo', '#Vecinos'],
    },
    {
        id: 5,
        estado: 'emergencia',
        type: 'emergencia',
        typeLabel: 'Emergencia',
        categoryId: 'servicios',
        category: 'Servicios básicos',
        icon: '⚡',
        title: 'Cable eléctrico caído',
        description:
            'Se encuentra un cable eléctrico caído en plena vía pública. Se solicita mantener distancia y reportar el peligro.',
        provider: 'Miguel P.',
        location: 'Calle Los Pinos',
        phone: '51987654325',
        date: 'Hace 3 horas',
        image: null,
        tags: ['#Electricidad', '#Peligro', '#Prevención'],
    },
    {
        id: 6,
        estado: 'emergencia',
        type: 'emergencia',
        typeLabel: 'Emergencia',
        categoryId: 'otros',
        category: 'Otros',
        icon: '⚠️',
        title: 'Poste en riesgo de caída',
        description:
            'Un poste presenta daños y parece estar a punto de caer. Se solicita apoyo para evitar posibles accidentes.',
        provider: 'Elena G.',
        location: 'Sector Las Palmas',
        phone: '51987654326',
        date: 'Ayer',
        image: null,
        tags: ['#Infraestructura', '#Peligro', '#Prevención'],
    },
];

function Emergencias() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [selectedLocation, setSelectedLocation] = useState('todas');
    const [selectedEmergency, setSelectedEmergency] = useState(null);

    // Obtener ubicaciones disponibles
    const locations = useMemo(
        () => [
            ...new Set(
                emergencies.map((emergency) => emergency.location)
            ),
        ],
        []
    );

    // Filtrar emergencias
    const filteredEmergencies = useMemo(() => {
        return emergencies.filter((emergency) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch = [
                emergency.title,
                emergency.description,
                emergency.provider,
                emergency.location,
                emergency.category,
                emergency.typeLabel,
                ...emergency.tags,
            ]
                .join(' ')
                .toLowerCase()
                .includes(searchText);

            const matchesCategory =
                selectedCategory === 'todas' ||
                emergency.categoryId === selectedCategory;

            const matchesLocation =
                selectedLocation === 'todas' ||
                emergency.location === selectedLocation;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                emergency.estado === 'emergencia'
            );
        });
    }, [search, selectedCategory, selectedLocation]);

    // Limpiar filtros
    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('todas');
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

            {/* Buscador y filtros */}
            <Reveal>
                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar emergencias, accidentes, reportes..."
                    selectedZone={selectedLocation}
                    onZoneChange={setSelectedLocation}
                    resultsCount={filteredEmergencies.length}
                />
            </Reveal>

            {/* Encabezado de resultados */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl text-brand-dark">
                    Reportes de emergencia
                </h3>
            </div>

            {/* Listado */}
            {filteredEmergencies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredEmergencies.map((emergency, index) => (
                        <Reveal
                            key={emergency.id}
                            className={`transition-delay-${index % 3}`}
                        >
                            <PublicationCard
                                publication={emergency}
                                categoryLabel={emergency.category}
                                typeLabel={emergency.typeLabel}
                                onDetails={setSelectedEmergency}
                            />
                        </Reveal>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="emergency"
                    title="No encontramos emergencias"
                    description="Prueba con otra búsqueda o modifica los filtros."
                    actionLabel="Limpiar filtros"
                    onAction={clearFilters}
                />
            )}

            {/* Modal de detalles */}
            <PublicationDetail
                publication={selectedEmergency}
                onClose={() => setSelectedEmergency(null)}
                variant="help"
            />

            {/* Crear publicación */}
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
