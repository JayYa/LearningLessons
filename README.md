# Learning Lessons

这套课程围绕现代 .NET 开发构建了一条从语言表层到底层运行时的学习曲线。课程以 C# 8 为锚点，从可空引用类型切入，遍历 switch 表达式、索引范围等语法糖，随后将重心转向异步编程的完整图景——从 yield return 同步迭代器的状态机构建，到 IAsyncEnumerable 异步流的消费与取消，最终抵达 SynchronizationContext 这一 await 续延调度的核心机制，并以默认接口方法收尾完成 C# 8 特性全景。三条主线贯穿始终：**平台迁移**（Framework 4.8 → 现代 .NET）、**C# 语言演进**（类型系统、模式匹配、接口增强）、**异步内部机制**（迭代器、异步流、调度上下文）。

🌐 在线查看：[JayYa.github.io/LearningLessons](https://JayYa.github.io/LearningLessons/)

## Morden .NET

| # | 课程 | 描述 |
|---|------|------|
| 1 | [Lesson 01: C# 8 Nullable Reference Types — 从 Framework 4.8 到现代 .NET](Morden%20.NET/01-csharp8-nullable-reference-types.html) | 从 Framework 4.8 迁移背景出发，讲解可空引用类型的设计动机与空安全实践 |
| 2 | [Lesson 02: C# 8 Switch Expressions · Using Declarations · Indices/Ranges](Morden%20.NET/02-csharp8-switch-using-indices.html) | 解析 switch 表达式模式匹配、using 声明与索引范围三种语法改进 |
| 3 | [Lesson 03: C# yield return 同步迭代器](Morden%20.NET/03-sync-yield-return-iterators.html) | 拆解 yield return 延迟执行与编译器生成的状态机实现 |
| 4 | [Lesson 04: C# 8 Async Streams — 异步流](Morden%20.NET/04-csharp8-async-streams.html) | 从同步迭代器到 IAsyncEnumerable，全面讲解异步流的消费、取消与上下文控制 |
| 5 | [Lesson 05: SynchronizationContext — await 续延调度的核心机制](Morden%20.NET/05-async-await-synchronizationcontext.html) | 深入 SynchronizationContext 调度模型，理解 await 续延如何在执行上下文中流转 |
| 6 | [Lesson 06: C# 8 收尾 — Default Interface Methods 与其他实用特性](Morden%20.NET/06-csharp8-wrapup-default-interface-methods.html) | 收尾讲解默认接口方法及 C# 8 其余实用特性，完成语言演进全景 |

*自动生成*
