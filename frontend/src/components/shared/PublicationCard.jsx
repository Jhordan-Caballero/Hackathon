import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import ImageFrame from '../ui/ImageFrame';

function PublicationCard({
   publication,
   onDetails,
}) {
   const hasPrice = publication.type === 'catalogo' || (publication.price !== null && publication.price !== undefined);

   // Fallbacks para asegurar que siempre se muestren distrito y ciudad
   const city = publication.city || 'Arequipa';
   const district = publication.district || 'Cerro Colorado';
   const location = publication.location || '';

   // Combina Dirección, Distrito y Ciudad en una sola línea
   const fullLocation = [location, district, city].filter(Boolean).join(', ');

   return (
      <article className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-border shadow-sm hover:shadow-card transition-all duration-300">

         {/* Fotografía */}
         <div className="relative">
            <ImageFrame
               src={publication.image}
               alt={publication.title}
               aspectRatio="aspect-[4/3]"
               className="rounded-none"
            />

            {/* Badge de precio */}
            {hasPrice && (
               <span className="absolute top-3 right-3 bg-brand-dark text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                  S/ {Number(publication.price).toFixed(2)}
               </span>
            )}
         </div>

         {/* Información */}
         <div className="p-5 flex flex-col flex-1">

            {/* Título */}
            <h3 className="font-serif text-xl leading-tight text-brand-dark mb-2">
               {publication.title}
            </h3>

            {/* Descripción */}
            <p className="text-xs text-brand-muted leading-relaxed line-clamp-3 mb-4">
               {publication.description}
            </p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
               {publication.tags?.map((tag) => (
                  <span
                     key={tag}
                     className="text-[11px] font-medium text-brand-accent bg-brand-soft px-2.5 py-1 rounded-lg cursor-pointer hover:bg-brand-accent hover:text-white transition-colors"
                  >
                     {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
               ))}
            </div>

            {/* Vecino y Ubicación completa en una sola línea */}
            <div className="flex items-center justify-between gap-2 border-t border-brand-border pt-3 mb-4 mt-auto">
               <span className="text-xs font-semibold text-brand-dark shrink-0">
                  {publication.provider}
               </span>

               <span className="flex items-center gap-1 text-[10px] text-brand-muted truncate max-w-[60%]" title={fullLocation}>
                  <HiOutlineLocationMarker className="text-sm text-brand-muted shrink-0" />
                  <span className="truncate">{fullLocation}</span>
               </span>
            </div>

            {/* Acciones */}
            <div className="grid grid-cols-2 gap-2">
               <button
                  type="button"
                  onClick={() => onDetails?.(publication)}
                  className="py-2.5 rounded-xl border border-brand-border text-brand-dark text-xs font-semibold hover:bg-brand-soft transition-colors"
               >
                  Ver detalles
               </button>

               <a
                  href={`https://wa.me/${publication.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
               >
                  <FaWhatsapp className="text-base" />
                  Contactar
               </a>
            </div>
         </div>
      </article>
   );
}

export default PublicationCard;