<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Services</h1>
      <button v-if="activeProjectId" class="btn-ghost" type="button"
              :disabled="loading" @click="probe">
        <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
        <span>Refresh</span>
      </button>
    </div>

    <div v-if="!activeProjectId" class="page-body center">
      <div class="empty-state">
        <i class="fa-solid fa-cubes"></i>
        <p>Select a project to inspect its service</p>
      </div>
    </div>

    <div v-else class="page-body">
      <section class="panel">
        <div class="panel-head">
          <div class="panel-title">
            <i class="fa-solid fa-server"></i>
            Runtime Service
          </div>
          <span class="panel-endpoint">{{ project?.serviceEndpoint }}</span>
        </div>

        <div v-if="loading" class="status-row">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <span>Probing…</span>
        </div>

        <div v-else-if="health" class="status-row" :class="health.status">
          <i :class="health.status === 'ok' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
          <span class="status-label">{{ health.status === 'ok' ? 'Online' : 'Unreachable' }}</span>
          <span class="status-latency">{{ health.latencyMs }} ms</span>
          <span v-if="health.status === 'error' && health.detail" class="status-detail">
            {{ health.detail }}
          </span>
        </div>

        <div v-else class="status-row">
          <i class="fa-solid fa-circle-question"></i>
          <span>Unknown</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProject, getProjectHealth, type Project, type ProjectHealth } from '../api/kosServices'
import { activeProjectId } from '../stores/project'

const route = useRoute()
const project = ref<Project | null>(null)
const health = ref<ProjectHealth | null>(null)
const loading = ref(false)

async function probe() {
  const id = route.params.id as string
  if (!id) return
  loading.value = true
  project.value = await getProject(id).catch(() => null)
  health.value = await getProjectHealth(id).catch(() => null)
  loading.value = false
}

watch(() => route.params.id, id => { if (id) probe() }, { immediate: true })
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100%; min-height: 0; }

.page-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-canvas);
}

.page-title { font-size: 15px; font-weight: 600; color: var(--text); }

.page-body { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.page-body.center { align-items: center; justify-content: center; }

.panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
}

.panel-title { font-size: 13px; font-weight: 600; color: var(--text); display: flex; align-items: center; gap: 8px; }
.panel-title i { color: var(--accent); font-size: 12px; }
.panel-endpoint { font-size: 12px; color: var(--text-muted); font-family: var(--mono); margin-left: auto; }

.status-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  font-size: 13px;
  color: var(--text-muted);
  i { font-size: 18px; }
  &.ok  { i { color: var(--green); } .status-label { color: var(--green); } }
  &.error { i { color: var(--red); } .status-label { color: var(--red); } }
}

.status-label { font-weight: 600; color: var(--text); }
.status-latency { color: var(--text-muted); font-family: var(--mono); font-size: 12px; }
.status-detail { color: var(--red); font-size: 12px; font-family: var(--mono); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.btn-ghost {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  &:hover { background: var(--bg-hover); color: var(--text); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  color: var(--text-muted);
  i { font-size: 32px; opacity: 0.25; }
  p { font-size: 14px; }
}
</style>
