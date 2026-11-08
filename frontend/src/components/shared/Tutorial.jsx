import { useEffect, useState } from 'react';
import {
    FiMapPin,
    FiStar,
    FiHeart,
    FiAlertTriangle,
    FiPlusCircle,
    FiX,
} from 'react-icons/fi';
import {
    EVENTO_ABRIR_TUTORIAL,
    marcarTutorialVisto,
    tutorialYaVisto,
} from '../../lib/tutorial';

// Tutorial de bienvenida (lo pide el reto: "Tutorial para usar la aplicación").
// Aparece solo la primera vez. Se coloca UNA vez en MainLayout.jsx.
// Para volver a abrirlo: import { abrirTutorial } from '../../lib/tutorial'

const PASOS = [
    {
        icono: FiMapPin,
        titulo: 'Tu barrio en una sola app',
        texto: 'Encuentra productos y servicios de vecinos de tu mismo distrito, sin gastar en transporte.',
    },
    {
        icono: FiStar,
        titulo: 'Visto Bueno Vecinal',
        texto: 'Los vecinos califican con estrellas. El sello "Visto Bueno" aparece cuando un servicio tiene 3 o más reseñas con 4 estrellas o más.',
    },
    {
        icono: FiHeart,
        titulo: 'Ayuda sin dinero',
        texto: 'En Ayuda Vecinal puedes pedir u ofrecer ayuda: préstamo de herramientas, donaciones, intercambio de habilidades y más.',
    },
    {
        icono: FiAlertTriangle,
        titulo: 'Emergencias',
        texto: 'Reporta una emergencia en segundos, aunque no tengas cuenta ni internet: se enviará sola al volver la señal. Los vecinos pueden responder "Yo ayudo".',
    },
    {
        icono: FiPlusCircle,
        titulo: 'Publica en 3 pasos',
        texto: '1) Toca "Publicar"  2) Escribe qué ofreces o necesitas  3) Envía. Solo necesitas tu nombre y tu número de celular.',
    },
];

function Tutorial() {
    const [abierto, setAbierto] = useState(() => !tutorialYaVisto());
    const [paso, setPaso] = useState(0);

    useEffect(() => {
        const abrir = () => {
            setPaso(0);
            setAbierto(true);
        };
        window.addEventListener(EVENTO_ABRIR_TUTORIAL, abrir);
        return () => window.removeEventListener(EVENTO_ABRIR_TUTORIAL, abrir);
    }, []);

    if (!abierto) return null;

    const cerrar = () => {
        marcarTutorialVisto();
        setAbierto(false);
    };

    const actual = PASOS[paso];
    const Icono = actual.icono;
    const esUltimo = paso === PASOS.length - 1;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-titulo"
        >
            <div className="bg-white w-full max-w-md rounded-3xl p-7 shadow-xl relative text-center">
                <button
                    type="button"
                    onClick={cerrar}
                    aria-label="Cerrar tutorial"
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand-dark hover:bg-brand-border"
                >
                    <FiX />
                </button>

                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-brand-soft text-brand-red flex items-center justify-center text-3xl">
                    <Icono />
                </div>

                <h2 id="tutorial-titulo" className="font-serif text-2xl text-brand-dark mb-3">
                    {actual.titulo}
                </h2>
                <p className="text-base text-brand-muted leading-relaxed mb-6">{actual.texto}</p>

                {/* Puntos de progreso */}
                <div className="flex justify-center gap-2 mb-6" aria-hidden="true">
                    {PASOS.map((_, i) => (
                        <span
                            key={i}
                            className={`h-2 rounded-full transition-all ${
                                i === paso ? 'w-6 bg-brand-red' : 'w-2 bg-brand-border'
                            }`}
                        />
                    ))}
                </div>

                <div className="flex gap-3">
                    {paso > 0 ? (
                        <button
                            type="button"
                            onClick={() => setPaso(paso - 1)}
                            className="flex-1 py-3 rounded-xl border border-brand-border text-brand-dark text-sm font-medium hover:bg-brand-soft"
                        >
                            Anterior
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={cerrar}
                            className="flex-1 py-3 rounded-xl border border-brand-border text-brand-muted text-sm font-medium hover:bg-brand-soft"
                        >
                            Saltar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={esUltimo ? cerrar : () => setPaso(paso + 1)}
                        className="flex-1 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-sm font-semibold"
                    >
                        {esUltimo ? '¡Empezar!' : 'Siguiente'}
                    </button>
                </div>

                <p className="text-xs text-brand-muted mt-4">
                    Paso {paso + 1} de {PASOS.length}
                </p>
            </div>
        </div>
    );
}

export default Tutorial;
