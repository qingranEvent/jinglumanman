import { message } from "antd";
import {
  ContextMenuType,
  CustomMarker,
  CustomLineMarks,
} from "../../../../types";


let rightclickEvent: any = null;
let getAddrFlag = true;
/**
 * 自定义点位
 */
const CUSTOM_PONINTS: CustomLineMarks = {
  start: [],
  end: [],
  avoid: [],
  waypoint: [],
};
export const handleDeleteMarker = (type: ContextMenuType, index: number) => {
  CUSTOM_PONINTS[type]?.splice(index, 1);
};
/**
 * 绘制自定义路线图
 * driving: 绘制驾车路线插件
 * customLineMarks: 自定义线路关键点
 */
export const drawCustomLine2Map = (
  driving: any,
  customLineMarks: CustomLineMarks,
  AMap: any
) => {
  const tmpWayPoints: unknown[] = [];
  const { start, end, avoid, waypoint } = customLineMarks!;
  const startLngLat = start[0].marker.getPosition();
  const endLngLat = end[0].marker.getPosition();
  // 设置避让区域
  if (avoid) {
    // 将每一避让点，转化成一个避让区域
    // 经度左右偏移 0.001，纬度上下偏移 0.01
    const offsetLng = 0.001;
    const offsetLat = 0.01;

    driving.setAvoidPolygons(
      avoid.map(({ marker }) => {
        // 标记处的经纬度
        const { lng, lat } = marker.getPosition();
        // 生成以该点为中心点的一个经纬度区域
        const [leftTop, rightTop, leftBottom, rightBottom] = [
          [lng - offsetLng, lat + offsetLat],
          [lng + offsetLng, lat + offsetLat],
          [lng - offsetLng, lat - offsetLat],
          [lng + offsetLng, lat - offsetLat],
        ];
        return [
          new AMap.LngLat(leftTop[0], leftTop[1]),
          new AMap.LngLat(rightTop[0], rightTop[1]),
          new AMap.LngLat(leftBottom[0], leftBottom[1]),
          new AMap.LngLat(rightBottom[0], rightBottom[1]),
        ];
      })
    );
  }
  // 构造途径点数据
  if (waypoint) {
    waypoint.forEach(({marker}) => {
      // 标记处的经纬度
      const { lng, lat } = marker.getPosition();
      tmpWayPoints.push(new AMap.LngLat(lng, lat));
    });
  }
  driving.search(
    new AMap.LngLat(startLngLat.lng, startLngLat.lat),
    new AMap.LngLat(endLngLat.lng, endLngLat.lat),
    {
      waypoints: tmpWayPoints,
    },
    (status: string, result: any) => {
      if (status === "complete") {
        console.log("绘制驾车路线完成");
        window.ADriving = {
          result,
        };
      } else {
        message.error("获取驾车数据失败，请重新选择路线关联的点位");
        console.error("获取驾车数据失败: ", result);
      }
    }
  );
};
export const initRightClckContextMenu = ({
  AMap,
  mapInstance,
  onSelect,
}: {
  AMap: any;
  mapInstance: any;
  onSelect: (customMarkerMap: CustomLineMarks) => void;
}) => {
  const geocoder = new AMap.Geocoder({
    city: "010", //城市设为北京，默认：“全国”
    radius: 1000, //范围，默认：500
  });
  //创建右键菜单
  const contextMenu = new AMap.ContextMenu();
  const hanndleSelect = (type: ContextMenuType, rightclickEvent: any) => {
    if (!getAddrFlag) {
      return;
    }
    let marker: any;
    const markerList = CUSTOM_PONINTS[type];
    switch (type) {
      case ContextMenuType.start: {
        if (CUSTOM_PONINTS.start.length > 0) {
          mapInstance.remove(CUSTOM_PONINTS.start.shift()?.marker);
        }
        marker = new AMap.Marker({
          map: mapInstance,
          position: rightclickEvent?.lnglat, //基点位置
          content: `
            <div
              class="amap-simple-marker-label"
              style="color: #fff; background-color: green; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%;"
            >
              起
              <span></span>
            </div>
          `,
          // size: [25, 30],
        });
        break;
      }
      case ContextMenuType.end: {
        if (CUSTOM_PONINTS.end.length > 0) {
          mapInstance.remove(CUSTOM_PONINTS.end.shift()?.marker);
        }
        marker = new AMap.Marker({
          map: mapInstance,
          position: rightclickEvent?.lnglat, //基点位置
          content: `
            <div
              class="amap-simple-marker-label"
              style="color: #fff; background-color: red; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%;"
            >
              终
              <span></span>
            </div>
          `,
        });
        break;
      }
      case ContextMenuType.avoid: {
        if (CUSTOM_PONINTS.avoid.length > 2) {
          mapInstance.remove(CUSTOM_PONINTS.avoid.shift()?.marker);
        }
        marker = new AMap.Marker({
          map: mapInstance,
          position: rightclickEvent?.lnglat, //基点位置
          content: `
            <div
              class="amap-simple-marker-label"
              style="color: #fff; background-color: blue; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%;"
            >
              避
              <span></span>
            </div>
          `,
        });
        break;
      }
      case ContextMenuType.waypoint: {
        if (CUSTOM_PONINTS.waypoint.length > 9) {
          mapInstance.remove(CUSTOM_PONINTS.waypoint.shift()?.marker);
        }
        marker = new AMap.Marker({
          map: mapInstance,
          position: rightclickEvent?.lnglat, //基点位置
          content: `
            <div
              class="amap-simple-marker-label"
              style="color: #fff; background-color: black; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%;"
            >
              经
              <span></span>
            </div>
          `,
        });
        break;
      }
    }
    markerList.push({
      marker,
      addr: "",
    });
    contextMenu.close();
    geocoder.getAddress(
      rightclickEvent.lnglat,
      (status: string, result: any) => {
        const curMarker = markerList.slice(-1)[0];
        if (status === "complete" && result.regeocode) {
          curMarker!.addr = result.regeocode.formattedAddress;
        } else {
          curMarker!.addr = "选择的地点暂无对应实际地址";
        }
        getAddrFlag = true;
        onSelect({ ...CUSTOM_PONINTS });
      }
    );
  };
  contextMenu.addItem(
    "设为起点",
    () => {
      hanndleSelect(ContextMenuType.start, rightclickEvent);
    },
    0
  );
  contextMenu.addItem(
    "设为终点",
    () => {
      hanndleSelect(ContextMenuType.end, rightclickEvent);
    },
    1
  );

  contextMenu.addItem(
    "设置为避让",
    () => {
      hanndleSelect(ContextMenuType.avoid, rightclickEvent);
    },
    2
  );

  //右键添加Marker标记
  contextMenu.addItem(
    "设为途径",
    () => {
      hanndleSelect(ContextMenuType.waypoint, rightclickEvent);
    },
    3
  );

  //地图绑定鼠标右击事件——弹出右键菜单
  mapInstance.on("click", function (e: any) {
    contextMenu.open(mapInstance, e.lnglat);
    rightclickEvent = e;
  });
  return contextMenu;
};
