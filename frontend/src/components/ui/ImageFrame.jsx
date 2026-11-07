
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
                    <span className="material-symbols-outlined text-4xl">
                        image
                    </span>
                    <span className="text-xs">
                        Sin fotografía
                    </span>
                </div>
            )}
        </div>
    );
}

export default ImageFrame;
