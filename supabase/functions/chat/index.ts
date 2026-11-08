import { createClient } from "npm:@supabase/supabase-js@2";

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")!;
const MODEL = "gemini-3.1-flash-lite";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM = `Eres el asistente de la página del barrio. Responde en español, en texto simple, sin markdown.
Usa SOLO los datos que devuelven las herramientas. No inventes teléfonos, precios ni direcciones.
Para servicios y negocios (comida, educación, productos) usa buscar_servicios.
Para ayuda, intercambios, donaciones o clases entre vecinos usa buscar_comunidad.
Para emergencias o acontecimientos importantes usa buscar_emergencias.
Interpreta preguntas cortas o ambiguas buscando palabras clave.
Si la herramienta devuelve "alternativas" y no hay coincidencias exactas, dilo claramente y ofrece esas alternativas como opciones cercanas.
Nunca respondas solo "no encontré".`;

const ubicacionProp = {
  type: "STRING",
  description: "Barrio o zona, por ejemplo: Sector Las Palmas. Opcional.",
};

const tools = [{
  functionDeclarations: [
    {
      name: "buscar_servicios",
      description: "Busca negocios o servicios ofrecidos en el barrio (comida, educación, productos)",
      parameters: {
        type: "OBJECT",
        properties: {
          texto: { type: "STRING", description: "palabras clave, por ejemplo: pan, gimnasio, clases" },
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
};

const PALABRAS_VACIAS = new Set(["hay", "una", "uno", "un", "de", "del", "la", "el", "por", "en", "zona", "alguien", "algun", "alguna", "que", "vende", "vendan", "puesto", "puestos", "a", "y", "o", "para", "con", "las", "los", "locales", "local"]);

function sinTildes(s: string) {
  return (s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function terminosDe(texto: string): Set<string> {
  const claves = sinTildes(texto ?? "")
    .split(/[^a-z0-9ñ]+/)
    .filter((p) => p.length > 2 && !PALABRAS_VACIAS.has(p));

  const terminos = new Set<string>(claves);
  for (const [cat, lista] of Object.entries(SINONIMOS)) {
    if (claves.some((c) => lista.includes(c))) {
      lista.forEach((s) => terminos.add(s));
      terminos.add(cat);
    }
  }
  return terminos;
}

function resolver(todos: any[], terminos: Set<string>, textoDe: (p: any) => string) {
  const coinciden = todos.filter(
    (p) => terminos.size === 0 || [...terminos].some((t) => sinTildes(textoDe(p)).includes(t)),
  );
  if (coinciden.length > 0) return { encontrados: coinciden.slice(0, 5) };
  return {
    encontrados: [],
    alternativas: todos.slice(0, 5),
    nota: "No hubo coincidencias exactas; ofrece estas alternativas como opciones cercanas.",
  };
}

async function buscarServicios(supabase: any, args: any) {
  let q = supabase.from("publications")
    .select("title, description, price, location, contact_whatsapp, categories!inner(name, slug)")
    .eq("section", "servicios")
    .eq("status", "activa")
    .limit(100);
  if (args?.ubicacion) q = q.ilike("location", `%${args.ubicacion}%`);

  const { data, error } = await q;
  if (error) throw new Error("Supabase: " + error.message);

  return resolver(
    data ?? [],
    terminosDe(args?.texto),
    (p) => `${p.title} ${p.description} ${p.categories?.name} ${p.categories?.slug}`,
  );
}

async function buscarComunidad(supabase: any, args: any) {
  let q = supabase.from("publications")
    .select("title, description, type, intent, location, contact_whatsapp")
    .eq("section", "comunidad")
    .eq("status", "activa")
    .limit(100);
  if (args?.ubicacion) q = q.ilike("location", `%${args.ubicacion}%`);

  const { data, error } = await q;
  if (error) throw new Error("Supabase: " + error.message);

  return resolver(
    data ?? [],
    terminosDe(args?.texto),
    (p) => `${p.title} ${p.description} ${p.type} ${p.intent}`,
  );
}

async function buscarEmergencias(supabase: any, args: any) {
  let q = supabase.from("emergencies_feed")
    .select("emergency_type, description, location, created_at, volunteers_count")
    .eq("status", "activa")
    .order("created_at", { ascending: false })
    .limit(100);
  if (args?.ubicacion) q = q.ilike("location", `%${args.ubicacion}%`);

  const { data, error } = await q;
  if (error) throw new Error("Supabase: " + error.message);

  const terminos = args?.tipo ? new Set([sinTildes(args.tipo)]) : new Set<string>();
  return resolver(data ?? [], terminos, (e) => `${e.emergency_type} ${e.description}`);
}

const HERRAMIENTAS: Record<string, (s: any, a: any) => Promise<any>> = {
  buscar_servicios: buscarServicios,
  buscar_comunidad: buscarComunidad,
  buscar_emergencias: buscarEmergencias,
};

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
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents,
            tools,
            generationConfig: {
              maxOutputTokens: 1024,
              thinkingConfig: { thinkingLevel: "low" },
            },
          }),
          signal: AbortSignal.timeout(35000),
        },
      );

      const data = await res.json();
      if (!res.ok || !data.candidates) {
        throw new Error("Gemini: " + JSON.stringify(data));
      }

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