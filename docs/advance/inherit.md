# 框架继承

## 如何配置

跟 artus 中的上层框架的继承一样，在 `config/framework.ts` 中定义需要继承的 CLI 框架即可。可以参考 examples 中的上层封装例子：

- [egg-bin](https://github.com/artus-cli/examples/tree/master/egg-bin)：类似于 egg-bin 的 demo
- [chair-bin](https://github.com/artus-cli/examples/tree/master/chair-bin)：继承 egg-bin 的 demo

每个 CLI 都可以作为一个上层框架被更上层的 CLI 所继承，只需要配置

```typescript
// config/framework.ts

export default {
  package: 'your-cli-name'
}
```
