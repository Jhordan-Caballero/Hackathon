import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import './MiniChat.css'

export default function MiniChat() {
  const [input, setInput] = useState('')
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(false)

  // Solo se ejecuta al enviar el formulario, nunca al cargar
  async function enviarMensaje(e) {
    e.preventDefault()
    const texto = input.trim()
    if (!texto || cargando) return

    setMensajes(prev => [...prev, { autor: 'tu', texto }])
    setInput('')
    setCargando(true)

    const { data, error } = await supabase.functions.invoke('chat', {
      body: { message: texto }
    })

    setCargando(false)

    if (error) {
      console.error(error)
      setMensajes(prev => [...prev, { autor: 'ia', texto: 'Hubo un error, intenta de nuevo.' }])
      return
    }

    setMensajes(prev => [...prev, { autor: 'ia', texto: data.reply }])
  }

  return (
    <section className="minichat">
      <h3 className="minichat__titulo">Pregunta al asistente del barrio</h3>

      <div className="minichat__mensajes">
        {mensajes.map((m, i) => (
          <div
            key={i}
            className={`minichat__burbuja minichat__burbuja--${m.autor}`}
          >
            {m.texto}
          </div>
        ))}
        {cargando && <p className="minichat__cargando">Escribiendo...</p>}
      </div>

      <form className="minichat__form" onSubmit={enviarMensaje}>
        <input
          className="minichat__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ej: Quiero 3 locales que vendan comida"
        />
        <button className="minichat__boton" type="submit" disabled={cargando}>
          Enviar
        </button>
      </form>
    </section>
  )
}