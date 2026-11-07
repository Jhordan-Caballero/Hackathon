
function ImageFrame({
    src,
    alt = '',
    className = '',
    aspectRatio = 'aspect-video',
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-brand-soft ${aspectRatio} ${className}`}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-brand-muted">
                    [imagen]
                </div>
            )}
        </div>
    );
}

export default ImageFrame;
