/**
 * 经纬度
 */
export type lnglat = [number, number];
/**
 * 摄像头位置字段信息
 */
export interface CameraPosition {
  id: number; // 摄像头所在位置唯一 id
  lngLat: lnglat; // 该位置的经纬度
  roadInfo: string; // 所在路段描述， eg：百沙路路庄桥
  forbiddenInfo: string; // 拍摄信息，eg：东西双向；东向辅路
  dateTime: string; // 最新上传提醒信息时间
}
/**
 * 地图上一个普通的位置点描述
 */
export interface COMMON_POSITION {
  lnglat: lnglat; // 该位置点的经纬度
  keyWord: string; // 该位置的中文搜索名称
  relativeArea: string[]; // 相关联的区域，即该区域都可以此为基点
  isSave: boolean; // 位置是否在 6 环以内
} 
/**
 * 导航时每一段线路描述的类型
 */
export enum NavigationType {
  normal = 'normal', // 普通描述
  road= 'road', // 关键路名称
  direction = 'direction', // 前进方向
  redLight = 'redLight', // 红绿灯
  tollStation = 'tollStation' // 高速路口收费站
};
/**
 * 地图上的一个区域，通过四个经纬度点确定一个区域
 */
export type Polygon = [lnglat, lnglat, lnglat, lnglat];
/**
 * 导航线路
 */
export interface HotLine {
  id: number; // 线路 id
  title: string; // 线路的关键描述，eg：巩华家园附近出发进入六环主路
  start: COMMON_POSITION; // 起始位置
  end: COMMON_POSITION; // 结束位置
  duration?: COMMON_POSITION[]; // 途径位置点
  processIsSave: boolean; // 线路是否安全，不经过已知摄像头表示安全
  description: string; // 线路详细描述，绕开摄像头的关键信息说明
  navigation: {
    type: NavigationType;
    text: string;
  }[]; // 导航信息
  lnglat: { // 导航关键点信息
    avoidPolygons?: Polygon[]; // 避让区域，最多支持三个
    waypoints?: lnglat[]; // 途径点，最多可以设置 10 个
  }
}
/**
 * 右键工具菜单类型
 */
export enum ContextMenuType {
  start = 'start', // 起点
  end = 'end',  // 终点
  avoid = 'avoid', // 避让点
  waypoint = 'waypoint', // 途径点
}
/**
 * 自定义 marker
 */
export interface CustomMarker {
  marker: Record<string,any>; // marker 实例
  addr: string; // marker 点对应的实际地址
}
/**
 * 自定义线路包含的 marker
 */
export type CustomLineMarks = Record<ContextMenuType, CustomMarker[]>;