import './index.css';
import db from '../db'

const $: typeof document.querySelector = document.querySelector.bind(document);
const $$: typeof document.querySelectorAll = document.querySelectorAll.bind(document);

const userNumber = $('.user-number') as HTMLDivElement;
const username = $('#username') as HTMLInputElement;
const password = $('#password') as HTMLInputElement;
const inputs = $$<HTMLInputElement>('.user-number > input')
const divs = $$<HTMLDivElement>('.msg')
const btn = $('#Login-btn') as HTMLButtonElement
const register = $('#register') as HTMLSpanElement;
const findPassword = $('#find-password') as HTMLSpanElement;
const findId = $('#find-id') as HTMLSpanElement;

userNumber.addEventListener('click', () => {
    const msg = ['3글자 이상 입력해 주세요.', '10글자 이상 입력해 주세요.']
    for (let i = 0; i < inputs.length; i++) {
        const { tooShort } = inputs[i].validity
        if (tooShort) {
            divs[i].innerHTML = msg[i]
            inputs[i].style.border = '1px solid red'
        } else {
            divs[i].innerHTML = ''
            inputs[i].style.border = '1px solid black'
        }
    }
})
register.addEventListener('click', () => {
    location.href = '../join-member-map/join-member-map.html'
})
 findPassword.addEventListener('click', () => {
    location.href = '../Find-password/Find-password.html'
})
 findId.addEventListener('click', () => {
    location.href = '../Find-id/Find-id.html'
})

db.addEventListener('success', evt => {
    const temp = evt.target as IDBOpenDBRequest;
    const db = temp.result
    btn.addEventListener('click', e => {
        const store = db.transaction('users', "readonly").objectStore('users');
        const req = store.getAll()
        if (username.value === '' || password.value === '') {
            alert('값을 입력해주세요');
            return false;
        } else {
            req.addEventListener('success', e => {
                const db1 = (e.target as IDBRequest).result;
                for (let i = 0; i < db1.length; i++) {
                    if (username.value === db1[i].username && password.value === db1[i].password) {
                        alert('로그인 되었습니다.')
                        const d = new Date();
                        d.setMonth(d.getMonth() + 1)
                        document.cookie = `username=${username.value}; expires=${d.toUTCString()}; path=/`;
                        location.href = '../main-map2/main-map2.html'
                    } else {
                        console.log(1);
                        alert('다시 입력해 주세요.')
                        return false
                    }
                }
            })
        }
    })
})