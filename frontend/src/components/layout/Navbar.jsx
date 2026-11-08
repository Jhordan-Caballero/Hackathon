import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const navigationLinks = [
    { label: 'Catálogo', to: '/' },
    { label: 'Ayuda Vecinal', to: '/ayuda-vecinal' },
    { label: 'Emergencias', to: '/emergencias', important: true },
    { label: 'Mi Perfil', to: '/perfil', private: true },
];

function getInitialTheme() {
    try {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) { /* sin acceso a localStorage */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeToggle({ theme, onToggle }) {
    const isDark = theme === 'dark';
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
            className="w-10 h-10 shrink-0 rounded-full border border-brand-border bg-brand-surface hover:bg-brand-soft text-brand-dark flex items-center justify-center transition-colors cursor-pointer"
        >
            {isDark ? (
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
}

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [usuario, setUsuario] = useState(null);
    
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        try {
            localStorage.setItem('theme', theme);
        } catch (e) { /* ignorar */ }
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    useEffect(() => {
        function revisarSesion() {
            const perfilGuardado = localStorage.getItem('community-profile');
            if (perfilGuardado) {
                try {
                    const datos = JSON.parse(perfilGuardado);
                    setUsuario(Array.isArray(datos) ? datos[0] : datos);
                } catch (e) {
                    setUsuario(null);
                }
            } else {
                setUsuario(null);
            }
        }
        revisarSesion();

        window.addEventListener('storage-update', revisarSesion);
        
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('storage-update', revisarSesion);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('community-profile');
        setUsuario(null);
        setUserDropdownOpen(false);
        closeMenu();
        navigate('/login');
    };

    const handlePublicarClick = (e) => {
        if (!usuario) {
            e.preventDefault();
            const quiereIngresar = window.confirm(
                "🔒 Inicio de sesión requerido\n\nPara poder crear una publicación en el vecindario es necesario identificarse.\n\n¿Deseas iniciar sesión ahora?"
            );
            if (quiereIngresar) {
                navigate('/login');
            }
        }
    };

    const getLinkClass = ({ isActive }, important = false) =>
        `whitespace-nowrap transition-colors duration-200 ${isActive
            ? 'text-brand-accent font-semibold'
            : important
                ? 'text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300'
                : 'text-brand-muted hover:text-brand-dark'
        }`;

    const visibleLinks = navigationLinks.filter(link => !link.private || usuario);
    return (
        <header className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-border/70 transition-all">
            <div className="max-w-7xl mx-auto px-5 lg:px-10 h-20 flex items-center justify-between gap-4">

                <div className="shrink-0 flex items-center">
                    <BrandLogo />
                </div>

                <nav className="hidden lg:flex items-center gap-7 px-7 py-3 rounded-full bg-brand-surface border border-brand-border text-sm font-semibold shadow-sm">
                    {visibleLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            end={link.to === '/'}
                            className={(props) => getLinkClass(props, link.important)}
                        >
                            {link.important && (
                                <span className="mr-1.5 text-base">✱</span>
                            )}
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2 shrink-0">
                    <ThemeToggle theme={theme} onToggle={toggleTheme} />

                    <Link
                        to="/publicar"
                        onClick={handlePublicarClick}
                        className="inline-flex items-center justify-center gap-1.5 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                    >
                        <span className="text-base leading-none">+</span>
                        <span className="hidden sm:inline">Publicar</span>
                    </Link>

                    {/* 🚀 DROP_DOWN PERFECTAMENTE ALINEADO AL ANCHO DEL BOTÓN */}
                    {usuario ? (
                        <div className="relative inline-block" ref={dropdownRef}>
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="hidden sm:inline-flex items-center justify-center gap-2 border border-brand-border bg-brand-surface hover:bg-brand-soft text-brand-dark text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-2xs min-w-[120px]"
                            >
                                <span className="truncate">{usuario.full_name?.split(' ')[0]}</span>
                                <span className="text-[9px] text-brand-muted font-normal">▼</span>
                            </button>

                            {/* 🚀 Pestañita flotante sin emoji y con el ancho 'w-full' exacto al del botón padre */}
                            {userDropdownOpen && (
                                <div className="absolute right-0 left-0 mt-1.5 w-full bg-brand-surface border border-brand-border rounded-xl shadow-md py-1 z-50 text-center animate-fade-in">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden sm:inline-flex items-center justify-center border border-brand-border bg-brand-surface hover:bg-brand-soft text-brand-muted hover:text-brand-dark text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                    )}

                    <button
                        type="button"
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden w-10 h-10 rounded-full border border-brand-border bg-brand-surface flex flex-col items-center justify-center gap-1.5 hover:bg-brand-soft transition-colors"
                    >
                        <span className={`w-4 h-0.5 bg-brand-dark rounded-full transition-transform ${menuOpen ? 'translate-y-1 rotate-45' : ''}`} />
                        <span className={`w-4 h-0.5 bg-brand-dark rounded-full transition-transform ${menuOpen ? '-translate-y-1 -rotate-45' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Menú móvil */}
            {menuOpen && (
                <nav className="lg:hidden absolute top-full left-0 w-full bg-brand-cream border-b border-brand-border shadow-card px-6 py-5 flex flex-col gap-5">
                    {visibleLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            end={link.to === '/'}
                            onClick={closeMenu}
                            className={(props) => `text-sm font-medium ${getLinkClass(props, link.important)}`}
                        >
                            {link.important && '✱ '}
                            {link.label}
                        </NavLink>
                    ))}

                    {usuario ? (
                        <button
                            onClick={handleLogout}
                            className="sm:hidden text-left text-sm font-semibold text-red-600 dark:text-red-400 border-t border-brand-border/60 pt-3 mt-1 flex items-center justify-between"
                        >
                            <span>Cerrar sesión ({usuario.full_name?.split(' ')[0]})</span>
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            onClick={closeMenu}
                            className="sm:hidden text-sm font-semibold text-brand-accent border-t border-brand-border/60 pt-3 mt-1"
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
}

export default Navbar;