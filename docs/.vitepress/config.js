import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Artus CLI',
  description: 'Modern CLI Framework base on artus.js',
  root: {
    label: 'Chinese',
    lang: 'cn',
  },
  base: '/',
  themeConfig: {
    outline: 'deep',
    nav: [
      { text: 'QuickStart', link: '/guide/quickstart' },
      { text: 'Plugins', link: '/plugins/index' },
      { text: 'Changelog', link: 'https://github.com/artus-cli/artus-cli/blob/master/CHANGELOG.md' },
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
        text: '高级用法',
        items: [
          { text: '指令', link: '/advance/command.md' },
          { text: '多环境', link: '/advance/env.md' },
          { text: '插件机制', link: '/advance/plugin.md' },
          { text: '框架继承', link: '/advance/framework.md' },
          { text: 'Program & Util', link: '/advance/program_util.md' },
        ],
      },
      {
        text: '插件列表',
        link: '/plugins/index',
      },
    ],
  },
});
