import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './styles.css'

import ProjectListView   from './views/ProjectListView.vue'
import DashboardView     from './views/DashboardView.vue'
import ServicesView      from './views/ServicesView.vue'
import LogsView          from './views/LogsView.vue'
import RepositoriesView  from './views/RepositoriesView.vue'
import ArtifactsView     from './views/ArtifactsView.vue'
import ConfigView        from './views/ConfigView.vue'
import DataView          from './views/DataView.vue'

import { selectProject, activeProjectId } from './stores/project'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',        redirect: '/projects' },
    { path: '/projects', component: ProjectListView },
    {
      path: '/projects/:id',
      redirect: to => `/projects/${to.params.id}/dashboard`,
    },
    { path: '/projects/:id/dashboard',    component: DashboardView },
    { path: '/projects/:id/services',     component: ServicesView },
    { path: '/projects/:id/logs',         component: LogsView },
    { path: '/projects/:id/repositories', component: RepositoriesView },
    { path: '/projects/:id/artifacts',    component: ArtifactsView },
    { path: '/projects/:id/config',       component: ConfigView },
    { path: '/projects/:id/data',         component: DataView },
  ],
})

// Sync active project from URL so deep links work
router.beforeEach((to) => {
  const id = to.params.id as string | undefined
  if (id && id !== activeProjectId.value) selectProject(id)
})

createApp(App).use(router).mount('#app')
