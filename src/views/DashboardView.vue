<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">
        {{ activeProject?.name ?? 'Dashboard' }}
        <span v-if="activeProject" class="ns">{{ activeProject.namespace }}</span>
      </h1>
      <span v-if="activeProject" class="badge" :class="activeProject.status.toLowerCase()">
        {{ activeProject.status }}
      </span>
    </div>

    <div v-if="!activeProject" class="page-body center">
      <div class="empty-state">
        <i class="fa-solid fa-layer-group"></i>
        <p>Select a project from the sidebar</p>
      </div>
    </div>

    <div v-else class="page-body">
      <div class="cards">
        <section class="card">
          <div class="card-icon"><i class="fa-solid fa-server"></i></div>
          <div class="card-info">
            <div class="card-label">Service Health</div>
            <div class="card-value" :class="health?.status === 'ok' ? 'ok' : 'err'">
              {{ healthLoading ? '…' : (health?.status ?? 'unknown') }}
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-icon"><i class="fa-solid fa-stopwatch"></i></div>
          <div class="card-info">
            <div class="card-label">Latency</div>
            <div class="card-value">
              {{ health ? health.latencyMs + ' ms' : '—' }}
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-icon"><i class="fa-solid fa-box-archive"></i></div>
          <div class="card-info">
            <div class="card-label">Bundle</div>
            <div class="card-value mono">{{ activeProject.bundleRef ?? '—' }}</div>
          </div>
        </section>

        <section class="card">
          <div class="card-icon"><i class="fa-solid fa-network-wired"></i></div>
          <div class="card-info">
            <div class="card-label">Endpoint</div>
            <div class="card-value mono">{{ activeProject.serviceEndpoint }}</div>
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="panel-head">
          <h2 class="panel-title">Settings</h2>
        </div>
        <div v-if="Object.keys(activeProject.settings ?? {}).length" class="settings-table">
          <div v-for="(v, k) in activeProject.settings" :key="k" class="settings-row">
            <span class="settings-key">{{ k }}</span>
            <span class="settings-val">{{ v }}</span>
          </div>
        </div>
        <div v-else class="empty-state small">
          <p>No settings configured</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProject, getProjectHealth, type Project, type ProjectHealth } from '../api/kosServices'
import { activeProject as activeProjectSummary } from '../stores/project'

const route = useRoute()
const activeProject = ref<Project | null>(null)
const health = ref<ProjectHealth | null>(null)
const healthLoading = ref(false)

async function reload(id: string) {
  activeProject.value = await getProject(id).catch(() => null)
  healthLoading.value = true
  health.value = await getProjectHealth(id).catch(() => null)
  healthLoading.value = false
}

watch(() => route.params.id as string, id => { if (id) reload(id) }, { immediate: true })
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100%; min-height: 0; }

.page-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-canvas);
}

.page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 1;
}

.ns { font-size: 12px; color: var(--text-muted); font-weight: 400; font-family: var(--mono); }

.badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  &.draft    { background: var(--bg-hover); color: var(--text-muted); }
  &.active   { background: color-mix(in srgb, var(--green) 15%, transparent); color: var(--green); }
  &.archived { background: color-mix(in srgb, var(--red)   15%, transparent); color: var(--red); }
}

.page-body { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
.page-body.center { align-items: center; justify-content: center; }

.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }

.card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.card-icon {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent-bg);
  border-radius: var(--radius-xs);
  color: var(--accent);
  font-size: 15px;
  flex-shrink: 0;
}

.card-label { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

.card-value {
  font-size: 15px; font-weight: 600; color: var(--text); margin-top: 2px;
  &.ok  { color: var(--green); }
  &.err { color: var(--red); }
  &.mono { font-family: var(--mono); font-size: 12px; word-break: break-all; }
}

.panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.panel-head {
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
}

.panel-title { font-size: 13px; font-weight: 600; color: var(--text); }

.settings-table { display: flex; flex-direction: column; }

.settings-row {
  display: flex;
  padding: 8px 18px;
  gap: 16px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  &:last-child { border-bottom: none; }
}

.settings-key { font-family: var(--mono); color: var(--text-muted); min-width: 160px; }
.settings-val { font-family: var(--mono); color: var(--text); }

.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 40px;
  color: var(--text-muted);
  i { font-size: 32px; opacity: 0.25; }
  p { font-size: 14px; }
  &.small { padding: 20px; }
}
</style>
