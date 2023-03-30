# 指令

指令除了前面说的常规用法之外，还有一些高级用法。

## 指令重定向

存在一种场景需要对指令做重定向（ 即更改执行指令 ），框架提供了 `Utils` 类（ 下文有详细介绍 ），其中具备一些实用的工具函数。

比如上面的注入指令的例子，可以直接用重定向的方式

```typescript
import { DefineCommand, Command, Utils } from '@artus-cli/artus-cli';

// test command
@DefineCommand({
  command: 'test',
})
export class TestCommand extends Command {
  async run() {
    console.info('test');
  }
}

// coverage command
@DefineCommand({
  command: 'cov',
})
export class CovCommand extends Command {
  @Inject()
  utils: Utils;

  async run() {
    console.info('coverage');

    // 参数格式跟 process.argv 一致，也可以写 flags 
    return this.utils.redirect([ 'test' ]);
  }
}
```

## 指令冲突与覆盖

如果两个指令的 command 除了 arugments 之外是一样的，为了避免开发时不小心写了同样的 command 导致难以快速排查出原因，框架目前针对同样的 command 会报错提醒指令冲突。

如果开发者确认就是需要覆盖指令，可以在 `DefineCommand` 的参数中传入 `overrideCommand` 参数来强制覆盖。

```typescript
import { DefineCommand, Command } from '@artus-cli/artus-cli';

// test command
@DefineCommand({
  command: 'test',
})
export class TestCommand extends Command {
  async run() {
    console.info('test');
  }
}

// new test command
@DefineCommand({
  command: 'test',
}, { overrideCommand: true }) // 标识强制覆盖
export class NewTestCommand extends Command {
  async run() {
    console.info('new test');
  }
}
```
