import { useState } from 'react';
import BrandLogo from '../layout/BrandLogo';

const navigationLinks = [
    { label: '[enlace de navegación]', href: '#features' },
    { label: '[enlace de navegación]', href: '#methodology' },
    { label: '[enlace de navegación]', href: '#comparison' },
];

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">

            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

                {/* Logotipo */}
                <BrandLogo />

                {/* Navegación escritorio */}
                <nav className="hidden lg:flex items-center gap-6 px-6 py-2 rounded-full bg-[#F4F3EE]/95 border border-brand-border shadow-xs text-xs font-medium text-brand-muted hover:border-brand-muted/30 transition-all duration-200">

                    {navigationLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="hover:text-brand-dark transition-colors duration-200"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Acciones */}
                <div className="flex items-center gap-3">

                    <a
                        href="#cta"
                        className="btn-shimmer hidden sm:inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wider bg-brand-accent hover:bg-brand-accent-hover text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        [botón de acción principal]
                    </a>

                    {/* Botón menú */}
                    <button
                        type="button"
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-10 h-10 rounded-full bg-[#1D1A2F] hover:bg-brand-dark text-white flex flex-col items-center justify-center gap-1.5 transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
                    >
                        <span className={`w-4 h-0.5 bg-white rounded-full transition-transform duration-200 ${menuOpen ? 'translate-y-1 rotate-45' : ''}`} />

                        <span className={`w-4 h-0.5 bg-white rounded-full transition-all duration-200 ${menuOpen ? '-translate-y-1 -rotate-45' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Menú desplegable */}
            {menuOpen && (
                <nav className="lg:hidden absolute top-full left-0 w-full bg-brand-cream/95 backdrop-blur-md border-b border-brand-border shadow-card px-6 py-6 flex flex-col gap-5">

                    {navigationLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm text-brand-muted hover:text-brand-dark transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}

                    <a
                        href="#cta"
                        onClick={() => setMenuOpen(false)}
                        className="sm:hidden text-sm font-semibold text-brand-accent"
                    >
                        [botón de acción principal]
                    </a>
                </nav>
            )}

        </header>
    );
}

export default Navbar;