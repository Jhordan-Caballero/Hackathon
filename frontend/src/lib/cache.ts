// Caché de datos para usar la app SIN INTERNET.
// Cada vez que una lista se carga bien, se guarda una copia en el celular.
// Si después no hay señal, se muestra esa copia (con la fecha de cuándo se guardó).

const PREFIX = 'vecinos-cache:'

export interface CachedValue<T> {
  data: T
  savedAt: string // fecha ISO de cuándo se guardó
}

export interface DataSource {
  fromCache: boolean
  savedAt: string | null
}

let lastSource: DataSource = { fromCache: false, savedAt: null }

/** ¿La última lista que se cargó vino de la copia guardada (sin internet)? */
export function getLastDataSource(): DataSource {
  return lastSource
}

export function saveCache<T>(key: string, data: T): void {
  try {
    const value: CachedValue<T> = { data, savedAt: new Date().toISOString() }
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // almacenamiento lleno o bloqueado: seguimos sin caché
  }
}

export function readCache<T>(key: string): CachedValue<T> | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as CachedValue<T>) : null
  } catch {
    return null
  }
}

export function isOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

/** true si el error se debe a falta de conexión (no a un error de datos). */
export function isNetworkError(e: unknown): boolean {
  if (!isOnline()) return true
  const message =
    e instanceof Error ? e.message : String((e as { message?: unknown } | null)?.message ?? e)
  return /failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(message)
}

/**
 * Intenta traer los datos de internet y guarda una copia.
 * Si no hay conexión, devuelve la copia guardada (o la de `fallback`).
 */
export async function withOfflineCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  fallback?: () => CachedValue<T> | null,
): Promise<T> {
  const fromCache = (): T | null => {
    const cached = readCache<T>(key) ?? fallback?.() ?? null
    if (!cached) return null
    lastSource = { fromCache: true, savedAt: cached.savedAt }
    return cached.data
  }

  if (!isOnline()) {
    const data = fromCache()
    if (data !== null) return data
    throw new Error('Sin conexión y todavía no hay datos guardados en este celular')
  }

  try {
    const data = await fetcher()
    saveCache(key, data)
    lastSource = { fromCache: false, savedAt: null }
    return data
  } catch (e) {
    if (isNetworkError(e)) {
      const data = fromCache()
      if (data !== null) return data
    }
    throw e
  }
}
