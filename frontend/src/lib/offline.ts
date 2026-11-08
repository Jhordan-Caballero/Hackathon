// MODO OFFLINE
// 1) La app abre sin internet (service worker: public/sw.js).
// 2) Las listas muestran la última copia guardada (ver cache.ts).
// 3) Una emergencia reportada SIN señal queda en cola y se envía sola
//    apenas vuelve la conexión.
// 4) Los números de emergencia siempre están disponibles.
//
// Uso: en main.jsx llamar UNA vez a initOffline().

import { reportEmergency } from './api'
import { isNetworkError, isOnline } from './cache'
import type { Emergency, EmergencyInput } from './types'

export { getLastDataSource, isOnline } from './cache'

// ---------------------------------------------------------------------
// Números de emergencia del Perú (funcionan sin internet: son llamadas)
// El 911 por ahora solo opera (en prueba) en Lima Metropolitana y Callao.
// ---------------------------------------------------------------------
export const NUMEROS_EMERGENCIA = [
  { numero: '105', nombre: 'Policía Nacional', para: 'Robos, asaltos, delitos en curso' },
  { numero: '116', nombre: 'Bomberos', para: 'Incendios, fugas de gas, rescates, accidentes' },
  { numero: '106', nombre: 'SAMU (ambulancia)', para: 'Emergencias médicas, gratuito' },
  { numero: '117', nombre: 'EsSalud', para: 'Emergencias médicas de asegurados' },
  { numero: '100', nombre: 'Línea 100', para: 'Violencia familiar o contra la mujer, 24 h' },
  { numero: '110', nombre: 'Policía de Carreteras', para: 'Emergencias en carretera' },
] as const

// ---------------------------------------------------------------------
// Cola de emergencias pendientes
// ---------------------------------------------------------------------
const QUEUE_KEY = 'vecinos-emergencias-pendientes'

export interface PendingEmergency {
  localId: string
  input: EmergencyInput
  createdAt: string
}

export type ReportResult =
  | { status: 'enviada'; emergency: Emergency }
  | { status: 'en_cola'; pending: PendingEmergency }

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((fn) => fn())
}

export function pendingEmergencies(): PendingEmergency[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as PendingEmergency[]
  } catch {
    return []
  }
}

function savePending(list: PendingEmergency[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(list))
  } catch {
    // sin espacio: no se puede encolar
  }
  notify()
}

function enqueue(input: EmergencyInput): PendingEmergency {
  const item: PendingEmergency = {
    localId: crypto.randomUUID(),
    input,
    createdAt: new Date().toISOString(),
  }
  savePending([...pendingEmergencies(), item])
  return item
}

/**
 * Reportar emergencia funcionando con o sin internet.
 * - Con señal: la envía al momento → { status: 'enviada' }
 * - Sin señal: la guarda y se enviará sola al volver la señal → { status: 'en_cola' }
 *   (las fotos NO se guardan sin señal; solo el texto)
 */
export async function reportEmergencySafe(input: EmergencyInput, photos: File[] = []): Promise<ReportResult> {
  if (!isOnline()) return { status: 'en_cola', pending: enqueue(input) }
  try {
    return { status: 'enviada', emergency: await reportEmergency(input, photos) }
  } catch (e) {
    if (isNetworkError(e)) return { status: 'en_cola', pending: enqueue(input) }
    throw e
  }
}

let flushing = false

/** Envía las emergencias que quedaron en cola. Devuelve cuántas se enviaron. */
export async function flushPendingEmergencies(): Promise<number> {
  if (flushing || !isOnline()) return 0
  const queue = pendingEmergencies()
  if (!queue.length) return 0
  flushing = true
  let sent = 0
  const remaining: PendingEmergency[] = []
  try {
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]
      try {
        await reportEmergency(item.input)
        sent++
      } catch (e) {
        if (isNetworkError(e)) {
          remaining.push(...queue.slice(i)) // se cayó la señal otra vez: reintentar luego
          break
        }
        console.warn('Emergencia pendiente descartada por datos inválidos', item, e)
      }
    }
  } finally {
    savePending(remaining)
    flushing = false
  }
  return sent
}

/** Avisa cuando cambia la cola (para mostrar "1 emergencia por enviar"). */
export function onPendingChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Avisa cuando se pierde o vuelve la conexión. */
export function onConnectionChange(fn: (online: boolean) => void): () => void {
  const on = () => fn(true)
  const off = () => fn(false)
  window.addEventListener('online', on)
  window.addEventListener('offline', off)
  return () => {
    window.removeEventListener('online', on)
    window.removeEventListener('offline', off)
  }
}

// ---------------------------------------------------------------------
// Service worker: permite abrir la app sin internet
// (solo en producción: npm run build + npm run preview, o la web publicada)
// ---------------------------------------------------------------------
function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        // Guardar de una vez los archivos que ya cargó esta página
        const urls = performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((url) => url.startsWith(location.origin))
        reg.active?.postMessage({ type: 'CACHE_URLS', urls: [location.origin + '/', ...urls] })
      })
      .catch((err) => console.warn('No se pudo activar el modo offline', err))
  })
}

let started = false

/** Llamar UNA vez al iniciar la app (en main.jsx). */
export function initOffline(): void {
  if (started) return
  started = true
  registerServiceWorker()
  window.addEventListener('online', () => {
    void flushPendingEmergencies()
  })
  void flushPendingEmergencies()
}
