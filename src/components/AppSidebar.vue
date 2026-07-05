<template>
  <aside class="sidebar">
    <div class="sidebar-head">
      <span class="brand">koshub</span>
    </div>

    <nav class="sidebar-scroll">
      <div class="nav-section">
        <div class="nav-label">Platform</div>

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

      <div class="nav-section">
        <div class="nav-label">kaga</div>

        <button class="nav-item" type="button">
          <i class="fa-solid fa-database"></i>
          <span>Repositories</span>
        </button>

        <button class="nav-item" type="button">
          <i class="fa-solid fa-boxes-stacked"></i>
          <span>Artifacts</span>
        </button>

        <button class="nav-item" type="button">
          <i class="fa-solid fa-sliders"></i>
          <span>Config</span>
        </button>
      </div>
    </nav>

    <div class="sidebar-foot">
      <span class="foot-tag">v0.1.0</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
</script>

<style scoped>
.sidebar {
  width: 210px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
}

.sidebar-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px 12px;
  border-bottom: 1px solid var(--border);
}

.brand {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-section {
  margin-bottom: 4px;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 10px 14px 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 7px 14px;
  font-size: 13px;
  color: var(--text-secondary);
  border-radius: 0;
  text-decoration: none;
  transition: background 0.1s, color 0.1s;
  cursor: pointer;
}

.nav-item i {
  font-size: 12px;
  width: 14px;
  text-align: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text);
}

.nav-item.router-link-active {
  background: var(--bg-active);
  color: var(--accent-soft);
}

.nav-item.router-link-active i {
  color: var(--accent);
}

.sidebar-foot {
  padding: 10px 14px;
  border-top: 1px solid var(--border);
}

.foot-tag {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--mono);
}
</style>
