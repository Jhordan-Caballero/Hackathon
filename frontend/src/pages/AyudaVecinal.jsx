import { useMemo, useState } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/shared/SearchBar';
import PromotionalBanner from '../components/shared/PromotionalBanner';
import { PERU_LOCATIONS } from '../datos/peruLocations';

// Datos de ejemplo
const requests = [
    {
        id: 1,
        type: 'ayuda',
        typeLabel: 'Solicito ayuda',
        icon: '🤝',
        title: 'Apoyo para realizar compras',
        description:
            'Busco una persona que pueda ayudarme con las compras del mercado, ya que por motivos personales se me dificulta salir de casa.',
        provider: 'Rosa M.',
        city: 'Arequipa',
        district: 'Cerro Colorado',
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
        icon: '🌿',
        title: 'Intercambio de plantas',
        description:
            'Tengo algunas plantas ornamentales y quisiera intercambiarlas por plantas aromáticas o medicinales para mi pequeño jardín.',
        provider: 'Carlos R.',
        city: 'Arequipa',
        district: 'Yanahuara',
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
        icon: '📚',
        title: 'Apoyo escolar para mi hijo',
        description:
            'Estoy buscando a alguien que pueda brindar orientación en matemáticas para un estudiante de secundaria. Agradecería mucho su apoyo.',
        provider: 'María L.',
        city: 'Arequipa',
        district: 'Cayma',
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
        icon: '🧰',
        title: 'Ofrezco herramientas de jardinería',
        description:
            'Tengo herramientas de jardinería que ya no utilizo. Me gustaría intercambiarlas por libros o materiales escolares en buen estado.',
        provider: 'Miguel P.',
        city: 'Arequipa',
        district: 'Cerro Colorado',
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
        icon: '🥐',
        title: 'Busco apoyo con alimentos',
        description:
            'Estoy buscando apoyo con algunos alimentos no perecibles para una familia que está pasando por una situación complicada.',
        provider: 'Elena G.',
        city: 'Arequipa',
        district: 'Alto Selva Alegre',
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
        icon: '📚',
        title: 'Intercambio de libros escolares',
        description:
            'Tengo libros escolares de secundaria en buen estado. Me gustaría intercambiarlos por otros materiales educativos.',
        provider: 'Luis A.',
        city: 'Arequipa',
        district: 'José Luis Bustamante y Rivero',
        location: 'Calle Los Pinos',
        phone: '51987654326',
        date: 'Hace 4 días',
        image: null,
        tags: ['#Libros', '#Educación', '#Intercambio'],
    },
];

function AyudaVecinal() {
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedType, setSelectedType] = useState('todas');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Cambio de ciudad con reinicio de distrito
    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setSelectedDistrict('');
    };

    // Filtrar solicitudes por búsqueda texto, ciudad, distrito y tipo
    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch = [
                request.title,
                request.description,
                request.provider,
                request.location,
                request.district,
                request.city,
                request.typeLabel,
                ...(request.tags || []),
            ]
                .join(' ')
                .toLowerCase()
                .includes(searchText);

            const matchesCity = !selectedCity || request.city === selectedCity;
            const matchesDistrict = !selectedDistrict || request.district === selectedDistrict;
            const matchesType = selectedType === 'todas' || request.type === selectedType;

            return matchesSearch && matchesCity && matchesDistrict && matchesType;
        });
    }, [search, selectedCity, selectedDistrict, selectedType]);

    // Limpiar filtros
    const clearFilters = () => {
        setSearch('');
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedType('todas');
    };

    const selectClass =
        'w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-dark outline-none focus:border-brand-accent transition-colors';

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

            {/* Buscador general */}
            <Reveal>
                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar solicitudes, intercambios, apoyo..."
                    resultsCount={filteredRequests.length}
                />
            </Reveal>

            {/* Filtros Geográficos y Tipo de Solicitud */}
            <Reveal className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Filtro Ciudad */}
                    <div>
                        <select
                            value={selectedCity}
                            onChange={handleCityChange}
                            className={selectClass}
                        >
                            <option value="">Todas las ciudades</option>
                            {Object.keys(PERU_LOCATIONS).map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Distrito */}
                    <div>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className={selectClass}
                            disabled={!selectedCity}
                        >
                            <option value="">
                                {selectedCity ? 'Todos los distritos' : 'Primero elige una ciudad'}
                            </option>
                            {selectedCity &&
                                PERU_LOCATIONS[selectedCity].map((dist) => (
                                    <option key={dist} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Filtro Tipo de Publicación */}
                    <div>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className={selectClass}
                        >
                            <option value="todas">Todos los tipos</option>
                            <option value="ayuda">Solicitud de ayuda</option>
                            <option value="intercambio">Intercambio</option>
                        </select>
                    </div>
                </div>
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
                                onDetails={setSelectedRequest}
                            />
                        </Reveal>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="volunteer_activism"
                    title="No encontramos solicitudes"
                    description="Prueba con otra búsqueda o modifica los filtros de ciudad y distrito."
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