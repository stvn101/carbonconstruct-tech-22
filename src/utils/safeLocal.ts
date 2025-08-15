const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const safeLocal = {
get(key: string): string | null {
try { return isBrowser ? window.localStorage.getItem(key) : null; } catch { return null; }
},
set(key: string, value: string): void {
try { if (isBrowser) window.localStorage.setItem(key, value); } catch {}
},
};

export function getJSON<T>(key: string, fallback: T): T {
const raw = safeLocal.get(key);
if (!raw) return fallback;
try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function setJSON(key: string, value: unknown): void {
try { safeLocal.set(key, JSON.stringify(value)); } catch {}
}

export default safeLocal;
