import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import type { App } from 'vue'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST?.replace(/['"]/g, '') || 'localhost',
  wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 80,
  wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
})
console.log('Echo opts:', echo.options);
export default function (app: App) {
  app.config.globalProperties.$echo = echo
}

export { echo }
