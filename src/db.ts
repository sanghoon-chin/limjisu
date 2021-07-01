const version:number = 1;
const dbName:string = 'project';

let db = indexedDB.open(dbName, version);

db.addEventListener('upgradeneeded', (evt:IDBVersionChangeEvent) => {
    const db = (evt.target as IDBOpenDBRequest).result;
    const store = db.createObjectStore('users', {
        keyPath: 'username',
        autoIncrement: false
    });
    /**
     * bus-number
     * bus-fee
     * username
     * 
     */
    const store2 = db.createObjectStore('busInfo', {
        keyPath: 'id',
        autoIncrement: true
    });
    store.createIndex('username', 'username', {unique: false});
    store2.createIndex('username', 'username', {unique: false})
}, {once: true})

export default db