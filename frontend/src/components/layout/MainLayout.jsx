import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AmbientBackground from './AmbientBackground';
import AIChatWidget from './AIChatWidget';
import Tutorial from '../shared/Tutorial';
import OfflineBanner from '../shared/OfflineBanner';
import { supabase } from '../../lib/supabase';

// Conecta el chat flotante con la IA del barrio (Edge Function "chat" de Supabase)
async function preguntarAlAsistente(texto) {
    const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: texto },
    });
    if (error) throw error;
    return data?.reply;
}
function MainLayout() {
    return (
        <div className="relative min-h-screen bg-brand-cream bg-fine-grid text-brand-dark font-sans antialiased flex flex-col">
            <AmbientBackground />

            <div className="relative z-10 flex flex-col min-h-screen">
                <OfflineBanner />
                <Navbar />

                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>

                <Footer />
                <AIChatWidget onSend={preguntarAlAsistente} />
                <Tutorial />
            </div>
        </div>
    );
}

export default MainLayout;