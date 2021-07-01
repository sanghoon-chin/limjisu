import { getPosition } from '../utils/getMyPos';

export const initMap = async () => {
    const container = document.querySelector('#map') as HTMLDivElement; //지도를 담을 영역의 DOM 레퍼런스
    const { lat, lon } = await getPosition();
    const options = {
        center: new kakao.maps.LatLng(lat, lon),
        level: 3 //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.BOTTOMLEFT);

    new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(lat, lon)
    }).setMap(map);
    return map
}