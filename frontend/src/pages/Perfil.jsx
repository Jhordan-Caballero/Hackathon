import { useEffect, useState } from 'react';
import { 
    FiUser, 
    FiBox, 
    FiHeart, 
    FiAlertTriangle,
    FiEdit2, 
    FiTrash2, 
    FiLogOut 
} from 'react-icons/fi';

import Button from '../components/ui/Button';
import PublicationCard from '../components/shared/PublicationCard';
import PublicationDetail from '../components/shared/PublicationDetail';
import EditPublicationModal from '../components/shared/EditPublicationModal';
import EditProfileModal from '../components/shared/EditProfileModal';

const PUBLICATIONS_KEY = 'community-publications';
const PROFILE_KEY = 'community-profile';

const initialProfile = {
    name: 'María López',
    location: 'Sector Las Palmas',
    phone: '51987654321',
};

const initialPublications = [
    {
        id: 101,
        ownerId: 'current-user',
        type: 'catalogo',
        typeLabel: 'Producto',
        categoryId: 'alimentos',
        category: 'Alimentos',
        icon: '🥐',
        title: 'Postres caseros',
        description: 'Ofrezco postres preparados en casa con ingredientes frescos.',
        provider: 'María López',
        location: 'Sector Las Palmas',
        phone: '51987654321',
        date: 'Hace 2 días',
        image: null,
        price: 15,
        tags: ['#Postres', '#Casero'],
    },
    {
        id: 102,
        ownerId: 'current-user',
        type: 'ayuda',
        typeLabel: 'Solicito ayuda',
        categoryId: 'educacion',
        category: 'Educación',
        icon: '📚',
        title: 'Apoyo escolar en matemáticas',
        description: 'Busco apoyo para reforzar algunos temas de matemáticas.',
        provider: 'María López',
        location: 'Sector Las Palmas',
        phone: '51987654321',
        date: 'Ayer',
        image: null,
        tags: ['#Educación', '#Apoyo'],
    },
    {
        id: 103,
        ownerId: 'current-user',
        type: 'emergencia',
        typeLabel: 'Emergencia',
        categoryId: 'seguridad',
        category: 'Seguridad',
        icon: '🚨',
        title: 'Falta de alumbrado en Calle 4',
        description: 'Luminaria apagada en la esquina del parque desde anoche.',
        provider: 'María López',
        location: 'Sector Las Palmas',
        phone: '51987654321',
        date: 'Hace 3 horas',
        image: null,
        tags: ['#Seguridad', '#Alumbrado'],
    },
];

function Perfil() {
    const [activeTab, setActiveTab] = useState('datos');
    const [profile, setProfile] = useState(initialProfile);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const [publications, setPublications] = useState(initialPublications);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [editingPublication, setEditingPublication] = useState(null);

    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        const savedPublications = localStorage.getItem(PUBLICATIONS_KEY);

        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }

        if (savedPublications) {
            const parsedPublications = JSON.parse(savedPublications);
            setPublications([
                ...parsedPublications.filter(
                    (pub) => pub.ownerId === 'current-user'
                ),
                ...initialPublications,
            ]);
        }
    }, []);

    const saveProfile = (newProfileData) => {
        setProfile(newProfileData);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfileData));
        setIsEditingProfile(false);
    };

    const openEditPublication = (publication) => {
        setEditingPublication(publication);
        setEditForm({
            title: publication.title,
            description: publication.description,
            location: publication.location,
            price: publication.price ?? '',
        });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const savePublication = (event) => {
        event.preventDefault();

        const updatedPublication = {
            ...editingPublication,
            ...editForm,
            price: editingPublication.type === 'catalogo' ? Number(editForm.price) : null,
            provider: profile.name,
            phone: profile.phone,
        };

        const updatedPublications = publications.map((pub) =>
            pub.id === editingPublication.id ? updatedPublication : pub
        );

        setPublications(updatedPublications);

        const savedPublications = JSON.parse(localStorage.getItem(PUBLICATIONS_KEY) || '[]');
        const updatedStorage = savedPublications.some((pub) => pub.id === updatedPublication.id)
            ? savedPublications.map((pub) => pub.id === updatedPublication.id ? updatedPublication : pub)
            : [...savedPublications, updatedPublication];

        localStorage.setItem(PUBLICATIONS_KEY, JSON.stringify(updatedStorage));
        setEditingPublication(null);
    };

    const deletePublication = (publication) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${publication.title}"?`)) return;

        const updatedPublications = publications.filter((item) => item.id !== publication.id);
        setPublications(updatedPublications);

        const savedPublications = JSON.parse(localStorage.getItem(PUBLICATIONS_KEY) || '[]');
        localStorage.setItem(
            PUBLICATIONS_KEY,
            JSON.stringify(savedPublications.filter((item) => item.id !== publication.id))
        );
    };

    const myPublications = publications.filter((pub) => pub.type === 'catalogo');
    const myRequests = publications.filter((pub) => pub.type === 'ayuda' || pub.type === 'intercambio');
    const myEmergencies = publications.filter((pub) => pub.type === 'emergencia');

    const renderPublicationList = (items, emptyMessage, createHref) => {
        if (items.length === 0) {
            return (
                <div className="bg-white border border-brand-border rounded-2xl p-10 md:p-12 text-center flex flex-col items-center justify-center">
                    <FiBox className="text-4xl text-brand-muted mb-3" />
                    <h3 className="font-serif text-xl text-brand-dark">
                        Aún no tienes publicaciones aquí
                    </h3>
                    <p className="text-sm text-brand-muted mt-2 max-w-md">
                        {emptyMessage}
                    </p>
                    <div className="mt-6">
                        <Button href={createHref}>Crear publicación</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((publication) => (
                    <div key={publication.id} className="flex flex-col">
                        <PublicationCard
                            publication={publication}
                            categoryLabel={publication.category}
                            typeLabel={publication.typeLabel}
                            onDetails={setSelectedPublication}
                        />

                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => openEditPublication(publication)}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-brand-border bg-brand-cream/30 text-brand-dark text-xs font-semibold hover:bg-brand-soft transition-colors"
                            >
                                <FiEdit2 className="text-brand-accent text-sm" /> 
                                <span>Editar</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => deletePublication(publication)}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50/50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                            >
                                <FiTrash2 className="text-sm" /> 
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
            <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                    Mi espacio
                </span>
                <h1 className="font-serif text-4xl text-brand-dark mt-2">
                    Mi perfil
                </h1>
                <p className="text-sm text-brand-muted mt-2">
                    Administra tus datos y las publicaciones que compartes con tu comunidad.
                </p>
            </div>

            {/* Cabecera del Usuario */}
            <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-7 mb-8 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center text-brand-accent text-2xl">
                    <FiUser />
                </div>
                <div className="text-center sm:text-left flex-1">
                    <h2 className="font-serif text-2xl text-brand-dark">
                        {profile.name}
                    </h2>
                    <p className="text-sm text-brand-muted mt-1">
                        {profile.location}
                    </p>
                </div>
                <span className="text-xs bg-brand-soft text-brand-accent px-4 py-2 rounded-full font-medium">
                    Miembro de la comunidad
                </span>
            </div>

            {/* Pestañas de navegación */}
            <div className="flex flex-wrap gap-2 border-b border-brand-border mb-8">
                {[
                    { id: 'datos', label: 'Mis datos', icon: <FiUser /> },
                    { id: 'publicaciones', label: 'Mis publicaciones', icon: <FiBox /> },
                    { id: 'solicitudes', label: 'Mis solicitudes', icon: <FiHeart /> },
                    { id: 'emergencias', label: 'Mis emergencias', icon: <FiAlertTriangle /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                            activeTab === tab.id
                                ? 'border-brand-accent text-brand-accent'
                                : 'border-transparent text-brand-muted hover:text-brand-dark'
                        }`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Pestaña: Mis datos */}
            {activeTab === 'datos' && (
                <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-serif text-2xl text-brand-dark">Datos personales</h3>
                            <p className="text-xs text-brand-muted mt-1">Información principal registrada en la plataforma.</p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditingProfile(true)}
                            className="gap-1.5"
                        >
                            <FiEdit2 /> Editar
                        </Button>
                    </div>

                    <div className="space-y-4 text-sm text-brand-dark">
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60">
                            <span className="text-xs text-brand-muted block mb-1">Nombre completo</span>
                            <p className="font-medium text-base">{profile.name}</p>
                        </div>

                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60">
                            <span className="text-xs text-brand-muted block mb-1">Dirección / Zona</span>
                            <p className="font-medium text-base">{profile.location}</p>
                        </div>

                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60">
                            <span className="text-xs text-brand-muted block mb-1">Número de WhatsApp</span>
                            <p className="font-medium text-base">{profile.phone}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Pestaña: Mis publicaciones */}
            {activeTab === 'publicaciones' && (
                <>
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <div>
                            <h3 className="font-serif text-2xl text-brand-dark">Mis publicaciones</h3>
                            <p className="text-xs text-brand-muted mt-1">Productos y servicios que has compartido.</p>
                        </div>
                        <Button href="/publicar?tipo=catalogo">Crear publicación</Button>
                    </div>
                    {renderPublicationList(
                        myPublications, 
                        'Cuando publiques un producto o servicio, aparecerá aquí.',
                        '/publicar?tipo=catalogo'
                    )}
                </>
            )}

            {/* Pestaña: Mis solicitudes */}
            {activeTab === 'solicitudes' && (
                <>
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <div>
                            <h3 className="font-serif text-2xl text-brand-dark">Mis solicitudes</h3>
                            <p className="text-xs text-brand-muted mt-1">Solicitudes de ayuda vecinal o propuestas de intercambio.</p>
                        </div>
                        <Button href="/publicar?tipo=ayuda">Crear solicitud</Button>
                    </div>
                    {renderPublicationList(
                        myRequests, 
                        'Cuando pidas ayuda o publiques un intercambio, aparecerá aquí.',
                        '/publicar?tipo=ayuda'
                    )}
                </>
            )}

            {/* Pestaña: Mis emergencias */}
            {activeTab === 'emergencias' && (
                <>
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <div>
                            <h3 className="font-serif text-2xl text-brand-dark">Mis emergencias</h3>
                            <p className="text-xs text-brand-muted mt-1">Alertas y reportes de riesgo compartidos con los vecinos.</p>
                        </div>
                        <Button href="/publicar?tipo=emergencia">Reportar emergencia</Button>
                    </div>
                    {renderPublicationList(
                        myEmergencies, 
                        'Cuando reportes un imprevisto o emergencia, aparecerá aquí.',
                        '/publicar?tipo=emergencia'
                    )}
                </>
            )}

            {/* Cerrar sesión */}
            <div className="mt-10 border-t border-brand-border pt-6 flex justify-end">
                <button
                    type="button"
                    onClick={() => {
                        localStorage.removeItem(PROFILE_KEY);
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
                >
                    <FiLogOut className="text-lg" /> Cerrar sesión
                </button>
            </div>

            {/* Modal de Detalle */}
            <PublicationDetail
                publication={selectedPublication}
                onClose={() => setSelectedPublication(null)}
                variant="help"
            />

            {/* Modales reutilizables mediante FormModalOrCard */}
            <EditProfileModal
                profile={profile}
                isOpen={isEditingProfile}
                onClose={() => setIsEditingProfile(false)}
                onSave={saveProfile}
            />

            <EditPublicationModal
                editingPublication={editingPublication}
                editForm={editForm}
                onClose={() => setEditingPublication(null)}
                onChange={handleEditChange}
                onSubmit={savePublication}
            />
        </section>
    );
}

export default Perfil;