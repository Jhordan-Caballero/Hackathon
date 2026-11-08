import { FiMapPin, FiSearch, FiGlobe } from 'react-icons/fi';
import SearchInput from '../ui/SearchInput';
import { PERU_LOCATIONS } from '../../datos/peruLocations'; 

function SearchBar({
    search,
    onSearchChange,
    searchPlaceholder = "Buscar en tu comunidad...",
    selectedCity = "",
    onCityChange,
    selectedZone = "todas",
    onZoneChange,
    resultsCount,
}) {
    // Maneja el cambio de ciudad y resetea el distrito seleccionado
    const handleCitySelectChange = (e) => {
        const city = e.target.value;
        if (onCityChange) onCityChange(city);
        if (onZoneChange) onZoneChange('todas');
    };

    return (
        <div className="bg-white border border-brand-border rounded-3xl shadow-sm p-5 md:p-6 mb-10 space-y-4">

            {/* Input principal de búsqueda */}
            <div className="relative w-full">
                <SearchInput
                    value={search}
                    onChange={onSearchChange}
                    placeholder={searchPlaceholder}
                />
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-start gap-4 pt-4 border-t border-brand-border/60">

                <div className="relative inline-flex items-center min-w-[200px] flex-1 sm:flex-none">
                    <span className="absolute left-3.5 text-brand-accent text-base pointer-events-none">
                        <FiGlobe />
                    </span>

                    <select
                        value={selectedCity}
                        onChange={handleCitySelectChange}
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm text-brand-dark font-medium outline-none focus:border-brand-accent transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">Todas las ciudades</option>
                        {Object.keys(PERU_LOCATIONS).map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    <span className="absolute right-3 text-brand-muted text-xs pointer-events-none">▼</span>
                </div>

                <div className="relative inline-flex items-center min-w-[200px] flex-1 sm:flex-none">
                    <span className="absolute left-3.5 text-brand-accent text-base pointer-events-none">
                        <FiMapPin />
                    </span>

                    <select
                        value={selectedZone}
                        onChange={(e) => onZoneChange && onZoneChange(e.target.value)}
                        disabled={!selectedCity}
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm text-brand-dark font-medium outline-none focus:border-brand-accent transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="todas">Todos los distritos</option>
                        {selectedCity &&
                            PERU_LOCATIONS[selectedCity].map((dist) => (
                                <option key={dist} value={dist}>
                                    {dist}
                                </option>
                            ))}
                    </select>

                    <span className="absolute right-3 text-brand-muted text-xs pointer-events-none">▼</span>
                </div>

                {typeof resultsCount === 'number' && (
                    <span className="text-sm text-brand-muted font-medium md:ml-auto text-left md:text-right py-2 md:py-0">
                        {resultsCount} {resultsCount === 1 ? 'publicación' : 'publicaciones'}
                    </span>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
