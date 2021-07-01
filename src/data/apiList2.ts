const url = new Map<string, string>();
const origin:string = `/api2`;

/**
 * @params keyword number ex)30    
 * @description 노선번호에 해당하는 노선 목록을 조회한다.
 */
url.set('노선번호목록조회', 'busrouteservice/getBusRouteList');


/**
 * @params areaId number ex)운행지역ID 02
 * @params keyword number ex)노선번호 30   
 * @description 운행지역ID와 노선번호에 해당하는 노선 목록을 조회한다.
 */
url.set('운행지역별노선번호목록조회', 'busrouteservice/getAreaBusRouteList');


/**
 * @params routeId number ex)200000085
 * @description 노선ID에 해당하는 노선의 기본 정보 및 배차 정보를 조회한다.
 */
url.set('노선정보항목조회', 'busrouteservice/getBusRouteInfoItem');


/**
 * @params routeId number ex) 200000085
 * @description 노선ID에 해당하는 노선의 경유정류소 목록을 조회한다.
 */
url.set('경유정류소목록조회', 'busrouteservice/getBusRouteStationList');


/**
 * @params routeId number ex)200000085
 * @description 노선 ID에 해당하는 노선 항목 조회 
 */
url.set('노선형상정보목록조회', 'busrouteservice/getBusRouteLineList');



export {
    url,
    origin
};