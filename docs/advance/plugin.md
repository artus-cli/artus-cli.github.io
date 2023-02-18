
# 插件机制

## 如何定义插件

插件的机制跟定义跟 artus 的插件一样的，当插件中通过 `DefineCommand` 定义了指令，也会自动被加载，所以插件可以做的很强大且方便，可以用来拓展指令，也可以用来全局拦截，甚至能够用来覆盖已有指令。

插件的实现，可以参考 examples 中的插件例子

- [plugin-help](https://github.com/artus-cli/artus-cli/blob/master/src/plugins/plugin-help/index.ts)：内置的 --help 插件
- [plugin-version](https://github.com/artus-cli/artus-cli/blob/master/src/plugins/plugin-version/index.ts)：内置的 --version 插件
- [plugins/plugin-codegen](https://github.com/artus-cli/examples/tree/master/plugins/plugin-codegen)：新增 codegen 单独指令的 demo
- [plugins/plugin-codegen-extra](https://github.com/artus-cli/examples/tree/master/plugins/plugin-codegen-extra)：拓展 codegen 指令的 demo

## 配置及开启插件

```typescript
// config/plugin.ts
export default {
  help: {
    enable: true,
    package: 'plugin-help',
  },
};
```
