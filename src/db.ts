const version:number = 1;
const dbName:string = 'project';

let db = indexedDB.open(dbName, version);

db.addEventListener('upgradeneeded', (evt:IDBVersionChangeEvent) => {
    const db = (evt.target as IDBOpenDBRequest).result;
    const store = db.createObjectStore('users', {
        keyPath: 'username',
        autoIncrement: false
    });
    store.createIndex('name', 'neam', {unique: true});
}, {once: true})

export default db