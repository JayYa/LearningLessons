# 📘 Learning Lessons

本仓库收录五门独立课程，其中三门围绕 .NET 技术栈展开：`Morden .NET` 沿 C# 8 到 15 的每一次语法升级梳理语言演进，`DotNET Platform` 下沉到 SDK 项目系统、CoreCLR 运行时、GC、依赖注入与配置体系，两者互为语言层与平台层的对照；`BeiGene` 是一份面试向的数据库索引专题，聚焦联合索引最左前缀与索引失效场景。`Python-React-Typescript` 从 C# 背景出发，以前后端两个进程如何联通为切入点，配合语言对照表跨入 Python 与 TypeScript 生态。`Build an Agent` 独立成篇，讲 AI Agent 的工具调用、记忆管理、任务编排与多智能体协作。各课程按需选读，共享同一方法论——从表层 API 下沉到底层机制。

🌐 在线查看：[JayYa.github.io/LearningLessons](https://JayYa.github.io/LearningLessons/)

## Python-React-Typescript

| # | 课程 | 描述 |
|---|------|------|
| 1 | [第 1 课 · 两个进程，一根线](https://JayYa.github.io/LearningLessons/Python-React-Typescript/lessons/0001-two-processes-one-wire.html) | 建立前后端两个进程通过 HTTP 联通的心智模型，从零跑通调用链并解决 CORS 这堵墙 |

**参考资料：**
- [参考 · C# ↔ Python / TypeScript 对照表](https://JayYa.github.io/LearningLessons/Python-React-Typescript/reference/csharp-rosetta.html) — 以 C# 为锚点对照 Python 与 TypeScript 的语法与惯用法
- [参考 · 术语表](https://JayYa.github.io/LearningLessons/Python-React-Typescript/reference/glossary.html) — Python / React / TypeScript 生态核心术语速查

## BeiGene

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 01 · 联合索引、最左前缀与索引失效（精讲）](https://JayYa.github.io/LearningLessons/BeiGene/lessons/0001-composite-index-leftmost-prefix.html) | 精讲联合索引的最左前缀匹配原则，剖析索引失效的典型场景与规避写法 |
| 2 | [Lesson 02 · 内存装不下的时候：排序、选择、Top-K 与外部归并（精讲）](https://JayYa.github.io/LearningLessons/BeiGene/lessons/0002-sorting-selection-topk-external.html) | 讲解大数据量下的排序、选择与 Top-K 算法，深入外部归并排序应对内存不足的场景 |

**参考资料：**
- [速查表 · 排序、选择、Top-K 与外部排序（C#）](https://JayYa.github.io/LearningLessons/BeiGene/reference/algo-cheatsheet.html) — 排序、选择、Top-K 与外部排序算法速查
- [Reference · 索引与 SQL 优化速查表](https://JayYa.github.io/LearningLessons/BeiGene/reference/db-index-cheatsheet.html) — 数据库索引设计与 SQL 优化常用手法速查

## Build an Agent

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 01 · What is an Agent](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/lessons/0001-what-is-an-agent.html) | 从零认识 AI Agent 的核心概念，理解 Agent 与普通 LLM 调用的本质区别 |
| 2 | [Lesson 02 · Tools & Plugins](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/lessons/0002-tools-and-plugins.html) | 讲解 Agent 的工具调用与插件扩展机制，理解如何赋予 Agent 与外部世界交互的能力 |
| 3 | [Lesson 03 · Memory & Context](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/lessons/0003-memory-and-context.html) | 探索 Agent 的记忆与上下文管理机制，理解如何让 Agent 跨多轮对话保持状态与连贯性 |
| 4 | [Lesson 04 · Planning & Orchestration](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/lessons/0004-planning-and-orchestration.html) | 深入 Agent 的任务规划与编排能力，理解如何将复杂目标拆解为可执行的子任务链 |
| 5 | [Lesson 05 · MAF Migration Bridge](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/lessons/0005-maf-migration-bridge.html) | 讲解 MAF（Multi-Agent Framework）迁移桥接层设计，理解如何在不同 Agent 框架之间实现互操作与平滑过渡 |
| 6 | [Lesson 06 · Multi-Agent Collaboration](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/lessons/0006-multi-agent-collaboration.html) | 探索多智能体协作模式，理解多个 Agent 如何分工、通信与协同完成复杂任务 |
| 7 | [Lesson 07 · Agent Observability](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/lessons/0007-agent-observability.html) | 讲解 Agent 可观测性设计，理解如何通过日志、指标与追踪监控 Agent 系统的运行状态与性能 |

**参考资料：**
- [Agent Glossary · Reference](https://JayYa.github.io/LearningLessons/Build%20an%20Agent/reference/agent-glossary.html) — AI Agent 领域核心术语速查

## DotNET Platform

| # | 课程 | 描述 |
|---|------|------|
| 1 | [第 1 课：SDK 风格项目系统](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0001-sdk-project-system.html) | 从传统 .csproj 格式到 SDK 风格项目系统的演进，理解 .NET 平台的项目组织与构建基础 |
| 2 | [第 2 课：运行时架构](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0002-coreclr-runtime-architecture.html) | 深入 CoreCLR 运行时架构，理解 .NET 平台的执行引擎、垃圾回收与 JIT 编译机制 |
| 3 | [第 3 课：GC 内部机制与内存控制](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0003-gc-internals-memory-control.html) | 深入 .NET GC 内部机制与内存控制策略，掌握代际回收、LOH 管理与性能调优的关键技术 |
| 4 | [第 4 课：依赖注入基础](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0004-dependency-injection-fundamentals.html) | 系统讲解 .NET 依赖注入容器的注册、解析与生命周期管理，理解 DI 在现代 .NET 应用中的核心角色 |
| 5 | [第 5 课：DI 进阶：工厂模式与 Keyed Service](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0005-di-advanced-factories-keyed.html) | 深入依赖注入进阶技巧，掌握工厂模式与 Keyed Service 在复杂场景下的灵活应用 |
| 6 | [第 6 课：超越 MSDI——Scrutor、容器替换与反模式总结](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0006-di-scrutor-container-replacement.html) | 探索 Scrutor 装饰器与程序集扫描、第三方容器替换及 DI 常见反模式，完成依赖注入知识体系闭环 |
| 7 | [第 7 课：配置系统基础——多源、分层、热重载](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0007-configuration-fundamentals.html) | 深入 .NET 配置系统的多源加载、分层覆盖与热重载机制，掌握 Options 模式之前的配置基础 |
| 8 | [第 8 课：Options 模式——强类型、热重载、校验](https://JayYa.github.io/LearningLessons/DotNET%20Platform/lessons/0008-configuration-options-pattern.html) | 讲解 Options 模式的强类型绑定、热重载验证与数据校验，完成 .NET 配置体系从基础到进阶的学习闭环 |

**参考资料：**
- [参考：配置系统速查](https://JayYa.github.io/LearningLessons/DotNET%20Platform/reference/configuration-quick-reference.html) — .NET 配置系统常用 API 与配置模式速查
- [参考：DI 生命周期与注册速查](https://JayYa.github.io/LearningLessons/DotNET%20Platform/reference/di-lifetime-reference.html) — 依赖注入三种生命周期（Transient、Scoped、Singleton）的行为差异与选择指南
- [参考：旧项目迁移到 SDK 风格](https://JayYa.github.io/LearningLessons/DotNET%20Platform/reference/migrate-to-sdk-style.html) — 传统 .csproj 项目迁移到 SDK 风格的操作指南
- [参考：NuGet 传递依赖解析规则](https://JayYa.github.io/LearningLessons/DotNET%20Platform/reference/nuget-dependency-resolution.html) — NuGet 依赖版本选择与冲突解析机制速查
- [参考：运行时配置速查](https://JayYa.github.io/LearningLessons/DotNET%20Platform/reference/runtime-configuration.html) — runtimeconfig.json 与 MSBuild 运行时配置选项速查
- [参考：Span\<T\> / Memory\<T\> 速查](https://JayYa.github.io/LearningLessons/DotNET%20Platform/reference/span-memory-patterns.html) — Span\<T\> 与 Memory\<T\> 高性能内存操作模式速查

## Morden .NET

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 01: C# 8 Nullable Reference Types — 从 Framework 4.8 到现代 .NET](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/01-csharp8-nullable-reference-types.html) | 从 Framework 4.8 迁移背景出发，讲解可空引用类型的设计动机与空安全实践 |
| 2 | [Lesson 02: C# 8 Switch Expressions · Using Declarations · Indices/Ranges](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/02-csharp8-switch-using-indices.html) | 解析 switch 表达式模式匹配、using 声明与索引/范围三种语法改进 |
| 3 | [Lesson 03: C# yield return 同步迭代器](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/03-sync-yield-return-iterators.html) | 拆解 yield return 延迟执行与编译器生成的状态机实现 |
| 4 | [Lesson 04: C# 8 Async Streams — 异步流](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/04-csharp8-async-streams.html) | 从同步迭代器到 IAsyncEnumerable，全面讲解异步流的消费、取消与上下文控制 |
| 5 | [Lesson 05: SynchronizationContext — await 续延调度的核心机制](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/05-async-await-synchronizationcontext.html) | 深入 SynchronizationContext 调度模型，理解 await 续延如何在执行上下文中流转 |
| 6 | [Lesson 06: C# 8 收尾 — Default Interface Methods 与其他实用特性](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/06-csharp8-wrapup-default-interface-methods.html) | 收尾讲解默认接口方法及 C# 8 其余实用特性，完成 C# 8 特性全景 |
| 7 | [Lesson 07: C# 9 Records — 不可变引用类型与值相等语义](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/07-csharp9-records.html) | 深入 records 不可变引用类型，理解值相等语义、with 表达式与继承行为 |
| 8 | [Lesson 08: C# 9 小特性集 — Top-level Statements · Pattern Matching 增强 · Target-typed new · Covariant Returns](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/08-csharp9-small-features.html) | 快速浏览 C# 9 四项实用小特性，提升日常开发效率 |
| 9 | [Lesson 09: C# 10 — Record Structs（记录结构体）](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/09-csharp10-record-structs.html) | 讲解 record struct 值类型语义，对比 record class 与传统 struct 的设计取舍 |
| 10 | [Lesson 10: C# 10 — 文件范围命名空间 · 全局引用 · 常量内插字符串](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/10-csharp10-small-features.html) | 介绍 C# 10 三项简化代码结构与提升可读性的生产力特性 |
| 11 | [Lesson 11: C# 11 — Raw String Literals（原始字符串字面量）](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/11-csharp11-raw-string-literals.html) | 深入原始字符串字面量的多行语法与转义免除机制 |
| 12 | [Lesson 12: C# 11 — List Patterns · Required Members](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/12-csharp11-list-patterns-required.html) | 解析列表模式解构语法与 required 成员初始化约束 |
| 13 | [Lesson 13: C# 11 — UTF-8 String Literals · C# 11 总结](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/13-csharp11-utf8-combo.html) | 讲解 UTF-8 字符串字面量语法，回顾 C# 11 特性全景 |
| 14 | [Lesson 14: C# 12 — Primary Constructors（主构造函数）](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/14-csharp12-primary-constructors.html) | 深入主构造函数语法，简化依赖注入与成员初始化的样板代码 |
| 15 | [Lesson 15: C# 12 — Collection Expressions（集合表达式）](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/15-csharp12-collection-expressions.html) | 解析集合表达式语法，统一数组、列表与 span 的初始化方式 |
| 16 | [Lesson 16: C# 12 — ref readonly 参数 + 内联数组](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/16-csharp12-ref-readonly-inline-arrays.html) | 讲解 ref readonly 参数传递语义与内联数组的高性能栈分配技巧 |
| 17 | [Lesson 17: C# 12 — Lambda 默认参数 · 任意类型别名 · Experimental · Interceptors](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/17-csharp12-small-features.html) | 收尾 C# 12 小特性集：Lambda 默认参数、任意类型别名、Experimental 特性与 Interceptors 拦截器预览 |
| 18 | [Lesson 18: C# 13 — params 集合 + 新 Lock 对象](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/18-csharp13-params-lock.html) | 讲解 C# 13 的 params 集合增强与新型 Lock 对象，拥抱最新语言特性 |
| 19 | [Lesson 19: C# 13 — ref struct 三部曲](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/19-csharp13-ref-struct-trilogy.html) | 深入 C# 13 ref struct 接口约束与泛型反变等三部曲，解锁高性能场景新可能 |
| 20 | [Lesson 20: C# 13 — 小特性合集](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/20-csharp13-small-features.html) | 速览 C# 13 中多项实用小特性，收尾 C# 13 语言演进全景 |
| 21 | [Lesson 21: C# 14 — field 关键字](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/21-csharp14-field-keyword.html) | 探索 C# 14 field 关键字，简化属性访问器的自定义逻辑编写 |
| 22 | [Lesson 22: C# 14 — 扩展成员](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/22-csharp14-extension-members.html) | 解析 C# 14 扩展成员语法，以更自然的方式为已有类型添加方法与属性 |
| 23 | [Lesson 23: C# 14 — 中等特性合集](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/23-csharp14-mid-features.html) | 收尾 C# 14 中等特性合集：params 增强、部分属性等语言特性深度解析 |
| 24 | [Lesson 24: C# 14 — 小特性合集](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/24-csharp14-small-features.html) | 速览 C# 14 各项小特性，完成 C# 14 语言演进全景收官 |
| 25 | [Lesson 25: C# 15 — Union 类型](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/25-csharp15-union-types.html) | 探索 C# 15 的 union 类型语法，以类型安全方式表达多选一的数据结构 |
| 26 | [Lesson 26: C# 15 — Closed Hierarchies（封闭继承层次）](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/26-csharp15-closed-hierarchies.html) | 讲解 C# 15 封闭继承层次，限制类型派生以确保 API 的完整性与可预测性 |
| 27 | [Lesson 27: C# 15 — 集合表达式参数](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/27-csharp15-collection-expression-args.html) | 解析 C# 15 集合表达式作为方法参数的语法增强，进一步统一集合传递方式 |
| 28 | [Lesson 28: C# 15 — 内存安全第一阶段](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/28-csharp15-memory-safety.html) | 探索 C# 15 引入的内存安全机制，利用类型系统在编译期消除常见内存错误 |
| 29 | [Lesson 29: C# 15 — 字典表达式](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/29-csharp15-dictionary-expressions.html) | 讲解字典表达式语法，以声明式字面量简化键值对集合的初始化与操作 |

**参考资料：**
- [异步流速查 · Async Streams · C# 8](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/async-streams-cheatsheet.html) — IAsyncEnumerable 消费、取消与配置速查
- [C# 9 小特性速查](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/csharp9-small-features-cheatsheet.html) — Top-level Statements · Pattern Matching · Target-typed new · Covariant Returns
- [in 参数 · 防御性拷贝深度解析](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/in-parameter-defensive-copy-cheatsheet.html) — C# 7.2+ in 参数传递语义与防御性拷贝机制速查
- [索引与范围速查 · Indices & Ranges · C# 8](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/indices-ranges-cheatsheet.html) — ^ 与 .. 运算符完整参考
- [NRT 速查 · Nullable Reference Types · C# 8+](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/nrt-cheatsheet.html) — 可空引用类型注解与警告速查
- [模式匹配速查 · Pattern Matching · C# 7~12](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/pattern-matching-cheatsheet.html) — switch 表达式与模式组合速查
- [Primary Constructors 速查 · C# 12](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/primary-constructors-cheatsheet.html) — 主构造函数语法、依赖注入与成员捕获速查
- [Records 速查 · C# 9+](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/records-cheatsheet.html) — record 声明、with 表达式与继承速查
- [Span / ReadOnlySpan 速查 · 现代 .NET 高性能基石](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/span-readonlyspan-cheatsheet.html) — Span\<T\>、ReadOnlySpan\<T\> 与 stackalloc 高性能内存操作速查
- [yield return 同步迭代器 · 速查表](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/sync-iterators-cheatsheet.html) — IEnumerable\<T\> 与 yield 状态机速查
- [SynchronizationContext & await 续延调度](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/synchronizationcontext-cheatsheet.html) — ConfigureAwait、调度上下文与执行流转速查

*自动生成*
