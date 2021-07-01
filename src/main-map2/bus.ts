import { IKakaoMap, IKakaoMarker } from "tenel-kakao-map";
import { fetchCurrentBusPosition } from "../utils/getData";
import { createMarkers } from "./map";

const $: typeof document.querySelector = document.querySelector.bind(document);

const busNumberWrapper = $('#bus-num-wrapper') as HTMLDivElement;
const busNumberInput = $('.bus-number-search') as HTMLInputElement;

let map: IKakaoMap;

let busMarkers: IKakaoMarker[] = []

const deleteBusMarker = () => {
    for(const m of busMarkers)
        m.setMap(null)
    busMarkers = []
}

export const setBusMarker = async (areaId: string, routeId: string) => { //버스의 위치를 요청하여 저장해준다음 drawMarker로 넘겨줌
    deleteBusMarker();

    busNumberInput.style.backgroundColor = 'white'
    busNumberWrapper.innerHTML = ''

    const positions = await fetchCurrentBusPosition(areaId, routeId)
    busMarkers = createMarkers(positions.map(el => el.latlng), 'bus')                                
}

export const init = (_map: IKakaoMap) => {
    map = _map;
}