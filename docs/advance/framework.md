# 框架继承

框架是 artus 中的概念，在 artus-cli 中，你可以认为一个框架就是一个 CLI 工具，通过 artus 的框架能力多个 CLI 可以方便的继承和拓展。

## 框架声明

如果自己的 CLI 工具希望能被其他 CLI 工具继承，只需要跟插件一样定义一个 `meta.json` 声明一下框架名称即可

```json
// meta.json
{
  "name": "your cli name"
}
```

## 如何使用

然后在 `config/plugin.ts` 中将需要继承的 CLI 当成插件引入并且开启即可。


```typescript
// config/plugin.ts

export default {
  yourCli: {
    enable: true,
    package: 'your-cli-name',
  }
}
```

## 示例

可以参考 examples 中的上层封装例子：

- [egg-bin](https://github.com/artus-cli/examples/tree/master/egg-bin)：类似于 egg-bin 的 demo
- [chair-bin](https://github.com/artus-cli/examples/tree/master/chair-bin)：继承 egg-bin 的 demo
