// ─── API Service Layer ────────────────────────────────────────────
// This module provides the base API client.
// Replace BASE_URL and the fetch wrappers to connect to a real FastAPI backend.
// All mock data is imported from src/data/mockData.ts — components never import mock data directly.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const USE_MOCK = true; // Set to false when connecting real backend

export async function apiGet<T>(path: string): Promise<T> {
  if (USE_MOCK) {
    // Mock mode: resolved by individual service modules
    throw new Error(`Mock mode: ${path}`);
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  if (USE_MOCK) {
    throw new Error(`Mock mode: ${path}`);
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  if (USE_MOCK) {
    throw new Error(`Mock mode: ${path}`);
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

// Simulate network latency for realistic UX during demo
export function mockDelay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
