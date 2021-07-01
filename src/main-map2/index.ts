import './index.css';
import db from '../db';

import { initMap} from './map';
import { IKakaoMap, IKakaoMarker } from 'tenel-kakao-map'

import { check, getCurrentUser } from './auth';
import { init as initCitySearch } from './city-search'
import { init as initBusNumberSearch } from './bus-number-search'
import { init as initSideBar } from './sidebar'
import { init as initBus, setBusMarker } from './bus'
import { sharedData } from './sharedData'

const $: typeof document.querySelector = document.querySelector.bind(document);

const username = $('.user-name') as HTMLSpanElement;
const busMoneyTemplate = $('.bus-history-form > template') as HTMLTemplateElement;

const search = $('.bus-search') as HTMLButtonElement;

let map: IKakaoMap;

(async () => {
    map = await initMap();
    initCitySearch()
    initBusNumberSearch(map)
    initBus(map)
    initSideBar()
})();

const init = () => {
    if (check()) {
        username.innerHTML = getCurrentUser();
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

let markers: IKakaoMarker[] = [];

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

// const createHistoryList = (lists, busInfo) => {
//     busHistoryForm.innerHTML = ''
//     const InfoName:string[] = ['지역', '기점', '종점', '첫차시간', '막차시간', '배차간격(평일)', '배차간격(토요일)', '배차간격(일요일)']
//     const infoIdName:string[] = ['area', 'stat', 'last', 'start-time', 'last-time', 'weekday-stop-time', 'saturday-stop-time', 'sunday-stop-time']

//     for (let i = 0; i < lists.length; i++) {
//         const clone = busMoneyTemplate.content.cloneNode(true) as HTMLElement;
//         const busNum = clone.querySelector('.bus-fee') as HTMLDivElement;
//         busNum.innerHTML = lists[i].searchTime + ' ' + lists[i].busArea;
//         const busFee = clone.querySelector('.bus-num') as HTMLElement;
//         busFee.innerHTML = lists[i].busNum + '번 버스';
//         //bus-infor-form 버스 정보 저장
//         for(let j = 0 ; j < InfoName.length ; j++ ){
//             const id = '#' + infoIdName[j] as string
//             const d = clone.querySelector(id) as HTMLElement
//             d.innerHTML = busInfo[i][InfoName[j]]
//         }
        
//         busHistoryForm.appendChild(clone)
//     }
// }


// const busMarkerCut = () => {
//     search.dataset.type = 'search'
//     search.innerHTML = '검색'
//     cityinput.value = ''
//     citynum.value = ''
//     for (let i = 0; i < setcutmarkers.length; i++) {
//         setcutmarkers[i].setMap(null)
//     }
// }



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

    // const saveOrGet = (positions) =>{
    //     if (positions.length) { //버스의 위치의 좌표가 있을떄
    //         search.dataset.type = 'cut'
    //         search.innerHTML = '삭제'
    //         if(!currentUser){
    //             return
    //         } else{
    //             // db에 버스 정보를 저장하는 함수
    //             //creatIdbUserInfo()
    //         }
    //     } else if (positions.length === 0) {
    //         alert('버스 번호를 다시 입력해 주세요.')
    //         search.dataset.type = 'search'
    //         search.innerHTML = '검색'
    //         citynum.value = ''
    //         cityinput.value = ''
    //         initMap()
    //     }
    // }

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
            // busMarkerCut()
        }
    })

    const updateLiveBusLoc = () => {
        // 나중에 버스위치를 업데이트할 필요가 없을 때 사용할 변수
        window.clearInterval(setI)
        setI = window.setInterval(()=>{
            if(sharedData.selectedAreaId == null || sharedData.selectedRouteId == null) {
                window.clearInterval(setI)
                return
            }

            setBusMarker(sharedData.selectedAreaId, sharedData.selectedRouteId)
        }, interval);
    }

})