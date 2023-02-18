import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Artus CLI',
  description: 'Modern CLI Framework base on artus.js',
  root: {
    label: 'Chinese',
    lang: 'cn',
  },
  themeConfig: {
    outline: 'deep',
    nav: [
      { text: 'QuickStart', link: '/guide/quickstart' },
      { text: 'Plugins', link: '/plugins/index' },
      { text: 'Changelog', link: 'https://github.com/artus-cli/artus-cli' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/quickstart' },
        ],
      },
      {
        text: '高级功能',
        items: [
          { text: '插件机制', link: '/advance/plugin.md' },
          { text: '框架继承', link: '/advance/inherit.md' },
          { text: '多环境', link: '/advance/env.md' },
          { text: '高级指令', link: '/advance/inject.md' },
          { text: 'Program & Util', link: '/advance/class.md' },
        ],
      },
      {
        text: '插件列表',
        link: '/plugins/index',
      },
    ],
  },
});
