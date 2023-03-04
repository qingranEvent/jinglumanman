import ShaheFor from './shahe/forbidden';
import ShaheHot from './shahe/hotlines';

/**
 * 摄像头位置
 */
export const FORBIDDEN_POSITION = [
  ...ShaheFor
];
/**
 * 热门导航线路
 */
export const HOT_LINES = [
  ...ShaheHot
];
/**
 * 绘制热门线图
 * driving: 绘制驾车路线插件
 * lineId: 线路 id
 */
export const drawHotLine2Map = (driving: any, lineId: number, AMap: any) => {
  const hotlnglat = HOT_LINES.find(({id}) => id === lineId);
  if (!hotlnglat) {
    console.error(`不存在 id 为 ${lineId} 的热门线路`);
  }
  const tmpWayPoints: unknown[] = [];
  const { start, end } = hotlnglat!;
  const { avoidPolygons, waypoints } = hotlnglat?.lnglat!;
  // 设置避让区域
  if (avoidPolygons) {
    driving.setAvoidPolygons(avoidPolygons.map((polygon) => {
      return polygon.map(([lng, lat]) => (new AMap.LngLat(lng, lat)));
    }));
  }
  // 构造途径点数据
  if (waypoints) {
    waypoints.forEach(([lng, lat]) => {
      tmpWayPoints.push(new AMap.LngLat(lng, lat));
    });
  }
  driving.search(
    new AMap.LngLat(start.lnglat[0], start.lnglat[1]),
    new AMap.LngLat(end.lnglat[0], end.lnglat[1]),
    {
      waypoints: tmpWayPoints
    },
    (status: string, result: any) => {
      if (status === "complete") {
        console.log("绘制驾车路线完成");
        window.ADriving = {
          result
        };
      } else {
        console.error("获取驾车数据失败：" + result);
      }
    }
  );
}