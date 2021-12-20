<% if (one) { -%>
const pages = ['pages/index/index'];
const color = '#282c34';

import { AppConfig as WechatAppConfig } from 'remax/wechat';
import { AppConfig as AliAppConfig } from 'remax/ali';
import { AppConfig as ToutiaoAppConfig } from 'remax/toutiao';
import { AppConfig as WebAppConfig } from 'remax/web';

export const wechat: WechatAppConfig = {
  pages,
  window: {
    navigationBarBackgroundColor: color,
    navigationBarTitleText: 'Remax One Wechat',
  },
};

export const ali: AliAppConfig = {
  pages,
  window: {
    defaultTitle: 'Remax One Ali',
    titleBarColor: color,
  },
};

export const toutiao: ToutiaoAppConfig = {
  pages,
  window: {
    navigationBarTitleText: 'Remax One Toutiao',
    navigationBarBackgroundColor: color,
  },
};

export const web: WebAppConfig = {
  pages,
  window: {
    // 页面默认标题
    defaultTitle: 'Remax Web Template',
    // 是否全局开启下拉刷新
    pullRefresh: false,
    // 触底滚动的默认距离，单位 px
    reachBottomOffset: 50,
  },
  router: {
    // history 类型，支持 hash 和 browser
    type: 'hash',
  },
  // tab bar 配置
  tabBar: {
    // 背景色
    backgroundColor: '#fff',
    // 选中状态的 tab 标题颜色
    selectedColor: 'red',
    // tab 标题颜色
    titleColor: 'blue',
    // tab 对象列表
    items: [
      {
        // tab 标题
        title: '标题',
        // tab 对应页面路由
        url: 'pages/index/index',
        // tab 显示的图片地址
        image: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
        // tab 选中后的显示的图片地址
        activeImage: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
      },
    ],
  },
};
<% } else { -%>
import { AppConfig } from "remax/<%= platform %>";

const config: AppConfig = {
  pages: ['pages/index/index'],
  window: {
    navigationBarTitleText: 'Remax <%= platformTitle %> Template With TypeScript',
    navigationBarBackgroundColor: '#282c34'
  }
};

export default config;
<% } -%>
