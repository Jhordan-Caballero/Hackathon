import { Link } from 'react-router-dom';
import logoImg from '../../assets/Loge.png';
import logoDarkImg from '../../assets/Loge DarkMode.png';

function BrandLogo() {
    const imgClass =
        'h-14 sm:h-16 md:h-18 w-auto object-contain transition-transform group-hover:scale-105 duration-200';

    return (
        <Link
            to="/"
            className="flex items-center py-1 group"
            aria-label="Ir al inicio"
        >
            {/* Logo para modo claro */}
            <img
                src={logoImg}
                alt="Logo Mi Barrio"
                className={`${imgClass} dark:hidden`}
            />
            {/* Logo para modo oscuro */}
            <img
                src={logoDarkImg}
                alt="Logo Mi Barrio"
                className={`${imgClass} hidden dark:block`}
            />
        </Link>
    );
}

export default BrandLogo;