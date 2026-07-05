<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <span class="brand-name">Koshub</span>
    </div>

    <nav class="sidebar-scroll">
      <!-- Projects -->
      <div class="nav-section">
        <div class="nav-label">Projects</div>
        <div class="ws-list">
          <div
            v-for="p in projects"
            :key="p.id"
            class="ws-row"
            :class="{ active: p.id === activeProjectId }"
            @contextmenu.prevent="openMenu(p, $event)"
          >
            <button class="ws-row-main" type="button" :title="p.namespace + '/' + p.name" @click="select(p.id)">
              <i class="fa-regular fa-folder"></i>
              <span class="ws-row-name">{{ p.name }}</span>
            </button>
            <button class="ws-row-menu" type="button" title="Project settings" @click.stop="openMenu(p, $event)">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </div>
          <div v-if="!projects.length" class="ws-empty">No projects yet.</div>
          <button class="add-project" type="button">
            <i class="fa-solid fa-plus"></i>
            <span>Add Project…</span>
          </button>
        </div>
      </div>

      <!-- Monitoring -->
      <div class="nav-section">
        <div class="nav-label">Monitoring</div>
        <router-link class="nav-item" to="/dashboard">
          <i class="fa-solid fa-gauge-high"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link class="nav-item" to="/services">
          <i class="fa-solid fa-cubes"></i>
          <span>Services</span>
        </router-link>
        <router-link class="nav-item" to="/logs">
          <i class="fa-solid fa-terminal"></i>
          <span>Logs</span>
        </router-link>
      </div>

      <!-- Registry -->
      <div class="nav-section">
        <div class="nav-label">Registry</div>
        <router-link class="nav-item" to="/repositories">
          <i class="fa-solid fa-database"></i>
          <span>Repositories</span>
        </router-link>
        <router-link class="nav-item" to="/artifacts">
          <i class="fa-solid fa-boxes-stacked"></i>
          <span>Artifacts</span>
        </router-link>
      </div>

      <!-- Configuration -->
      <div class="nav-section">
        <div class="nav-label">Configuration</div>
        <router-link class="nav-item" to="/config">
          <i class="fa-solid fa-sliders"></i>
          <span>Config</span>
        </router-link>
        <router-link class="nav-item" to="/data">
          <i class="fa-solid fa-table"></i>
          <span>Data</span>
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
    <button class="ctx-item" type="button" @click="select(menu.project.id); closeMenu()">
      <i class="fa-regular fa-folder-open"></i><span>Open</span>
    </button>
    <button class="ctx-item" type="button" @click="closeMenu()">
      <i class="fa-regular fa-copy"></i><span>Copy Path</span>
    </button>
    <button class="ctx-item" type="button" @click="closeMenu()">
      <i class="fa-solid fa-gear"></i><span>Project Settings…</span>
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item danger" type="button" @click="removeProject(menu.project.id)">
      <i class="fa-regular fa-trash-can"></i><span>Remove from list</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Project {
  id: string
  name: string
  namespace: string
}

const projects = ref<Project[]>([
  { id: 'kosmos-prod', name: 'kosmos-prod', namespace: 'dev.kosmos' },
  { id: 'kosmos-dev',  name: 'kosmos-dev',  namespace: 'dev.kosmos' },
  { id: 'iris-engine', name: 'iris-engine', namespace: 'dev.kosmos' },
])

const activeProjectId = ref<string>(
  localStorage.getItem('koshub.activeProject') ?? projects.value[0]?.id ?? ''
)

function select(id: string) {
  activeProjectId.value = id
  localStorage.setItem('koshub.activeProject', id)
  closeMenu()
}

function removeProject(id: string) {
  projects.value = projects.value.filter(p => p.id !== id)
  if (activeProjectId.value === id) {
    activeProjectId.value = projects.value[0]?.id ?? ''
  }
  closeMenu()
}

interface MenuState { project: Project; x: number; y: number }
const menu = ref<MenuState | null>(null)

function openMenu(project: Project, e: MouseEvent) {
  menu.value = { project, x: e.clientX, y: e.clientY }
}
function closeMenu() { menu.value = null }

function onClickOutside() { if (menu.value) closeMenu() }

onMounted(()   => document.addEventListener('click', onClickOutside, true))
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
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

/* ── Brand ─────────────────────────────────────────────────── */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 12px;
  border-bottom: 1px solid var(--border);
}

.brand-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #c8bef0 0%, var(--accent) 45%, var(--accent-strong) 100%);
  color: var(--accent-text);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(140, 130, 220, 0.25), 0 0 14px -2px rgba(140, 130, 220, 0.45);
}

.brand-name {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.01em;
  color: var(--text);
}

/* ── Scroll area ────────────────────────────────────────────── */
.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sidebar-scroll::-webkit-scrollbar-corner { background: transparent; }

/* ── Sections ───────────────────────────────────────────────── */
.nav-section { display: flex; flex-direction: column; gap: 2px; }

.nav-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  padding: 8px 10px 4px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* ── Nav items (router-link + buttons) ──────────────────────── */
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
}
.nav-item:hover { background: var(--bg-hover); color: var(--text); }
.nav-item.router-link-active { background: var(--bg-active); color: var(--text); }

.nav-item i {
  font-size: 12px;
  opacity: 0.75;
  width: 14px;
  text-align: center;
}
.nav-item.router-link-active i,
.nav-item:hover i { color: var(--accent); opacity: 1; }

/* ── Project list ───────────────────────────────────────────── */
.ws-list { display: flex; flex-direction: column; gap: 2px; }

.ws-row {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  transition: background 0.1s;
}
.ws-row:hover { background: var(--bg-hover); }
.ws-row:hover .ws-row-menu { opacity: 1; }
.ws-row.active .ws-row-name { color: var(--text); }

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
}
.ws-row-main i { font-size: 12px; width: 14px; color: var(--text-muted); }

.ws-row-name {
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
}
.ws-row-menu:hover { color: var(--text); background: var(--bg-active); opacity: 1; }
.ws-row-menu i { font-size: 12px; }

.ws-empty {
  padding: 6px 10px;
  font-size: 12px;
  color: var(--text-muted);
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
}
.add-project i { font-size: 11px; width: 14px; }
.add-project:hover { color: var(--text); border-color: var(--accent); background: var(--bg-hover); }

/* ── Bottom ─────────────────────────────────────────────────── */
.sidebar-bottom {
  border-top: 1px solid var(--border);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── Context menu ───────────────────────────────────────────── */
.ctx-menu {
  position: fixed;
  z-index: 1000;
  min-width: 200px;
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
}
.ctx-item i { width: 14px; font-size: 12px; text-align: center; opacity: 0.8; }
.ctx-item:hover { background: var(--accent); color: #fff; }
.ctx-item:hover i { opacity: 1; }

.ctx-item.danger { color: var(--red); }
.ctx-item.danger:hover { background: var(--red); color: #fff; }

.ctx-sep {
  height: 1px;
  margin: 3px 6px;
  background: var(--border);
}
</style>
