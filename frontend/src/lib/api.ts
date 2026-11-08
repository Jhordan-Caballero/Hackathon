// Todas las llamadas a Supabase en un solo lugar.
// Los componentes de React SOLO importan funciones de aquí.

import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type {
  Category,
  Emergency,
  EmergencyFeedItem,
  EmergencyInput,
  EmergencyStatus,
  Profile,
  Publication,
  PublicationFeedItem,
  PublicationFilters,
  PublicationInput,
  LoginInput,
  RegisterInput,
  Review,
  Section,
} from './types'

// =====================================================================
// SESIÓN Y PERFIL  (login con NOMBRE + TELÉFONO, sin contraseña)
//
// Cómo funciona por dentro: Supabase necesita correo y contraseña, así que
// los generamos a partir del teléfono (el usuario nunca los ve):
//   correo     = 51987654321@vecinos.app
//   contraseña = vecino-51987654321
// Requisito en Supabase: Authentication > Sign In / Providers > Email >
// "Confirm email" DESACTIVADO.
// Riesgo conocido (demo): quien sepa tu número y nombre podría entrar.
// Mejora futura: código por SMS.
// =====================================================================

function phoneCredentials(phone: string) {
  const digits = normalizePhone(phone)
  if (digits.length < 9) throw new Error('Escribe un número de celular válido (9 dígitos)')
  return { email: `${digits}@vecinos.app`, password: `vecino-${digits}`, digits }
}

/** Quita tildes, mayúsculas y espacios extra para comparar nombres. */
function simplifyName(name: string): string {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ')
}

/** REGISTRO (primera vez): nombre, teléfono, región, distrito y referencia. */
export async function registerWithPhone(input: RegisterInput): Promise<Profile> {
  if (!input.full_name.trim()) throw new Error('Escribe tu nombre')
  const { email, password, digits } = phoneCredentials(input.phone)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: input.full_name.trim(),
        phone: digits,
        has_whatsapp: input.has_whatsapp ?? true,
        region: input.region,
        district: input.district,
        neighborhood: input.neighborhood ?? null,
      },
    },
  })
  if (error) {
    if (/already registered|already exists/i.test(error.message)) {
      throw new Error('Ese número ya está registrado. Inicia sesión con tu nombre y teléfono.')
    }
    throw error
  }
  if (!data.session) {
    throw new Error('Falta desactivar "Confirm email" en Supabase (Authentication > Email)')
  }
  const profile = await getMyProfile()
  if (!profile) throw new Error('No se pudo crear el perfil')
  return profile
}

/** LOGIN (siguientes veces): nombre + teléfono. */
export async function loginWithPhone(input: LoginInput): Promise<Profile> {
  const { email, password } = phoneCredentials(input.phone)
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (/invalid login credentials/i.test(error.message)) {
      throw new Error('No encontramos ese número. Si es tu primera vez, regístrate.')
    }
    throw error
  }
  const profile = await getMyProfile()
  // El nombre funciona como una verificación extra: basta con que coincida el primer nombre
  const typedFirst = simplifyName(input.full_name).split(' ')[0] ?? ''
  if (!profile || !typedFirst || !simplifyName(profile.full_name).includes(typedFirst)) {
    await supabase.auth.signOut()
    throw new Error('El nombre no coincide con el registrado para ese número')
  }
  return profile
}

/** Devuelve el id del usuario actual o null si es visitante. */
export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user.id ?? null
}

/**
 * Para "Reportar emergencia" sin cuenta: si no hay sesión, crea una anónima
 * en silencio (requiere "Allow anonymous sign-ins", que ya está activado).
 */
export async function ensureSession(fullName = 'Vecino'): Promise<string> {
  const current = await getUserId()
  if (current) return current
  const { data, error } = await supabase.auth.signInAnonymously({
    options: { data: { full_name: fullName } },
  })
  if (error || !data.user) throw error ?? new Error('No se pudo iniciar sesión')
  return data.user.id
}

export async function getMyProfile(): Promise<Profile | null> {
  const userId = await getUserId()
  if (!userId) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data as Profile | null
}

/** true si ya llenó nombre y teléfono (si no, mostrar el formulario rápido). */
export function isProfileComplete(p: Profile | null): boolean {
  return !!p && !!p.whatsapp && p.full_name !== 'Vecino'
}

export async function updateMyProfile(
  changes: Partial<Pick<Profile, 'full_name' | 'whatsapp' | 'has_whatsapp' | 'region' | 'district' | 'neighborhood' | 'avatar_url'>>,
): Promise<Profile> {
  const userId = await getUserId()
  if (!userId) throw new Error('Inicia sesión primero')
  const { data, error } = await supabase
    .from('profiles')
    .update(changes)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

/** Cierra sesión. Puede volver a entrar con su nombre y teléfono. */
export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

// =====================================================================
// CATEGORÍAS
// =====================================================================

export async function getCategories(section?: Section): Promise<Category[]> {
  let q = supabase.from('categories').select('*').order('name')
  if (section) q = q.in('section', [section, 'ambos'])
  const { data, error } = await q
  if (error) throw error
  return data as Category[]
}

// =====================================================================
// IMÁGENES (bucket "images", carpeta del usuario)
// =====================================================================

export async function uploadImages(files: File[]): Promise<string[]> {
  if (!files.length) return []
  const userId = await ensureSession()
  const urls: string[] = []
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').slice(-60)
    const path = `${userId}/${crypto.randomUUID()}-${safeName}`
    const { error } = await supabase.storage
      .from('images')
      .upload(path, file, { contentType: file.type, upsert: false })
    if (error) throw error
    urls.push(supabase.storage.from('images').getPublicUrl(path).data.publicUrl)
  }
  return urls
}

// =====================================================================
// PUBLICACIONES  (catálogo = 'servicios', ayuda vecinal = 'comunidad')
// =====================================================================

export async function listPublications(f: PublicationFilters): Promise<PublicationFeedItem[]> {
  let q = supabase
    .from('publications_feed')
    .select('*')
    .eq('section', f.section)
    .eq('status', 'activa')
    .order('created_at', { ascending: false })
    .limit(100)

  const search = f.search?.trim()
  if (search) {
    if (search.startsWith('#')) {
      q = q.contains('tags', [cleanTag(search)])
    } else {
      const s = search.replace(/[,()%*]/g, ' ')
      q = q.or(`title.ilike.%${s}%,description.ilike.%${s}%`)
    }
  }
  if (f.categoryId) q = q.eq('category_id', f.categoryId)
  if (f.region) q = q.eq('region', f.region)
  if (f.district) q = q.eq('district', f.district)
  if (f.intent) q = q.eq('intent', f.intent)
  if (f.type) q = q.eq('type', f.type)
  if (f.minRating) q = q.gte('avg_rating', f.minRating)
  if (f.emergencySupport) q = q.eq('emergency_support', true)

  const { data, error } = await q
  if (error) throw error
  return data as PublicationFeedItem[]
}

export async function getPublication(id: string): Promise<PublicationFeedItem | null> {
  const { data, error } = await supabase
    .from('publications_feed')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as PublicationFeedItem | null
}

export async function createPublication(input: PublicationInput, photos: File[] = []): Promise<Publication> {
  const profile = await getMyProfile()
  if (!profile || !isProfileComplete(profile)) {
    throw new Error('Completa tu nombre y teléfono antes de publicar')
  }
  const image_urls = await uploadImages(photos)
  const { data, error } = await supabase
    .from('publications')
    .insert({
      section: input.section,
      type: input.type,
      intent: input.intent,
      title: input.title.trim(),
      description: requireText(input.description, 'Escribe una descripción'),
      category_id: input.category_id ?? null,
      tags: (input.tags ?? []).map(cleanTag).filter(Boolean),
      price: input.section === 'comunidad' ? null : input.price ?? null,
      location: input.location ?? profile.neighborhood,
      region: input.region ?? profile.region,
      district: input.district ?? profile.district,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      emergency_support: input.emergency_support ?? false,
      contact_whatsapp: normalizePhone(input.contact_whatsapp ?? profile.whatsapp ?? ''),
      has_whatsapp: profile.has_whatsapp,
      image_urls,
    })
    .select()
    .single()
  if (error) throw error
  return data as Publication
}

export async function updatePublication(
  id: string,
  changes: Partial<PublicationInput> & { status?: Publication['status'] },
): Promise<Publication> {
  const patch: Record<string, unknown> = { ...changes }
  if (changes.tags) patch.tags = changes.tags.map(cleanTag).filter(Boolean)
  if (changes.section === 'comunidad') patch.price = null
  const { data, error } = await supabase
    .from('publications')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Publication
}

export async function deletePublication(id: string): Promise<void> {
  const { error } = await supabase.from('publications').delete().eq('id', id)
  if (error) throw error
}

/** "Mis publicaciones" y "Mis solicitudes" (filtra por section/intent en la UI). */
export async function myPublications(): Promise<PublicationFeedItem[]> {
  const userId = await getUserId()
  if (!userId) return []
  const { data, error } = await supabase
    .from('publications_feed')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as PublicationFeedItem[]
}

// =====================================================================
// RESEÑAS  ("Visto Bueno Vecinal")
// =====================================================================

export async function listReviews(publicationId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('publication_id', publicationId)
    .order('created_at', { ascending: false })
  if (error) throw error
  const reviews = data as Review[]

  // nombres de quienes reseñaron
  const ids = [...new Set(reviews.map((r) => r.author_id))]
  if (ids.length) {
    const { data: people } = await supabase.from('profiles').select('id, full_name').in('id', ids)
    const rows = (people ?? []) as { id: string; full_name: string }[]
    const names = new Map<string, string>(rows.map((p) => [p.id, p.full_name]))
    reviews.forEach((r) => (r.author_name = names.get(r.author_id) ?? 'Vecino'))
  }
  return reviews
}

export async function addReview(publicationId: string, rating: number, comment?: string): Promise<void> {
  const profile = await getMyProfile()
  if (!isProfileComplete(profile)) throw new Error('Completa tu perfil para calificar')
  const { error } = await supabase.from('reviews').insert({
    publication_id: publicationId,
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    comment: comment?.trim() || null,
  })
  if (error) {
    if (error.code === '23505') throw new Error('Ya calificaste esta publicación')
    if (error.code === '42501') throw new Error('No puedes calificar tu propia publicación')
    throw error
  }
}

// =====================================================================
// EMERGENCIAS
// =====================================================================

export async function listEmergencies(opts: { region?: string; district?: string; onlyActive?: boolean } = {}): Promise<EmergencyFeedItem[]> {
  let q = supabase
    .from('emergencies_feed')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (opts.region) q = q.eq('region', opts.region)
  if (opts.district) q = q.eq('district', opts.district)
  if (opts.onlyActive ?? true) q = q.neq('status', 'resuelta')
  const { data, error } = await q
  if (error) throw error
  return data as EmergencyFeedItem[]
}

export async function getEmergency(id: string): Promise<EmergencyFeedItem | null> {
  const { data, error } = await supabase
    .from('emergencies_feed')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as EmergencyFeedItem | null
}

/** Funciona aunque la persona NO esté registrada (crea sesión anónima). */
export async function reportEmergency(input: EmergencyInput, photos: File[] = []): Promise<Emergency> {
  await ensureSession(input.reporter_name || 'Vecino')
  const profile = await getMyProfile()
  const image_urls = await uploadImages(photos)
  const { data, error } = await supabase
    .from('emergencies')
    .insert({
      emergency_type: input.emergency_type,
      description: requireText(input.description, 'Describe la emergencia'),
      // location es obligatoria en la tabla: si no la dan, usamos la referencia o el distrito
      location:
        input.location?.trim() || profile?.neighborhood || input.district || profile?.district || 'Sin referencia',
      region: input.region ?? profile?.region ?? null,
      district: input.district ?? profile?.district ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      contact_phone: normalizePhone(input.contact_phone ?? profile?.whatsapp ?? '') || null,
      image_urls,
    })
    .select()
    .single()
  if (error) throw error
  return data as Emergency
}

export async function updateEmergencyStatus(id: string, status: EmergencyStatus): Promise<void> {
  const { error } = await supabase.from('emergencies').update({ status }).eq('id', id)
  if (error) throw error
}

/** Botón "Yo ayudo". */
export async function volunteerForEmergency(emergencyId: string, message?: string): Promise<void> {
  await ensureSession()
  const { error } = await supabase
    .from('emergency_volunteers')
    .insert({ emergency_id: emergencyId, message: message ?? null })
  if (error && error.code !== '23505') throw error // 23505 = ya se había ofrecido
}

/** Escucha emergencias nuevas/actualizadas en vivo. Devuelve función para dejar de escuchar. */
export function subscribeToEmergencies(onChange: () => void): () => void {
  const channel: RealtimeChannel = supabase
    .channel('emergencias-en-vivo')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencies' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_volunteers' }, onChange)
    .subscribe()
  return () => {
    void supabase.removeChannel(channel)
  }
}

// =====================================================================
// UTILIDADES DE CONTACTO
// =====================================================================

/** Deja solo dígitos y agrega 51 si es un celular peruano de 9 dígitos. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 9 && digits.startsWith('9')) return `51${digits}`
  return digits
}

export function whatsappLink(phone: string, message = ''): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${normalizePhone(phone)}${text}`
}

export function callLink(phone: string): string {
  return `tel:+${normalizePhone(phone)}`
}

export function smsLink(phone: string, message = ''): string {
  return `sms:+${normalizePhone(phone)}${message ? `?body=${encodeURIComponent(message)}` : ''}`
}

function requireText(value: string | undefined, message: string): string {
  const text = value?.trim()
  if (!text) throw new Error(message)
  return text
}

function cleanTag(tag: string): string {
  return tag.trim().replace(/^#+/, '').toLowerCase().replace(/\s+/g, '-')
}
