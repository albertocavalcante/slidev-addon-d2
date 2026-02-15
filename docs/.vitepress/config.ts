import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'slidev-addon-d2',
  description: 'D2 diagram support for Slidev presentations',
  base: '/slidev-addon-d2/',

  head: [
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'slidev-addon-d2' }],
    ['meta', { name: 'og:description', content: 'D2 diagram support for Slidev presentations' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'Options', link: '/options' },
      { text: 'Themes', link: '/themes' },
      { text: 'Live Demo', link: '/demo/', target: '_blank' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Options', link: '/options' },
          { text: 'Themes', link: '/themes' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/albertocavalcante/slidev-addon-d2' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
    },
  },
})
