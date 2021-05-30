let version = 1;
let dbName = 'project'

const db = indexedDB.open(dbName, version);

// DB 구조 생성
db.addEventListener('upgradeneeded', evt => {
    const db = evt.target.result;
    const store = db.createObjectStore('users', {
        keyPath: 'username',
        autoIncrement: false
    })
    store.createIndex('birth', 'birth', {unique: false});
    store.createIndex('email', 'email', {unique: true});
}, {once: true})