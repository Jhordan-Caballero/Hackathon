import { FiMapPin, FiSearch } from 'react-icons/fi';
import SearchInput from '../ui/SearchInput';

const ZONAS_AREQUIPA = [
    { value: 'todas', label: 'Todas las zonas' },
    { value: 'alto-selva-alegre', label: 'Alto Selva Alegre' },
    { value: 'cayma', label: 'Cayma' },
    { value: 'yanahuara', label: 'Yanahuara' },
    { value: 'cercado', label: 'Cercado' },
    { value: 'cerro-colorado', label: 'Cerro Colorado' },
    { value: 'jose-luis-bustamante', label: 'J.L. Bustamante y Rivero' },
    { value: 'paucarpata', label: 'Paucarpata' },
    { value: 'sachaca', label: 'Sachaca font' },
];

function SearchBar({
    search,
    onSearchChange,
    searchPlaceholder = "Buscar en tu comunidad...",
    selectedZone = "todas",
    onZoneChange,
    resultsCount,
}) {
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

            {/* Barra inferior: Selector de zona predefinido + Contador */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/60">

                {/* Filtro estandarizado de zonas */}
                <div className="relative inline-flex items-center min-w-[220px]">
                    <span className="absolute left-3.5 text-brand-accent text-base pointer-events-none">
                        <FiMapPin />
                    </span>

                    <select
                        value={selectedZone}
                        onChange={(e) => onZoneChange && onZoneChange(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm text-brand-dark font-medium outline-none focus:border-brand-accent transition-colors appearance-none cursor-pointer"
                    >
                        {ZONAS_AREQUIPA.map((zona) => (
                            <option key={zona.value} value={zona.value}>
                                {zona.label}
                            </option>
                        ))}
                    </select>

                    <span className="absolute right-3 text-brand-muted text-xs pointer-events-none">
                        ▼
                    </span>
                </div>

                {/* Contador de resultados */}
                {typeof resultsCount === 'number' && (
                    <span className="text-sm text-brand-muted font-medium sm:ml-auto text-right sm:text-left">
                        {resultsCount} {resultsCount === 1 ? 'publicación' : 'publicaciones'}
                    </span>
                )}
            </div>
        </div>
    );
}

export default SearchBar;