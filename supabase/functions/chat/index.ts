import { createClient } from "npm:@supabase/supabase-js@2";

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")!;
// Se prueban en orden: si uno está saturado (503/429), se usa el siguiente
const MODELOS = ["gemini-3.1-flash-lite", "gemini-flash-lite-latest"];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Zonas oficiales de la página; sirven para corregir errores al escribir
const ZONAS = [
  "Arequipa", "Cayma", "Cerro Colorado", "Characato", "José Luis Bustamante y Rivero",
  "Yanahuara", "Miraflores", "Mariano Melgar", "Paucarpata", "Sabandía", "Sachaca",
  "Socabaya", "Tiabaya", "La Joya", "Alto Selva Alegre", "Cusco", "Lima", "Piura", "La Libertad",
];

const SYSTEM = `Eres el asistente de la página del barrio. Responde en español, en texto simple.
REGLAS ESTRICTAS:
- Solo puedes mencionar negocios, teléfonos, precios y direcciones que aparezcan literalmente en el resultado de una herramienta.
- Si el resultado tiene "encontrados" con elementos, lista esos elementos.
- Si "encontrados" está vacío, di exactamente: "No hay registros para esa búsqueda." y no inventes nada.
- Nunca presentes "alternativas" como si fueran la respuesta exacta. Si las mencionas, aclara que son de otra zona o categoría y cita su nombre real.
- Máximo 3 opciones, cada una en una línea que empiece con "- ".
- No saludes, no te despidas, no uses markdown.`;

const ubicacionProp = {
  type: "STRING",
  description: "solo el distrito o ciudad. Ejemplo: Cayma, Arequipa. Opcional.",
};

const tools = [{
  functionDeclarations: [
    {
      name: "buscar_servicios",
      description: "Busca negocios, servicios, productos o promociones ofrecidos en el barrio",
      parameters: {
        type: "OBJECT",
        properties: {
          texto: { type: "STRING", description: "solo el producto o servicio, sin la zona. palabras clave, por ejemplo: pan, gimnasio, promo, utp" },
          ubicacion: ubicacionProp,
        },
      },
    },
    {
      name: "buscar_comunidad",
      description: "Busca en la comunidad: pedidos de ayuda, intercambios, donaciones y ofrecimientos entre vecinos",
      parameters: {
        type: "OBJECT",
        properties: {
          texto: { type: "STRING", description: "palabras clave, por ejemplo: martillo, inglés, compras" },
          ubicacion: ubicacionProp,
        },
      },
    },
    {
      name: "buscar_emergencias",
      description: "Busca emergencias o acontecimientos importantes reportados en el barrio",
      parameters: {
        type: "OBJECT",
        properties: {
          tipo: { type: "STRING", description: "tipo de emergencia, por ejemplo: incendio, sismo" },
          ubicacion: ubicacionProp,
        },
      },
    },
  ],
}];

const SINONIMOS: Record<string, string[]> = {
  comida: ["comida", "almuerzo", "menu", "restaurant", "restaurante", "pollo", "pan", "panaderia", "panadero", "cafeteria", "cafe", "desayuno", "pizza", "postre", "pastel", "torta"],
  educacion: ["educacion", "clase", "clases", "profesor", "tutor", "ingles", "matematica", "refuerzo", "curso"],
  productos: ["producto", "tienda", "bodega", "ropa", "herramienta", "articulo"],
  gimnasio: ["gym", "gimnasio", "ejercicio", "fitness"],
  promo: ["promo", "promocion", "oferta", "descuento"],
};

const PALABRAS_VACIAS = new Set(["hay", "una", "uno", "un", "de", "del", "la", "el", "por", "en", "zona", "alguien", "algun", "alguna", "que", "vende", "vendan", "puesto", "puestos", "a", "y", "o", "para", "con", "las", "los", "locales", "local", "pa", "servicios", "servicio"]);

const CIUDADES = ["arequipa", "cusco", "lima", "piura", "la libertad"];

// ---------- Normalización y tolerancia a errores ----------

function normalizar(s: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function esCiudad(u?: string) {
  return !!u && CIUDADES.includes(normalizar(u));
}
// Distancia de Levenshtein: cambios de letra necesarios para igualar dos palabras
function distancia(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return d[m][n];
}

function palabrasCoinciden(buscada: string, candidata: string): boolean {
  if (candidata.includes(buscada) || buscada.includes(candidata)) return true;
  const tolerancia = buscada.length <= 4 ? 1 : 2;
  return distancia(buscada, candidata) <= tolerancia;
}

// Coincide si alguna palabra buscada aparece (aprox.) en el texto destino
function textoCoincide(textoBuscado: string, textoDestino: string): boolean {
  const destino = normalizar(textoDestino).split(" ");
  const buscadas = normalizar(textoBuscado).split(" ").filter((p) => p.length > 2);
  if (buscadas.length === 0) return true;
  return buscadas.some((b) => destino.some((d) => palabrasCoinciden(b, d)));
}

// Corrige la zona escrita contra la lista oficial (tolera errores de escritura)
function corregirZona(entrada?: string): string | undefined {
  if (!entrada) return undefined;
  const limpia = normalizar(entrada);
  let mejor = entrada;
  let menor = Infinity;
  for (const z of ZONAS) {
    const d = distancia(limpia, normalizar(z));
    if (d < menor) { menor = d; mejor = z; }
  }
  return menor <= Math.max(3, Math.floor(limpia.length / 3)) ? mejor : entrada;
}

function coincideUbicacion(p: any, ubicacion?: string): boolean {
  if (!ubicacion) return true;
  return textoCoincide(ubicacion, p.location ?? "");
}

// ---------- Búsquedas ----------

// Expande las palabras con sinónimos (pan -> panaderia, etc.)
function terminosDe(texto: string): string[] {
  const claves = normalizar(texto ?? "")
    .split(" ")
    .filter((p) => p.length > 2 && !PALABRAS_VACIAS.has(p));

  const terminos = new Set<string>(claves);
  for (const [cat, lista] of Object.entries(SINONIMOS)) {
    if (claves.some((c) => lista.includes(c))) {
      lista.forEach((s) => terminos.add(s));
      terminos.add(cat);
    }
  }
  return [...terminos];
}

function resolver(todos: any[], terminos: string[], textoDe: (p: any) => string) {
  const coinciden = todos.filter(
    (p) => terminos.length === 0 || terminos.some((t) => textoCoincide(t, textoDe(p))),
  );
  return { encontrados: coinciden.slice(0, 5), total: coinciden.length };
}

async function buscarServicios(supabase: any, args: any) {
  // Busca en servicios y en comunidad, porque una promo puede estar en cualquiera
  const { data, error } = await supabase.from("publications")
    .select("title, description, tags, price, location, contact_whatsapp, section, categories(name, slug)")
    .in("section", ["servicios", "comunidad"])
    .eq("status", "activa")
    .limit(200);
  if (error) throw new Error("Supabase: " + error.message);

  const ubicacion = esCiudad(args?.ubicacion) ? undefined : corregirZona(args?.ubicacion);
  const filtrados = (data ?? []).filter((p: any) => coincideUbicacion(p, ubicacion));

  return resolver(
    filtrados,
    terminosDe(args?.texto),
    (p) => `${p.title} ${p.description} ${(p.tags ?? []).join(" ")} ${p.categories?.name ?? ""} ${p.categories?.slug ?? ""}`,
  );
}

async function buscarComunidad(supabase: any, args: any) {
  const { data, error } = await supabase.from("publications")
    .select("title, description, tags, type, intent, location, contact_whatsapp")
    .eq("section", "comunidad")
    .eq("status", "activa")
    .limit(200);
  if (error) throw new Error("Supabase: " + error.message);

  const ubicacion = corregirZona(args?.ubicacion);
  const filtrados = (data ?? []).filter((p: any) => coincideUbicacion(p, ubicacion));

  return resolver(
    filtrados,
    terminosDe(args?.texto),
    (p) => `${p.title} ${p.description} ${(p.tags ?? []).join(" ")} ${p.type} ${p.intent}`,
  );
}

async function buscarEmergencias(supabase: any, args: any) {
  const { data, error } = await supabase.from("emergencies_feed")
    .select("emergency_type, description, location, created_at, volunteers_count")
    .eq("status", "activa")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error("Supabase: " + error.message);

  const ubicacion = corregirZona(args?.ubicacion);
  const filtrados = (data ?? []).filter((e: any) => coincideUbicacion(e, ubicacion));
  const terminos = args?.tipo ? [normalizar(args.tipo)] : [];

  return resolver(filtrados, terminos, (e) => `${e.emergency_type} ${e.description}`);
}

const HERRAMIENTAS: Record<string, (s: any, a: any) => Promise<any>> = {
  buscar_servicios: buscarServicios,
  buscar_comunidad: buscarComunidad,
  buscar_emergencias: buscarEmergencias,
};

// ---------- Gemini ----------

// Llama a Gemini probando cada modelo; pasa al siguiente si hay saturación
async function llamarGemini(payload: string): Promise<any> {
  let ultimo: any = null;
  for (const modelo of MODELOS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
        body: payload,
        signal: AbortSignal.timeout(35000),
      },
    );
    const data = await res.json();
    if (res.ok && data.candidates) return data;
    ultimo = { status: res.status, data };
    if (res.status !== 503 && res.status !== 429) break;
  }
  throw new Error("Gemini: " + JSON.stringify(ultimo));
}

// ---------- Servidor ----------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: cors });

  try {
    const raw = await req.text();
    if (!raw) {
      return Response.json({ error: "Body vacío" }, { status: 400, headers: cors });
    }

    const body = JSON.parse(raw);
    if (!body.message) {
      return Response.json({ error: "Falta el campo 'message'" }, { status: 400, headers: cors });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const contents: any[] = [{ role: "user", parts: [{ text: body.message }] }];
    const publicaciones: any[] = [];

    for (let i = 0; i < 3; i++) {
      const data = await llamarGemini(JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents,
        tools,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.2,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }));

      const parts = data.candidates[0].content.parts;
      const call = parts.find((p: any) => p.functionCall)?.functionCall;

      if (!call) {
        const reply = parts.map((p: any) => p.text ?? "").join("");
        return Response.json({ reply, rows: publicaciones }, { headers: cors });
      }

      contents.push({ role: "model", parts });

      const ejecutar = HERRAMIENTAS[call.name];
      const result = ejecutar
        ? await ejecutar(supabase, call.args ?? {})
        : { error: "herramienta desconocida" };

      if (result?.encontrados) publicaciones.push(...result.encontrados);

      contents.push({
        role: "user",
        parts: [{ functionResponse: { name: call.name, response: { result } } }],
      });
    }

    return Response.json(
      { reply: "No pude responder en este momento.", rows: publicaciones },
      { headers: cors },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: String(err) }, { status: 500, headers: cors });
  }
});