<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Projects</h1>
      <button class="btn-primary" type="button" @click="showAdd = true">
        <i class="fa-solid fa-plus"></i>
        <span>Add Project</span>
      </button>
    </div>

    <div class="page-body">
      <div v-if="loading" class="empty-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading projects…</p>
      </div>

      <div v-else-if="loadError" class="empty-state err">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>{{ loadError }}</p>
        <button class="btn-ghost" type="button" @click="loadProjects()">Retry</button>
      </div>

      <template v-else-if="projects.length">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Namespace</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in projects"
              :key="p.id"
              class="row"
              :class="{ selected: p.id === activeProjectId }"
              @click="open(p.id)"
            >
              <td class="col-name">
                <i class="fa-regular fa-folder"></i>
                {{ p.name }}
              </td>
              <td class="col-ns">{{ p.namespace }}</td>
              <td><span class="badge" :class="p.status.toLowerCase()">{{ p.status }}</span></td>
              <td class="col-date">{{ formatDate(p.updatedAt) }}</td>
              <td class="col-action" @click.stop>
                <button class="icon-btn" title="Delete" @click="del(p.id)">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <div v-else class="empty-state">
        <i class="fa-solid fa-layer-group"></i>
        <p>No projects yet</p>
        <button class="btn-primary" type="button" @click="showAdd = true">Add your first project</button>
      </div>
    </div>
  </div>

  <AddProjectModal
    v-if="showAdd"
    @close="showAdd = false"
    @created="onCreated"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AddProjectModal from '../components/AddProjectModal.vue'
import { projects, activeProjectId, loading, loadError, loadProjects, selectProject, removeProject } from '../stores/project'

const router = useRouter()
const showAdd = ref(false)

function open(id: string) {
  selectProject(id)
  router.push(`/projects/${id}/dashboard`)
}

async function del(id: string) {
  await removeProject(id)
}

function onCreated(id: string) {
  showAdd.value = false
  router.push(`/projects/${id}/dashboard`)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
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

.page-body { flex: 1; overflow-y: auto; padding: 20px 24px; }

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border);
}

.row {
  cursor: pointer;
  transition: background 0.1s;
  &:hover td { background: var(--bg-hover); }
  &.selected td { background: var(--bg-active); }
}

.row td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  vertical-align: middle;
}

.col-name {
  font-weight: 500;
  i { color: var(--text-muted); margin-right: 8px; font-size: 12px; }
}

.col-ns { color: var(--text-muted); font-size: 12px; font-family: var(--mono); }
.col-date { color: var(--text-muted); font-size: 12px; white-space: nowrap; }
.col-action { width: 40px; text-align: center; }

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  &.draft    { background: var(--bg-hover); color: var(--text-muted); }
  &.active   { background: color-mix(in srgb, var(--green) 15%, transparent); color: var(--green); }
  &.archived { background: color-mix(in srgb, var(--red)   15%, transparent); color: var(--red); }
}

.icon-btn {
  background: none; border: none; color: var(--text-muted);
  cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: 13px;
  &:hover { color: var(--red); background: color-mix(in srgb, var(--red) 12%, transparent); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 240px;
  color: var(--text-muted);
  i { font-size: 32px; opacity: 0.25; }
  p { font-size: 14px; color: var(--text-secondary); }
  &.err i, &.err p { color: var(--red); opacity: 1; }
}

.btn-primary {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--accent-text);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  &:hover { background: var(--accent-strong); }
}

.btn-ghost {
  padding: 7px 14px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  &:hover { background: var(--bg-hover); color: var(--text); }
}
</style>
