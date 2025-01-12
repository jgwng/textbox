import { CATEGORY_DATABASE_NAME, CATEGORY_DATABASE_VERSION, CATEGORY_OBJECT_STORE_NAME, CATEGORY_NAME, CATEGORY_COLOR } from './constants.js';
export const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CATEGORY_DATABASE_NAME, CATEGORY_DATABASE_VERSION);

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CATEGORY_OBJECT_STORE_NAME)) {
        const objectStore = db.createObjectStore(CATEGORY_OBJECT_STORE_NAME, { keyPath: "categorySeq", autoIncrement: true });
        objectStore.createIndex(CATEGORY_NAME, CATEGORY_NAME, { unique: false });
        objectStore.createIndex(CATEGORY_COLOR, CATEGORY_COLOR, { unique: false });
      }
    };
  });
};

export const insertData = async (data) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([CATEGORY_OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(CATEGORY_OBJECT_STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.add(data);

      request.onsuccess = (event) => {
        const insertedId = event.target.result; // Get the generated key
        resolve({categorySeq: insertedId });  // Return the inserted data with its ID
      };

      request.onerror = (event) => {
        console.error("Error inserting data:", event.target.error);
        reject(event.target.error); // Reject with the error
      };
    });

  } catch (error) {
    console.error("Error in insertData:", error);
    throw error; // Throw the error to handle it in the caller
  }
};


export const deleteAllData = async () => {
  const db = await openDB();
  const transaction = db.transaction([CATEGORY_OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(CATEGORY_OBJECT_STORE_NAME);

  const request = objectStore.clear();

  request.onsuccess = () => {
    console.log("All data deleted successfully!");
  };

  request.onerror = (event) => {
    console.error(`Error deleting all data: ${event.target.error}`);
  };
};
export const updateData = async (id, updatedData) => {
    const db = await openDB();
    const transaction = db.transaction([CATEGORY_OBJECT_STORE_NAME], "readwrite");
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
  
export const getAllCategoryData = async () => {
  const db = await openDB();
  const transaction = db.transaction([CATEGORY_OBJECT_STORE_NAME], "readonly");
  const objectStore = transaction.objectStore(CATEGORY_OBJECT_STORE_NAME);

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
  const transaction = db.transaction([CATEGORY_OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(CATEGORY_OBJECT_STORE_NAME);
  
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

export const insertDefaultData = async (defaultData) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([CATEGORY_OBJECT_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(CATEGORY_OBJECT_STORE_NAME);

    return Promise.all(
      defaultData.map((data) => {
        return new Promise((resolve, reject) => {
          const request = objectStore.add(data);
          request.onsuccess = () => {
            console.log(`Default data added:`, data);
            resolve(true);
          };
          request.onerror = (event) => {
            console.error(`Error adding default data: ${event.target.error}`);
            reject(event.target.error);
          };
        });
      })
    );
  } catch (error) {
    console.error("Error inserting default data:", error);
    throw error;
  }
};
