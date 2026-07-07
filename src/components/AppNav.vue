<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <span class="brand-name">Koshub</span>
    </div>

    <nav class="sidebar-scroll">
      <!-- Projects -->
      <div class="nav-section">
        <div class="nav-label">Workspaces</div>
        <div class="ws-list">
          <div v-if="loading" class="ws-empty">Loading…</div>
          <div v-else-if="loadError" class="ws-empty err">{{ loadError }}</div>

          <div
            v-for="p in projects"
            :key="p.id"
            class="ws-row"
            :class="{ active: p.id === activeProjectId }"
            @contextmenu.prevent="openMenu(p, $event)"
          >
            <button class="ws-row-main" type="button"
                    :title="p.namespace + '/' + p.name"
                    @click="open(p.id)">
              <i class="fa-regular fa-folder"></i>
              <span class="ws-row-name">{{ p.name }}</span>
              <span class="ws-row-ns">{{ p.namespace }}</span>
            </button>
            <button class="ws-row-menu" type="button" title="Project options"
                    @click.stop="openMenu(p, $event)">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </div>

          <div v-if="!loading && !loadError && !projects.length" class="ws-empty">
            No projects yet.
          </div>

          <button class="add-project" type="button" @click="showAdd = true">
            <i class="fa-solid fa-plus"></i>
            <span>Add Project…</span>
          </button>
        </div>
      </div>

      <!-- Monitoring -->
      <div class="nav-section">
        <div class="nav-label">Monitoring</div>
        <router-link class="nav-item" :to="route('dashboard')">
          <i class="fa-solid fa-gauge-high"></i><span>Dashboard</span>
        </router-link>
        <router-link class="nav-item" :to="route('services')">
          <i class="fa-solid fa-cubes"></i><span>Services</span>
        </router-link>
        <router-link class="nav-item" :to="route('logs')">
          <i class="fa-solid fa-terminal"></i><span>Logs</span>
        </router-link>
      </div>

      <!-- Registry -->
      <div class="nav-section">
        <div class="nav-label">Registry</div>
        <router-link class="nav-item" :to="route('repositories')">
          <i class="fa-solid fa-database"></i><span>Repositories</span>
        </router-link>
        <router-link class="nav-item" :to="route('artifacts')">
          <i class="fa-solid fa-boxes-stacked"></i><span>Artifacts</span>
        </router-link>
      </div>

      <!-- Configuration -->
      <div class="nav-section">
        <div class="nav-label">Configuration</div>
        <router-link class="nav-item" :to="route('config')">
          <i class="fa-solid fa-sliders"></i><span>Config</span>
        </router-link>
        <router-link class="nav-item" :to="route('data')">
          <i class="fa-solid fa-table"></i><span>Data</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-bottom">
      <button class="nav-item" type="button">
        <i class="fa-solid fa-gear"></i>
        <span>Settings</span>
      </button>
    </div>
  </aside>

  <!-- Context menu -->
  <div v-if="menu" class="ctx-menu" :style="{ left: menu.x + 'px', top: menu.y + 'px' }">
    <button class="ctx-item" type="button" @click="open(menu.project.id); closeMenu()">
      <i class="fa-regular fa-folder-open"></i><span>Open</span>
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item danger" type="button" @click="del(menu.project.id)">
      <i class="fa-regular fa-trash-can"></i><span>Remove</span>
    </button>
  </div>

  <!-- Add Project Modal -->
  <AddProjectModal
    v-if="showAdd"
    @close="showAdd = false"
    @created="onCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AddProjectModal from './AddProjectModal.vue'
import {
  projects, activeProjectId, loading, loadError,
  loadProjects, selectProject, removeProject,
} from '../stores/project'
import type { ProjectSummary } from '../api/kosServices'

const router = useRouter()
const showAdd = ref(false)

onMounted(() => {
  loadProjects()
  document.addEventListener('click', onClickOutside, true)
})
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))

function route(view: string): string {
  return activeProjectId.value
    ? `/projects/${activeProjectId.value}/${view}`
    : '/projects'
}

function open(id: string) {
  selectProject(id)
  router.push(`/projects/${id}/dashboard`)
  closeMenu()
}

async function del(id: string) {
  closeMenu()
  await removeProject(id)
  if (!activeProjectId.value) router.push('/projects')
}

function onCreated(id: string) {
  showAdd.value = false
  router.push(`/projects/${id}/dashboard`)
}

interface MenuState { project: ProjectSummary; x: number; y: number }
const menu = ref<MenuState | null>(null)

function openMenu(project: ProjectSummary, e: MouseEvent) {
  menu.value = { project, x: e.clientX, y: e.clientY }
}
function closeMenu() { menu.value = null }
function onClickOutside() { if (menu.value) closeMenu() }
</script>

<style scoped>
.sidebar {
  width: 272px;
  flex-shrink: 0;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--border);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 12px;
  border-bottom: 1px solid var(--border);
}

.brand-name {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.01em;
  color: var(--text);
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nav-section { display: flex; flex-direction: column; gap: 2px; }

.nav-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  padding: 8px 10px 4px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background 0.1s, color 0.1s;
  &:hover { background: var(--bg-hover); color: var(--text); }
  &.router-link-active { background: var(--bg-active); color: var(--text); }
  i { font-size: 12px; opacity: 0.75; width: 14px; text-align: center; }
  &.router-link-active i, &:hover i { color: var(--accent); opacity: 1; }
}

.ws-list { display: flex; flex-direction: column; gap: 2px; }

.ws-row {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  transition: background 0.1s;
  &:hover { background: var(--bg-hover); }
  &:hover .ws-row-menu { opacity: 1; }
  &.active .ws-row-name { color: var(--accent); }
}

.ws-row-main {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  padding: 7px 4px 7px 10px;
  background: transparent;
  border: none;
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  i { font-size: 12px; width: 14px; color: var(--text-muted); flex-shrink: 0; }
}

.ws-row-name {
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.ws-row-ns {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.ws-row-menu {
  flex-shrink: 0;
  padding: 6px 8px;
  margin-right: 2px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0.45;
  transition: opacity 0.1s, color 0.1s, background 0.1s;
  &:hover { color: var(--text); background: var(--bg-active); opacity: 1; }
  i { font-size: 12px; }
}

.ws-empty {
  padding: 6px 10px;
  font-size: 12px;
  color: var(--text-muted);
  &.err { color: var(--red); }
}

.add-project {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
  padding: 7px 10px;
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  background: none;
  color: var(--text-muted);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.1s, border-color 0.1s, background 0.1s;
  i { font-size: 11px; width: 14px; }
  &:hover { color: var(--text); border-color: var(--accent); background: var(--bg-hover); }
}

.sidebar-bottom {
  border-top: 1px solid var(--border);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ctx-menu {
  position: fixed;
  z-index: 1000;
  min-width: 180px;
  padding: 3px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 7px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.ctx-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12.5px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  width: 100%;
  i { width: 14px; font-size: 12px; text-align: center; opacity: 0.8; }
  &:hover { background: var(--accent); color: #fff; }
  &:hover i { opacity: 1; }
  &.danger { color: var(--red); }
  &.danger:hover { background: var(--red); color: #fff; }
}

.ctx-sep { height: 1px; margin: 3px 6px; background: var(--border); }
</style>
