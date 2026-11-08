// Listas para los selectores de Región y Distrito.
// Por ahora solo Arequipa tiene distritos (provincia de Arequipa).
// Para agregar otra región: añade su lista en DISTRITOS_POR_REGION.

export const REGIONES = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao',
  'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque',
  'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno',
  'San Martín', 'Tacna', 'Tumbes', 'Ucayali',
] as const

export const REGION_POR_DEFECTO = 'Arequipa'

export const DISTRITOS_POR_REGION: Record<string, string[]> = {
  Arequipa: [
    'Arequipa (Cercado)', 'Alto Selva Alegre', 'Cayma', 'Cerro Colorado', 'Characato',
    'Chiguata', 'Jacobo Hunter', 'José Luis Bustamante y Rivero', 'La Joya',
    'Mariano Melgar', 'Miraflores', 'Mollebaya', 'Paucarpata', 'Pocsi', 'Polobaya',
    'Quequeña', 'Sabandía', 'Sachaca', 'San Juan de Siguas', 'San Juan de Tarucani',
    'Santa Isabel de Siguas', 'Santa Rita de Siguas', 'Socabaya', 'Tiabaya',
    'Uchumayo', 'Vítor', 'Yanahuara', 'Yarabamba', 'Yura',
  ],
}

/** Distritos de una región (lista vacía si aún no se cargaron sus distritos). */
export function distritosDe(region: string): string[] {
  return DISTRITOS_POR_REGION[region] ?? []
}
