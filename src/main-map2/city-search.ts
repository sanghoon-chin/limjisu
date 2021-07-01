import { areaIds } from '../data/arealds'
import { sharedData } from './sharedData'

const $: typeof document.querySelector = document.querySelector.bind(document);

const areaWrapper = $('#bus-area-wrapper') as HTMLDivElement;
const areaInput = $('.bus-area-search') as HTMLInputElement;

const busNumberWrapper = $('#bus-num-wrapper') as HTMLDivElement;
const busNumberInput = $('.bus-number-search') as HTMLInputElement;

const search = $('.bus-search') as HTMLButtonElement;

const clear = () => {
    areaWrapper.innerHTML = ''
}

const render = () => {
    clear()

    const areas = getFilteredAreas()
    for (let i = 0; i < areas.length; i++) {
        const div = document.createElement('div')
        const city = areas[i].cityName
        div.dataset.type = 'city'
        div.dataset.cityId = areas[i].cityId
        div.innerHTML = city
        areaWrapper.appendChild(div)
    }
}

const changeDataset = () => {
    search.dataset.type = 'search'
    search.innerHTML = '검색'
}

const getFilteredAreas = () => {
    return areaIds.filter(({ cityName }) => {
        return cityName.includes(areaInput.value)
    })
}

const cityIncludes = () => {
    changeDataset()
    areaInput.style.backgroundColor = 'white'
    areaWrapper.style.border = 'none'
    busNumberInput.value = ''
    busNumberWrapper.innerHTML = ''
    render()
}

export const init = () => {
    areaInput.addEventListener('input', () => {
        cityIncludes()//input value의 includes해서 div appendChild
    })

    document.body.addEventListener('click', () => {
        clear()
    })
    
    areaWrapper.addEventListener('click', e => {
        const tar = e.target as HTMLDivElement;
        if (tar.nodeName !== 'DIV') return 
        if (tar.dataset.type === 'city') {
            sharedData.selectedAreaId = tar.dataset.cityId
            areaInput.value = tar.innerHTML;
            clear()
        }
    })
}