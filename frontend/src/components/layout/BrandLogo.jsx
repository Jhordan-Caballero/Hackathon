import { Link } from 'react-router-dom';
import logoImg from '../../assets/Loge.png';

function BrandLogo() {
    return (
        <Link
            to="/"
            className="flex items-center py-1 group"
            aria-label="Ir al inicio"
        >
            <img 
                src={logoImg}
                alt="Logo Mi Barrio" 
                className="h-14 sm:h-16 md:h-18 w-auto object-contain transition-transform group-hover:scale-105 duration-200" 
            />
        </Link>
    );
}

export default BrandLogo;