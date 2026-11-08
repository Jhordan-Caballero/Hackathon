// Tipos que reflejan las tablas de Supabase (después de 01_ajustes_supabase.sql)

export type Section = 'servicios' | 'comunidad'
export type PublicationType =
  | 'producto'
  | 'servicio'
  | 'ayuda'
  | 'intercambio'
  | 'prestamo'
  | 'donacion'
export type Intent = 'ofrezco' | 'solicito'
export type PublicationStatus = 'activa' | 'pausada' | 'cerrada'

export type EmergencyType =
  | 'incendio'
  | 'sismo'
  | 'inundacion'
  | 'salud'
  | 'seguridad'
  | 'accidente'
  | 'servicios_basicos'
  | 'persona_vulnerable'
  | 'otro'
export type EmergencyStatus = 'activa' | 'atendida' | 'resuelta'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  section: 'servicios' | 'comunidad' | 'ambos'
  icon: string | null
}

export interface Profile {
  id: string
  full_name: string
  whatsapp: string | null // número de teléfono
  has_whatsapp: boolean
  region: string | null
  district: string | null
  neighborhood: string | null // referencia de ubicación
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Publication {
  id: string
  user_id: string
  category_id: string | null
  title: string
  description: string | null
  section: Section
  type: PublicationType
  intent: Intent
  price: number | null
  location: string | null
  region: string | null
  district: string | null
  latitude: number | null
  longitude: number | null
  contact_whatsapp: string | null
  has_whatsapp: boolean
  emergency_support: boolean
  image_urls: string[]
  tags: string[]
  status: PublicationStatus
  created_at: string
  updated_at: string
}

// Lo que devuelve la vista publications_feed
export interface PublicationFeedItem extends Publication {
  author_name: string | null // viene del perfil del autor
  category_name: string | null
  category_slug: string | null
  avg_rating: number
  review_count: number
  visto_bueno: boolean // >= 3 reseñas y promedio >= 4
}

export interface Review {
  id: string
  author_id: string
  reviewed_user_id: string
  publication_id: string
  rating: number
  comment: string | null
  created_at: string
  author_name?: string
}

export interface Emergency {
  id: string
  user_id: string
  emergency_type: EmergencyType
  description: string | null
  location: string | null
  region: string | null
  district: string | null
  latitude: number | null
  longitude: number | null
  image_urls: string[]
  status: EmergencyStatus
  contact_phone: string | null
  created_at: string
  updated_at: string
}

export interface EmergencyFeedItem extends Emergency {
  reporter_name: string | null // viene del perfil de quien reportó
  volunteers_count: number
}

// ---------- Entradas de formularios ----------

/** Formulario de Registro (la primera vez). */
export interface RegisterInput {
  full_name: string
  phone: string
  has_whatsapp?: boolean // por defecto true
  region: string
  district: string
  neighborhood?: string // dirección o referencia
}

/** Formulario de Login (las siguientes veces). */
export interface LoginInput {
  full_name: string
  phone: string
}

export interface PublicationInput {
  section: Section
  type: PublicationType
  intent: Intent
  title: string
  description?: string
  category_id?: string | null
  tags?: string[]
  price?: number | null // se ignora si section = 'comunidad'
  location?: string
  region?: string
  district?: string
  latitude?: number | null
  longitude?: number | null
  emergency_support?: boolean
  contact_whatsapp?: string // si no se manda, se usa el teléfono del perfil
}

export interface PublicationFilters {
  section: Section
  search?: string // texto libre o "#etiqueta"
  categoryId?: string
  region?: string
  district?: string
  minRating?: number
  intent?: Intent
  type?: PublicationType
  emergencySupport?: boolean
}

export interface EmergencyInput {
  emergency_type: EmergencyType
  description: string
  location?: string
  region?: string
  district?: string
  latitude?: number | null
  longitude?: number | null
  reporter_name?: string // si no tiene cuenta, se usa como nombre de su perfil
  contact_phone?: string
}

export const EMERGENCY_LABELS: Record<EmergencyType, string> = {
  incendio: 'Incendio',
  sismo: 'Sismo',
  inundacion: 'Inundación / huaico',
  salud: 'Emergencia de salud',
  seguridad: 'Seguridad',
  accidente: 'Accidentes',
  servicios_basicos: 'Servicios básicos (agua, luz)',
  persona_vulnerable: 'Vecino en situación vulnerable',
  otro: 'Otro',
}
