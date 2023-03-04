/**
 * 热门线路
 */
import { HotLine, NavigationType } from "../../../types";

const HOT_LINE: HotLine[] = [
  {
    id: 1,
    title: '巩华家园附近出发进入六环主路',
    start: {
      lnglat: [116.274918,40.143854],
      keyWord: '顺沙路 19 号院 3 区南门',
      relativeArea: ['顺沙路 19 号院, 1、2、3、4 区，即路松街 87、88、89、90 号院', '巩华家园', '三水青清庄园'],
      isSave: false,
    },
    end: {
      lnglat: [116.328943,40.17084],
      keyWord: '百善收费站',
      relativeArea: ['六环主路，百善收费站进、出口'],
      isSave: false,
    },
    processIsSave: true,
    description: `从起始位置附近进入到 百沙路主路 后，
      沿着 百沙路自西向东 行驶，直到行驶到一个 三叉红绿灯路口，向 左前方 继续沿着百沙路行驶，
      直到前方出现 南百路 ，继续沿着南百路行驶，右转进入顺沙路主路 ，然后在第一个 红绿灯路口 左转，进入六环匝道，进而到达 百善收费站 .`,
    navigation: [
      {
        type: NavigationType.normal,
        text: '从起始位置附近进入到'
      },
      {
        type: NavigationType.road,
        text: '百沙路主路'
      },
      {
        type: NavigationType.road,
        text: '百沙路主路'
      },
      {
        type: NavigationType.normal,
        text: '沿着'
      },
      {
        type: NavigationType.direction,
        text: '百沙路自西向东'
      },
      {
        type: NavigationType.normal,
        text: '行驶，直到行驶到一个'
      },
      {
        type: NavigationType.redLight,
        text: '三叉红绿灯路口'
      },
      {
        type: NavigationType.direction,
        text: '左前方'
      },
      {
        type: NavigationType.normal,
        text: '继续沿着百沙路行驶，直到前方出现'
      },
      {
        type: NavigationType.road,
        text: '南百路'
      },
      {
        type: NavigationType.normal,
        text: '，继续沿着南百路行驶，'
      },
      {
        type: NavigationType.direction,
        text: '右转'
      },
      {
        type: NavigationType.normal,
        text: '进入'
      },
      {
        type: NavigationType.road,
        text: '顺沙路主路'
      },
      {
        type: NavigationType.normal,
        text: '，然后在第一个'
      },
      {
        type: NavigationType.redLight,
        text: '红绿灯路口'
      },
      {
        type: NavigationType.direction,
        text: '左转'
      },
      {
        type: NavigationType.normal,
        text: '，进入六环匝道，进而到达'
      },
      {
        type: NavigationType.tollStation,
        text: '百善收费站'
      },
    ],
    lnglat: {
      avoidPolygons: [
        [
          [116.277517, 40.169843],
          [116.279517, 40.169843],
          [116.277517, 40.167843],
          [116.279517, 40.167843]
        ],
        [
          [116.246046, 40.163198],
          [116.248046, 40.163198],
          [116.246046, 40.161198],
          [116.248046, 40.161198]
        ],
        [
          [116.290339, 40.17625],
          [116.288339, 40.17625],
          [116.290339, 40.17425],
          [116.288339, 40.17425]
        ]
      ],
      // waypoints: [[116.329014, 40.170872]] // 百善收费站
    }
  }
];

export default HOT_LINE;
