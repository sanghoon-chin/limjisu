import './join-member-map.css'
import db from '../db'

const $: typeof document.querySelector = document.querySelector.bind(document);
const $$: typeof document.querySelectorAll = document.querySelectorAll.bind(document);

const container = $('.container') as HTMLDivElement;
const inputs = $$<HTMLInputElement>('.text-input-box > input');
const divs = $$('.text-input-box > div');
const username = $('#username') as HTMLInputElement
const password = $('#password') as HTMLInputElement
const email = $('#email') as HTMLInputElement
const btn = $('button') as HTMLButtonElement

container.addEventListener('click', () => {
    const msg = ['3글자 이상 입력해 주세요.', '10글자 이상 입력해 주세요.', '20글자 이상 입력해 주세요.']
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

db.addEventListener('success', evt => {
    const temp = evt.target as IDBOpenDBRequest;
    const db = temp.result;

    btn.addEventListener('click', () => {
        if (username.value === '' ||
            password.value === '' ||
            email.value === '') {
            alert('값을 입력해주세요')
            return false
        }
        const store = db.transaction('users', "readwrite").objectStore('users');
        const req2 = store.getAll()
        const userInfo = {
            username: username.value,
            password: password.value,
            email: email.value
        }
        req2.addEventListener('success', e => {
            const db1 = (e.target as IDBRequest).result;
            let bool = false
            for (let i = 0; i < db1.length; i++) {
                if (username.value === db1[i].username) {
                    bool = true
                }
            }
            if (username.validity.valid && password.validity.valid && email.validity.valid) {
                if (!bool) {
                    const req = store.add(userInfo)
                    req.addEventListener('success', e => {
                        alert('가입되었습니다')
                        location.href = './login.html'
                    })
                }
            } else {
                alert('다시 입력해 주세요.')
            }
        })
    })
})

