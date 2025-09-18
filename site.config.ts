import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://valaxy.site/',
  favicon: "/wlop.svg",
  lang: 'zh-CN',
  title: 'LMing',
  subtitle: 'Think Twice, Code Once',
  author: {
    name: 'LMing',
    avatar: 'https://thirdqq.qlogo.cn/g?b=sdk&nk=1489298615&s=640',
    status: {
      emoji: '🤔'
    },
  },
  description: '别急 想起来才会更新',
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
  },
  encrypt: {
    enable: true,
  }
})
