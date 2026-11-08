import { FiImage } from 'react-icons/fi';

function ImageFrame({
    src,
    alt = '',
    className = '',
    aspectRatio = 'aspect-video',
}) {
    return (
        <div
            className={`relative overflow-hidden bg-brand-soft ${aspectRatio} ${className}`}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-muted">
                    {/* 🚀 ICONO REEMPLAZADO: FiImage vectorial de alta definición */}
                    <FiImage className="text-3xl text-brand-muted/70" />
                    <span className="text-xs font-medium">
                        Sin fotografía
                    </span>
                </div>
            )}
        </div>
    );
}

export default ImageFrame;
