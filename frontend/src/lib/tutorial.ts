// Control del tutorial: se muestra solo la primera vez, y se puede volver a
// abrir desde cualquier botón (por ejemplo, "¿Cómo se usa?" en el Footer).

const VISTO_KEY = 'vecinos-tutorial-visto'
export const EVENTO_ABRIR_TUTORIAL = 'abrir-tutorial'

export function tutorialYaVisto(): boolean {
  try {
    return localStorage.getItem(VISTO_KEY) === 'si'
  } catch {
    return true // si el navegador bloquea el almacenamiento, no molestar
  }
}

export function marcarTutorialVisto(): void {
  try {
    localStorage.setItem(VISTO_KEY, 'si')
  } catch {
    // sin almacenamiento: no pasa nada
  }
}

/** Abre el tutorial desde cualquier parte: onClick={abrirTutorial} */
export function abrirTutorial(): void {
  window.dispatchEvent(new Event(EVENTO_ABRIR_TUTORIAL))
}
