<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Dashboard</h1>
    </div>

    <div class="page-body">
      <div class="cards">
        <section class="card">
          <div class="card-icon"><i class="fa-solid fa-server"></i></div>
          <div class="card-info">
            <div class="card-label">kaga</div>
            <div class="card-value" :class="kagaStatus === 'online' ? 'ok' : 'err'">
              {{ kagaStatus }}
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-icon"><i class="fa-solid fa-database"></i></div>
          <div class="card-info">
            <div class="card-label">Repositories</div>
            <div class="card-value">{{ repoCount }}</div>
          </div>
        </section>

        <section class="card">
          <div class="card-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
          <div class="card-info">
            <div class="card-label">Artifacts</div>
            <div class="card-value">{{ artifactCount }}</div>
          </div>
        </section>
      </div>

      <section class="panel">
        <h2 class="panel-title">Recent activity</h2>
        <div class="empty-state">
          <i class="fa-solid fa-wave-square"></i>
          <p>No recent activity</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const kagaStatus = ref<'online' | 'offline'>('offline')
const repoCount = ref(0)
const artifactCount = ref(0)
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.page-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-canvas);
}

.page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.page-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.card-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-bg);
  border-radius: var(--radius-xs);
  color: var(--accent);
  font-size: 15px;
  flex-shrink: 0;
}

.card-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.card-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  font-family: var(--mono);
  margin-top: 2px;
  &.ok { color: var(--green); }
  &.err { color: var(--red); }
}

.panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px 18px;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 0;
  color: var(--text-muted);
  i { font-size: 24px; opacity: 0.3; }
  p { font-size: 13px; }
}
</style>
