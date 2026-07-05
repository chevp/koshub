import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import './styles.css';
import DashboardView from './views/DashboardView.vue';
import ServicesView from './views/ServicesView.vue';
import LogsView from './views/LogsView.vue';
import RepositoriesView from './views/RepositoriesView.vue';
import ArtifactsView from './views/ArtifactsView.vue';
import ConfigView from './views/ConfigView.vue';
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: DashboardView },
        { path: '/services', component: ServicesView },
        { path: '/logs', component: LogsView },
        { path: '/repositories', component: RepositoriesView },
        { path: '/artifacts', component: ArtifactsView },
        { path: '/config', component: ConfigView },
    ],
});
createApp(App).use(router).mount('#app');
