<template>
  <div class="shell">
    <AppNav />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
</script>

<style scoped>
.shell {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: var(--bg-canvas);
}
</style>
