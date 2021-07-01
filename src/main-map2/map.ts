import type { IKakaoLatLng, IKakaoMap, IKakaoMarker } from 'tenel-kakao-map';
import { getPosition } from '../utils/getMyPos';

const busMarker: string = require('../assets/marker_bus.png');

const MARKERS = {
    stop: new kakao.maps.MarkerImage(
        'https://image.flaticon.com/icons/png/512/3448/3448339.png', 
        new kakao.maps.Size(38, 38)
    ),
    bus: new kakao.maps.MarkerImage(
        busMarker, 
        new kakao.maps.Size(38, 38)
    )
}

let map: IKakaoMap

const $: typeof document.querySelector = document.querySelector.bind(document);

const roadmapControl = $('.btnRoadmap') as HTMLSpanElement;
const skyviewControl = $('.btnSkyview') as HTMLSpanElement;
const mapTypeContainer = $('.map-type-container') as HTMLSpanElement;

export const createMarkers = (positions: IKakaoLatLng[], markerType: keyof typeof MARKERS) => {

    let markers: IKakaoMarker[] = []
    for(const position of positions){
        const marker: IKakaoMarker = new kakao.maps.Marker({
            map, // 마커를 표시할 지도
            position, // 마커를 표시할 위치
            image: MARKERS[markerType] // 마커 이미지 
        })

        marker.setMap(map)
        markers.push(marker)
    }
    return markers
}

export const initMap = async () => {
    const container = document.querySelector('#map') as HTMLDivElement; //지도를 담을 영역의 DOM 레퍼런스
    const { lat, lon } = await getPosition();
    const options = {
        center: new kakao.maps.LatLng(lat, lon),
        level: 3 //지도의 레벨(확대, 축소 정도)
    };

    map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.BOTTOMLEFT);

    new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(lat, lon)
    }).setMap(map);

    const setMapType = (div) => { 
        roadmapControl.classList.remove('active')
        skyviewControl.classList.remove('active')

        if(div === roadmapControl){
            map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
            div.classList.add('active') 
        } else if (div === skyviewControl){
            map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);   
            div.classList.add('active')
        }
    }
    
    mapTypeContainer.addEventListener('click', (e:Event) => {
        setMapType(e.target as HTMLSpanElement)
    })

    setMapType(roadmapControl)

    return map
}