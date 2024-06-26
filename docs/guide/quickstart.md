# 快速开始

## 目录结构

跟 Artus 的应用一样，除了 config 目录的约定之外，其他原则上不约束目录结构，但是我们也会有一些推荐的规范（ 比如入口文件统一放到 bin 目录下，指令文件统一放到 cmd 目录下 ），比如 simple-bin 

> 如果不想分那么多目录或文件也可以参考 [singlefile](https://github.com/artus-cli/examples/tree/master/singlefile) 例子的单文件结构

```bash
simple-bin
├── bin
│   └── cli.ts     入口文件
├── cmd      
│   └── main.ts    主命令
└── package.json   描述文件
```

simple-bin 中只有一个指令，如果存在多个指令的情况，也可以参考 egg-bin 的目录结构：

```bash
egg-bin
├── bin
│   └── cli.ts
├── cmd
│   ├── cov.ts
│   ├── debug.ts
│   ├── dev.ts
│   ├── main.ts
│   └── test.ts
├── config
│   ├── config.ts
│   └── plugin.ts
├── index.ts
├── meta.json
└── package.json   
``` 

## 入口文件

CLI 的可执行文件，只要引入 `@artus-cli/artus-cli` 的 `start` 方法并且执行即可，一般定义在项目的 bin 目录中。

```typescript
// bin/cli.ts
#!/usr/bin/env node

import { start } from '@artus-cli/artus-cli';

start({
  // 你的 bin 名称，没传默认是 package.json 里的 name
  // 如果 bin 中有配置也会默认选 bin 配置中的第一个
  binName: 'my-bin',

  // 指令所在目录，比如代码目录在项目根目录下的 src 目录，cli.ts 在 src/bin/ 中，那么就可以配 path.dirname(__dirname)
  // 如果不配，会自动找 package.json 所在目录
  // baseDir: path.dirname(__dirname),
});
```

## 定义指令

### DefineCommand

通过 `DefineCommand` 这个装饰器可以定义一个指令。

```typescript
// index.ts
import { DefineCommand, Command } from '@artus-cli/artus-cli';

@DefineCommand()
export class MyCommand extends Command {
  async run() {
    console.info('trigger me');
  }
}
```

如果 `DefineCommand` 不传 command ，那么该指令会自动设置为主指令，比如上面的例子的 bin 名称是叫 my-bin，那么直接在命令行执行 my-bin 就会打印 `trigger me` 。

### Option

可以通过 `Option` 装饰器定义参数：

```typescript
// index.ts
import { DefineCommand, Option, Command } from '@artus-cli/artus-cli';

@DefineCommand()
export class MyCommand extends Command {
  @Option({
    // flag 别名，比如 -p
    alias: 'p',
    // flag 默认值
    default: 3000,
    // flag 描述，会打印在 -h 信息中
    description: 'port'
  })
  port: number;

  async run() {
    console.info('Run with port', this.port);
  }
}
```

此时再执行 `my-bin` 将会打印 `Run with port 3000` ，因为 `port` 默认是 3000 ，也可以指定执行 `my-bin --port=7001` 或者 `my-bin -p 7001`

### 综合使用

上面的例子中的 `DefineCommand` 也可以传入 command 指定执行参数以及描述：

```typescript
// index.ts
import { DefineCommand, Option, Command } from '@artus-cli/artus-cli';

@DefineCommand({
  // $0 代表指令名的占位符，建议统一用 $0
  // 这里的几种写法：'my-bin [baseDir]' 或者 '$0 [baseDir]' 再或者 '[baseDir]' 效果是一样的
  command: '$0 [baseDir]',

  // 指令描述，非必需，会打印在 -h 信息中
  description: 'My First Bin',

  // 指令使用示例，非必须，会打印在 -h 信息中
  examples: [
    // 第一个参数是指令例子，第二个参数是对当前指令例子的注释（ 格式 yargs 的规范一致 ），其中 `$0` 会被自动替换成指令名
    [ '$0 ./', 'Run in base dir' ],
  ],
})
export class MyCommand extends Command {
  @Option({
    alias: 'p',
    default: 3000,
    description: 'port'
  })
  port: number;

  @Option()
  baseDir: string;

  async run() {
    console.info('Run with port %s in %s', this.port, this.baseDir);
  }
}
```

当执行 `my-bin ./src --port=7001` 即可打印 `Run with port 7001 in ./src`

## 定义子指令

### 常规用法

定义子指令也是通过 `DefineCommand` 这个装饰器，比如上面的例子改成一个 dev 的子指令，只需要改一下 command 即可：

```typescript
// dev.ts
import { DefineCommand, Option, Command } from '@artus-cli/artus-cli';

@DefineCommand({
  command: 'dev [baseDir]',
  description: 'Run Dev Server',
  alias: 'd',
})
export class MyDevCommand extends Command {
  @Option({
    alias: 'p',
    default: 3000,
    description: 'port'
  })
  port: number;
  
  @Option()
  baseDir: string;

  async run() {
    console.info('Run with port %s in %s', this.port, this.baseDir);
  }
}
```

然后执行 `my-bin dev ./src --port=7001` 或者 `my-bin d ./src --port=7001` 即可 ，如果需要定义更多子指令也可以使用同样的配置方式，比如

```typescript
// test.ts
import { DefineCommand, Command } from '@artus-cli/artus-cli';

@DefineCommand({
  command: 'test',
  description: 'Run Unittest',
  alias: 't',
})
export class MyTestCommand extends Command {
  async run() {
    console.info('Run Unittest');
  }
}
```

当定义 command 的时候，上面例子中的 bin 名称（ 即 my-bin ）也可以省略，比如上面的例子可以精简成以下写法：

```typescript
// test.ts
import { DefineCommand, DefineOption, Command } from '@artus-cli/artus-cli';

@DefineCommand({
  command: 'test',
  description: 'Run Unittest',
  alias: 't',
})
export class MyTestCommand extends Command {
  async run() {
    console.info('Run Unittest');
  }
}
```

定义好之后就可以执行 `my-bin test` 看到效果。

### 指定父指令

常规用法中的父子关系，是通过解析 command 字符串支持的，在定义 Command 的时候也可以通过配置 parent 主动指定父指令。比如

```typescript
@DefineCommand({
  command: 'module',
  description: 'Module Commands',
})
export class ModuleMainCommand extends Command {
  async run() {
    console.info('module is run');
  }
}

@DefineCommand({
  command: 'dev',
  description: 'Module Dev Commands',
  parent: ModuleMainCommand,
})
export class ModuleDevCommand extends Command {
  async run() {
    console.info('module dev');
  }
}

@DefineCommand({
  command: 'debug',
  description: 'Module Debug Commands',
  parent: ModuleMainCommand,
})
export class ModuleDebugCommand extends Command {
  async run() {
    console.info('module debug');
  }
}
```

然后就可以有了以下三个指令：

- `my-bin module`
- `my-bin module dev`
- `my-bin module debug`

就不用挨个写 `module dev` 和 `module debug`

> 使用场景：比如已经有一个 DevCommand ，需要在 module 这个父指令下也有一个 dev 指令，就可以新增一个 ModuleDevCommand 继承 DevCommand ，只需要配置 parent 为 ModuleCommand 即可 。

## Arguments

配置在 `DefineCommand` 的 command 参数中，两种配置方式

- `<options>` 必传参数，比如 `command: 'test <file>'`
- `[options]` 可选参数，比如 `command: 'dev [baseDir]'`

也可以配置动态参数

- `<options...>` 必传的动态参数，比如 `command: 'test <files...>'` ，最终拿到的 files 将是个数组。
- `[options...]` 可选动态参数，跟上面效果一样。

## Option

Option 是 Arguments 与 Flags(`--port` 这种参数) 的统一配置，通过 `Option` 装饰器定义

```typescript
export interface OptionProps {
  alias?: string | string[]; // 别名
  default?: any;  // 默认值
  required?: boolean; // 是否必须
  description?: string; // 描述
}
```

当配置以下格式时

```typescript
@DefineCommand()
export class DevCommand extends Command {
  // 可以传入详细配置
  @Option({
    alias: 'p',
    description: 'port'
  })
  port: number;
  
  // 传入字符代表 description
  @Option('daemon')
  daemon: boolean;
  
  @Option('node flags')
  nodeFlags: string;
}
```

执行指令可传入 `--port=7001 --node-flags=--inspect --daemon`

转换成在 run 函数中获取的 options 为

```json
{
    "port": 7001,
    "nodeFlags": "--inspect",
    "daemon": true
}
```

> - 如果是 boolean 类型，当传参为 `--no-daemon` 等同于 `--daemon=false` 。
> - Arguments 的详细配置也可以在其中配置，但只支持配置 `type` 与 `default` 两个属性。

## 中间件

分成几种中间件：

- 触发器中间件（ 由 artus/pipeline 提供的 pipeline middlewares ）
- 跟指令绑定的中间件
  - 跟指令类绑定的中间件（ command middlewares ）
  - 跟 run 函数绑定的中间件（ method middlewares ）

执行流水大概如下

```bash
# 输入
input -> pipeline middlewares -> command middlewares -> method middlewares -> run

# 输出
run -> method middlewares -> command middlewares -> pipeline middlewares -> output
```

### 触发器中间件

在生命周期中注入 `@artus-cli/artus-cli` 的 Program ，然后调用 `use` 函数即可。这类型的中间件一般是用于全局或者针对性拦截一些指令输入。

> `Program` 是框架提供的一些开放 API ，可以用于获取指令列表，注册中间件，注册全局 Option 等，后面高级功能有介绍。

```typescript
// lifecycle.ts
import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, CommandContext, Program, CommandContext } from '@artus-cli/artus-cli';

@LifecycleHookUnit()
export default class UsageLifecycle implements ApplicationLifecycle {
  @Inject()
  private readonly program: Program;

  @LifecycleHook()
  async didLoad() {
    this.program.use(async (ctx: CommandContext, next) => {
        // do something
        await next();
    });
  }
}
```

> 使用场景：比如 [plugin-help](https://github.com/artus-cli/plugin-help) 中就通过中间件拦截了 `--help` 和 `-h` 的输入，然后重定向到 help 指令。

### 指令中间件

通过 Middleware 装饰器可以定义指令中间件，可以使用在指令类或者 run 函数中，比如下面的例子

```typescript
import { DefineCommand, Command, Middleware } from '@artus-cli/artus-cli';

@DefineCommand({
  command: 'dev',
  description: 'Run the development server',
})
@Middleware(async (_ctx, next) => {
  console.info('prerun 1');
  await next();
  console.info('postrun 1');
})
export class DevCommand extends Command {
  @Middleware(async (_ctx, next) => {
    console.info('prerun 2');
    await next();
    console.info('postrun 2');
  })
  async run() {
    // nothing
  }
}
```

输出结果为

```bash
prerun 1
prerun 2
postrun 2
postrun 1
```

中间件也可以传数组，再比如下面这个例子

```typescript
import { DefineCommand, Command, Middleware } from '@artus-cli/artus-cli';

@DefineCommand({
  command: 'dev',
  description: 'Run the development server',
})
@Middleware([
  async (_ctx, next) => {
    console.info('prerun 1');
    await next();
    console.info('postrun 1');
  },
  async (_ctx, next) => {
    console.info('prerun 2');
    await next();
    console.info('postrun 2');
  },
])
export class DevCommand extends Command {
  @Middleware([
    async (_ctx, next) => {
      console.info('prerun 3');
      await next();
      console.info('postrun 3');
    },
    async (_ctx, next) => {
      console.info('prerun 4');
      await next();
      console.info('postrun 4');
    },
  ])
  async run() {
    // nothing
  }
}
```

输出内容为

```bash
prerun 1
prerun 2
prerun 3
prerun 4
postrun 4
postrun 3
postrun 2
postrun 1
```

## 指令继承

直接使用类的继承方式即可。

### 配置继承

当指令继承时，子指令类会继承父指令类定义的配置信息，比如下面的例子

```typescript
// dev command
@DefineCommand({
  command: 'dev',
})
export class DevCommand extends Command {
  @Option({
    alias: 'p',
    default: 3000,
  })
  port: number;

  async run() {
    console.info('Run In', this.port);
  }
}

// debug command
@DefineCommand({
  command: 'debug',
})
export class DebugCommand extends DevCommand {
  @Option({
    default: 8080,
    description: 'inspect port'
  })
  inspectPort: number;

  async run() {
    super.run();
    console.info('Debug In', this.inspectPort);
  }
}
```

执行 `my-bin debug` 的话，会输出

```bash
Run In 3000
Debug In 8080
```

### 中间件继承

除了上面说的指令配置会自动继承之外，在类上挂载的中间件也能够被继承，还是继续看例子：

```typescript
// dev command
@DefineCommand({
  command: 'dev',
})
@Middleware(async (_ctx, next) => {
  console.info('dev prerun 1');
  await next();
  console.info('dev postrun 1');
})
export class DevCommand extends Command {
  @Middleware(async (_ctx, next) => {
    console.info('dev prerun 2');
    await next();
    console.info('dev postrun 2');
  })
  async run() {
    // nothing
  }
}

// debug command
@DefineCommand({
  command: 'debug',
})
@Middleware(async (_ctx, next) => {
  console.info('debug prerun 1');
  await next();
  console.info('debug postrun 1');
})
export class DebugCommand extends DevCommand {
  @Middleware(async (_ctx, next) => {
    console.info('debug prerun 2');
    await next();
    console.info('debug postrun 2');
  })
  async run() {
    super.run();
  }
}
```

执行 `my-bin debug` 后会输出

```bash
# -----   指令执行开始 ----
dev prerun 1            # --> DevCommand>class_middleware
debug prerun 1          # --> DebugCommand>class_middleware
# -----   run() 执行开始 ----
debug prerun 2          # --> DebugCommand>run_middleware
# -----   super.run() 执行开始 ----
dev prerun 2            # --> DevCommand>run_middleware
dev postrun 2           # --> DevCommand>run_middleware
# -----   super.run() 执行结束 ----
debug postrun 2         # --> DebugCommand>run_middleware
# -----   run() 执行结束 ----
debug postrun 1         # --> DebugCommand>run_middleware
dev postrun 1           # --> DevCommand>run_middleware
# -----   指令执行结束 ----
```

这里分两种情况：

- 一种是绑定在类上的中间件，会直接合并：
  - 比如 Dev 定义的类中间件是 A ，Debug 定义的类中间件是 B ，那么在 Debug 中的类中间件列表会组合成 `[ A, B ]`。
- 另一种是绑定在 `run` 函数的中间件，当在 DebugCommand 的 `run` 函数中调用 `super.run` 的时候，就会执行 Dev 的 `run` 函数中间件。
  - 所以如果不想触发 Dev 的 `run` 函数中间件，不调用 `super.run` 即可 ...

## 高级用法

更多高级用法可以看以下几篇文档

- [指令](../advance/command.md)
- [多环境](../advance/env.md)
- [插件机制](../advance/plugin.md)
- [框架继承](../advance/framework.md)
- [Program & Util](../advance/program_util.md)

## Examples

体验用的相关 demo 例子都在：https://github.com/artus-cli/examples

- [simple-bin](https://github.com/artus-cli/examples/tree/master/simple-bin)：简单 demo
- [singlefile](https://github.com/artus-cli/examples/tree/master/singlefile)：单文件 demo
- [egg-bin](https://github.com/artus-cli/examples/tree/master/egg-bin)：类似于 egg-bin 的 demo
- [chair-bin](https://github.com/artus-cli/examples/tree/master/chair-bin)：继承 egg-bin 的 demo
- [override-bin](https://github.com/artus-cli/examples/tree/master/override-bin)：继承 egg-bin 并覆盖指令的 demo
- [plugin-help](https://github.com/artus-cli/artus-cli/blob/master/src/plugins/plugin-help/index.ts)：内置的 --help 插件
- [plugin-version](https://github.com/artus-cli/artus-cli/blob/master/src/plugins/plugin-version/index.ts)：内置的 --version 插件
- [plugins/plugin-check-update](https://github.com/artus-cli/examples/blob/master/plugins/plugin-check-update)：检查 bin 更新 demo
- [plugins/plugin-codegen](https://github.com/artus-cli/examples/tree/master/plugins/plugin-codegen)：新增 codegen 单独指令的 demo
- [plugins/plugin-codegen-extra](https://github.com/artus-cli/examples/tree/master/plugins/plugin-codegen-extra)：拓展 codegen 指令的 demo

