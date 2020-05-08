{{#if one}}
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
  title: 'Remax Web Template',
};
{{else}}
module.exports = {
  pages: ['pages/index/index'],
  window: {
    navigationBarTitleText: 'Remax {{ platformTitle }} Template',
    navigationBarBackgroundColor: '#282c34'
  }
};
{{/if}}
