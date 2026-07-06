const BASE = import.meta.env.VITE_KOS_SERVICES_URL ?? 'http://localhost:8080';
async function request(path, init) {
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`${res.status} ${text}`);
    }
    if (res.status === 204)
        return undefined;
    return res.json();
}
export const listProjects = () => request('/api/projects');
export const getProject = (id) => request(`/api/projects/${id}`);
export const createProject = (body) => request('/api/projects', { method: 'POST', body: JSON.stringify(body) });
export const updateProject = (id, body) => request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteProject = (id) => request(`/api/projects/${id}`, { method: 'DELETE' });
export const activateProject = (id) => request(`/api/projects/${id}/activate`, { method: 'POST' });
export const archiveProject = (id) => request(`/api/projects/${id}/archive`, { method: 'POST' });
export const getProjectHealth = (id) => request(`/api/projects/${id}/health`);
