import { FiSearch } from 'react-icons/fi'; // Importas el icono desde React Icons

function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative">
            {/* Reemplazamos el span por el componente del icono */}
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-xl pointer-events-none" />

            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full h-14 pl-11 pr-10 rounded-xl border border-brand-border bg-brand-cream/40 text-base text-brand-dark placeholder:text-brand-muted/70 placeholder:text-sm md:placeholder:text-base outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 transition-all"
            />
        </div>
    );
}

export default SearchInput;