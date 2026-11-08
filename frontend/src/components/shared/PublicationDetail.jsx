import { useState, useEffect } from 'react';
import { FiX, FiUser } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaStar, FaWhatsapp } from 'react-icons/fa';

import ImageFrame from '../ui/ImageFrame';
import Button from '../ui/Button';
import { supabase } from '../../supabaseClient'; 

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
    const [commentsList, setCommentsList] = useState([]);
    
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserName, setCurrentUserName] = useState('');
    const [isMyOwnProfileView, setIsMyOwnProfileView] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); 

    useEffect(() => {
        if (publication) {
            setCommentsList(publication.reviews || []);
        }

        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                const name = parsed.full_name || parsed.name || '';
                setCurrentUserName(name);
                setCurrentUserId(parsed.id);
                setIsUserLoggedIn(true);

                if (!publication.provider || publication.user_id === parsed.id) {
                    setIsMyOwnProfileView(true);
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            setIsUserLoggedIn(false);
        }
    }, [publication]);

    const city = publication.city || publication.region || 'Arequipa';
    const district = publication.district || 'Cerro Colorado';
    const location = publication.location || '';
    const fullLocation = [location, district, city].filter(Boolean).join(', ');

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUserId) return;

        try {
            const { data, error } = await supabase
                .from('reviews')
                .insert([
                    {
                        author_id: currentUserId,              
                        reviewed_user_id: publication.user_id, 
                        publication_id: publication.id,       
                        rating: rating,                        
                        comment: commentText.trim()            
                    }
                ])
                .select();

            if (error) {
                if (error.message?.includes('unique constraint') || error.code === '23505') {
                    alert('⚠️ Ya has dejado una opinión en esta publicación. Solo se permite un comentario por vecino.');
                } else {
                    alert(`Error de base de datos: ${error.message}`);
                }
                return;
            }

            if (data && data.length > 0) {
                const insertedReview = data[0];
                const newCommentVisual = {
                    id: insertedReview.id,
                    comment: insertedReview.comment,
                    rating: insertedReview.rating,
                    author: { full_name: currentUserName }
                };
                setCommentsList([newCommentVisual, ...commentsList]);
                setCommentText('');
            }
        } catch (err) {
            console.error("Error inesperado:", err);
        }
    };
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="publication-title"
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-brand-border relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-muted/20 [&::-webkit-scrollbar-thumb]:rounded-full"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar detalles"
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-sm hover:bg-brand-soft text-brand-dark transition-colors text-lg z-10 border border-brand-border/40"
                >
                    <FiX />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    
                    {/* COLUMNA IZQUIERDA: Detalles del Producto o Servicio */}
                    <div className="border-b md:border-b-0 md:border-r border-brand-border/60">
                        <ImageFrame
                            src={publication.image}
                            alt={publication.title}
                            aspectRatio="aspect-[16/10]"
                            className="rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl"
                        />
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 id="publication-title" className="font-serif text-3xl font-bold text-brand-dark leading-tight">
                                    {publication.title}
                                </h3>
                                {!isHelp && publication.price != null && (
                                    <p className="text-2xl font-bold text-brand-accent mt-2">
                                        Desde: S/ {publication.price}
                                    </p>
                                )}
                            </div>

                            <p className="text-sm text-brand-muted leading-relaxed bg-brand-cream/10 p-3 rounded-xl border border-brand-border/30">
                                {publication.description?.replace(' [OCULTO]', '')}
                            </p>

                            <div className="space-y-2.5 text-xs text-brand-dark border-t border-brand-border/60 pt-4">
                                <p className="flex items-center gap-2">
                                    <FiUser className="text-brand-muted text-base shrink-0" />
                                    <span className="font-semibold">{publication.provider || currentUserName || 'Miembro Vecinal'}</span>
                                </p>
                                <p className="flex items-center gap-2 text-brand-muted">
                                    <HiOutlineLocationMarker className="text-brand-muted text-base shrink-0" />
                                    <span>{fullLocation}</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {publication.tags?.map((tag) => (
                                    <span key={tag} className="text-[11px] font-semibold text-brand-accent bg-brand-soft px-2.5 py-1 rounded-lg border border-brand-border/30">
                                        {tag.startsWith('#') ? tag : `#${tag}`}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Button
                                    href={`https://wa.me/${String(publication.contact_whatsapp || publication.phone || '').replace(/\D/g, '')}`}
                                    className="w-full flex items-center justify-center gap-2 !bg-emerald-700 hover:!bg-emerald-800 rounded-xl py-3 text-sm shadow-2xs transition-transform hover:-translate-y-0.5"
                                >
                                    <FaWhatsapp className="text-lg" />
                                    Contactar por WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* COLUMNA DERECHA: Opiniones con scroll completamente fino, minimalista y casi imperceptible */}
                    <div className="p-6 bg-brand-soft/20 flex flex-col justify-between max-h-[85vh] md:overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-accent/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div>
                            <h4 className="font-serif text-xl font-bold text-brand-dark mb-4 border-b border-brand-border/60 pb-2">
                                Opiniones del vecindario
                            </h4>

                            {isUserLoggedIn && !isMyOwnProfileView ? (
                                <form onSubmit={handleAddComment} className="mb-5 bg-white p-4 rounded-2xl border border-brand-border shadow-2xs space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[11px] font-bold text-brand-dark uppercase tracking-wider">
                                            Deja tu valoración
                                        </label>
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="text-base focus:outline-none transition-colors"
                                                >
                                                    <FaStar className={(hoverRating || rating) >= star ? 'text-amber-500' : 'text-gray-300'} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Escribe tu opinión o experiencia con este vecino..."
                                        className="w-full rounded-xl border border-brand-border bg-brand-soft/20 p-2.5 text-xs text-brand-dark outline-none focus:border-brand-accent resize-none h-16 transition-colors"
                                        required
                                    />

                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-brand-accent text-white text-xs font-semibold rounded-xl hover:bg-brand-accent-hover transition-all shadow-2xs"
                                    >
                                        Publicar opinión
                                    </button>
                                </form>
                            ) : !isUserLoggedIn ? (
                                <div className="mb-5 p-3.5 bg-brand-cream/30 border border-brand-border/60 rounded-xl text-center">
                                    <p className="text-xs text-brand-muted font-medium">
                                        Inicia sesión para dejar una opinión en este anuncio.
                                    </p>
                                </div>
                            ) : null}

                            {/* Listado de comentarios con scroll mini estético */}
                            <div className="space-y-2.5 max-h-[45vh] md:max-h-none overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-accent/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {commentsList.length > 0 ? (
                                    commentsList.map((review, index) => (
                                        <div
                                            key={review.id || index}
                                            className="bg-white rounded-xl p-3.5 border border-brand-border/60 shadow-3xs text-xs flex flex-col gap-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-brand-dark">
                                                    {review.author?.full_name || 'Vecino Anónimo'}
                                                </span>
                                                {review.rating && (
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar 
                                                                key={i} 
                                                                className={`text-[10px] ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`} 
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-brand-muted leading-relaxed">
                                                {review.comment || review.text}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-brand-muted text-center py-6 bg-white rounded-xl border border-dashed border-brand-border/60">
                                        Aún no hay opiniones en este anuncio. ¡Sé el primero!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PublicationDetail;