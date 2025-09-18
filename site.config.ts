import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://valaxy.site/',
  favicon: "/wlop.svg",
  lang: 'zh-CN',
  title: 'LMing',
  subtitle: 'An infinite universe...',
  author: {
    name: 'LMing',
    status: {
      emoji: '🤔'
    },
  },
  description: '想要成为一个有趣的人ヾ(^∀^)ﾉ',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/ZhantaoLi',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'BiliBili',
      link: 'https://space.bilibili.com/1078303870',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
  ],

  redirects: {
    // Valaxy 采用文章文件名作为导航，不支持 Hexo 的日期层级和指定 ID
    // 为了防止访客进入以前网址导致 404，可以添加重定向
    useVueRouter: false,
    rules: [
      {
        from: '/posts/38835.html',
        to: '/posts/hello-valaxy',
      },
    ]
  },

  search: {
    // 本地搜索：https://valaxy.site/guide/third-party#%E6%90%9C%E7%B4%A2
    enable: false,
  },

  license: {
    enabled: false,
  },

  statistics: {
    // 阅读时间
    enable: true,
    readTime: {
      speed: {
        cn: 300,
        en: 200,
      },
    },
  },
  sponsor: {
    enable: false,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: '',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: '',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: '',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
  encrypt: {
    // 文章加密：https://valaxy.site/guide/page#%E9%A1%B5%E9%9D%A2%E5%8A%A0%E5%AF%86
    enable: true,
  }
})
