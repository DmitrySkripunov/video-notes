
const CACHE = 'network-or-cache-v1';
const timeout = 400;
const dbName = "videoNotesDb";
const version = 1; 
const storeName = "videoNotes";
let db;

openDB(() => {
  console.log('success');
});

async function openDB(callback) {
  // ask to open the db
  const openRequest = self.indexedDB.open(dbName, version);
   
  openRequest.onerror = function (event) {
    console.log(
      "Everyhour isn't allowed to use IndexedDB?!" + event.target.errorCode
    );
  };
  
  // upgrade needed is called when there is a new version of you db schema that has been defined
  openRequest.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains(storeName)) {
      // if there's no store of 'storeName' create a new object store
      db.createObjectStore(storeName, { keyPath: "key" }); //some use keyPath: "id" (basically the primary key) - unsure why yet
    }
  };
  
  openRequest.onsuccess = function (event) {
    db = event.target.result;
    if (callback) {
      callback();
    }
  };
}

async function getFromStore(key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = key ? store.get(key) : store.getAll();
  
    request.onsuccess = function (event) {
      resolve(event.target.result);
    };
    
    request.onerror = function () {
      reject(request.error)
    };
  
    transaction.onerror = function (event) {
      reject(event)
      //console.log("trans failed", event);
    };
    transaction.oncomplete = function (event) {
      //console.log("trans completed", event);
    };
  });
}

async function addToStore(key, value) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    const request = store.put({ key, value });

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };

    transaction.onerror = function (event) {
      reject(event);
    };

    transaction.oncomplete = function (event) {
      //console.log("trans completed", event);
    };
  });
}

addEventListener('message', async ({data, source}) => {
  if (data.type === 'LOAD_NOTES') {
    try {
      console.log('LOAD_NOTES');
      const result = await getFromStore(data.key);
      console.log('LOAD_NOTES RESULT:', result);
      source.postMessage({type: 'LOAD_NOTES_SUCCESS', result});
    } catch (e) {
      source.postMessage({type: 'LOAD_NOTES_ERROR', error: e});
    }
  } else if (data.type === 'ADD_NOTE') {
    try {
      const key = await addToStore(data.key, data.blob);
      source.postMessage({type: 'ADD_NOTE_SUCCESS', key});
    } catch (e) {
      source.postMessage({type: 'ADD_NOTE_ERROR', error: e});
    }
  } else {
    //console.log(`The client sent me a message: ${event.data}`);

    //event.source.postMessage('Hi client');
  }
});

self.addEventListener("install", (event) => {
  console.log('installed');
  /*event.waitUntil(
    caches.open(CACHE).then((cache) => {
      //console.log(cache.addAll);
      return cache.addAll([
        "/images/photo.jpg",
        "/styles/article.css",
        "/styles/index.css",
        "/styles/styles.css",
      ]);
    })
  );*/
});

self.addEventListener("activate", (event) => {
  console.log('activated');
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fromNetwork(event.request, timeout).catch((err) => {
      console.log(`Error: ${err.message()}`);
      return fromCache(event.request);
    })
  );
});

function fromNetwork(request, timeout) {
  return new Promise((resolve, reject) => {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      resolve(response);
    }, reject);
  });
}

async function fromCache(request) {
  return caches
    .open(CACHE)
    .then((cache) =>
      cache
        .match(request)
        .then((matching) => matching || Promise.reject("no-match"))
    );
}
