const $: typeof document.querySelector = document.querySelector.bind(document);

const openBtn = $('#open-btn') as HTMLButtonElement;
const closesBtn = $('#closes-btn') as HTMLButtonElement;
const sidebar = $('#sidebar') as HTMLDivElement;

const busHistoryWrapper = $('.bus-history') as HTMLDivElement;
const busHistoryForm = $('.bus-history-form') as HTMLDivElement;

export const init = () => {
    openBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    })
    
    closesBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    })

    busHistoryWrapper.addEventListener('click', e => {
        if ((e.target as HTMLElement).nodeName === 'IMG') {
            busHistoryForm.classList.toggle('show');
            (e.target as HTMLElement).classList.toggle('imgRotateY');
            busHistoryWrapper.classList.toggle('change-border-radius')
        }
    })
    
    busHistoryForm.addEventListener('click', e => {
        let tar = e.target as HTMLElement;
        if(tar.classList.value === 'bus-history-form show'){
            return
        }
        while(tar.classList.value !== 'bus-template'){
            tar = tar.parentElement as HTMLElement;
        };
        
        (tar.querySelector('.bus-infor-form') as HTMLDivElement).classList.toggle('dropdown')
    })
}

