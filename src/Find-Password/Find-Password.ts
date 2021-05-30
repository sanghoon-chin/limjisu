import db from '../db'

const $: typeof document.querySelector = document.querySelector.bind(document);
const $$: typeof document.querySelectorAll = document.querySelectorAll.bind(document);

const idInput = $('.id-input') as HTMLInputElement;
const btn = $('#btn') as HTMLButtonElement;
const btn1 = $('.btn') as HTMLButtonElement;
const userNumber = $('#user-number') as HTMLDivElement;
const userPassword = $('#user-password') as HTMLDivElement
const password = $('#password') as HTMLDivElement

userPassword.classList.add('display-none')

db.addEventListener('success', evt => {
    const temp = evt.target as IDBOpenDBRequest;
    const db = temp.result;

    btn.addEventListener('click', () => {
        if (idInput.value === '') {
            alert('값을 입력해주세요')
            return false
        }
        const store = db.transaction('users', 'readwrite').objectStore('users');
        const req = store.getAll()

        req.addEventListener('success', e => {
            const db1 = (e.target as IDBRequest).result;
            for (let i = 0; i < db1.length; i++) {
                if (idInput.value === db1[i].username) {
                    password.innerHTML = `비밀번호는 '${db1[i].password}' 입니다.`
                    userNumber.classList.add('display-none')
                    userPassword.classList.remove('display-none')
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