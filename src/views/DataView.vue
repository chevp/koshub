<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Data</h1>
      <div class="head-tabs">
        <button class="head-tab" :class="{ active: view === 'nodes' }" @click="switchView('nodes')">
          <i class="fa-solid fa-circle-nodes"></i> Nodes
          <span class="count-badge" v-if="nodeTotal !== null">{{ nodeTotal }}</span>
        </button>
        <button class="head-tab" :class="{ active: view === 'edges' }" @click="switchView('edges')">
          <i class="fa-solid fa-arrow-right-arrow-left"></i> Edges
          <span class="count-badge" v-if="edgeTotal !== null">{{ edgeTotal }}</span>
        </button>
      </div>
      <div class="head-spacer"></div>
      <div class="status-dot" :class="apiStatus" :title="apiStatus === 'ok' ? 'kaga online' : 'kaga offline'"></div>
    </div>

    <div class="page-body">
      <!-- Error state -->
      <div class="error-bar" v-if="error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        {{ error }}
      </div>

      <!-- Nodes table -->
      <template v-if="view === 'nodes'">
        <div class="table-wrap" v-if="nodes.length > 0 || loading">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kind</th>
                <th>Label</th>
                <th>Source</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="loading-row"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</td>
              </tr>
              <tr v-else v-for="n in nodes" :key="n.id">
                <td class="mono cell-id" :title="n.id">{{ n.id.slice(0, 8) }}…</td>
                <td><span class="kind-chip">{{ n.kind }}</span></td>
                <td class="cell-label">{{ n.label }}</td>
                <td class="mono cell-source">{{ n.source }}</td>
                <td class="mono cell-date">{{ fmt(n.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" v-else-if="!loading && !error">
          <i class="fa-solid fa-circle-nodes"></i>
          <p>No nodes</p>
          <span>The kaga graph is empty.</span>
        </div>
      </template>

      <!-- Edges table -->
      <template v-if="view === 'edges'">
        <div class="table-wrap" v-if="edges.length > 0 || loading">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>From</th>
                <th>Rel</th>
                <th>To</th>
                <th>Source</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="loading-row"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</td>
              </tr>
              <tr v-else v-for="e in edges" :key="e.id">
                <td class="mono cell-id" :title="e.id">{{ e.id.slice(0, 8) }}…</td>
                <td class="mono cell-id" :title="e.fromId">{{ e.fromId.slice(0, 8) }}…</td>
                <td><span class="rel-chip">{{ e.rel }}</span></td>
                <td class="mono cell-id" :title="e.toId">{{ e.toId.slice(0, 8) }}…</td>
                <td class="mono cell-source">{{ e.source }}</td>
                <td class="mono cell-date">{{ fmt(e.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" v-else-if="!loading && !error">
          <i class="fa-solid fa-arrow-right-arrow-left"></i>
          <p>No edges</p>
          <span>The kaga graph has no edges.</span>
        </div>
      </template>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="page === 0" @click="go(page - 1)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="page-info">{{ page + 1 }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="page >= totalPages - 1" @click="go(page + 1)">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface KagaNode {
  id: string; kind: string; label: string; source: string; createdAt: string
}
interface KagaEdge {
  id: string; fromId: string; toId: string; rel: string; source: string; createdAt: string
}

const view       = ref<'nodes' | 'edges'>('nodes')
const nodes      = ref<KagaNode[]>([])
const edges      = ref<KagaEdge[]>([])
const nodeTotal  = ref<number | null>(null)
const edgeTotal  = ref<number | null>(null)
const page       = ref(0)
const totalPages = ref(0)
const loading    = ref(false)
const error      = ref('')
const apiStatus  = ref<'ok' | 'err' | 'unknown'>('unknown')

const PAGE_SIZE = 50

function fmt(iso: string) {
  return iso ? new Date(iso).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '—'
}

async function fetchNodes(p = 0) {
  loading.value = true
  error.value   = ''
  try {
    const r = await fetch(`/api/nodes?page=${p}&size=${PAGE_SIZE}&sort=createdAt,desc`)
    if (!r.ok) throw new Error(`kaga ${r.status}`)
    const data = await r.json()
    nodes.value      = data.content ?? []
    nodeTotal.value  = data.totalElements ?? 0
    totalPages.value = data.totalPages ?? 0
    page.value       = p
    apiStatus.value  = 'ok'
  } catch (e: any) {
    error.value     = e.message ?? 'Verbindung zu kaga fehlgeschlagen'
    apiStatus.value = 'err'
  } finally {
    loading.value = false
  }
}

async function fetchEdges(p = 0) {
  loading.value = true
  error.value   = ''
  try {
    const r = await fetch(`/api/edges?page=${p}&size=${PAGE_SIZE}`)
    if (!r.ok) throw new Error(`kaga ${r.status}`)
    const data = await r.json()
    edges.value      = data.content ?? data ?? []
    edgeTotal.value  = data.totalElements ?? edges.value.length
    totalPages.value = data.totalPages ?? 1
    page.value       = p
    apiStatus.value  = 'ok'
  } catch (e: any) {
    error.value     = e.message ?? 'Verbindung zu kaga fehlgeschlagen'
    apiStatus.value = 'err'
  } finally {
    loading.value = false
  }
}

function switchView(v: 'nodes' | 'edges') {
  view.value = v
  page.value = 0
  if (v === 'nodes') fetchNodes(0)
  else               fetchEdges(0)
}

function go(p: number) {
  if (view.value === 'nodes') fetchNodes(p)
  else                        fetchEdges(p)
}

onMounted(() => fetchNodes(0))
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* ── Head ─────────────────────────────────────────────────── */
.page-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 48px;
  border-bottom: 1px solid var(--border);
}
.page-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  flex-shrink: 0;
}
.head-tabs {
  display: flex;
  gap: 2px;
}
.head-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  transition: background 0.1s, color 0.1s;
}
.head-tab:hover  { background: var(--bg-hover); color: var(--text); }
.head-tab.active { background: var(--accent-bg); color: var(--accent-soft); }
.head-tab i      { font-size: 11px; }
.count-badge {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0 6px;
  font-size: 10px;
  font-family: var(--mono);
  color: var(--text-muted);
}
.head-tab.active .count-badge {
  border-color: var(--border-strong);
  color: var(--accent-soft);
}
.head-spacer { flex: 1; }
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}
.status-dot.ok      { background: var(--green); box-shadow: 0 0 0 2px rgba(74,222,128,.2); }
.status-dot.err     { background: var(--red); }
.status-dot.unknown { background: var(--text-muted); }

/* ── Body ─────────────────────────────────────────────────── */
.page-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.error-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: var(--red-bg);
  color: var(--red);
  font-size: 13px;
  border-bottom: 1px solid rgba(248,113,113,.2);
}

/* ── Table ────────────────────────────────────────────────── */
.table-wrap {
  flex: 1;
  overflow: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.data-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  text-align: left;
  padding: 9px 14px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--bg-canvas);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.data-table td {
  padding: 8px 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.data-table tr:hover td { background: var(--bg-hover); }

.mono         { font-family: var(--mono); font-size: 11.5px; }
.cell-id      { color: var(--text-muted); }
.cell-label   { color: var(--text); max-width: 240px; }
.cell-source  { color: var(--text-muted); }
.cell-date    { color: var(--text-muted); font-size: 11px; }

.kind-chip, .rel-chip {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--mono);
}
.kind-chip {
  background: var(--accent-bg);
  color: var(--accent-soft);
  border: 1px solid var(--border-strong);
}
.rel-chip {
  background: rgba(74,222,128,.1);
  color: var(--green);
  border: 1px solid rgba(74,222,128,.25);
}

.loading-row {
  text-align: center;
  padding: 32px !important;
  color: var(--text-muted);
  font-size: 13px;
  i { margin-right: 6px; }
}

/* ── Empty ────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 0;
  color: var(--text-muted);
}
.empty-state i     { font-size: 28px; opacity: 0.3; }
.empty-state p     { font-size: 14px; font-weight: 500; color: var(--text-secondary); }
.empty-state span  { font-size: 13px; }

/* ── Pagination ───────────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.page-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-xs);
  font-size: 12px;
  color: var(--text-secondary);
  transition: background 0.1s;
}
.page-btn:hover:not(:disabled) { background: var(--bg-hover); color: var(--text); }
.page-btn:disabled              { opacity: 0.3; }
.page-info {
  font-size: 12px;
  font-family: var(--mono);
  color: var(--text-muted);
  min-width: 60px;
  text-align: center;
}
</style>
