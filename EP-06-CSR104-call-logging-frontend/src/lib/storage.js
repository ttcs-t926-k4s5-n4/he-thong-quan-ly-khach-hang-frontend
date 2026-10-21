export function getSafeLocalStorage() {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredJson(storage, key, fallback) {
  try {
    const value = storage?.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function readStoredCallLogs(storage, key, fallback) {
  const stored = readStoredJson(storage, key, fallback);

  if (!Array.isArray(stored)) {
    return fallback;
  }

  return stored.filter(
    (item) =>
      item !== null &&
      typeof item === 'object' &&
      !Array.isArray(item),
  );
}

export function readStoredCustomerId(
  storage,
  key,
  fallback,
  customers = [],
) {
  const stored = readStoredJson(storage, key, fallback);

  if (typeof stored !== 'string') {
    return fallback;
  }

  return customers.some((customer) => customer.id === stored)
    ? stored
    : fallback;
}
export const isLocalStorageAvailable = () => { try { const k = '__chk__'; window.localStorage.setItem(k, k); window.localStorage.removeItem(k); return true; } catch { return false; } };


export const safeJsonParse = (str, fallback) => { try { return JSON.parse(str) ?? fallback; } catch { return fallback; } };


export const getStorageQuotaEstimate = async () => ({ quota: 5242880, usage: 0 });

export const pruneStoredLogs = (list, max = 100) => Array.isArray(list) ? list.slice(0, max) : [];
