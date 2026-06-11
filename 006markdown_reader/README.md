# Python 新人 Vibecoding 约 4 小时核心路线实战指南

这是一套面向 Python 新人的中文分节练习指南。目标是在约 4 小时内完成 `00-10` 的核心路线，用 `Claude Code CLI` 辅助完成一个最小任务管理系统，并在实践中理解 `SDD`、小步迭代、轻量 `TDD` 和 `Review` 的基本工作流。`11` 是额外可选延伸，不计入这 4 小时核心路线。

## 使用方式

按编号顺序阅读和实践。每一节都要完成“本节产出物”，并在结尾对照两部分收束内容：`验收标准` 和 `常见卡点`。`验收标准` 用来判断是否可以进入下一节，`常见卡点` 用来排查最容易出错的地方。第二部分从 `task-vibe/` 目录开始，所有真正编码练习都在项目目录内完成。

## 教师带课版

适合 1 次紧凑工作坊或拆成两段短课。教师可以把下面的学习单元当作节奏参考，而不是严格计时表；如果学生是 Python 新人，可以把 `00-10` 先压在约 4 小时核心练习里，再把 `11` 留作课后加练。

## 学生自学版

适合独立学习。学生可以先按 `00` 到 `10` 顺序推进，不跳过验证步骤，先完成约 4 小时核心路线；`11` 作为额外延伸，在核心路径完成后再做。每完成一节，都要先对照本节的预期输出，再进入下一节；如果失败，就先使用本节的修复提示词和常见卡点排查，不要直接让 `Claude Code CLI` 一次性重写整个项目。

## 课程目录

1. [00_overview.md](00_overview.md)
2. [01_vibecoding_modes.md](01_vibecoding_modes.md)
3. [02_environment_setup.md](02_environment_setup.md)
4. [03_project_spec_sdd.md](03_project_spec_sdd.md)
5. [04_task_breakdown.md](04_task_breakdown.md)
6. [05_backend_fastapi.md](05_backend_fastapi.md)
7. [06_database_sqlite.md](06_database_sqlite.md)
8. [07_core_api_tdd.md](07_core_api_tdd.md)
9. [08_frontend_jinja2.md](08_frontend_jinja2.md)
10. [09_debugging_with_claude_code.md](09_debugging_with_claude_code.md)
11. [10_review_and_reflection.md](10_review_and_reflection.md)
12. [11_next_steps.md](11_next_steps.md)

## 建议学习节奏

下面是建议节奏，不是严格计时。核心路线 `00-10` 目标是压在约 4 小时附近；`11` 是额外可选扩展，不计入核心时间。

- 第 1 个学习单元：`00` + `01`
- 第 2 个学习单元：`02`
- 第 3 个学习单元：`03`
- 第 4 个学习单元：`04` + `05`
- 第 5 个学习单元：`06`
- 第 6 个学习单元：`07`
- 第 7 个学习单元：`08` + `09`
- 第 8 个学习单元：`10`
- 课后延伸：`11`

## 你会完成什么

我们会一起做一个最小任务管理系统，技术栈固定为 `FastAPI + SQLite + Jinja2`。你会从创建项目目录开始，在 `Claude Code CLI` 的协作下完成需求整理、任务拆解、后端接口、数据库、页面、调试和复盘。

这套指南和配套文章都使用中文，只有命令、路径、代码和必要技术名保留英文，方便你直接照着终端操作。
