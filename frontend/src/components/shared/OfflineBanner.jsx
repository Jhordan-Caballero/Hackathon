import { useEffect, useState } from 'react';
import { FiWifiOff, FiClock } from 'react-icons/fi';
import {
    isOnline,
    onConnectionChange,
    onPendingChange,
    pendingEmergencies,
} from '../../lib/offline';

// Franja que aparece arriba cuando no hay internet o hay emergencias por enviar.
// Se coloca UNA vez en MainLayout.jsx, encima del <Outlet />.
function OfflineBanner() {
    const [online, setOnline] = useState(isOnline());
    const [pending, setPending] = useState(pendingEmergencies().length);

    useEffect(() => {
        const offConn = onConnectionChange(setOnline);
        const offQueue = onPendingChange(() => setPending(pendingEmergencies().length));
        return () => {
            offConn();
            offQueue();
        };
    }, []);

    if (online && pending === 0) return null;

    return (
        <div className="sticky top-0 z-50 bg-brand-dark text-white text-sm px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-center">
            {!online && (
                <span className="flex items-center gap-2">
                    <FiWifiOff /> Sin conexión: estás viendo la última información guardada.
                </span>
            )}
            {pending > 0 && (
                <span className="flex items-center gap-2">
                    <FiClock />
                    {pending === 1
                        ? '1 emergencia en espera: se enviará al volver la señal.'
                        : `${pending} emergencias en espera: se enviarán al volver la señal.`}
                </span>
            )}
        </div>
    );
}

export default OfflineBanner;
