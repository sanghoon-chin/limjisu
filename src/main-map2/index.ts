import './index.css';

const $: typeof document.querySelector = document.querySelector.bind(document);
const $$: typeof document.querySelectorAll = document.querySelectorAll.bind(document);

const buttons = $$<HTMLButtonElement>('button');
const btns = $$('#drop-down-btn');
const username = $('.user-name') as HTMLSpanElement;
let busMoneyAdd = $('#bus-money-add') as HTMLDivElement;
let busMoneyTemplate = $<HTMLTemplateElement>('#bus-money-section-template');

let currentUser: (string | null) = null;
        
const check = () => {
    const cookies = document.cookie.split(';')
    for(let data of cookies){
        if(data.includes('username')){
            currentUser = data.split('=')[1]
            break;
        }
    }
    if(currentUser){
        return true
    } else{
        return false
    }
}

const init = () => {
    let isLoggedIn = check();
    if(isLoggedIn){
        username.innerHTML = currentUser as string
    } else{
        username.innerHTML = '로그인 해주세요'
        username.addEventListener('click', () => {
            location.href = '../Login-map/Login-map.html';
        })
    }
}


window.addEventListener('DOMContentLoaded', init);

buttons.forEach(button =>
  button.addEventListener("click", () => {
    ($('#sidebar') as HTMLDivElement).classList.toggle("collapsed");
  })
)

const dropdown = () => {
    // for(let i = 0; i < btns.length; i++){
    //   btns[i].addEventListener('click', (e)  => {
    //     const section = (e.target as HTMLDivElement).parentElement.nextElementSibling
    //     section.classList.toggle('show')
    //     e.target.classList.toggle('imgRotateY')
    //     e.target.parentElement.classList.toggle('change-border-radius')
    // })
}
} 

const createDiv = () => {
    for(let i = 0 ; i < 3 ; i++){
      const clone = busMoneyTemplate.content.cloneNode(true)
      clone.querySelector('#day-time').innerHTML = '2021년 2월 3일 오후 03:25 안산'
      clone.querySelector('#bus-number-money').innerHTML = '3번 버스 1,200원'
      busMoneyAdd.appendChild(clone)
    }
}

createDiv()
dropdown()