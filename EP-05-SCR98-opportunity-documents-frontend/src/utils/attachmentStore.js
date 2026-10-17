const DB_NAME = 'salesflow-opportunity-documents';
const DB_VERSION = 1;
const STORE_NAME = 'attachments';
let databasePromise;
const memoryStore = new Map();

function openDatabase() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB is unavailable in this browser.'));
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('opportunityId', 'opportunityId', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open IndexedDB.'));
    request.onblocked = () => reject(new Error('Database is blocked by another browser tab.'));
  });
  return databasePromise;
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Database request failed.'));
  });
}

async function runTransaction(mode, operation) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    let result;
    try { result = operation(transaction.objectStore(STORE_NAME)); } catch (error) { reject(error); return; }
    transaction.oncomplete = () => resolve(result?.result);
    transaction.onerror = () => reject(transaction.error || new Error('Database transaction failed.'));
    transaction.onabort = () => reject(transaction.error || new Error('Database transaction aborted.'));
  });
}

export async function getAllAttachments() {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    return await requestToPromise(transaction.objectStore(STORE_NAME).getAll());
  } catch (error) {
    if (typeof indexedDB === 'undefined') return [...memoryStore.values()];
    throw error;
  }
}

export async function saveAttachment(attachment) {
  try { await runTransaction('readwrite', (store) => store.put(attachment)); }
  catch (error) {
    if (typeof indexedDB === 'undefined') { memoryStore.set(attachment.id, attachment); return; }
    throw error;
  }
}

export async function removeAttachment(id) {
  try { await runTransaction('readwrite', (store) => store.delete(id)); }
  catch (error) {
    if (typeof indexedDB === 'undefined') { memoryStore.delete(id); return; }
    throw error;
  }
}

export async function ensureDemoAttachments(demoAttachments) {
  const current = await getAllAttachments();
  if (current.length > 0) return current;
  const prepared = demoAttachments.map(({ demoContent, ...metadata }) => {
    const contentBlob = new Blob([demoContent || 'Tài liệu demo'], { type: metadata.type || 'text/plain' });
    const padding = ' '.repeat(Math.max(0, (Number(metadata.size) || 0) - contentBlob.size));
    const blob = padding ? new Blob([contentBlob, padding], { type: metadata.type || 'text/plain' }) : contentBlob;
    return { ...metadata, size: blob.size, blob, isDemo: true };
  });
  for (const attachment of prepared) await saveAttachment(attachment);
  return prepared;
}
