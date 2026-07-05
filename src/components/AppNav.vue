<template>
  <div class="nav-shell">
    <header class="topbar">
      <div class="topbar-start">
        <span class="brand">koshub</span>
        <div class="topbar-sep"></div>
        <div class="project-selector" ref="selectorRef">
          <button class="selector-btn" @click="dropdownOpen = !dropdownOpen">
            <i class="fa-solid fa-folder-open selector-icon"></i>
            <span class="selector-name">{{ activeProject?.name ?? '—' }}</span>
            <i class="fa-solid fa-chevron-down selector-chevron" :class="{ rotated: dropdownOpen }"></i>
          </button>

          <div class="project-dropdown" v-if="dropdownOpen">
            <div class="dropdown-head">Switch project</div>
            <button
              v-for="p in projects"
              :key="p.id"
              class="dropdown-item"
              :class="{ active: p.id === activeProjectId }"
              @click="select(p.id)"
            >
              <i class="fa-solid fa-check check-icon"></i>
              <div class="dropdown-item-body">
                <span class="dropdown-item-name">{{ p.name }}</span>
                <span class="dropdown-item-ns">{{ p.namespace }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="topbar-end">
        <button class="icon-btn" title="Settings">
          <i class="fa-solid fa-gear"></i>
        </button>
        <span class="version">v0.1.0</span>
      </div>
    </header>

    <nav class="tabs" v-if="activeProject">
      <router-link class="tab" to="/dashboard">
        <i class="fa-solid fa-gauge-high"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link class="tab" to="/services">
        <i class="fa-solid fa-cubes"></i>
        <span>Services</span>
      </router-link>
      <router-link class="tab" to="/logs">
        <i class="fa-solid fa-terminal"></i>
        <span>Logs</span>
      </router-link>
      <div class="tab-sep"></div>
      <router-link class="tab" to="/repositories">
        <i class="fa-solid fa-database"></i>
        <span>Repositories</span>
      </router-link>
      <router-link class="tab" to="/artifacts">
        <i class="fa-solid fa-boxes-stacked"></i>
        <span>Artifacts</span>
      </router-link>
      <router-link class="tab" to="/config">
        <i class="fa-solid fa-sliders"></i>
        <span>Config</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Project {
  id: string
  name: string
  namespace: string
}

const projects: Project[] = [
  { id: 'kosmos-prod', name: 'kosmos-prod', namespace: 'dev.kosmos' },
  { id: 'kosmos-dev',  name: 'kosmos-dev',  namespace: 'dev.kosmos' },
  { id: 'iris-engine', name: 'iris-engine', namespace: 'dev.kosmos' },
]

const activeProjectId = ref<string>(
  localStorage.getItem('koshub.activeProject') ?? projects[0].id
)

const activeProject = computed(() =>
  projects.find(p => p.id === activeProjectId.value) ?? null
)

const dropdownOpen = ref(false)
const selectorRef   = ref<HTMLElement | null>(null)

function select(id: string) {
  activeProjectId.value = id
  localStorage.setItem('koshub.activeProject', id)
  dropdownOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (selectorRef.value && !selectorRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(()   => document.addEventListener('click', onClickOutside, true))
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
</script>

<style scoped>
.nav-shell {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border);
}

/* ── Topbar ─────────────────────────────────────────────── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid var(--border);
}

.topbar-start {
  display: flex;
  align-items: center;
  gap: 0;
}

.topbar-end {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
  padding-right: 12px;
}

.topbar-sep {
  width: 1px;
  height: 18px;
  background: var(--border);
  margin: 0 12px;
}

.version {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--mono);
}

.icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs);
  color: var(--text-muted);
  font-size: 13px;
  transition: background 0.1s, color 0.1s;
}
.icon-btn:hover {
  background: var(--bg-hover);
  color: var(--text);
}

/* ── Project selector ────────────────────────────────────── */
.project-selector {
  position: relative;
}

.selector-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: background 0.1s, color 0.1s;
}
.selector-btn:hover {
  background: var(--bg-hover);
  color: var(--text);
}

.selector-icon {
  font-size: 12px;
  color: var(--accent);
}

.selector-chevron {
  font-size: 10px;
  color: var(--text-muted);
  transition: transform 0.15s;
}
.selector-chevron.rotated {
  transform: rotate(180deg);
}

/* ── Dropdown ────────────────────────────────────────────── */
.project-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 200;
  min-width: 240px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  padding: 4px 0;
}

.dropdown-head {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 8px 12px 6px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 12px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: background 0.1s, color 0.1s;
  text-align: left;
}
.dropdown-item:hover {
  background: var(--bg-hover);
  color: var(--text);
}
.dropdown-item.active {
  color: var(--text);
}

.check-icon {
  font-size: 11px;
  width: 12px;
  color: var(--accent);
  opacity: 0;
  flex-shrink: 0;
}
.dropdown-item.active .check-icon {
  opacity: 1;
}

.dropdown-item-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.dropdown-item-name {
  font-size: 13px;
  font-weight: 500;
}
.dropdown-item-ns {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--mono);
}

/* ── Tabs ────────────────────────────────────────────────── */
.tabs {
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 2px;
  height: 40px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  height: 100%;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.1s, border-color 0.1s;
  white-space: nowrap;
}
.tab i {
  font-size: 11px;
}
.tab:hover {
  color: var(--text);
  text-decoration: none;
}
.tab.router-link-active {
  color: var(--text);
  border-bottom-color: var(--accent);
}

.tab-sep {
  width: 1px;
  height: 16px;
  background: var(--border);
  margin: 0 6px;
  flex-shrink: 0;
}
</style>
