const BASE = (import.meta.env.VITE_KOS_SERVICES_URL as string | undefined) ?? ''

export interface Project {
  id: string
  name: string
  namespace: string
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  serviceEndpoint: string
  bundleRef?: string
  settings: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface ProjectSummary {
  id: string
  name: string
  namespace: string
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  updatedAt: string
}

export interface ProjectHealth {
  status: 'ok' | 'error'
  latencyMs: number
  detail: unknown
}

export interface CreateProjectBody {
  name: string
  namespace: string
  serviceEndpoint: string
  bundleRef?: string
  settings?: Record<string, string>
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`${res.status} ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const listProjects     = () => request<ProjectSummary[]>('/api/projects')
export const getProject       = (id: string) => request<Project>(`/api/projects/${id}`)
export const createProject    = (body: CreateProjectBody) =>
  request<Project>('/api/projects', { method: 'POST', body: JSON.stringify(body) })
export const updateProject    = (id: string, body: Partial<CreateProjectBody>) =>
  request<Project>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteProject    = (id: string) =>
  request<void>(`/api/projects/${id}`, { method: 'DELETE' })
export const activateProject  = (id: string) =>
  request<Project>(`/api/projects/${id}/activate`, { method: 'POST' })
export const archiveProject   = (id: string) =>
  request<Project>(`/api/projects/${id}/archive`, { method: 'POST' })
export const getProjectHealth = (id: string) =>
  request<ProjectHealth>(`/api/projects/${id}/health`)
