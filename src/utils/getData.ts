import { BUSINFO, LANLOG, RODDATA } from "../main-map2/interface";
import { APIKey } from '../config/index';
import * as API1 from '../data/apiList1';
import { url, origin } from '../data/apiList2';
import { IKakaoLatLng } from "tenel-kakao-map";

type GETDATA = (origin: string, path: string | undefined, query: string, method?: string) => Promise<any>

export const getData: GETDATA = (origin, path, query, method='GET') => {
    const url = `${origin}/${path}?${query}`;
    return fetch(url, {method}).then(res => res.text());
}

// areaId - businfo 를 캐싱
const busInfoCache = new Map<string, BUSINFO[]>();

export const fetchBusInfo = async (areaId: string) => {
    if(busInfoCache.has(areaId)) return busInfoCache.get(areaId) as BUSINFO[]

    const queries = new URLSearchParams()
    queries.append('ServiceKey', APIKey['경기']);
    queries.append('areaId', areaId);

    const result = await getData(origin, url.get('운행지역별노선번호목록조회'), queries.toString())
    const htmlDom = new DOMParser().parseFromString(result, 'text/html');

    const routeNames = htmlDom.querySelectorAll('routename');
    const routeIds = htmlDom.querySelectorAll('routeid')

    const data: BUSINFO[] = []
    for(let i = 0; i < routeNames.length; i++){
        data.push({
            busId: routeIds[i].innerHTML,
            busNumber: routeNames[i].innerHTML,
        })
    }
    busInfoCache.set(areaId, data)
    return data;
}


// routeId - busstom 를 캐싱
const busStopCache = new Map<string, LANLOG[]>();

export const fetchBusStopInfo = async (routeId: string) => {
    if(busStopCache.has(routeId)) return busStopCache.get(routeId) as LANLOG[]

    const queries = new URLSearchParams()
    queries.append('ServiceKey', APIKey['경기']);
    queries.append('routeId', routeId);

    const result = await getData(origin, url.get('경유정류소목록조회'), queries.toString())
    const htmlDom = new DOMParser().parseFromString(result, 'text/html')

    const gpslati = htmlDom.querySelectorAll('y')
    const gpslong = htmlDom.querySelectorAll('x')

    const data: LANLOG[] = [];
    for (let i = 0; i < gpslati.length; i++) {
        data.push({
            latlng: new kakao.maps.LatLng(
                Number(gpslati[i].innerHTML), 
                Number(gpslong[i].innerHTML)
            )
        })
    }
    busStopCache.set(routeId, data)
    return data;
}


// routeId - busstom 를 캐싱
const busRoadCache = new Map<string, RODDATA[]>();

export const fetchBusRoad = async (routeId: string) => {
    if(busRoadCache.has(routeId)) return busRoadCache.get(routeId) as RODDATA[]

    const queries = new URLSearchParams()
    queries.append('ServiceKey', APIKey['경기']);
    queries.append('routeId', routeId);

    const result = await getData(origin, url.get('노선형상정보목록조회'), queries.toString())
    const htmlDom = new DOMParser().parseFromString(result, 'text/html')

    const busroutelinelist = htmlDom.querySelectorAll('busroutelinelist')

    const data: RODDATA[] = []

    for(let i = 0 ; i < busroutelinelist.length ; i++){
        const y = busroutelinelist[i].querySelector('x')?.innerHTML
        const x = busroutelinelist[i].querySelector('y')?.innerHTML

        data.push({
            x: Number(x),
            y: Number(y)
        })
    }
    busRoadCache.set(routeId, data)
    return data;
}

export const fetchCurrentBusPosition = async (areaId: string, routeId: string) => {

    const queries = new URLSearchParams()
    queries.append('ServiceKey', APIKey['국토']);
    queries.append('cityCode', areaId);
    queries.append('routeId', routeId);

    const result = await getData(API1.origin, API1.url.get('노선별버스위치목록조회'), queries.toString())
    const htmlDom = new DOMParser().parseFromString(result, 'text/html')

    const X = htmlDom.querySelectorAll('gpslati')
    const Y = htmlDom.querySelectorAll('gpslong')
    const place = htmlDom.querySelectorAll('nodenm')
    const item = htmlDom.querySelectorAll('item')

    const positions: {
        title: string,
        latlng: IKakaoLatLng
    }[] = [];
    for (let i = 0; i < item.length; i++) {
        positions.push({ //버스 좌표를 가져와서 positions에 넣어줌
            title: place[i].innerHTML,
            latlng: new kakao.maps.LatLng(
                Number(X[i].innerHTML), 
                Number(Y[i].innerHTML)
            )
        })
    }
    
    return positions;
}