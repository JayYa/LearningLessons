# Learning Lessons

这套课程围绕现代 .NET 开发构建了一条从语言表层到底层运行时的完整学习曲线。课程以 C# 8 为锚点，从可空引用类型切入，遍历 switch 表达式、索引范围等语法糖，随后将重心转向异步编程的完整图景——从 yield return 同步迭代器的状态机构建，到 IAsyncEnumerable 异步流的消费与取消，最终抵达 SynchronizationContext 这一 await 续延调度的核心机制，并以默认接口方法收尾完成 C# 8 特性全景。进入 C# 9 篇章后，课程继续深入 records 不可变引用类型的值相等语义与一组小而精的实用特性，随后迈入 C# 10 的记录结构体与文件范围命名空间、全局引用等生产力提升特性，再进入 C# 11 的原始字符串字面量、列表模式、required 成员与 UTF-8 字符串字面量，最终抵达 C# 12 的主构造函数、集合表达式、ref readonly 参数与内联数组、Lambda 默认参数与任意类型别名等前沿特性。三条主线贯穿始终：**C# 语言演进**（类型系统、模式匹配、不可变数据——从 C# 8 到 C# 12 的持续进化）、**异步内部机制**（迭代器、异步流、调度上下文）、**平台迁移**（Framework 4.8 → 现代 .NET）。此外，课程还收录了维京时代历史概览与《冰海战纪》角色原型的史实对照，为漫画叙事提供真实历史锚点。

🌐 在线查看：[JayYa.github.io/LearningLessons](https://JayYa.github.io/LearningLessons/)

## Morden .NET

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 01: C# 8 Nullable Reference Types — 从 Framework 4.8 到现代 .NET](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/01-csharp8-nullable-reference-types.html) | 从 Framework 4.8 迁移背景出发，讲解可空引用类型的设计动机与空安全实践 |
| 2 | [Lesson 02: C# 8 Switch Expressions · Using Declarations · Indices/Ranges](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/02-csharp8-switch-using-indices.html) | 解析 switch 表达式模式匹配、using 声明与索引/范围三种语法改进 |
| 3 | [Lesson 03: C# yield return 同步迭代器](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/03-sync-yield-return-iterators.html) | 拆解 yield return 延迟执行与编译器生成的状态机实现 |
| 4 | [Lesson 04: C# 8 Async Streams — 异步流](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/04-csharp8-async-streams.html) | 从同步迭代器到 IAsyncEnumerable，全面讲解异步流的消费、取消与上下文控制 |
| 5 | [Lesson 05: SynchronizationContext — await 续延调度的核心机制](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/05-async-await-synchronizationcontext.html) | 深入 SynchronizationContext 调度模型，理解 await 续延如何在执行上下文中流转 |
| 6 | [Lesson 06: C# 8 收尾 — Default Interface Methods 与其他实用特性](https://JayYa.github.io/LearningLessons/Morden%20.NET/lessons/06-csharp8-wrapup-default-interface-methods.html) | 收尾讲解默认接口方法及 C# 8 其余实用特性，完成语言演进全景 |
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

**参考资料：**
- [异步流速查 · Async Streams · C# 8](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/async-streams-cheatsheet.html) — IAsyncEnumerable 消费、取消与配置速查
- [C# 9 小特性速查](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/csharp9-small-features-cheatsheet.html) — Top-level Statements · Pattern Matching · Target-typed new · Covariant Returns
- [索引与范围速查 · Indices & Ranges · C# 8](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/indices-ranges-cheatsheet.html) — ^ 与 .. 运算符完整参考
- [NRT 速查 · Nullable Reference Types · C# 8+](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/nrt-cheatsheet.html) — 可空引用类型注解与警告速查
- [模式匹配速查 · Pattern Matching · C# 7~12](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/pattern-matching-cheatsheet.html) — switch 表达式与模式组合速查
- [Records 速查 · C# 9+](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/records-cheatsheet.html) — record 声明、with 表达式与继承速查
- [Span / ReadOnlySpan 速查 · 现代 .NET 高性能基石](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/span-readonlyspan-cheatsheet.html) — Span\<T\>、ReadOnlySpan\<T\> 与 stackalloc 高性能内存操作速查
- [yield return 同步迭代器 · 速查表](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/sync-iterators-cheatsheet.html) — IEnumerable\<T\> 与 yield 状态机速查
- [SynchronizationContext & await 续延调度](https://JayYa.github.io/LearningLessons/Morden%20.NET/reference/synchronizationcontext-cheatsheet.html) — ConfigureAwait、调度上下文与执行流转速查

## Vinland Saga

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 0001 — 维京时代概览：冰海战纪的历史舞台](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0001-viking-age-overview.html) | 概览维京时代的历史背景与社会结构，为《冰海战纪》的叙事世界提供真实历史锚点 |
| 2 | [Lesson 0002 — 漫画 vs 史实：《冰海战纪》角色原型对照](https://JayYa.github.io/LearningLessons/Vinland%20Saga/lessons/0002-character-prototypes.html) | 对比漫画角色与真实维京历史人物，揭示幸村诚笔下的史实基础与创作改编 |

**参考资料：**
- [维京时代大事年表](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/viking-age-timeline.html) — Vinland Saga 历史时间线参考
- [角色-史实对照表](https://JayYa.github.io/LearningLessons/Vinland%20Saga/reference/vinland-saga-character-reference.html) — Vinland Saga 漫画角色与历史原型速查

*自动生成*
