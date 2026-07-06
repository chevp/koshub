import { ref, computed } from 'vue';
import { listProjects, deleteProject as apiDelete, } from '../api/kosServices';
export const projects = ref([]);
export const activeProjectId = ref(localStorage.getItem('koshub.activeProject'));
export const activeProject = computed(() => projects.value.find(p => p.id === activeProjectId.value) ?? null);
export const loading = ref(false);
export const loadError = ref(null);
export async function loadProjects() {
    loading.value = true;
    loadError.value = null;
    try {
        projects.value = await listProjects();
        if (activeProjectId.value && !projects.value.find(p => p.id === activeProjectId.value)) {
            selectProject(null);
        }
    }
    catch (e) {
        loadError.value = e instanceof Error ? e.message : 'Failed to load projects';
    }
    finally {
        loading.value = false;
    }
}
export function selectProject(id) {
    activeProjectId.value = id;
    if (id)
        localStorage.setItem('koshub.activeProject', id);
    else
        localStorage.removeItem('koshub.activeProject');
}
export async function removeProject(id) {
    await apiDelete(id);
    projects.value = projects.value.filter(p => p.id !== id);
    if (activeProjectId.value === id)
        selectProject(null);
}
