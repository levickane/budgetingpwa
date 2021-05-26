let db;
// create a new db request for a "BudgetDB" database.
const request = window.indexedDB.open('BudgetDB', 1);

request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  const db = event.target.result;

  const BudgetStore = db.createObjectStore('BudgetTable', {
    keyPath: 'BudgetId',
    autoIncrement: true
  });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
  if (err) {
    console.log(err);
  }
};

function saveRecord(record) {
  console.log(record);
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.
  const transaction = db.transaction(['BudgetTable'], 'readwrite');
  const BudgetStore = transaction.objectStore('BudgetTable');
  BudgetStore.add(record);
}

function checkDatabase() {
  const db = request.result;
  const transaction = db.transaction(['BudgetTable'], 'readwrite');
  const BudgetStore = transaction.objectStore('BudgetTable');
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable
  const getAll = BudgetStore.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then(() => {
          const db = request.result;
          const transaction = db.transaction(['BudgetTable'], 'readwrite');
          const objectStore = transaction.objectStore('BudgetTable');
          objectStore.clear();
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);