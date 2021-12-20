<% if (one) { %>
const pages = ['pages/index/index'];

module.exports.ali = {
  pages,
  window: {
    defaultTitle: 'Remax Ali Template',
    titleBarColor: '#282c34',
  },
};

module.exports.wechat = {
  pages,
  window: {
    navigationBarTitleText: 'Remax Wechat Template',
    navigationBarBackgroundColor: '#282c34',
  },
};

module.exports.toutiao = {
  pages,
  window: {
    navigationBarTitleText: 'Remax Toutiao Template',
    navigationBarBackgroundColor: '#282c34',
  },
};

module.exports.web = {
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
<% } else { %>
module.exports = {
  pages: ['pages/index/index'],
  window: {
    navigationBarTitleText: 'Remax <%= platformTitle %> Template',
    navigationBarBackgroundColor: '#282c34'
  }
};
<% } %>
