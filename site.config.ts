import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://valaxy.site/',
  favicon: "/favicon.svg",
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
  codeHeightLimit: 400,
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
      name: 'E-Mail',
      link: 'mailto:lizhantao213@qq.com',
      icon: 'i-ri-mail-line',
      color: '#73c2fb',
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
  mediumZoom: {
    enable: true
  },
  sponsor: {
    enable: false,
  },
  encrypt: {
    enable: true,
  }
})
