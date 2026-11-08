import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AmbientBackground from './AmbientBackground';
import AIChatWidget from './AIChatWidget';
function MainLayout() {
    return (
        <div className="relative min-h-screen bg-brand-cream bg-fine-grid text-brand-dark font-sans antialiased flex flex-col">
            <AmbientBackground />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>

                <Footer />
                <AIChatWidget />
            </div>
        </div>
    );
}

export default MainLayout;