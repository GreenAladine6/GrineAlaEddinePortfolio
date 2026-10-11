const DATABASE_NAME = "ala-portfolio-uploads";
const STORE_NAME = "files";
const CV_KEY = "portfolio-cv";

function openUploadDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local file storage."));
  });
}

export async function savePortfolioFile(key: string, file: File) {
  const database = await openUploadDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(file, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not save the file."));
  });
  database.close();
}

export async function readPortfolioFile(key: string) {
  const database = await openUploadDatabase();
  const file = await new Promise<Blob | undefined>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error ?? new Error("Could not read the saved file."));
  });
  database.close();
  return file;
}

export async function removePortfolioFile(key: string) {
  const database = await openUploadDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not remove the saved file."));
  });
  database.close();
}

export const saveCvFile = (file: File) => savePortfolioFile(CV_KEY, file);
export const readCvFile = () => readPortfolioFile(CV_KEY);
export const removeCvFile = () => removePortfolioFile(CV_KEY);
export const certificationImageKey = (id: string) => `certification-image:${id}`;
export const experienceImageKey = (id: string) => `experience-image:${id}`;
