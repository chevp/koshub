<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Services</h1>
    </div>
    <div class="page-body">
      <div class="empty-state">
        <i class="fa-solid fa-cubes"></i>
        <p>No services configured</p>
        <span class="dim">Connect kaga to discover services</span>
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
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
}

.page-title { font-size: 15px; font-weight: 600; color: var(--text); }

.page-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
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
  text-align: center;
  i { font-size: 32px; opacity: 0.25; }
  p { font-size: 14px; color: var(--text-secondary); }
  .dim { font-size: 12px; }
}
</style>
