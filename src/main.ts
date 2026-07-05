import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './styles.css'

import DashboardView from './views/DashboardView.vue'
import ServicesView from './views/ServicesView.vue'
import LogsView from './views/LogsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/services', component: ServicesView },
    { path: '/logs', component: LogsView },
  ],
})

createApp(App).use(router).mount('#app')
