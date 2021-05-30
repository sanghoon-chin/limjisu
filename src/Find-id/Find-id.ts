import db from '../db'

const $: typeof document.querySelector = document.querySelector.bind(document);
const $$: typeof document.querySelectorAll = document.querySelectorAll.bind(document);

const emaliInput = $('.emali-input') as HTMLInputElement;
const userEmali = $('#user-emali') as HTMLDivElement
const userid = $('#user-id') as HTMLDivElement
const id = $('#id') as HTMLDivElement
const btn = $('#btn') as HTMLDivElement
const btn1 = $('.btn') as HTMLDivElement

userid.classList.add('display-none')

db.addEventListener('success', evt => {
    const temp = evt.target as IDBOpenDBRequest;
    const db = temp.result;

    btn.addEventListener('click', () => {
        if (emaliInput.value === '') {
            alert('값을 입력해주세요')
            return false
        }
        const store = db.transaction('users', 'readwrite').objectStore('users');
        const req = store.getAll()

        req.addEventListener('success', e => {
            const db1 = (e.target as IDBRequest).result;
            for (let i = 0; i < db1.length; i++) {
                if (emaliInput.value === db1[i].email) {
                    id.innerHTML = `아이디는 '${db1[i].username}' 입니다.`
                    userEmali.classList.add('display-none')
                    userid.classList.remove('display-none')
                } else {
                    alert('다시 입력 해주세요.')
                }
            }
        })
    })

    btn1.addEventListener('click', () => {
        location.href = '../Login-map/Login-map.html';
    })
})