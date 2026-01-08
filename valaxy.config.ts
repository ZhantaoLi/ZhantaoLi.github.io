import type { UserThemeConfig } from 'valaxy-theme-yun'
import { $t, defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'
import { addonMeting } from 'valaxy-addon-meting'
import { addonComponents } from 'valaxy-addon-components'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
  'i-ri-code-box-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: 'LMing',
    },
    nav: [
      {
        text: $t('nav.categories'),
        link: '/categories/',
        icon: 'i-ri-apps-line',
      },
      {
        text: $t('nav.tags'),
        link: '/tags/',
        icon: 'i-ri-bookmark-3-line',
      },
      {
        text: $t('nav.links'),
        link: '/links/',
        icon: 'i-ri-open-arm-line',
      },
      {
        text: $t('nav.websites'),
        link: '/websites/',
        icon: 'i-ri-window-line',
      },
      {
        text: $t('nav.demos'),
        link: '/demos/',
        icon: 'i-ri-code-box-line',
      },
    ],
    pages: [
      {
        name: $t('pages.categories'),
        url: '/categories/',
        icon: 'i-ri-apps-line',
        color: 'dodgerblue',
      },
      {
        name: $t('pages.tags'),
        url: '/tags/',
        icon: 'i-ri-bookmark-3-line',
        color: 'dodgerblue',
      },
      {
        name: $t('pages.links'),
        url: '/links/',
        icon: 'i-ri-open-arm-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2025,
      beian: {
        enable: false,
        icp: 'xICP备xxxxxx号',
      },
      icon: {
        enable: false,
        title: 'Home',
        url: 'https://zhantaoli.github.io/',
      }
    },
  },
  modules: {
    rss: {
      enable: true,
      fullText: false,
    },
  },

  siteConfig: {
    comment: {
      enable: true,
    },
  },
  addons: [
    addonWaline({
      serverURL: 'https://walinelming.vercel.app/',
      pageview: true,
      comment: true,
    }),
    addonMeting({
      global: true,
      props: {
        id: '13112729612',
        server: 'netease',
        type: 'playlist',
        autoplay: false,
        theme: "#409EFF",
      },
      options: {
        lyricHidden: true,
      },
    }),
    addonComponents(),
  ],
  unocss: { safelist },
})
