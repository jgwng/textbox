import { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME, INDEX_SELECTION, INDEX_URL, INDEX_CATEGORY, INDEX_MACRO_NO } from './constants.js';

export const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id", autoIncrement: true });
        objectStore.createIndex(INDEX_SELECTION, INDEX_SELECTION, { unique: false });
        objectStore.createIndex(INDEX_URL, INDEX_URL, { unique: false });
        objectStore.createIndex(INDEX_CATEGORY, INDEX_CATEGORY, { unique: false });
        objectStore.createIndex(INDEX_MACRO_NO, INDEX_MACRO_NO, { unique: false });
      }
    };
  });
};

export const insertData = async (data) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.add(data);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        console.error("Error inserting data:", event.target.error);
        resolve(false);
      };
    });

  } catch (error) {
    console.error("Error in insertData:", error);
    return false;
  }
};
export const updateData = async (id, updatedData) => {
  const db = await openDB();
  const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(CATEGORY_OBJECT_STORE_NAME);

  return new Promise((resolve, reject) => {
    // Get the existing data for the provided id
    const getRequest = objectStore.get(id);

    getRequest.onsuccess = (event) => {
      const existingData = event.target.result;

      if (!existingData) {
        reject(`No data found with id: ${id}`);
        return;
      }

      // Merge the existing data with the updated data
      const mergedData = { ...existingData, ...updatedData };

      // Put the merged data back into the object store
      const updateRequest = objectStore.put(mergedData);

      updateRequest.onsuccess = () => {
        console.log(`Data with id: ${id} successfully updated.`);
        resolve(true);
      };

      updateRequest.onerror = (event) => {
        console.error(`Error updating data: ${event.target.error}`);
        reject(`Error updating data: ${event.target.error}`);
      };
    };

    getRequest.onerror = (event) => {
      console.error(`Error fetching data for update: ${event.target.error}`);
      reject(`Error fetching data for update: ${event.target.error}`);
    };
  });
};

export const deleteAllData = async () => {
  const db = await openDB();
  const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

  const request = objectStore.clear();

  request.onsuccess = () => {
    console.log("All data deleted successfully!");
  };

  request.onerror = (event) => {
    console.error(`Error deleting all data: ${event.target.error}`);
  };
};

export const getAllData = async () => {
  const db = await openDB();
  const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error listing data: ${event.target.error}`);
    };
  });
};

export const deleteData = async (id) => {
  const db = await openDB();
  const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
  
  return new Promise((resolve, reject) => {
    const request = objectStore.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      reject(`Error deleting entry: ${event.target.error}`);
    };
  });
};

export const getDataByCategory = async (category) => {
  const db = await openDB();
  const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
  const categoryIndex = objectStore.index("category");

  return new Promise((resolve, reject) => {
    const request = categoryIndex.getAll(category);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error getting data by category: ${event.target.error}`);
    };
  });
}; 