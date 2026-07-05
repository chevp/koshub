<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Logs</h1>
      <span class="head-tag">Live</span>
    </div>
    <div class="log-body">
      <div class="empty-state">
        <i class="fa-solid fa-terminal"></i>
        <p>No log output</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; height: 100%; min-height: 0; }

.page-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
}

.page-title { font-size: 15px; font-weight: 600; color: var(--text); }

.head-tag {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--green);
  background: var(--green-bg);
  padding: 2px 8px;
  border-radius: 100px;
}

.log-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  font-family: var(--mono);
  font-size: 12.5px;
  background: var(--bg-canvas);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  i { font-size: 28px; opacity: 0.25; }
  p { font-size: 13px; }
}
</style>
