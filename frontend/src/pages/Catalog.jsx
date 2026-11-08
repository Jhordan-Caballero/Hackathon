import { useMemo, useState } from 'react';

import Reveal from '../components/ui/Reveal';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import SectionHero from '../components/shared/SectionHero';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/shared/SearchBar';
import PromotionalBanner from '../components/shared/PromotionalBanner';
import MiniChat from '../components/Minichat/MiniChat';


// Datos de ejemplo con estado inicial 'activo'
const publications = [
    {
        id: 1,
        status: 'activo',
        categoryId: 'alimentos',
        category: 'Alimentos',
        icon: '🥐',
        title: 'Pan artesanal recién horneado',
        description:
            'Ofrezco pan artesanal elaborado en casa con ingredientes frescos. Realizo pedidos por encargo y entregas coordinadas.',
        provider: 'María López',
        location: 'Sector Las Palmas',
        phone: '51987654321',
        price: 8,
        date: 'Hace 2 horas',
        image: null,
        rating: 4.8,
        comments: [
            { id: 1, text: 'Muy rico y fresco, excelente atención.' },
            { id: 2, text: 'Buena calidad y entrega puntual.' },
        ],
        tags: ['#PanArtesanal', '#Alimentos', '#HechoEnCasa'],
    },
    {
        id: 2,
        status: 'activo',
        categoryId: 'hogar',
        category: 'Hogar y Arreglos',
        icon: '🛠️',
        title: 'Servicio de reparación de muebles',
        description:
            'Realizo reparaciones y mantenimiento de muebles de madera. Trabajo con responsabilidad y precios accesibles.',
        provider: 'Carlos Ramírez',
        location: 'Calle Los Aromos',
        phone: '51987654322',
        price: 35,
        date: 'Hace 5 horas',
        image: null,
        rating: 4.5,
        comments: [
            { id: 1, text: 'Dejó mi mesa como nueva.' },
        ],
        tags: ['#Carpintería', '#Reparaciones', '#Hogar'],
    },
    {
        id: 3,
        status: 'activo',
        categoryId: 'educacion',
        category: 'Educación y Clases',
        icon: '📚',
        title: 'Clases particulares de matemáticas',
        description:
            'Brindo clases de reforzamiento para estudiantes de primaria y secundaria. Modalidad presencial y personalizada.',
        provider: 'Andrea Torres',
        location: 'Sector 1',
        phone: '51987654323',
        price: 20,
        date: 'Ayer',
        image: null,
        rating: 5,
        comments: [
            { id: 1, text: 'Explica muy bien y tiene paciencia.' },
        ],
        tags: ['#Matemáticas', '#Educación', '#Clases'],
    },
    {
        id: 4,
        status: 'activo',
        categoryId: 'mascotas',
        category: 'Mascotas y Plantas',
        icon: '🌿',
        title: 'Cuidado de plantas a domicilio',
        description:
            'Ofrezco apoyo para el cuidado de plantas, riego, poda y mantenimiento de jardines pequeños.',
        provider: 'Miguel Pérez',
        location: 'Sector Las Palmas',
        phone: '51987654324',
        price: 25,
        date: 'Hace 2 días',
        image: null,
        rating: 4.7,
        comments: [
            { id: 1, text: 'Muy cuidadoso con las plantas.' },
        ],
        tags: ['#Jardinería', '#Plantas', '#Hogar'],
    },
    {
        id: 5,
        status: 'activo',
        categoryId: 'tecnologia',
        category: 'Tecnología',
        icon: '💻',
        title: 'Mantenimiento de computadoras',
        description:
            'Realizo limpieza, instalación de programas y mantenimiento preventivo de computadoras y laptops.',
        provider: 'José Mendoza',
        location: 'Calle Los Pinos',
        phone: '51987654325',
        price: 40,
        date: 'Hace 3 días',
        image: null,
        rating: 4.9,
        comments: [
            { id: 1, text: 'Servicio rápido y confiable.' },
        ],
        tags: ['#Computadoras', '#Tecnología', '#Soporte'],
    },
    {
        id: 6,
        status: 'activo',
        categoryId: 'hogar',
        category: 'Hogar y Arreglos',
        icon: '🛠️',
        title: 'Servicio de limpieza de hogares',
        description:
            'Ofrezco servicio de limpieza general para departamentos y casas. Coordinamos horarios según disponibilidad.',
        provider: 'Rosa Fernández',
        location: 'Sector 2',
        phone: '51987654326',
        price: 50,
        date: 'Hace 4 días',
        image: null,
        rating: 4.6,
        comments: [
            { id: 1, text: 'Muy ordenada y responsable.' },
        ],
        tags: ['#Limpieza', '#Hogar', '#Servicio'],
    },
];

function Catalog() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [selectedLocation, setSelectedLocation] = useState('todas');
    const [selectedRating, setSelectedRating] = useState('todas');
    const [selectedPublication, setSelectedPublication] = useState(null);

    // Obtener ubicaciones disponibles
    const locations = useMemo(
        () => [
            ...new Set(
                publications.map((publication) => publication.location)
            ),
        ],
        []
    );

    // Filtrar publicaciones (excluyendo inactivas)
    const filteredPublications = useMemo(() => {
        return publications.filter((publication) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch = [
                publication.title,
                publication.description,
                publication.provider,
                publication.location,
                ...publication.tags,
            ]
                .join(' ')
                .toLowerCase()
                .includes(searchText);

            const matchesCategory =
                selectedCategory === 'todas' ||
                publication.categoryId === selectedCategory;

            const matchesLocation =
                selectedLocation === 'todas' ||
                publication.location === selectedLocation;

            const matchesRating =
                selectedRating === 'todas' ||
                publication.rating >= Number(selectedRating);

            const matchesStatus = publication.status !== 'inactivo';

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesRating &&
                matchesStatus
            );
        });
    }, [search, selectedCategory, selectedLocation, selectedRating]);

    // Limpiar filtros
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
            {/* Buscador y filtros */}
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

            {/* Listado */}
            {filteredPublications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPublications.map((publication, index) => (
                        <Reveal
                            key={publication.id}
                            className={`transition-delay-${index % 3}`}
                        >
                            <PublicationCard
                                publication={publication}
                                categoryLabel={publication.category}
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

            {/* Modal de detalles */}
            <PublicationDetail
                publication={selectedPublication}
                onClose={() => setSelectedPublication(null)}
                variant="catalog"
            />
            <MiniChat />
            {/* Crear publicación */}
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