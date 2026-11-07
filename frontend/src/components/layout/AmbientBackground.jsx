function AmbientBackground() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        >
            {/* Orbe ámbar superior derecho */}
            <div className="absolute -top-32 right-[-5%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-amber-200/40 via-orange-100/25 to-transparent blur-3xl animate-float-slow animate-pulse-glow" />

            {/* Orbe lavanda izquierdo */}
            <div className="absolute top-[35%] -left-36 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-200/30 via-indigo-100/20 to-transparent blur-3xl animate-float-reverse" />

            {/* Orbe verde central */}
            <div className="absolute top-[18%] left-[30%] w-[600px] h-[450px] rounded-full bg-emerald-100/25 blur-3xl animate-float-slow" />

            {/* Orbe ámbar inferior derecho */}
            <div className="absolute bottom-20 -right-20 w-[620px] h-[620px] rounded-full bg-gradient-to-tl from-amber-100/30 via-rose-100/20 to-transparent blur-3xl animate-float-slow" />
        </div>
    );
}

export default AmbientBackground;
