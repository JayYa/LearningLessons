# Learning Lessons

这套课程沿四条独立轨道展开，各自深入一个专门领域：现代 .NET 技术纵深从 C# 8 一路推进到 C# 14，覆盖可空引用类型、异步流、records、主构造函数、集合表达式、ref struct 接口与泛型反变、field 关键字及扩展成员，构建从 Framework 4.8 到最新 .NET 的完整语言演进地图；历史轨道以《冰海战纪》为叙事锚点，从维京时代社会概览延伸到丹麦征服英格兰、北海帝国、维京东线、文兰探险、社会层级结构与基督教化；工具轨道分两支——Claude Context Bar 聚焦 VS Code 扩展开发底层（扩展解剖、激活生命周期到 StatusBarItem API 与 findActiveSessions 数据引擎），GitHub and SandCastle 深入 GitHub Actions 标签触发自动化（从第一个工作流到状态机抽象再到链式触发与预检模式）。四条轨道虽主题各异，却共享同一方法论——从表层 API 下沉到内部机制，从孤立知识点串成系统认知。

🌐 在线查看：[JayYa.github.io/LearningLessons](https://JayYa.github.io/LearningLessons/)

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
| 20 | [Lesson 20: C# 13 — 小特性合集](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/20-csharp13-small-features.html) | 速览 C# 13 中多项实用小特性，收尾现代 .NET 语言演进全景 |
| 21 | [Lesson 21: C# 14 — field 关键字](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/21-csharp14-field-keyword.html) | 探索 C# 14 field 关键字，简化属性访问器的自定义逻辑编写 |
| 22 | [Lesson 22: C# 14 — 扩展成员](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/22-csharp14-extension-members.html) | 解析 C# 14 扩展成员语法，以更自然的方式为已有类型添加方法与属性 |

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

## Vinland Saga

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 0001 — 维京时代概览：冰海战纪的历史舞台](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0001-viking-age-overview.html) | 概览维京时代的历史背景与社会结构，为《冰海战纪》的叙事世界提供真实历史锚点 |
| 2 | [Lesson 0002 — 漫画 vs 史实：《冰海战纪》角色原型对照](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0002-character-prototypes.html) | 对比漫画角色与真实维京历史人物，揭示幸村诚笔下的史实基础与创作改编 |
| 3 | [Lesson 0003 — 丹麦征服英格兰：维京人的北海霸权](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0003-danish-conquest-of-england.html) | 讲述丹麦王朝对英格兰的征服历程，梳理维京人在北海的霸权兴衰 |
| 4 | [Lesson 0004 — 克努特大帝与北海帝国](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0004-cnut-north-sea-empire.html) | 剖析克努特大帝如何整合英格兰、丹麦与挪威，建立横跨北海的维京帝国 |
| 5 | [Lesson 0005 — 维京东线与瓦良格卫队](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0005-varangian-east.html) | 探索维京人的东进之路，讲述瓦良格卫队在拜占庭帝国的传奇与历史影响 |
| 6 | [Lesson 0006 — 文兰：北欧人发现北美与定居失败](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0006-vinland-norse-in-north-america.html) | 追寻北欧人向西探索文兰的航海壮举，解析北美定居尝试的成败与考古证据 |
| 7 | [Lesson 0007 — 维京人的社会结构：Jarl、Karl 与奴隶](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0007-viking-social-hierarchy.html) | 拆解维京社会的三层等级体系，从贵族 Jarl、自由民 Karl 到奴隶，揭示《冰海战纪》角色的社会身份根源 |
| 8 | [Lesson 0008 — 北欧的基督教化：从奥丁到基督](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0008-viking-christianization.html) | 追溯北欧从多神信仰到基督教化的漫长转变，理解《冰海战纪》中信仰冲突的历史根源 |

**参考资料：**
- [🗺 东部地理术语指南](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/eastern-geography-guide.html) — 拜占庭 · 罗斯 · 基辅 · 君士坦丁堡地理术语速查
- [🏛 诺曼起源争议参考](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/normanist-debate.html) — 诺曼起源争议学术背景与关键论据
- [🧬 斯堪的纳维亚人起源参考](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/scandinavian-origins.html) — 斯堪的纳维亚人的民族起源、迁徙与遗传谱系学术参考
- [维京时代大事年表](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/viking-age-timeline.html) — Vinland Saga 历史时间线参考
- [⚔️ 维京劫掠驱动因素参考](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/viking-raid-causes.html) — 维京劫掠的经济、人口与技术驱动因素分析
- [📐 维京战船与 Portage 参考](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/viking-ships-and-portage.html) — 维京长船设计与陆地运船技术参考
- [🪙 维京白银经济参考](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/viking-silver-economy.html) — 维京时代白银贸易与经济体系参考
- [角色-史实对照表](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/vinland-saga-character-reference.html) — Vinland Saga 漫画角色与历史原型速查

## Claude Context Bar

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 0001 — VS Code 扩展的解剖结构](https://JayYa.github.io/LearningLessons/Claude%20Context%20Bar/lessons/0001-extension-anatomy.html) | 拆解 VS Code 扩展的 manifest、激活事件与代码骨架，理解扩展生命周期 |
| 2 | [Lesson 0002 — 激活与生命周期](https://JayYa.github.io/LearningLessons/Claude%20Context%20Bar/lessons/0002-activation-lifecycle.html) | 深入 VS Code 扩展的激活事件类型与生命周期管理机制 |
| 3 | [Lesson 0003 — StatusBarItem：状态栏 UI 原语](https://JayYa.github.io/LearningLessons/Claude%20Context%20Bar/lessons/0003-statusbar-api.html) | 解析 StatusBarItem API 的设计与用法，掌握状态栏 UI 元素的创建与控制 |
| 4 | [Lesson 0004 — findActiveSessions：数据引擎](https://JayYa.github.io/LearningLessons/Claude%20Context%20Bar/lessons/0004-find-active-sessions.html) | 揭示 findActiveSessions 数据引擎如何驱动上下文感知，串联扩展的实时状态信息 |

**参考资料：**
- [参考：术语表](https://JayYa.github.io/LearningLessons/Claude%20Context%20Bar/reference/glossary.html) — VS Code 扩展开发核心术语速查
- [参考：npm 包命名规则](https://JayYa.github.io/LearningLessons/Claude%20Context%20Bar/reference/npm-package-naming-rules.html) — npm 包名称约束、作用域包与命名最佳实践
- [参考：VS Code 扩展 API 基础](https://JayYa.github.io/LearningLessons/Claude%20Context%20Bar/reference/vscode-extension-api-basics.html) — 扩展清单、贡献点与核心 API 速查

## GitHub and SandCastle

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 0001 — 你的第一个标签触发工作流](https://JayYa.github.io/LearningLessons/GitHub%20and%20SandCastle/lessons/0001-your-first-label-triggered-workflow.html) | 从零搭建第一个标签触发工作流，理解 GitHub Actions 的事件驱动模型 |
| 2 | [Lesson 0002 — 标签状态机](https://JayYa.github.io/LearningLessons/GitHub%20and%20SandCastle/lessons/0002-the-label-state-machine.html) | 将标签工作流抽象为状态机，掌握工作流编排的工程化思维 |
| 3 | [Lesson 0003 — 高级模式：链式触发、预检与形状检测](https://JayYa.github.io/LearningLessons/GitHub%20and%20SandCastle/lessons/0003-advanced-patterns.html) | 探索链式触发、预检与形状检测等高级模式，解决真实场景中的复杂自动化需求 |

**参考资料：**
- [Reference: 标签触发工作流语法速查表](https://JayYa.github.io/LearningLessons/GitHub%20and%20SandCastle/reference/github-actions-label-workflow-syntax.html) — 标签触发工作流的事件类型、条件筛选与作业配置语法速查

*自动生成*
