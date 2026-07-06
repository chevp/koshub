import { ref, computed } from 'vue'
import {
  listProjects, deleteProject as apiDelete,
  type ProjectSummary,
} from '../api/kosServices'

export const projects       = ref<ProjectSummary[]>([])
export const activeProjectId = ref<string | null>(
  localStorage.getItem('koshub.activeProject'),
)
export const activeProject = computed(
  () => projects.value.find(p => p.id === activeProjectId.value) ?? null,
)
export const loading = ref(false)
export const loadError = ref<string | null>(null)

export async function loadProjects(): Promise<void> {
  loading.value = true
  loadError.value = null
  try {
    projects.value = await listProjects()
    if (activeProjectId.value && !projects.value.find(p => p.id === activeProjectId.value)) {
      selectProject(null)
    }
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Failed to load projects'
  } finally {
    loading.value = false
  }
}

export function selectProject(id: string | null): void {
  activeProjectId.value = id
  if (id) localStorage.setItem('koshub.activeProject', id)
  else localStorage.removeItem('koshub.activeProject')
}

export async function removeProject(id: string): Promise<void> {
  await apiDelete(id)
  projects.value = projects.value.filter(p => p.id !== id)
  if (activeProjectId.value === id) selectProject(null)
}
