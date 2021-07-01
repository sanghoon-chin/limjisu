import './index.css';
import db from '../db';

import { myAPIKey } from '../config/index';
import { getData } from '../utils/getData';

import {initMap} from './map';
import {IKakaoMap, IKakaoLatLng, IKakaoMarker, IKakaoPolyline} from 'tenel-kakao-map'

import endpoint from '../data/reqApiList';
import {url, origin} from '../data/apiList2';

import {areaIds} from '../data/arealds'

const requestOrigin: string = `http://openapi.tago.go.kr/openapi/service/`;

const $: typeof document.querySelector = document.querySelector.bind(document);
const $$: typeof document.querySelectorAll = document.querySelectorAll.bind(document);

const loadingGif = $('#loading-gif') as HTMLImageElement

const openBtn = $('#open-btn') as HTMLButtonElement;
const closesBtn = $('#closes-btn') as HTMLButtonElement;
const username = $('.user-name') as HTMLSpanElement;
const sidebar = $('#sidebar') as HTMLDivElement;
let busHistoryWrapper = $('.bus-history') as HTMLDivElement;
const busHistoryForm = $('.bus-history-form') as HTMLDivElement;
let busMoneyTemplate = $('.bus-history-form > template') as HTMLTemplateElement;


const cityinput = $('.bus-area-search') as HTMLInputElement;
const citynum = $('.bus-number-search') as HTMLInputElement;

const search = $('.bus-search') as HTMLButtonElement;
//const busStopbtn = $('#bus-marker-search');
//const cutbtn = $('#cut');

const areaWrapper = $('#bus-area-Wrapper') as HTMLDivElement;
const busNumWapper = $('#bus-num-wrapper') as HTMLDivElement;

const roadmapControl = $('.btnRoadmap') as HTMLSpanElement;
const skyviewControl = $('.btnSkyview') as HTMLSpanElement;
const mapTypeContainer = $('.map-type-container') as HTMLSpanElement;


let city: CITYDATA[] = []
let busNum: BUSINFO[] = []
//let time = []

let map: IKakaoMap;

(async () => {
    map = await initMap();
})();

interface IDBBUSINFO {
    'busArea': string;
    'busNum': string;
    'username': string;
    'searchTime': String;
}

interface LANLOG {
    latlng: IKakaoLatLng
}

interface POSITION {
    title: string;
    latlng: IKakaoLatLng
}

interface RODDATA{
    x: number;
    y: number;
}

interface CITYDATA{
    cityName: string;
    cityId: string;
}

interface BUSINFO{
    busNumber: string;
    busId: string;
}
let currentUser: (string | null) = null;

const check = () => {
    const cookies = document.cookie.split(';')
    for (let data of cookies) {
        if (data.includes('username')) {
            currentUser = data.split('=')[1]
            break;
        }
    }
    if (currentUser) {
        return true
    } else {
        return false
    }
}

const init = () => {
    let isLoggedIn = check();
    if (isLoggedIn) {
        username.innerHTML = currentUser as string;
        //loadHistory();
    } else {
        username.innerHTML = '로그인 해주세요'
        username.style.fontSize = '18px'
        username.style.marginLeft = '25px'
        username.addEventListener('click', () => {
            location.href = './login.html';
        })
    }
}

window.addEventListener('DOMContentLoaded', init);

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

const render = (datas, div1) => {
    div1.innerHTML = ''

    for (let i = 0; i < datas.length; i++) {
        const div = document.createElement('div')
        if(datas[i].cityName){
            const city = datas[i].cityName
            div.dataset.type = 'city'
            div.dataset.cityId = datas[i].cityId
            div.innerHTML = city
        } else if (datas[i].busNumber){
            const number = datas[i].busNumber
            div.dataset.type = 'city'
            div.innerHTML = number + '번'
            div.dataset.id = datas[i].busId
        }
        div1.appendChild(div)
    }
}

const cityIncludes = () => {
    changeDataset()
    city = []
    cityinput.style.backgroundColor = 'white'
    areaWrapper.style.border = 'none'
    citynum.value = ''
    busNumWapper.innerHTML = ''

    for (let i = 0; i < areaIds.length; i++) {
        if (areaIds[i].cityName.includes(cityinput.value)) {
            city.push({
                cityName: areaIds[i].cityName,
                cityId:areaIds[i].cityId
            })
        }
    }

    render(city, areaWrapper)
}

const busNumberPush = async () => {
    changeDataset()
    busNum = []

    cityinput.style.backgroundColor = 'white'
    busNumWapper.style.border = 'none'
    busNumWapper.style.left = '170px'

    const queries3 = new URLSearchParams()
    queries3.append('ServiceKey', myAPIKey);
    queries3.append('areaId', cityinput.dataset.id  as string);

    const result3 = await getData(origin, url.get('운행지역별노선번호목록조회'), queries3.toString())
    let dom3 = new DOMParser();
    let htmlDom = dom3.parseFromString(result3, 'text/html');

    const routeNames = htmlDom.querySelectorAll('routename');
    const routeids = htmlDom.querySelectorAll('routeid')

    
    if(citynum.value){
        for (let i = 0; i < routeNames.length; i++) {
            const name = routeNames[i].innerHTML
            const id = routeids[i].innerHTML
            if (name.includes(citynum.value)) {
                busNum.push({
                    busNumber: name,
                    busId: id
                })
            }
        }
    } else if(citynum.value === ''){
        for (let i = 0; i < routeNames.length; i++) {
            busNum.push({
                busNumber: routeNames[i].innerHTML,
                busId: routeids[i].innerHTML
            })
        }
    }
    
    render(busNum, busNumWapper)
}

const busNumberAppend = (div) => {
    changeDataset()
    busNum = []
    render(busNum, busNumWapper)

    busNumWapper.style.border = 'none'
    citynum.value = div.innerHTML;
    citynum.style.backgroundColor = 'F4F4F4'
}

let markers: IKakaoMarker[] = [];

let setmarkers: IKakaoMarker[] = [];

let setcutmarkers: IKakaoMarker[] = [];

let busID: (null | String | HTMLElement) = null;

type FUNC = () => string

const getCurrentTime: FUNC = () => {

    const getCurrentTime = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth() + 1;  
        const date = d.getDate();  
        const hour = d.getHours()
        const minute = d.getMinutes()
        const sum = `${year}년 ${month}월 ${date}일 ${hour}:${minute}`
        return String(sum)
    }

    const d = getCurrentTime()
    return d
}

const createHistoryList = (lists, busInfo) => {
    busHistoryForm.innerHTML = ''
    const InfoName:string[] = ['지역', '기점', '종점', '첫차시간', '막차시간', '배차간격(평일)', '배차간격(토요일)', '배차간격(일요일)']
    const infoIdName:string[] = ['area', 'stat', 'last', 'start-time', 'last-time', 'weekday-stop-time', 'saturday-stop-time', 'sunday-stop-time']

    for (let i = 0; i < lists.length; i++) {
        const clone = busMoneyTemplate.content.cloneNode(true) as HTMLElement;
        const busNum = clone.querySelector('.bus-fee') as HTMLDivElement;
        busNum.innerHTML = lists[i].searchTime + ' ' + lists[i].busArea;
        const busFee = clone.querySelector('.bus-num') as HTMLElement;
        busFee.innerHTML = lists[i].busNum + '번 버스';
        //bus-infor-form 버스 정보 저장
        for(let j = 0 ; j < InfoName.length ; j++ ){
            const id = '#' + infoIdName[j] as string
            const d = clone.querySelector(id) as HTMLElement
            d.innerHTML = busInfo[i][InfoName[j]]
        }
        
        busHistoryForm.appendChild(clone)
    }
}


const drawMarker = (positions, points) => { //positions 가져와서 마커를 그려줌
    const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        // 마커 이미지의 이미지 크기 입니다
        const imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다    
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지 
        })
        markers.push(marker)
        setcutmarkers.push(marker)
    }

    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map)
    }

    // let bounds = new kakao.maps.LatLngBounds(null, null);

    // const setBounds = () => {
    //     for (let i = 0; i < points.length; i++) {
    //         // LatLngBounds 객체에 좌표를 추가합니다
    //         bounds.extend(points[i]);
    //     }
    //     map.setBounds(bounds);
    // }

    // setBounds()
}

const busStopMarker = async () => {
    for (let i = 0; i < setmarkers.length; i++) {
        setmarkers[i].setMap(null)
    }

    const queries4 = new URLSearchParams()
    queries4.append('ServiceKey', myAPIKey);
    queries4.append('routeId', citynum.dataset.id as string);

    const result4 = await getData(origin, url.get('경유정류소목록조회'), queries4.toString())
    let dom4 = new DOMParser()
    let htmlDom = dom4.parseFromString(result4, 'text/html')

    console.log(htmlDom);
    

    const gpslati = htmlDom.querySelectorAll('y')
    const gpslong = htmlDom.querySelectorAll('x')

    const positions1: LANLOG[] = [];

    for (let i = 0; i < gpslati.length; i++) {
        let lan = gpslati[i].innerHTML
        let lon = gpslong[i].innerHTML

        positions1.push({
            latlng: new kakao.maps.LatLng(Number(lan), Number(lon))
        })
    }

    // 마커 이미지의 이미지 주소
    const busimageSrc = "https://image.flaticon.com/icons/png/512/3448/3448339.png";

    for (let i = 0; i < positions1.length; i++) {
        const pos = positions1[i];
        // 마커 이미지의 이미지 크기 입니다
        const imageSize2 = new kakao.maps.Size(38, 38);

        // 마커 이미지를 생성합니다    
        const markerImage2 = new kakao.maps.MarkerImage(busimageSrc, imageSize2);

        // 마커를 생성합니다
        const marker: IKakaoMarker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: pos.latlng, // 마커를 표시할 위치
            image: markerImage2 // 마커 이미지 
        })
        setmarkers.push(marker)
    }

    for (let i = 0; i < markers.length; i++) {
        setmarkers[i].setMap(map)
    }
}

const busStopMarkerCut = () => {
    for (let i = 0; i < setmarkers.length; i++) {
        setmarkers[i].setMap(null)
    }
}

const busMarkerCut = () => {
    search.dataset.type = 'search'
    search.innerHTML = '검색'
    cityinput.value = ''
    citynum.value = ''
    for (let i = 0; i < setcutmarkers.length; i++) {
        setcutmarkers[i].setMap(null)
    }
}

const changeDataset = () => {
    search.dataset.type = 'search'
    search.innerHTML = '검색'
}

const getBusRoadData = async () => {

    const queries = new URLSearchParams()
    queries.append('ServiceKey', myAPIKey);
    queries.append('routeId', citynum.dataset.id as string);
    
    
    const result = await getData(origin, url.get('노선형상정보목록조회'), queries.toString())
    let dom = new DOMParser()
    let htmlDom = dom.parseFromString(result, 'text/html')
    
    const busroutelinelist = htmlDom.querySelectorAll('busroutelinelist')
    const data:RODDATA[] = []

    for(let i = 0 ; i < busroutelinelist.length ; i++){
        const y = busroutelinelist[i].querySelector('x')?.innerHTML
        const x = busroutelinelist[i].querySelector('y')?.innerHTML

        data.push({
            x: Number(x),
            y: Number(y)
        })
    }
    const linePath:IKakaoLatLng[] = data.map(({x, y}) => {
        return new kakao.maps.LatLng(x, y)
    })

    const polyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 5, // 선의 두께 입니다
        strokeColor: '#10e449', // 선의 색깔입니다
        strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    }).setMap(map);
}

const setMapType = (div) => { 
    roadmapControl.classList.remove('push-but')
    skyviewControl.classList.remove('push-but')
    if(div.classList.value === 'btnRoadmap'){
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
        div.classList.add('push-but') 
    } else if (div.classList.value === 'btnSkyview'){
        map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);   
        div.classList.add('push-but')
    }
}


cityinput.addEventListener('input', () => {
    cityIncludes()//input value의 includes해서 div appendChild
})

document.body.addEventListener('click', () => {
    city = []
    render(city, areaWrapper)
    
    busNum = []
    render(busNum, busNumWapper)
})

areaWrapper.addEventListener('click', e => {
    const tar = e.target as HTMLDivElement;
    if(tar.nodeName !== 'DIV') return 
    if (tar.dataset.type === 'city') {
        cityinput.dataset.id = ''
        cityinput.dataset.id = tar.dataset.cityId;
        cityinput.value = tar.innerHTML;
        city = []
        render(city, areaWrapper)
    }
})

citynum.addEventListener('click', () => {
    busNumberPush() //버스 number fetch() 한후 bus number 넣어줌
})

citynum.addEventListener('input', () => {
    busNumberPush() //버스 number fetch() 한후 bus number 넣어줌
})

busNumWapper.addEventListener('click', e => {
    const tar = e.target as HTMLDivElement

    if(tar.nodeName !== 'DIV') return
    if (tar.dataset.type === 'city') {
        citynum.value = tar.innerHTML;
        citynum.dataset.id = ''
        citynum.dataset.id = tar.dataset.id;

        getBusRoadData()
        busStopMarker()
        
        busNum = []
        render(busNum, busNumWapper)
    }
})

db.addEventListener('success', (e) => {
    const db = (e.target as IDBOpenDBRequest).result;
    
    // const creatIdbUserInfo = () => {
    //     const transaction = db.transaction('busInfo', 'readwrite')
    //     const store = transaction.objectStore('busInfo');
    //     const temp: IDBBUSINFO = {
    //         'busArea': cityinput.value,
    //         'busNum': citynum.value,
    //         'username': currentUser as string,
    //         'searchTime': getCurrentTime()
    //     }
    //     const req = store.add(temp)
    //     req.addEventListener('success', (e) => {
    //         console.log('저장 성공')
    //     })
    //     getHistoryList()
    // }
    
    // const getHistoryList = () => {
    //     const store = db.transaction('busInfo', 'readwrite').objectStore('busInfo');
    //     const d = store.index('username')
    //     const req1 = d.getAll(currentUser)
    //     req1.addEventListener('success', async(e) => {
    //         const db1 = (e.target as IDBRequest).result;
    //         const data = await getBusInfo(db1)
    //         createHistoryList(db1, data)
    //     })
    // }

    // getHistoryList()
    
    // const busMarker = async () => { //버스의 위치를 요청하여 저장해준다음 drawMarker로 넘겨줌
    //     citynum.style.backgroundColor = 'white'
    //     busNumWapper.innerHTML = ''
    
    //     for (let i = 0; i < markers.length; i++) {
    //         markers[i].setMap(null)
    //     }
    
    //     for (let i = 0; i < setmarkers.length; i++) {
    //         setmarkers[i].setMap(null)
    //     }
    
    //     markers = []
    
    //     const queries = new URLSearchParams()
    //     queries.append('ServiceKey', myAPIKey);
    //     queries.append('cityCode', busNumber[cityinput.value]);
    //     queries.append('routeNo', citynum.value);
    
    //     const result = await getData(requestOrigin, endpoint.get('노선번호목록조회'), queries.toString())
    //     let dom = new DOMParser()
    //     let htmlDom = dom.parseFromString(result, 'text/html')
    
    //     const routeno = htmlDom.querySelectorAll('routeno')
    
    //     for (let i = 0; i < routeno.length; i++) {
    //         if (routeno[i].innerHTML === citynum.value) {
    //             let busID1 = (routeno[i].parentElement as HTMLElement).querySelector('routeid') as HTMLElement;
    //             busID = busID1.innerHTML
    //         }
    //     }
    
    //     const queries2 = new URLSearchParams()
    //     queries2.append('ServiceKey', myAPIKey);
    //     queries2.append('cityCode', busNumber[cityinput.value]);
    //     queries2.append('routeId', busID as string);
    
    //     const result2 = await getData(requestOrigin, endpoint.get('노선별버스위치목록조회'), queries2.toString())
    //     let dom2 = new DOMParser()
    //     let htmlDom1 = dom2.parseFromString(result2, 'text/html')
    //     마커를 표시할 위치와 title 객체 배열입니다 
    
    //     let points: IKakaoLatLng[] = [];
    //     let positions: POSITION[] = [];
    
    //     const X = htmlDom1.querySelectorAll('gpslati')
    //     const Y = htmlDom1.querySelectorAll('gpslong')
    //     const place = htmlDom1.querySelectorAll('nodenm')
    //     const item = htmlDom1.querySelectorAll('item')
    
    //     for (let i = 0; i < item.length; i++) {
    //         let lan = X[i].innerHTML
    //         let lon = Y[i].innerHTML
    //         let _place = place[i].innerHTML
    //         positions.push({ //버스 좌표를 가져와서 positions에 넣어줌
    //             title: _place,
    //             latlng: new kakao.maps.LatLng(Number(lan), Number(lon))
    //         })
    //         points.push(new kakao.maps.LatLng(Number(lan), Number(lon)))
    //     }
    
    
    //     drawMarker(positions, points)                                        

    //     saveOrGet(positions)
    // }

    const saveOrGet = (positions) =>{
        if (positions.length) { //버스의 위치의 좌표가 있을떄
            search.dataset.type = 'cut'
            search.innerHTML = '삭제'
            if(!currentUser){
                return
            } else{
                // db에 버스 정보를 저장하는 함수
                //creatIdbUserInfo()
            }
        } else if (positions.length === 0) {
            alert('버스 번호를 다시 입력해 주세요.')
            search.dataset.type = 'search'
            search.innerHTML = '검색'
            citynum.value = ''
            cityinput.value = ''
            initMap()
        }
    }

    // const getBusInfo = async (dbdata) => {
    //     let busID: (String | null) = null
    //     let busInfo: object[] = []

    //     for (let i = 0; i < dbdata.length; i++) {
    //         const queries = new URLSearchParams()
    //         queries.append('ServiceKey', myAPIKey);
    //         queries.append('cityCode', busNumber[dbdata[i].busArea]);
    //         queries.append('routeNo', dbdata[i].busNum);

    //         const result = await getData(requestOrigin, endpoint.get('노선번호목록조회'), queries.toString())
    //         let dom = new DOMParser()
    //         let htmlDom = dom.parseFromString(result, 'text/html')

    //         const routeno = htmlDom.querySelectorAll('routeno')

    //         for (let j = 0; j < routeno.length; j++) {
    //             if (routeno[j].innerHTML === dbdata[i].busNum) {
    //                 let busID1 = (routeno[j].parentElement as HTMLElement).querySelector('routeid') as HTMLElement;
    //                 busID = busID1.innerHTML
    //             }
    //         }

    //         const queries1 = new URLSearchParams()
    //         queries1.append('ServiceKey', myAPIKey);
    //         queries1.append('cityCode', busNumber[dbdata[i].busArea]);
    //         queries1.append('routeId', busID as string);

    //         const result1 = await getData(requestOrigin, endpoint.get('노선정보항목조회'), queries1.toString())
    //         let dom1 = new DOMParser()
    //         let htmlDom1 = dom1.parseFromString(result1, 'text/html')

    //         const startnodenm = htmlDom1.querySelector('startnodenm') as HTMLDivElement //기점
    //         const endnodenm = htmlDom1.querySelector('endnodenm') as HTMLDivElement //종점
    //         const startvehicletime = htmlDom1.querySelector('startvehicletime') //첫차시간
    //         const endvehicletime = htmlDom1.querySelector('endvehicletime') as HTMLDivElement //막차시간
    //         const intervaltime = htmlDom1.querySelector('intervaltime') //배차간격(평일)
    //         const intervalsattime = htmlDom1.querySelector('intervaltime') //배차간격(토요일)
    //         const intervalsuntime = htmlDom1.querySelector('intervalsuntime') //배차간격(일요일)

    //         const start = `${startvehicletime?.innerHTML.slice(0, 2)}:${startvehicletime?.innerHTML.slice(2, 4)}`
    //         const end = `${endvehicletime?.innerHTML.slice(0, 2)}:${endvehicletime?.innerHTML.slice(2, 4)}`

    //         busInfo.push({
    //             '지역': dbdata[i].busArea,
    //             '기점': startnodenm.innerHTML,
    //             '종점': endnodenm.innerHTML,
    //             '첫차시간': start,
    //             '막차시간': end,
    //             '배차간격(평일)': '배차간격(평일) ' + intervaltime?.innerHTML + '분',
    //             '배차간격(토요일)': '배차간격(토요일) ' + intervalsattime?.innerHTML + '분',
    //             '배차간격(일요일)': '배차간격(일요일) ' + intervalsuntime?.innerHTML + '분'
    //         })

    //         busID = null
    //     }
    //     console.log(busInfo);

    //     return busInfo
    // }

    let interval:number = 5000;
    let setI:number

    search.addEventListener('click', (e: MouseEvent) => {
        if ((e.target as HTMLButtonElement).dataset.type === 'search') {
            updateLiveBusLoc()
        } else if ((e.target as HTMLElement).dataset.type === 'cut') {
            busMarkerCut()
        }
    })

    const updateLiveBusLoc = () => {
        // 나중에 버스위치를 업데이트할 필요가 없을 때 사용할 변수
        //setI = window.setInterval(busMarker, interval);
    }

})
mapTypeContainer.addEventListener('click', (e:Event) => {
    const div = e.target as HTMLSpanElement
    setMapType(div)
})




/*
busStopbtn.addEventListener('click', () => {
    busStopMarker() //정류소 위치를 표시
})
busStopMarkerCut() //버스 정류소 마커 삭제
*/

// 함수 => 재사용 / 요청을 하는 함수, 데이터를 가공하는 함수, 