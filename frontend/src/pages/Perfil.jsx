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
import { supabase } from '../supabaseClient';

const PROFILE_KEY = 'community-profile';

function Perfil() {
    const [activeTab, setActiveTab] = useState('datos');
    const [profile, setProfile] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const [publications, setPublications] = useState([]);
    const [loadingPublications, setLoadingPublications] = useState(true);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [editingPublication, setEditingPublication] = useState(null);

    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        district: '',
        location: '',
        price: '',
        tags: [],
        status: 'activo',
    });

    const formatPhone = (phone) => {
        if (!phone) return '';
        const cleaned = String(phone).replace(/\D/g, '');
        const fullNumber = cleaned.length === 9 ? `51${cleaned}` : cleaned;
        if (fullNumber.length === 11 && fullNumber.startsWith('51')) {
            return `+${fullNumber.slice(0, 2)} ${fullNumber.slice(2, 5)} ${fullNumber.slice(5, 8)} ${fullNumber.slice(8)}`;
        }
        return phone;
    };

    useEffect(() => {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                const userObject = Array.isArray(parsed) ? parsed[0] : parsed;
                setProfile(userObject);
            } catch (e) {
                console.error("Error al leer sesión local", e);
            }
        }
    }, []);

    // CONSULTA REAL: Trae las publicaciones asociadas al user_id de este perfil
    useEffect(() => {
        if (!profile?.id) return;

        async function fetchMyPublications() {
            setLoadingPublications(true);
            try {
                const { data, error } = await supabase
                    .from('publications')
                    .select('*')
                    .eq('user_id', profile.id) // Filtramos por tu ID único de Supabase
                    .order('created_at', { ascending: false });

                if (!error) {
                    setPublications(data || []);
                }
            } catch (err) {
                console.error("Error cargando tus publicaciones:", err);
            } {
                setLoadingPublications(false);
            }
        }

        fetchMyPublications();
    }, [profile]);
    const saveProfile = async (newProfileData) => {
        try {
            if (profile?.id) {
                const { data, error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: newProfileData.full_name,
                        region: newProfileData.region,
                        district: newProfileData.district,
                        neighborhood: newProfileData.neighborhood,
                        whatsapp: newProfileData.whatsapp
                    })
                    .eq('id', profile.id)
                    .select();

                if (error) {
                    alert(`No se pudo actualizar en Supabase: ${error.message}`);
                    return;
                }

                const updatedUser = Array.isArray(data) ? data[0] : data;
                setProfile(updatedUser);
                localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedUser));
            } else {
                setProfile(newProfileData);
                localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfileData));
            }
            window.dispatchEvent(new Event('storage-update'));
            setIsEditingProfile(false);
        } catch (err) {
            alert('Error inesperado al guardar los cambios.');
        }
    };

    const openEditPublication = (publication) => {
        setEditingPublication(publication);
        setEditForm({
            title: publication.title,
            description: publication.description,
            district: publication.district || 'Cerro Colorado',
            location: publication.location || publication.neighborhood || '',
            price: publication.price ?? '',
            tags: publication.tags || [],
            status: publication.status || 'activo',
        });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // Guarda los cambios editados de la publicación directo en Supabase
    const savePublication = async (updatedPub) => {
        try {
            // Limpiamos descripciones viejas por si acaso
            let cleanDesc = updatedPub.description.replace(' [OCULTO]', '');

            // Si el usuario eligió Oculto / Inactivo, le sumamos el tag secreto al final
            const finalDescription = updatedPub.status === 'inactivo'
                ? `${cleanDesc} [OCULTO]`
                : cleanDesc;

            const { error } = await supabase
                .from('publications')
                .update({
                    title: updatedPub.title,
                    description: finalDescription, // Guardamos la bandera aquí de forma segura
                    district: updatedPub.district,
                    location: updatedPub.location,
                    price: updatedPub.price,
                    tags: updatedPub.tags
                    // 🚫 NUNCA MÁS ENVIAMOS LA COLUMNA STATUS AQUÍ (Evita el check constraint)
                })
                .eq('id', updatedPub.id);

            if (!error) {
                // Sincronizamos localmente el objeto modificado para que el Perfil se entere al instante
                const localUpdated = {
                    ...updatedPub,
                    description: finalDescription,
                    status: updatedPub.status // Mantiene 'inactivo' o 'activo' en la interfaz
                };

                setPublications(prev => prev.map(pub => pub.id === updatedPub.id ? localUpdated : pub));
                setEditingPublication(null);
            } else {
                alert(`Error en Supabase: ${error.message}`);
            }
        } catch (err) {
            console.error(err);
        }
    };


    const deletePublication = async (publication) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${publication.title}"?`)) return;
        try {
            const { error } = await supabase
                .from('publications')
                .delete()
                .eq('id', publication.id);

            if (!error) {
                setPublications(prev => prev.filter(item => item.id !== publication.id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 1. Catálogo comercial (lo que venga de la sección servicios)
    const myPublications = publications.filter((pub) => pub.section === 'servicios');

    // 2. Mis solicitudes (Sección comunidad pero que NO sean emergencias médicas/riesgos)
    const myRequests = publications.filter((pub) => pub.section === 'comunidad' && !pub.emergency_support);

    // 3. Mis emergencias (Sección comunidad que tengan activado el interruptor real del backend)
    const myEmergencies = publications.filter((pub) => pub.section === 'comunidad' && pub.emergency_support);


    const fullProfileLocation = profile ? [
        profile.neighborhood || profile.location,
        profile.district,
        profile.region
    ].filter(Boolean).join(', ') : 'Cargando ubicación...';

    const renderPublicationList = (items, emptyMessage, createHref) => {
        if (loadingPublications) return <p className="text-sm text-brand-muted animate-pulse py-6">Cargando tus anuncios reales...</p>;

        if (items.length === 0) {
            return (
                <div className="bg-white border border-brand-border rounded-2xl p-10 md:p-12 text-center flex flex-col items-center justify-center">
                    <FiBox className="text-4xl text-brand-muted mb-3" />
                    <h3 className="font-serif text-xl text-brand-dark">Aún no tienes publicaciones aquí</h3>
                    <p className="text-sm text-brand-muted mt-2 max-w-md">{emptyMessage}</p>
                    <div className="mt-6"><Button href={createHref}>Crear publicación</Button></div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((publication) => (
                    <div key={publication.id} className="flex flex-col relative">
                        <div className="absolute top-3 left-3 z-10">
                            {publication.description?.includes('[OCULTO]') ? (
                                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-200 shadow-sm">
                                    ● Oculto / Inactivo
                                </span>
                            ) : (
                                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 shadow-sm">
                                    ● Visible / Activo
                                </span>
                            )}
                        </div>

                        <PublicationCard
                            publication={publication}
                            categoryLabel={publication.category}
                            typeLabel={publication.type}
                            onDetails={setSelectedPublication}
                        />
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <button type="button" onClick={() => openEditPublication(publication)} className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-brand-border bg-brand-cream/30 text-brand-dark text-xs font-semibold hover:bg-brand-soft transition-colors">
                                <FiEdit2 className="text-brand-accent text-sm" /> <span>Editar</span>
                            </button>
                            <button type="button" onClick={() => deletePublication(publication)} className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50/50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors">
                                <FiTrash2 className="text-sm" /> <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (!profile) return <div className="flex items-center justify-center min-h-screen"><p className="text-brand-muted">Cargando...</p></div>;
    return (
        <section className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
            <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">Mi espacio</span>
                <h1 className="font-serif text-4xl text-brand-dark mt-2">Mi perfil</h1>
                <p className="text-sm text-brand-muted mt-2">Administra tus datos y las publicaciones que compartes con tu comunidad.</p>
            </div>

            <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-7 mb-8 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center text-brand-accent text-2xl"><FiUser /></div>
                <div className="text-center sm:text-left flex-1">
                    <h2 className="font-serif text-2xl text-brand-dark">{profile.full_name || profile.name}</h2>
                    <p className="text-sm text-brand-muted mt-1">{fullProfileLocation}</p>
                </div>
                <span className="text-xs bg-brand-soft text-brand-accent px-4 py-2 rounded-full font-medium">Miembro de la comunidad</span>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-brand-border mb-8">
                {[
                    { id: 'datos', label: 'Mis datos', icon: <FiUser /> },
                    { id: 'publicaciones', label: 'Mis publicaciones', icon: <FiBox /> },
                    { id: 'solicitudes', label: 'Mis solicitudes', icon: <FiHeart /> },
                    { id: 'emergencias', label: 'Mis emergencias', icon: <FiAlertTriangle /> },
                ].map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab.id ? 'border-brand-accent text-brand-accent' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}>
                        <span className="text-lg">{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'datos' && (
                <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-serif text-2xl text-brand-dark">Datos personales</h3>
                            <p className="text-xs text-brand-muted mt-1">Información principal registrada en la plataforma.</p>
                        </div>
                        <Button variant="secondary" onClick={() => setIsEditingProfile(true)} className="gap-1.5"><FiEdit2 /> Editar</Button>
                    </div>

                    <div className="space-y-4 text-sm text-brand-dark">
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60"><span className="text-xs text-brand-muted block mb-1">Nombre completo</span><p className="font-medium text-base">{profile.full_name || profile.name}</p></div>
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60"><span className="text-xs text-brand-muted block mb-1">Ciudad / Departamento</span><p className="font-medium text-base">{profile.region || profile.city || 'No especificado'}</p></div>
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60"><span className="text-xs text-brand-muted block mb-1">Distrito</span><p className="font-medium text-base">{profile.district || 'No especificado'}</p></div>
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60"><span className="text-xs text-brand-muted block mb-1">Dirección / Zona</span><p className="font-medium text-base">{profile.neighborhood || profile.location}</p></div>
                        <div className="p-4 bg-brand-cream/30 rounded-xl border border-brand-border/60"><span className="text-xs text-brand-muted block mb-1">Número de WhatsApp</span><p className="font-medium text-base">{formatPhone(profile.whatsapp || profile.phone)}</p></div>
                    </div>
                </div>
            )}

            {activeTab === 'publicaciones' && (
                <>
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <div><h3 className="font-serif text-2xl text-brand-dark">Mis publicaciones</h3><p className="text-xs text-brand-muted mt-1">Productos y servicios que has compartido.</p></div>
                        <Button href="/publicar?tipo=catalogo">Crear publicación</Button>
                    </div>
                    {renderPublicationList(myPublications, 'Cuando publiques un producto o servicio, aparecerá aquí.', '/publicar?tipo=catalogo')}
                </>
            )}

            {activeTab === 'solicitudes' && (
                <>
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <div><h3 className="font-serif text-2xl text-brand-dark">Mis solicitudes</h3><p className="text-xs text-brand-muted mt-1">Solicitudes de ayuda vecinal o propuestas de intercambio.</p></div>
                        <Button href="/publicar?tipo=ayuda">Crear solicitud</Button>
                    </div>
                    {renderPublicationList(myRequests, 'Cuando pidas ayuda o publiques un intercambio, aparecerá aquí.', '/publicar?tipo=ayuda')}
                </>
            )}

            {activeTab === 'emergencias' && (
                <>
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <div><h3 className="font-serif text-2xl text-brand-dark">Mis emergencias</h3><p className="text-xs text-brand-muted mt-1">Alertas y reportes de riesgo compartidos con los vecinos.</p></div>
                        <Button href="/publicar?tipo=emergencia">Reportar emergencia</Button>
                    </div>
                    {renderPublicationList(myEmergencies, 'Cuando reportes un imprevisto o emergencia, aparecerá aquí.', '/publicar?tipo=emergencia')}
                </>
            )}

            <div className="mt-10 border-t border-brand-border pt-6 flex justify-end">
                <button type="button" onClick={() => { localStorage.removeItem(PROFILE_KEY); window.dispatchEvent(new Event('storage-update')); window.location.href = '/login'; }} className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"><FiLogOut className="text-lg" /> Cerrar sesión</button>
            </div>

            <PublicationDetail publication={selectedPublication} onClose={() => setSelectedPublication(null)} variant="help" />
            <EditProfileModal profile={profile} isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)} onSave={saveProfile} />
            <EditPublicationModal
                editingPublication={editingPublication}
                onClose={() => setEditingPublication(null)}
                onSave={savePublication}
            />        </section>
    );
}

export default Perfil;
