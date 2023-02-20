# 内置类 Program 及 Util

## Program

[Program](https://github.com/artus-cli/artus-cli/blob/master/src/core/program.ts) 是框架提供的 Singleton 原型，内置了一些便捷 API ，可以在生命周期中注入并使用，相关能力如下：

### 注册 Option

可以通过 Program 的 `option` 方法指定全局 Option 或者针对部分指令添加 Option 。使用方式如下

```typescript
@LifecycleHookUnit()
export default class UsageLifecycle implements ApplicationLifecycle {
  @Inject()
  private readonly program: Program;

  @LifecycleHook()
  async configDidLoad() {
    const { rootCommand } = this.program;
    // 注册全局生效的 Option
    this.program.option({
      help: {
        type: 'boolean',
        alias: 'h',
        description: 'Show Help',
      },
    });

    // 注册只对根指令生效的 option
    this.program.option({
      version: {
        type: 'boolean',
        alias: 'v',
        description: 'Show Version',
      },
    }, [ rootCommand ]);
  }
}
```

### 注册中间件

除了前面通过装饰器注册中间件，也可以在 lifecycle 中通过 program 注册中间件（ 三种中间件均支持 ），比如内置的 `plugin-version` 的实现：

```typescript
// index.ts

@LifecycleHookUnit()
export default class VersionLifecycle implements ApplicationLifecycle {
  @Inject()
  private readonly program: Program;

  @LifecycleHook()
  async configDidLoad() {
    const { rootCommand } = this.program;
    this.program.option({
      version: {
        type: 'boolean',
        alias: 'v',
        description: 'Show Version',
      },
    }, [ rootCommand ]);

    // intercept root command and show version
    this.program.useInCommand(rootCommand, async (ctx: CommandContext, next) => {
      const { args } = ctx;
      if (args.version) {
        return console.info(this.program.version || '1.0.0');
      }

      await next();
    });
  }
}
```

注册三种中间件的方法分别是：

- `use`   注册 pipeline 中间件
- `useInCommand`   注册指令中间件（ 通过 program 注册到 command 的中间件不会被继承 ）
- `useInExecution`   注册 run 函数中间件

### Utils

Utils 是框架提供的在 Execution 阶段使用的工具类，可以用于中间件或者在指令中注入并使用。提供了两个方法：

- `redirect(argv: string[])` 重定向指令，会新建 pipeline ，上面有过介绍。
- `forward(clz: typeof Command, args?: T)` 转发指令，入参是指令类，也可以传入参数（ 如果传了会覆盖已有解析出来的参数 ）。
  - 跟 redirect 的差异：在当前 pipeline 触发（ 即不会触发 pipeline middleware ），而 redirect 会新建 pipeline。
