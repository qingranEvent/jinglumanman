import { CameraPosition } from "types";
import { FORBIDDEN_POSITION } from '../../../positions/index'

export const addForbiddenMarker = ({
  AMap,
  instance
}: {
  AMap: any; // 地图全局对象
  instance: any; // 地图实例
}) => {
  const icon = {
    // 图标类型，现阶段只支持 image 类型
    type: 'image',
    // 图片 url
    image: 'https://vdata.amap.com/icons/b18/1/2.png',
    // 图片尺寸
    size: [16, 16],
    // 图片相对 position 的锚点，默认为 bottom-center
    anchor: 'center',
  };
  const text = {
    // 要展示的文字内容
    content: '中邮速递易',
    // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
    direction: 'right',
    // 在 direction 基础上的偏移量
    offset: [-20, -5],
    // 文字样式
    style: {
        // 字体大小
        fontSize: 12,
        // 字体颜色
        fillColor: '#22886f',
        // 描边颜色
        strokeColor: '#fff',
        // 描边宽度
        strokeWidth: 2,
    }
  };
  // 创建 LabelsLayer
  const labelsLayer = new AMap.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
    // 该层内标注是否避让
    collision: true,
    // 设置 allowCollision：true，可以让标注避让用户的标注
    allowCollision: true,
  });
  // 批量添加 labelMarker
  FORBIDDEN_POSITION.forEach(({ lngLat }) => {
    if (lngLat) {
      const labelMarker = new AMap.LabelMarker({
        name: '标注2', // 此属性非绘制文字内容，仅最为标识使用
        position: lngLat,
        zIndex: 16,
        // 将第一步创建的 icon 对象传给 icon 属性
        icon: icon,
        // 将第二步创建的 text 对象传给 text 属性
        // text: text,
      });
      labelsLayer.add(labelMarker);
    }
  });
  instance.add(labelsLayer);
}
