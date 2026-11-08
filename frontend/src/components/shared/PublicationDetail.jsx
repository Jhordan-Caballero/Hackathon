import { useState, useEffect } from 'react';
import { FiX, FiUser } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaStar, FaWhatsapp } from 'react-icons/fa';

import ImageFrame from '../ui/ImageFrame';
import Button from '../ui/Button';

const PROFILE_KEY = 'community-profile';

function PublicationDetail({
    publication,
    onClose,
    variant = 'catalog',
}) {
    if (!publication) return null;

    const isHelp = variant === 'help';

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [commentsList, setCommentsList] = useState(publication.comments || []);

    // 🚀 NUEVO: Detectamos dinámicamente si el usuario actual es el dueño del post para ocultar el formulario
    const [currentUserName, setCurrentUserName] = useState('');
    const [isMyOwnProfileView, setIsMyOwnProfileView] = useState(false);

    useEffect(() => {
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                const name = parsed.full_name || parsed.name || '';
                setCurrentUserName(name);

                // Si el post no tiene provider, o coincide con tu ID/nombre, asumimos que estás en tu perfil
                if (!publication.provider || publication.user_id === parsed.id) {
                    setIsMyOwnProfileView(true);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [publication]);

    // Fallbacks para garantizar que la ciudad y el distrito SIEMPRE aparezcan
    const city = publication.city || publication.region || 'Arequipa';
    const district = publication.district || 'Cerro Colorado';
    const location = publication.location || '';

    const fullLocation = [location, district, city].filter(Boolean).join(', ');

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newCommentObj = {
            id: Date.now(),
            text: commentText,
            rating: rating,
        };

        setCommentsList([newCommentObj, ...commentsList]);
        setCommentText('');
    };
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="publication-title"
                className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl border border-brand-border"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="relative">
                    <ImageFrame
                        src={publication.image}
                        alt={publication.title}
                        aspectRatio="aspect-[16/9]"
                        className="rounded-none"
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar detalles"
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-brand-soft text-brand-dark transition-colors text-lg"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="p-6">
                    <h3
                        id="publication-title"
                        className="font-serif text-3xl text-brand-dark mb-3"
                    >
                        {publication.title}
                    </h3>

                    {!isHelp && publication.price != null && (
                        <p className="text-xl font-semibold text-brand-accent mb-3">
                            Desde: S/ {publication.price}
                        </p>
                    )}

                    <p className="text-sm text-brand-muted leading-relaxed mb-5">
                        {publication.description?.replace(' [OCULTO]', '')}
                    </p>

                    <div className="space-y-3 text-sm text-brand-dark mb-5 border-y border-brand-border py-4">
                        <p className="flex items-center gap-2">
                            <FiUser className="text-brand-muted text-base shrink-0" />
                            {/* 🚀 FIX: Si p.provider está vacío, usa el nombre de la sesión activa del perfil */}
                            <span className="font-semibold">
                                {publication.provider || currentUserName || 'Miembro Vecinal'}
                            </span>
                        </p>

                        <p className="flex items-center gap-2 text-xs text-brand-muted">
                            <HiOutlineLocationMarker className="text-brand-muted text-base shrink-0" />
                            <span>{fullLocation}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {publication.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs text-brand-accent bg-brand-soft px-3 py-1.5 rounded-lg"
                            >
                                {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                        ))}
                    </div>

                    <Button
                        href={`https://wa.me{publication.phone || publication.contact_whatsapp}`}
                        className="w-full flex items-center justify-center gap-2 !bg-emerald-700 hover:!bg-emerald-800 mb-8"
                    >
                        <FaWhatsapp className="text-lg" />
                        Contactar por WhatsApp
                    </Button>

                    <div className="border-t border-brand-border pt-6">
                        <h4 className="font-serif text-xl text-brand-dark mb-4">
                            Opiniones del vecindario
                        </h4>

                        {/* 🚀 FIX: Ocultamos el formulario de comentarios si estás viendo tu propio anuncio desde tu perfil */}
                        {!isMyOwnProfileView && (
                            <form onSubmit={handleAddComment} className="mb-6 bg-brand-soft/50 p-4 rounded-2xl border border-brand-border/60">
                                <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                                    Deja tu valoración
                                </label>

                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="text-lg focus:outline-none transition-colors"
                                        >
                                            <FaStar
                                                className={(hoverRating || rating) >= star ? 'text-amber-500' : 'text-gray-300'}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Escribe tu opinión o experiencia..."
                                    className="w-full rounded-xl border border-brand-border bg-white p-3 text-xs text-brand-dark outline-none focus:border-brand-accent resize-none h-20 mb-3"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-brand-accent text-white text-xs font-semibold rounded-xl hover:bg-brand-accent-hover transition-colors"
                                >
                                    Publicar opinión
                                </button>
                            </form>
                        )}

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {commentsList.length > 0 ? (
                                commentsList.map((comment, index) => (
                                    <div
                                        key={comment.id ?? index}
                                        className="bg-brand-soft rounded-2xl p-3 text-xs text-brand-dark"
                                    >
                                        {comment.rating && (
                                            <div className="flex items-center gap-1 mb-1 text-amber-500">
                                                {[...Array(comment.rating)].map((_, i) => (
                                                    <FaStar key={i} className="text-[10px]" />
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-brand-dark">
                                            {typeof comment === 'string' ? comment : comment.text}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-brand-muted text-center py-4">
                                    Aún no hay opiniones.
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PublicationDetail;
