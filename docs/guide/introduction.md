# Artus CLI 诞生过程

## 背景

命令行工具，是 Node.js 最初也是最大的应用场景，我们日常工作中会经常用到 NPM、Babel、Webpack 等 CLI，我们的应用的工程化也往往需要依托于自有的命令行工具。

目前业界已经有大量 CLI 工具库，以下几个均是大家比较耳熟能详的：

- [commander.js](https://github.com/tj/commander.js)
  - 经典老牌类库，小巧精简，适合实现一些小 CLI 工具。
  - 函数式定义指令配置，指令少的时候比较简洁直观。
  - 缺少插件、框架、中间件等通用的拓展方案。
  - 学习成本较低。
- [yargs](https://github.com/yargs/yargs)
  - 功能比 commander 多且强大，能满足大部分独立 CLI 工具的需求。
  - 也是函数式定义指令配置，指令少的时候比较简单直观。
  - 提供了配置继承的能力，但是也缺少插件、框架等通用的拓展方案。
  - 学习成本中等，主要是功能太多且复杂。
- [oclif](https://oclif.io/)
  - 定位为 CLI 框架，功能强大且齐全。
  - 通过传统类定义的方式定义指令配置，支持指令继承（但是似乎不支持继承配置），OOP 的编程风格让代码拆分较为简单。
  - 具备较强的拓展能力和插件、生命周期钩子机制，但缺少框架方案，不易提供场景化的 CLI 框架封装，生命周期的钩子也没有中间件那么灵活。
  - 学习成本中等偏上，比前两个多了不少概念。

为什么在上面的分析里面，我们都会考虑一个『扩展性』的需求呢？因为在我们过往的实践中，会涉及到社区开源和内部上层框架之间的协同问题：内部工具往往会继承于我们开源的社区工具，做一些私有逻辑，并会持续把企业的最佳实践下沉到社区。

![image](https://user-images.githubusercontent.com/5856440/208103377-57ba656b-30bc-4329-88f1-35f0aa3cfaff.png)

这是 Egg 那边的一些真实实践：

![image](https://user-images.githubusercontent.com/5856440/208103403-dfdeb7c4-70bd-4415-b2d8-c3730b763fef.png)

其中的 common-bin 就是基于 yargs 封装的命令行框架，但是在多年实践中，我们也发现了 common-bin 的一些问题，比如年久失修、缺少插件机制、TS 不友好、缺少通用的切面逻辑 等等 ... 

---

## 命令行框架

上文所说的场景，在 Artus 的体系里面，也有类似的情况，作为一个定位为框架的框架的开源项目，我们也不可避免的需要考虑对应的命令行场景。

在企业场景下，一个命令行除了常规的能力外，往往还有以下要求：

- 支持身份鉴权
- 支持灵活的定制化和扩展能力
- 具备一定的统一管控能力
- 自动化升级能力
- 现代化、健壮、便于测试

是不是觉得有点眼熟？这些要求其实跟一个 Web 框架很像，正好 Artus 的一个核心卖点就是协议无关性。那我们是不是可以基于 Artus 来封装一个 CLI 框架的框架呢？

试着对标下：

- 每一个 Command 是不是类似一个 Controller？
- Command 之间的公共逻辑是不是类似一个 Service？
- 支持身份鉴权，可以通过 Middleware 来统一拦截？
- 定制性和扩展能力，不正是插件机制么？ 
- 开源版本和企业版本的关系，不正是框架机制么？

Artus 天然具备了流水线、插件、框架、IoC 等能力，只需要额外再封装几个装饰器，实现下 argv 的 parser 能力，就很快能实现了。

不仅能让 CLI 的编程界面与我们应用的编程界面一致，减少开发者学习成本的同时，还能拓展 Artus 的使用场景，吃自己的狗粮。

甚至我们有时在命令行场景需要的一些能力，如 oss、redis 都可以直接复用 Artus 的生态了，也能直接引入 Artus 上层框架的一些 Loader 用于构建期的分析。

那还等什么？ 干吧～

## 设计思路

- 基于 Artus 的 pipeline 流水线设计，将指令输入作为协议，将指令执行通过中间件模式串联，支持指令重定向。
- 用户编程风格方面，采用 IoC 的方式来定义指令、参数配置、中间件。

![image](https://user-images.githubusercontent.com/5856440/208103431-5efab2c8-d848-4b46-8d9e-fe0922e51e23.png)

## 编程界面预览

```typescript
// index.ts
import { DefineCommand, Option, Command } from '@artus-cli/artus-cli';

@DefineCommand()
export class MyCommand extends Command {
  @Option({
    alias: 'p',
    default: 3000,
    description: 'port'
  })
  port: number;

  async run() {
    console.info('Run with port', this.port);
  }
}
```

## 快速开始

创建项目

```bash
$ npm init
```

安装 `artus-cli`

```bash
$ npm i @artus-cli/artus-cli --save
```

初始化 ts 环境，然后创建文件 index.ts ，写入代码

```typescript
#!/usr/bin/env node

// index.ts
import { start } from '@artus-cli/artus-cli';
import { DefineCommand, Command } from '@artus-cli/artus-cli';

@DefineCommand()
export class MyCommand extends Command {
  async run() {
    console.info('hello artus cli');
  }
}

start({ binName: 'my-bin' });
```

执行代码

```typescript
$ npx ts-node index.js
```

---

点击 [快速开始](./quickstart) 开始学习如何使用

