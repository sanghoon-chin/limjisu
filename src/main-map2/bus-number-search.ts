import type { BUSINFO } from './interface'
import type { IKakaoLatLng, IKakaoMap, IKakaoMarker, IKakaoPolyline } from 'tenel-kakao-map';
import { fetchBusInfo, fetchBusRoad, fetchBusStopInfo } from '../utils/getData';
import { sharedData } from './sharedData'
import { createMarkers } from './map';

const $: typeof document.querySelector = document.querySelector.bind(document);

const areaWrapper = $('#bus-area-wrapper') as HTMLDivElement;
const areaInput = $('.bus-area-search') as HTMLInputElement;

const busNumberWrapper = $('#bus-num-wrapper') as HTMLDivElement;
const busNumberInput = $('.bus-number-search') as HTMLInputElement;

const search = $('.bus-search') as HTMLButtonElement;

let map: IKakaoMap;

const clear = () => {
    areaWrapper.innerHTML = ''
}

const getFilteredNumbers = async (areaId: string): Promise<BUSINFO[]> => {
    const busInfo = await fetchBusInfo(areaId)
    return busInfo.filter(({ busNumber }) => busNumber.includes(busNumberInput.value))
}

const render = async () => {
    if(sharedData.selectedAreaId == null) return;

    busNumberWrapper.innerHTML = ''

    const numbers = await getFilteredNumbers(sharedData.selectedAreaId)
    for(const { busId, busNumber } of numbers) {
        const div = document.createElement('div')
        div.innerHTML = busNumber + '번'
        div.dataset.type = 'city'
        div.dataset.id = busId
        busNumberWrapper.appendChild(div)
    }
}

const changeDataset = () => {
    search.dataset.type = 'search'
    search.innerHTML = '검색'
}

const busNumberPush = async () => {
    changeDataset()

    areaInput.style.backgroundColor = 'white'
    busNumberWrapper.style.border = 'none'
    busNumberWrapper.style.left = '170px'

    render()
}

let busStopMarkers: IKakaoMarker[] = [];

const deleteBusStopMarker = () => {
    for (let i = 0; i < busStopMarkers.length; i++) {
        busStopMarkers[i].setMap(null)
    }
    busStopMarkers = []
}

const setBusStopMarker = async () => {
    if(sharedData.selectedRouteId == null) return;

    deleteBusStopMarker()

    const busStopPositions = await fetchBusStopInfo(sharedData.selectedRouteId)
    const markers = createMarkers(busStopPositions.map(el => el.latlng), 'stop')
    busStopMarkers.push(...markers)
}


let busRoadPolyline: IKakaoPolyline|null = null;

const deleteBusRoad = () => {
    busRoadPolyline?.setMap(null)
    busRoadPolyline = null
}

const getBusRoadData = async () => {
    if(sharedData.selectedRouteId == null) return;

    deleteBusRoad()

    const data = await fetchBusRoad(sharedData.selectedRouteId);
    const linePath: IKakaoLatLng[] = data.map(({x, y}) => {
        return new kakao.maps.LatLng(x, y)
    })

    busRoadPolyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 5, // 선의 두께 입니다
        strokeColor: '#10e449', // 선의 색깔입니다
        strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    })
    busRoadPolyline.setMap(map);
}

busNumberWrapper.addEventListener('click', e => {
    const tar = e.target as HTMLDivElement

    if (tar.nodeName !== 'DIV') return
    if (tar.dataset.type === 'city') {
        busNumberInput.value = tar.innerHTML;
        sharedData.selectedRouteId = tar.dataset.id;

        getBusRoadData()
        setBusStopMarker()
        
        clear()
    }
})

export const init = (_map: IKakaoMap) => {
    
    map = _map;

    busNumberInput.addEventListener('click', () => {
        busNumberPush() //버스 number fetch() 한후 bus number 넣어줌
    })

    busNumberInput.addEventListener('input', () => {
        if(busNumberInput.value == '') {
            clear()
            sharedData.selectedRouteId = undefined
        } else {
            busNumberPush() //버스 number fetch() 한후 bus number 넣어줌
        }
    })
    
    document.body.addEventListener('click', () => {
        clear()
    })
}