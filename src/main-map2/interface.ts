import type { IKakaoLatLng } from "tenel-kakao-map";

export interface BUSINFO{
    busNumber: string;
    busId: string;
}

export interface LANLOG {
    latlng: IKakaoLatLng
}

export interface RODDATA{
    x: number;
    y: number;
}

export interface SharedData {
    selectedAreaId?: string
    selectedRouteId?: string
}