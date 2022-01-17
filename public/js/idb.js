// create variable to hold db connection
let db;

const request = indexedDB.open('budget', 1);


request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;

    db.createObjectStore('new_transaction', { autoIncrement: true });
  };

  // upon a successful 
request.onsuccess = function(event) {

    db = event.target.result;
  
    // If app is online, upload transaction
    if (navigator.onLine) {
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  // Saving record in Index so it can upload when connection is back
function saveRecord(record) {
    
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
 
    const transactionObjectStore = transaction.objectStore('new_transaction');
  

    transactionObjectStore.add(record);
  }

  function uploadTransaction() {
    // open a transaction on your db
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    // access your object store
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    // get all records from store and set to a variable
    const getAll = transactionObjectStore.getAll();


  
// upon a successful .getAll() execution
getAll.onsuccess = function() {

    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_transaction'], 'readwrite');
          const transactionObjectStore = transaction.objectStore('new_transaction');
          // clear all items in your store
          transactionObjectStore.clear();

          alert('All saved transactions has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  }

  window.addEventListener('online', uploadTransaction);