import Navbar from './Navbar';
import Footer from './Footer';
import AmbientBackground from './AmbientBackground';

function MainLayout({ children }) {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-brand-cream bg-fine-grid text-brand-dark font-sans antialiased">

            <AmbientBackground />

            <div className="relative z-10">

                <Navbar />

                <main>
                    {children}
                </main>

                <Footer />

            </div>
        </div>
    );
}

export default MainLayout;
