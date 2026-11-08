import { useState } from 'react';

function AIChatWidget({ onSend }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte?',
        },
    ]);

    const handleSend = async (e) => {
        e.preventDefault();

        const text = message.trim();
        if (!text || isLoading) return;

        setMessages((prev) => [
            ...prev,
            { role: 'user', content: text },
        ]);

        setMessage('');
        setIsLoading(true);

        try {
            if (onSend) {
                const response = await onSend(text);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: response || 'No recibí una respuesta.',
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: 'El asistente todavía está pendiente de conexión con el backend.',
                    },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Ocurrió un problema. Inténtalo nuevamente.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">

            {/* Ventana del chat */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[min(360px,calc(100vw-2rem))] h-[480px] max-h-[70vh] bg-white rounded-2xl border border-brand-border shadow-2xl flex flex-col overflow-hidden">

                    {/* Encabezado */}
                    <div className="bg-brand-accent text-white px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                                ✦
                            </div>

                            <div>
                                <p className="font-semibold text-sm">Asistente virtual</p>
                                <p className="text-xs text-white/70">Aquí para ayudarte</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white text-xl"
                            aria-label="Cerrar chat"
                        >
                            ×
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-cream/50">
                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${item.role === 'user'
                                            ? 'bg-brand-accent text-white rounded-br-sm'
                                            : 'bg-white border border-brand-border text-brand-dark rounded-bl-sm'
                                        }`}
                                >
                                    {item.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="text-xs text-brand-muted">
                                El asistente está escribiendo...
                            </div>
                        )}
                    </div>

                    {/* Entrada de mensaje */}
                    <form
                        onSubmit={handleSend}
                        className="p-3 border-t border-brand-border bg-white flex gap-2"
                    >
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 min-w-0 bg-brand-soft rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-accent/20"
                        />

                        <button
                            type="submit"
                            disabled={!message.trim() || isLoading}
                            className="w-11 h-11 shrink-0 rounded-xl bg-brand-accent text-white flex items-center justify-center hover:bg-brand-accent-hover disabled:opacity-40 transition"
                            aria-label="Enviar mensaje"
                        >
                            ↑
                        </button>
                    </form>
                </div>
            )}

            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-brand-accent text-white shadow-lg hover:scale-105 hover:bg-brand-accent-hover transition-all flex items-center justify-center text-2xl"
                aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
            >
                {isOpen ? '×' : '✦'}
            </button>
        </div>
    );
}

export default AIChatWidget;
