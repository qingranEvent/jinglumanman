/**
 * 加载地图插件
 */
export const initLoadPlugins = (AMap: any, mapInstance: any, callback: any) => {
  // 1、ToolBar 地图放大缩小工具
  AMap.plugin(["AMap.ToolBar", "AMap.Driving", "AMap.Geocoder"], function () {
    const toolbar = new AMap.ToolBar();
    mapInstance.addControl(toolbar);
    const driving = new AMap.Driving({
      map: mapInstance,
      panel: "panel",
      policy: AMap.DrivingPolicy.REAL_TRAFFIC,
    });
    window.APlugins = {
      ready: true,
      plugins: ["ToolBar", "AMap.Driving", "AMap.Geocoder"],
      driving,
    };
    if (typeof callback === "function") {
      callback(driving);
    }
  });
};