import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'

import App from '@/app/App.vue'
import { router } from '@/app/router'
import { runtime } from '@/config/runtime'
import '@/style.css'

async function bootstrap() {
  if (runtime.apiMode === 'mock') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest: 'warn',
    })
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.use(Vant)

  app.mount('#app')
}

void bootstrap()
