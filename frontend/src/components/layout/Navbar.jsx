import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const navigationLinks = [
    { label: 'Catálogo', to: '/' },
    { label: 'Ayuda Vecinal', to: '/ayuda-vecinal' },
    { label: 'Emergencias', to: '/emergencias', important: true },
    { label: 'Mi Perfil', to: '/perfil' },
];

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const getLinkClass = ({ isActive }, important = false) =>
        `whitespace-nowrap transition-colors duration-200 ${
            isActive
                ? 'text-brand-accent font-semibold'
                : important
                    ? 'text-red-600 font-semibold hover:text-red-700'
                    : 'text-brand-muted hover:text-brand-dark'
        }`;

    return (
        <header className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-border/70 transition-all">

            {/* Altura ajustada a h-20 (80px) para permitir un logo grande */}
            <div className="max-w-7xl mx-auto px-5 lg:px-10 h-20 flex items-center justify-between gap-4">

                {/* Logotipo con espacio garantizado */}
                <div className="shrink-0 flex items-center">
                    <Link to="/" onClick={closeMenu} className="flex items-center">
                        <BrandLogo />
                    </Link>
                </div>

                {/* Navegación escritorio ampliada (Óvalo más grande y visible) */}
                <nav className="hidden lg:flex items-center gap-7 px-7 py-3 rounded-full bg-white border border-brand-border text-sm font-semibold shadow-sm">

                    {navigationLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            end={link.to === '/'}
                            className={(props) =>
                                getLinkClass(props, link.important)
                            }
                        >
                            {link.important && (
                                <span className="mr-1.5 text-base">✱</span>
                            )}
                            {link.label}
                        </NavLink>
                    ))}

                </nav>

                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0">

                    <Link
                        to="/publicar"
                        className="inline-flex items-center justify-center gap-1.5 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                    >
                        <span className="text-base leading-none">+</span>
                        <span className="hidden sm:inline">Publicar</span>
                    </Link>

                    <Link
                        to="/login"
                        className="hidden sm:inline-flex items-center justify-center border border-brand-border bg-white hover:bg-brand-soft text-brand-muted hover:text-brand-dark text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
                    >
                        Entrar
                    </Link>

                    {/* Botón menú móvil */}
                    <button
                        type="button"
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden w-10 h-10 rounded-full border border-brand-border bg-white flex flex-col items-center justify-center gap-1.5 hover:bg-brand-soft transition-colors"
                    >
                        <span
                            className={`w-4 h-0.5 bg-brand-dark rounded-full transition-transform ${
                                menuOpen ? 'translate-y-1 rotate-45' : ''
                            }`}
                        />
                        <span
                            className={`w-4 h-0.5 bg-brand-dark rounded-full transition-transform ${
                                menuOpen ? '-translate-y-1 -rotate-45' : ''
                            }`}
                        />
                    </button>

                </div>
            </div>

            {/* Menú móvil */}
            {menuOpen && (
                <nav className="lg:hidden absolute top-full left-0 w-full bg-brand-cream border-b border-brand-border shadow-card px-6 py-5 flex flex-col gap-5">

                    {navigationLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            end={link.to === '/'}
                            onClick={closeMenu}
                            className={(props) =>
                                `text-sm font-medium ${getLinkClass(
                                    props,
                                    link.important
                                )}`
                            }
                        >
                            {link.important && '✱ '}
                            {link.label}
                        </NavLink>
                    ))}

                    <Link
                        to="/login"
                        onClick={closeMenu}
                        className="sm:hidden text-sm font-semibold text-brand-accent"
                    >
                        Entrar
                    </Link>

                </nav>
            )}

        </header>
    );
}

export default Navbar;