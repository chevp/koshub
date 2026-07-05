<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Config</h1>
    </div>
    <div class="page-body">
      <div class="empty-state">
        <i class="fa-solid fa-sliders"></i>
        <p>No configuration</p>
        <span>Project configuration will appear here.</span>
      </div>
    </div>
  </div>
</template>

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
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 0;
  color: var(--text-muted);
}
.empty-state i { font-size: 28px; opacity: 0.3; }
.empty-state p { font-size: 14px; font-weight: 500; color: var(--text-secondary); }
.empty-state span { font-size: 13px; }
</style>
