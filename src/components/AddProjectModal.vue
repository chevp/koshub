<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-head">
        <span class="modal-title">Add Project</span>
        <button class="modal-close" type="button" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form class="modal-body" @submit.prevent="submit">
        <div class="field">
          <label class="field-label">Name <span class="req">*</span></label>
          <input v-model="form.name" class="field-input" placeholder="iris-engine" required />
        </div>
        <div class="field">
          <label class="field-label">Namespace <span class="req">*</span></label>
          <input v-model="form.namespace" class="field-input" placeholder="kosmos-prod" required />
        </div>
        <div class="field">
          <label class="field-label">Service Endpoint <span class="req">*</span></label>
          <input v-model="form.serviceEndpoint" class="field-input"
                 placeholder="http://localhost:8090" required
                 pattern="https?://.+" title="Must be a valid http(s) URL" />
        </div>
        <div class="field">
          <label class="field-label">Bundle Ref <span class="opt">(optional)</span></label>
          <input v-model="form.bundleRef" class="field-input" placeholder="gs://bucket/game.tar.gz" />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <div class="modal-actions">
          <button class="btn-ghost" type="button" @click="$emit('close')">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="saving">
            <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
            <span>{{ saving ? 'Creating…' : 'Create Project' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createProject } from '../api/kosServices'
import { loadProjects, selectProject } from '../stores/project'

const emit = defineEmits<{ close: []; created: [id: string] }>()

const form = ref({ name: '', namespace: '', serviceEndpoint: '', bundleRef: '' })
const saving = ref(false)
const error = ref<string | null>(null)

async function submit() {
  saving.value = true
  error.value = null
  try {
    const p = await createProject({
      name: form.value.name,
      namespace: form.value.namespace,
      serviceEndpoint: form.value.serviceEndpoint,
      bundleRef: form.value.bundleRef || undefined,
    })
    await loadProjects()
    selectProject(p.id)
    emit('created', p.id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create project'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 2000;
}

.modal {
  width: 440px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
}

.modal-title { font-size: 14px; font-weight: 600; color: var(--text); }

.modal-close {
  background: none; border: none; color: var(--text-muted);
  cursor: pointer; padding: 4px; border-radius: 4px;
  font-size: 14px;
  &:hover { color: var(--text); background: var(--bg-hover); }
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.field { display: flex; flex-direction: column; gap: 5px; }

.field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.req { color: var(--red); margin-left: 2px; }
.opt { color: var(--text-muted); font-weight: 400; }

.field-input {
  padding: 7px 10px;
  background: var(--bg-canvas);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 13px;
  font-family: var(--mono);
  outline: none;
  transition: border-color 0.1s;
  &:focus { border-color: var(--accent); }
}

.error-msg {
  padding: 8px 10px;
  background: color-mix(in srgb, var(--red) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--red) 40%, transparent);
  border-radius: var(--radius-sm);
  color: var(--red);
  font-size: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
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
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
</style>
