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