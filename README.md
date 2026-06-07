# Learning Lessons

本系列以 C# 8 为起点，贯穿从 Framework 4.8 到现代 .NET 的语言演进主线。从可空引用类型带来的类型安全变革，到 Switch 表达式与模式匹配等语法糖背后的编译器设计思想，再到 yield return 同步迭代器与 IAsyncEnumerable 异步流构成的完整迭代器进化路径——每课深入一个特性，兼顾原理、实战与迁移场景。后期课程更深入到 SynchronizationContext 调度机制和 Default Interface Methods 等特性，完成从语言表层到底层运行时的全景覆盖。

🌐 在线查看：[jayya.github.io/LearningLessons](https://jayya.github.io/LearningLessons/)

---

## Morden .NET

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 01: C# 8 Nullable Reference Types — 从 Framework 4.8 到现代 .NET](Morden%20.NET/01-csharp8-nullable-reference-types.html) | 从 Framework 4.8 历史包袱出发，系统讲解可空引用类型、空合并赋值与旧项目迁移策略 |
| 2 | [Lesson 02: C# 8 Switch Expressions · Using Declarations · Indices/Ranges](Morden%20.NET/02-csharp8-switch-using-indices.html) | C# 8 三大语法改进：Switch 表达式模式匹配、Using 声明自动释放、索引与范围运算符 |
| 3 | [Lesson 03: C# yield return 同步迭代器](Morden%20.NET/03-sync-yield-return-iterators.html) | 深度拆解 yield return 的延迟执行原理、编译器状态机生成与实战模式 |
| 4 | [Lesson 04: C# 8 Async Streams — 异步流](Morden%20.NET/04-csharp8-async-streams.html) | IAsyncEnumerable 异步流完整讲解：CancellationToken 取消、ConfigureAwait 上下文与 Async LINQ |
| 5 | [Lesson 05: SynchronizationContext — await 续延调度的核心机制](Morden%20.NET/05-async-await-synchronizationcontext.html) | 深入 await 续延调度机制，理解 SynchronizationContext 如何串联异步执行上下文 |
| 6 | [Lesson 06: C# 8 收尾 — Default Interface Methods 与其他实用特性](Morden%20.NET/06-csharp8-wrapup-default-interface-methods.html) | 收尾 C# 8 系列：默认接口方法与其余实用特性一览 |

---

*自动生成*
