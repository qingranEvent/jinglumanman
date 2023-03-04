import React, { useEffect, useState } from 'react';
import AMapLoader from "@amap/amap-jsapi-loader";
import { Card, Tabs, Typography, List, Button, message } from "antd";
import { cloneDeep } from "lodash";
import { initLoadPlugins } from '../plugins';
import { HOT_LINES, drawHotLine2Map } from "../positions";
import { addForbiddenMarker } from './components/marker'
import {
  initRightClckContextMenu,
  handleDeleteMarker,
  drawCustomLine2Map,
} from "./components/rightContextMenu";
import styles from './index.less';
import { NavigationType, ContextMenuType, CustomLineMarks } from "../../types";

let AMap: any;
let mapInstance: any;
let contextMenu: any;
let driving: any;
const defaultCustomLineMarks: CustomLineMarks = {
  [ContextMenuType.start]: [],
  [ContextMenuType.end]: [],
  [ContextMenuType.avoid]: [],
  [ContextMenuType.waypoint]: [],
};
/**
 * 线路推荐工具
 */
const RecommendTools: React.FC<{
  customeLineMarkers: CustomLineMarks;
  tabKey: string;
  onTabChange: (type: string) => void;
  onDeleteMarker: (type: ContextMenuType, index: number) => void;
  onloadNavigation: () => void;
  onClearNavgation: () => void;
}> = ({
  customeLineMarkers: { start, end, avoid, waypoint },
  tabKey,
  onDeleteMarker,
  onTabChange,
  onloadNavigation,
  onClearNavgation,
}) => (
  <Tabs
    defaultActiveKey="search_line"
    key={tabKey}
    onChange={(tab) => {
      onTabChange(tab);
    }}
    className={styles["tabs-container"]}
  >
    <Tabs.TabPane key="hot_line" tab="热门线路" disabled>
      <div className={styles["hot-lines"]}>
        {HOT_LINES.map(
          ({ id, title, description, start, end, duration, navigation }) => (
            <Card title={title} key={id} className={styles["line-item"]}>
              <div className={styles.start}>
                <div className={styles.position}>
                  <span className={styles.row1}>
                    <span className={styles.tit}>起点：</span>
                    <span>{start.keyWord}</span>
                  </span>
                  <span className={styles.row2}>
                    <span className={styles.tit}>周边区域：</span>
                    <span>{start.relativeArea.join("。 ")}</span>
                  </span>
                </div>
              </div>
              <div className={styles.end}>
                <div className={styles.position}>
                  <span className={styles.row1}>
                    <span className={styles.tit}>终点：</span>
                    <span>{end.keyWord}</span>
                  </span>
                  <span className={styles.row2}>
                    <span className={styles.tit}>周边区域：</span>
                    <span>{end.relativeArea.join(", ")}</span>
                  </span>
                </div>
              </div>
              {duration && (
                <div className={styles.duration}>
                  {duration.map((point) => (
                    <span>{point.keyWord}</span>
                  ))}
                </div>
              )}
              <div className={styles.description}>
                <Typography.Paragraph
                  copyable={{
                    text: description,
                    tooltips: ["复制", "复制成功"],
                    format: "text/plain",
                  }}
                  ellipsis={{
                    rows: 3,
                    expandable: true,
                    symbol: "查看详情",
                    tooltip: description,
                  }}
                >
                  {navigation.map(({ type, text }, index) => (
                    <Typography.Text
                      mark={type !== NavigationType.normal}
                      key={index}
                    >
                      {text}
                    </Typography.Text>
                  ))}
                </Typography.Paragraph>
              </div>
            </Card>
          )
        )}
      </div>
    </Tabs.TabPane>
    <Tabs.TabPane key="search_line" tab="自定义线路">
      <div className={styles["custom-line"]}>
        {/* 点击生成导航路线 */}
        <div className={styles["btn-wrapper"]}>
          <Button onClick={onloadNavigation}>生成</Button>
          <Button onClick={onClearNavgation}>清除</Button>
        </div>
        <div className={styles.item}>
          <h4 className={styles.tit}>选择起始位置</h4>
          <Typography.Paragraph mark>{start[0]?.addr}</Typography.Paragraph>
        </div>
        <div className={styles.item}>
          <h4 className={styles.tit}>选择目标位置</h4>
          <Typography.Paragraph mark>{end[0]?.addr}</Typography.Paragraph>
        </div>
        <div className={styles.item}>
          <h4 className={styles.tit}>设置避让点(地图右键选择)</h4>
          {avoid.length > 0 && (
            <List
              dataSource={avoid}
              renderItem={({ addr }, index) => (
                <List.Item>
                  <Typography.Paragraph type="danger">
                    {addr}
                    <a
                      key="list-loadmore-edit"
                      onClick={() => {
                        // 右键实例区域的变量更新
                        handleDeleteMarker(ContextMenuType.avoid, index);
                        // 当前组件的状态变更
                        onDeleteMarker(ContextMenuType.avoid, index);
                      }}
                    >
                      移除
                    </a>
                  </Typography.Paragraph>
                </List.Item>
              )}
            />
          )}
        </div>
        <div className={styles.item}>
          <h4 className={styles.tit}>设置中途经过点(地图右键选择)</h4>
          {waypoint.length > 0 && (
            <List
              dataSource={waypoint}
              renderItem={({ addr }, index) => (
                <List.Item>
                  <Typography.Paragraph type="success">
                    {addr}
                    <a
                      key="list-loadmore-edit"
                      onClick={() => {
                        // 右键实例区域的变量更新
                        handleDeleteMarker(ContextMenuType.avoid, index);
                        // 当前组件的状态变更
                        onDeleteMarker(ContextMenuType.avoid, index);
                      }}
                    >
                      移除
                    </a>
                  </Typography.Paragraph>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Tabs.TabPane>
  </Tabs>
);

export default function HomePage() {
  const [tabName, setTabName] = useState("search_line");
  const [customeLineMarkers, setCustomeLineMarkers] = useState<CustomLineMarks>(
    defaultCustomLineMarks
  );
  const onDeleteMarker = (type: ContextMenuType, index: number) => {
    const newMarkers = cloneDeep(customeLineMarkers);
    const tmpMarker = newMarkers[type]?.[index]?.marker;
    mapInstance.remove(tmpMarker);
    newMarkers[type]?.splice(index, 1);
    setCustomeLineMarkers(newMarkers);
  };
  useEffect(() => {
    AMapLoader.load({
      key: "263eaad74d51c7e0bce9c0380b237809", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((oriAMap) => {
        AMap = oriAMap;
        mapInstance = new AMap.Map("map-container", {
          resizeEnable: true,
          center: [116.397428, 39.90923], //地图中心点
          zoom: 14, //地图显示的缩放级别
        });
        // 添加摄像头
        addForbiddenMarker({
          AMap,
          instance: mapInstance,
        });
        // 加载插件
        initLoadPlugins(AMap, mapInstance, (oriDriving: any) => {
          driving = oriDriving;
          if (tabName === 'hot_line') {
            drawHotLine2Map(driving, 1, AMap);
          }
        });
        // 右键菜单
        contextMenu = initRightClckContextMenu({
          AMap,
          mapInstance,
          onSelect: (markers) => {
            setCustomeLineMarkers(cloneDeep(markers));
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  console.log("tabName", tabName);
  return (
    <div className={styles.container}>
      {/* <div className={styles.header}></div> */}
      <div className={styles.main}>
        <Card className={styles.slide}>
          <RecommendTools
            tabKey={tabName}
            onTabChange={(tab) => {
              setTabName(tab);
            }}
            customeLineMarkers={customeLineMarkers}
            onDeleteMarker={onDeleteMarker}
            onloadNavigation={() => {
              // 线路合法校验
              if (
                customeLineMarkers.start.length === 0 ||
                customeLineMarkers.end.length === 0
              ) {
                message.warning("起始位置和目标位置不可为空");
                return;
              }
              drawCustomLine2Map(driving, customeLineMarkers, AMap);
            }}
            onClearNavgation={() => {
              driving.clear();
              Object.keys(customeLineMarkers).forEach((key) => {
                customeLineMarkers[key as ContextMenuType].forEach(({ marker }) =>
                  mapInstance.remove(marker)
                );
              });
              setCustomeLineMarkers(defaultCustomLineMarks);
            }}
          />
        </Card>
        <Card className={styles.content} id="map-container"></Card>
        <div className={styles['text-pannel']} id="panel"></div>
      </div>
    </div>
  );
}
