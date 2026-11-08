import { Link } from 'react-router-dom';
import BrandLogo from '../layout/BrandLogo';

const footerGroups = [
    {
        title: 'Navegación',
        links: [
            { label: 'Catálogo', to: '/' },
            { label: 'Ayuda Vecinal', to: '/ayuda-vecinal' },
            { label: 'Emergencias', to: '/emergencias' },
        ],
    },
    {
        title: 'Comunidad',
        links: [
            { label: 'Mi Perfil', to: '/perfil' },
            { label: 'Crear Publicación', to: '/publicar' },
            { label: 'Centro de Alertas', to: '/emergencias' },
        ],
    },
];

function Footer() {
    return (
        <footer className="border-t border-brand-border bg-brand-surface pt-16 pb-12 px-6 lg:px-12 relative z-10">

            <div className="max-w-7xl mx-auto">

                {/* Columnas principales */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">

                    {/* Información de marca */}
                    <div className="md:col-span-4">
                        <div className="mb-5">
                            <BrandLogo />
                        </div>

                        <p className="text-brand-muted text-sm max-w-sm font-light leading-relaxed">
                            Una plataforma vecinal unificada diseñada para fomentar la colaboración, el comercio local y la prevención comunitaria en tu distrito.
                        </p>
                    </div>

                    {/* Grupos de navegación dinámicos */}
                    {footerGroups.map((group, index) => (
                        <div key={index} className="md:col-span-2">

                            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
                                {group.title}
                            </h4>

                            <ul className="space-y-3 text-xs text-brand-muted font-light">
                                {group.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            to={link.to}
                                            className="hover:text-brand-dark transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {/* Información adicional */}
                    <div className="md:col-span-4">

                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
                            Soporte y Prevención
                        </h4>

                        <p className="text-xs text-brand-muted font-light leading-relaxed mb-3">
                            ¿Observas una situación de riesgo en tu barrio?
                        </p>

                        <p className="text-xs text-brand-muted font-light leading-relaxed">
                            Reporta imprevistos rápidamente desde la pestaña de emergencias para alertar a los miembros de tu comunidad en tiempo real.
                        </p>
                    </div>
                </div>

                {/* Pie inferior */}
                <div className="pt-8 border-t border-brand-border/70 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted font-light gap-4">

                    <div>
                        © {new Date().getFullYear()} Red Vecinal Cohesiva. Todos los derechos reservados.
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="hover:text-brand-dark transition-colors">
                            Términos de servicio
                        </Link>

                        <Link to="/" className="hover:text-brand-dark transition-colors">
                            Política de privacidad
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
