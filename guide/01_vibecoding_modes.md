# 01. Vibecoding 方法论：用一个小函数完整走一遍

## 预计用时

20-25 分钟。

## 本节位置

这是约 4 小时核心路线（00-10）的第 1 个学习单元。本节会从 `00` 的概念地图进入第一次真实练习，但它不是正式全栈项目。我们会创建一个临时实验目录 `vibecoding-method-lab/`，在里面启动 `Claude Code CLI`，用一个很小的 Python 函数练习 `SDD -> TDD -> 小步实现 -> Review`。正式任务管理系统会从 `02` 的 `task-vibe/` 目录开始。

这样安排的原因很简单：在进入全栈项目前，学生先用一个小到能完全看懂的函数体验完整工作流。你会先写规格，再写测试，先看到测试失败，再写最小实现让测试通过，最后让 Claude 做 Review。后面做 FastAPI、SQLite、Jinja2 时，只是把同一套动作放大到项目级别。

## 工具使用规则

终端用于创建 `vibecoding-method-lab/`、创建 `.venv`、安装 `pytest`、运行 `pytest`、检查文件和输出。`Claude Code CLI` 用于检查规格、辅助创建小范围代码、解释失败原因和做 Review。

## 学习目标

学完本节，你应该能理解并亲手体验 5 个动作。

第一，理解 `Prompt-Driven Coding` 的用途：它适合快速起草想法，但不能作为最终交付方式。
第二，理解 `SDD`：先写清楚规格，避免 AI 自己扩展需求。
第三，理解轻量 `TDD`：先写测试或预期行为，再写实现。
第四，理解小步迭代：一次只完成一个行为，不把多个修改混在一起。
第五，理解 `Review`：代码通过测试后，还要让 AI 帮你解释、检查、复盘，让代码从“能跑”变成“能讲清楚”。

本节练习的函数叫 `normalize_task_title(title: str) -> str`。它做的事情很小：把任务标题前后的空格去掉，把中间连续多个空格压缩成一个空格，如果标题全是空格，就返回空字符串。这个函数看起来简单，但非常适合演示方法论，因为它有清楚输入、清楚输出、清楚边界，也很容易用测试验证。

## 本节产出物

本节结束时，你应该得到下面 5 个产出物：

1. 一个临时练习目录：`vibecoding-method-lab/`。
2. 一个规格文件：`spec.md`。
3. 一个测试文件：`test_task_title.py`。
4. 一个实现文件：`task_title.py`。
5. 一段 Review 笔记：`review_note.md`。

请注意，`vibecoding-method-lab/` 只是方法论实验目录，不是后面全栈项目的目录。后面 `02` 会重新创建正式项目目录 `task-vibe/`。如果你把这两个目录混在一起，后面的学习会变乱。

## 操作步骤

### 第 1 步：创建方法实验目录

先在你想放练习文件的位置打开终端，创建一个独立目录：

```bash
mkdir vibecoding-method-lab
cd vibecoding-method-lab
```

确认你已经进入实验目录：

```bash
pwd
```

预期输出里应该以 `vibecoding-method-lab` 结尾。这个检查很重要，因为后面的所有文件都应该放在这个临时目录里，而不是放进正式项目 `task-vibe/`。

### 第 2 步：创建虚拟环境并安装 pytest

本节会运行 `pytest test_task_title.py`，所以需要先准备一个只属于这个实验目录的 Python 虚拟环境。这样做有两个好处：第一，不污染你电脑上的全局 Python；第二，学生能清楚知道 `pytest` 是从哪里来的。

在 `vibecoding-method-lab/` 目录内执行：

```bash
python -m venv .venv
source .venv/bin/activate
pip install pytest
```

安装完成后，可以确认 `pytest` 已经可用：

```bash
pytest --version
```

预期输出会显示 pytest 的版本号，例如：

```text
pytest 8.x.x
```

如果你看到 `pytest: command not found`，通常说明虚拟环境没有激活，或者 `pip install pytest` 没有成功。先不要继续写测试，回到这一步修好环境。

### 第 3 步：启动 Claude Code CLI

在 `vibecoding-method-lab/` 目录内启动 `Claude Code CLI`：

```bash
claude
```

启动后，先不要让 Claude 写代码。你要先告诉它本节的边界：

```text
我正在做一个 Python 新人的 vibecoding 方法论实验。本节只练一个小函数 normalize_task_title，不做 FastAPI，不做数据库，不创建正式项目。请你作为我的 Claude Code CLI 编程搭档，帮助我按 SDD -> TDD -> 小步实现 -> Review 的顺序完成练习。
```

这段话的目的是建立边界。AI 很容易在没有边界时“热心过头”，给你加项目结构、加复杂工具、加你现在不需要的功能。好的 vibecoding 第一件事不是写代码，而是告诉 AI：这次只做什么，不做什么。



### 第 4 步：用 SDD 写规格

在 `vibecoding-method-lab/` 目录下先让 Claude Code 创建 `spec.md`，写下这个函数的规格。你的任务不是盲目接受，而是看懂它有没有把范围说清楚，尤其是“本次不做”有没有挡住多余功能。

Claude Code 提示词示例：

```text
请在当前 vibecoding-method-lab/ 目录下创建 spec.md，只写 normalize_task_title 这个小函数的规格。

要求：
1. 写清楚目标、函数签名、规则、本次不做；
2. 规则只包含去掉前后空格、压缩中间空白、全空格返回空字符串；
3. 明确不做标题长度检查、emoji 处理、标点处理、数据库或 Web 功能；
4. 不要创建测试文件，不要创建实现文件。
```

参考修改示例：

```markdown
# normalize_task_title 规格

## 目标

把用户输入的任务标题整理成稳定、可保存、可显示的格式。

## 函数签名

normalize_task_title(title: str) -> str

## 规则

1. 去掉标题前后的空格。
2. 把中间连续多个空格压缩成一个空格。
3. 如果标题全是空格，返回空字符串。

## 本次不做

1. 不检查标题长度。
2. 不处理 emoji。
3. 不处理中英文标点。
4. 不连接数据库。
```

打开新窗口，检查：

```bash
cat spec.md
```

这里就是 `SDD` 的核心：先写规格，再写代码。规格不需要很长，但必须能回答“这个函数到底做什么”和“这个函数不做什么”。对新人来说，“不做什么”尤其重要，因为它能防止 AI 把小练习扩展成大工程。

### 第 5 步：用 TDD 先写测试

接下来不要写实现，让 Claude Code 在 `vibecoding-method-lab/` 目录下创建测试文件 `test_task_title.py`。这一步只定义预期行为，故意让测试先失败。

Claude Code 提示词示例：

```text
请根据 spec.md 创建 test_task_title.py，只写 normalize_task_title 的 pytest 测试。

要求：
1. 测试前后空格会被去掉；
2. 测试中间连续多个空格会压缩成一个空格；
3. 测试全是空格时返回空字符串；
4. 只创建或修改 test_task_title.py；
5. 不要创建 task_title.py，不要写实现代码。
```

参考修改示例：

```python
from task_title import normalize_task_title


def test_normalize_task_title_trims_spaces():
    assert normalize_task_title("  学习 Claude Code  ") == "学习 Claude Code"


def test_normalize_task_title_collapses_inner_spaces():
    assert normalize_task_title("学习   Claude   Code") == "学习 Claude Code"


def test_normalize_task_title_handles_empty_title():
    assert normalize_task_title("   ") == ""
```

完成后检查：

```bash
cat test_task_title.py
```

这一步是 `TDD` 的 Red 阶段。Red 的意思不是“代码错了很糟糕”，而是“我们先看到一个预期中的失败”。这个失败证明测试确实在检查一个还没有实现的行为。如果你还没写实现，测试却通过了，那说明测试没有真正测到你想要的东西。

运行测试：

```bash
python -m pytest test_task_title.py
```

预期结果是失败。你可能看到类似信息：

```text
ModuleNotFoundError: No module named 'task_title'
```
![[Pasted image 20260606205337.png]]

这是一个好失败。它说明测试已经开始寻找 `task_title.py`，但实现文件还不存在。

### 第 6 步：写最小实现

现在让 Claude Code 创建 `task_title.py`，只写刚好能让测试通过的最小实现。

Claude Code 提示词示例：

```text
现在请创建 task_title.py，只实现 normalize_task_title(title: str) -> str。

要求：
1. 让 test_task_title.py 里的 3 个测试通过；
2. 使用尽量简单的 Python 写法；
3. 不要增加标题长度校验；
4. 不要创建类、数据库、FastAPI 或其他项目结构；
5. 修改后告诉我应该运行哪条 pytest 命令验证。
```

参考修改示例：

```python
def normalize_task_title(title: str) -> str:
    return " ".join(title.strip().split())
```

完成后检查：

```bash
cat task_title.py
```

这段实现很短，但它刚好满足规格。`title.strip()` 会去掉前后空格，`split()` 会把字符串按空白分开，并自动忽略连续空格，`" ".join(...)` 会用一个普通空格把它们重新连接起来。如果输入是 `"   "`，`strip()` 后是空字符串，`split()` 得到空列表，最后 `join` 返回空字符串。

这就是 TDD 的 Green 阶段：写最少的代码，让测试通过。这里不要顺手加标题长度校验，不要加数据库，不要加 Web 接口。那些都不在规格里。新人的一个常见误区是“既然已经开始写了，不如多加一点”。但在 AI 协作里，多加一点很容易变成多出十个你看不懂的文件。

再次运行测试：

```bash
pytest test_task_title.py
```

预期输出里应该看到：

```text
3 passed
```

判断测试是否通过时，不要只盯着数字，而要看“是否全部通过”和“测试是否仍在本节范围内”：

- 情况 1：看到 `3 passed`，说明本节要求的 3 个基础测试都通过，可以进入下一步。
- 情况 2：看到 `4 passed`、`5 passed` 或更多，并且没有 `failed`、`error`、`xfailed` 等失败信号，也可以进入下一步。但要先确认额外测试仍然符合 `spec.md`，比如仍然只检查空白整理行为，没有加入标题长度、数据库、FastAPI 或其他范围外内容。
- 情况 3：如果出现失败或报错，先不要进入下一步。把完整报错、`test_task_title.py`、`task_title.py` 发给 Claude，让它只分析这个错误，不要重写整个练习。

如果出现报错，可以在 Claude Code CLI 中输入：

```text
这是我运行 pytest test_task_title.py 的完整报错。请先解释最可能的原因，再给最小修复方案。不要重写整个练习，也不要添加本节规格之外的功能。
```


### 第 7 步：做一次小步迭代

现在你已经完成了最小实现，可以体验一次“小步迭代”。小步迭代不是加很多功能，而是在已经通过测试的基础上，增加一个非常小的新行为。

例如，你可以新增一个测试：如果标题中包含换行和制表符，也应该被整理成普通空格。

Claude Code 提示词示例：

```text
请在 test_task_title.py 里只新增一个测试：标题中包含 tab 和换行时，也应该被整理成普通空格。

要求：
1. 只修改 test_task_title.py；
2. 不要修改 task_title.py；
3. 不要新增其他行为；
4. 修改后告诉我应该重新运行哪条测试命令。
```

参考修改示例：

```python
def test_normalize_task_title_handles_tabs_and_newlines():
    assert normalize_task_title("学习\tClaude\nCode") == "学习 Claude Code"
```

完成后检查：

```bash
cat test_task_title.py
python -m pytest test_task_title.py
```

你可能会发现测试直接通过，因为 `split()` 本来就会处理多种空白字符。这也是一个重要学习点：有时候好的最小实现已经覆盖了更多合理行为。此时你不需要为了“显得做了迭代”而强行改代码。小步迭代的目标是保持行为清楚，而不是制造复杂度。

如果你想继续练习，可以让 Claude 帮你解释为什么这个新增测试也能通过：

```text
请解释为什么 normalize_task_title 使用 strip、split、join 后，也能处理 tab 和换行。请用 Python 新人能理解的语言说明，不要修改代码。
```

### 第 8 步：让 Claude 做 Review

测试通过不代表学习结束。现在让 Claude Code 根据当前三个文件创建 `review_note.md`，记录一次 Review。你仍然要逐句读懂，如果有一句你解释不出来，就让 Claude 改成更朴素的表达。

Claude Code 提示词示例：

```text
请 review 当前练习中的 spec.md、test_task_title.py 和 task_title.py，并创建 review_note.md。

请只关注 4 件事：
1. 规格是否清楚；
2. 测试是否覆盖了核心行为；
3. 实现是否足够简单；
4. 是否有过度设计。

请不要引入 FastAPI、数据库或正式项目结构。
review_note.md 要用 Python 新人能看懂的短句，不要写得像正式代码审计报告。
```

参考修改示例：

```markdown
# Review 笔记

## 规格是否清楚

规格清楚，因为它说明了函数目标、函数签名、三条规则和本次不做什么。

## 测试是否覆盖核心行为

测试覆盖了前后空格、连续空格、空标题，以及 tab/newline 的情况。

## 实现是否足够简单

实现只有一行，使用 strip、split、join，符合当前规格。

## 是否有过度设计

没有引入数据库、Web 框架或复杂类结构，适合 Python 新人理解。
```

完成后检查：

```bash
cat review_note.md
```

Review 的意义是把“我照着做完了”变成“我知道为什么这样做”。如果你能讲清楚这个小函数的规格、测试、实现和边界，后面进入全栈项目时就不会只是在复制命令。

### 第 9 步：把每一步和方法论对应起来

完成代码以后，不要急着关闭终端。请停下来，把刚才的动作和方法论一一对应。这个动作看起来像复盘，其实是把“我做了什么”变成“我学会了什么”。

当你创建 `spec.md` 时，你做的是 `SDD`。它不是为了写一份漂亮文档，而是为了先把范围固定住。一个小函数也需要规格，因为规格能告诉你哪些行为应该实现，哪些行为暂时不要碰。比如本节明确“不检查标题长度”，这会阻止 Claude 自作主张加入额外校验。

当你创建 `test_task_title.py`，并在没有实现文件时运行 `pytest`，你做的是 `TDD` 的 Red 阶段。Red 阶段最重要的不是“失败”，而是“失败得正确”。如果失败原因是 `ModuleNotFoundError`，说明测试正在寻找还没有实现的模块；如果失败原因是语法错误，说明你还没真正进入行为验证，需要先修正测试文件。

当你写下 `task_title.py` 的一行实现，并让测试通过，你做的是 Green 阶段。Green 阶段的关键是“刚好够用”。你不需要把函数写得很复杂，也不需要创建类。AI 很容易给出更完整、更工程化的答案，但本节的目标是让新人理解行为，不是展示架构能力。

当你新增 tab 和换行的测试时，你做的是小步迭代。它只增加一个可验证行为，而且这个行为和原规格非常接近。好的迭代应该像这样：小、清楚、能验证。如果你一次加入长度校验、数据库保存、接口调用，那就不是迭代，而是范围失控。

当你写 `review_note.md` 时，你做的是 `Review`。Review 不只是让 Claude 夸代码好不好，而是检查规格、测试、实现之间是否一致。对新人来说，Review 最重要的价值是训练表达：你能不能说出为什么这个实现符合规格，为什么测试能证明它，为什么当前没有过度设计。

### 第 10 步：学会读输出，而不是只看通过或失败

很多新人运行命令时，只看最后一行：通过就开心，失败就慌。但在 `Vibecoding` 里，你必须学会读输出。输出是你和系统沟通的方式，也是你和 Claude 协作的事实依据。

当你第一次运行 `pytest test_task_title.py`，如果看到 `ModuleNotFoundError: No module named 'task_title'`，这不是坏消息。它说明测试文件已经被 pytest 找到了，测试也已经尝试导入目标函数，只是实现还不存在。这个失败正好符合 TDD 的预期。

如果你看到的是 `SyntaxError`，那就不是理想 Red。它说明 Python 连测试文件都解析不了。此时你应该先检查冒号、缩进、引号，而不是让 Claude 直接写实现。

如果你看到的是 `AssertionError`，说明实现已经存在，但输出和预期不一致。这个时候最适合把“输入值、实际输出、预期输出”一起发给 Claude，让它分析差异。例如：输入是 `"学习   Claude   Code"`，预期是 `"学习 Claude Code"`，实际却还是多个空格。这能帮助 Claude 精准判断问题在空格压缩逻辑。

如果你看到 `3 passed`、`4 passed` 或更多通过数量，也不要马上跳过。你要确认两件事：第一，pytest 是否显示全部通过，没有失败或错误；第二，测试数量是否和你实际写下的测试数量一致。Claude 有时会多写一两个合理测试，只要它们仍然符合 `spec.md`，就不需要为了凑成固定数字而删除。反过来，如果你明明写了 4 个测试，却只看到 3 个通过，说明可能有一个测试没有被 pytest 识别，比如函数名没有以 `test_` 开头。

读输出是一种工程能力。你读得越准确，和 Claude 的对话就越短、越清楚、越有结果。

### 第 11 步：把 Claude 当副驾驶，而不是自动驾驶

本节要求你启动 `Claude Code CLI`，但不是为了让 Claude 全程替你做。你要练习一种更健康的协作方式：Claude 是副驾驶，你仍然是驾驶者。

副驾驶可以帮你看地图。比如你把 `spec.md` 发给 Claude，让它检查规格是否清楚。它可能提醒你“空字符串应该返回什么”还没写清楚。这个反馈很有价值，因为它帮你发现规格空洞。

副驾驶可以帮你检查仪表盘。比如测试失败时，你把完整报错给 Claude，让它解释失败原因。它可以告诉你这是缺少模块、断言失败，还是语法错误。这样你不会在错误类型之间乱猜。

副驾驶也可以帮你解释路线。比如测试通过后，你让 Claude 解释 `strip()`、`split()`、`join()`，它能把一行代码拆成容易理解的步骤。但你不能只停留在“Claude 解释过了”。你还要自己用一句话复述：先去掉前后空格，再按空白切分，再用单个空格重新连接。

自动驾驶式使用 Claude 的表现是：你说“帮我完成这个练习”，然后复制它所有输出。
副驾驶式使用 Claude 的表现是：你每次只给一个小目标，并且要求它解释原因、控制范围、不要改无关内容。本课程推荐后一种。

### 第 12 步：把本节实验收干净

进入下一节之前，请确认这个实验目录保持简单。`vibecoding-method-lab/` 里理想情况下只有这些文件：

```text
spec.md
test_task_title.py
task_title.py
review_note.md
```

如果 Claude 额外创建了很多文件，比如 `app.py`、`requirements.txt`、`database.py`、`templates/`，请先不要带着这些文件进入下一节。它们说明本节范围已经被扩展了。你可以保留作为对比，但要在笔记里写清楚：这些不是本节要求的产物。

这一点很重要，因为后面 `02` 会创建正式项目 `task-vibe/`。正式项目会有 FastAPI、SQLite、Jinja2、页面和接口。

最好的状态是：`01` 很小，但你完整经历了方法；`02` 才正式变大，但你已经知道如何控制节奏。

### 第 13 步：用自己的话讲一遍

最后，请不要只把文件留在目录里。你要尝试用自己的话讲一遍这个实验。这个动作很像课堂上的“讲给同桌听”，但它对自学尤其重要。因为你能不能讲出来，通常比你能不能复制代码更能说明是否学会。

你可以按下面顺序讲：

第一，我先创建了 `vibecoding-method-lab/`，因为本节只是方法实验，不是正式项目。第二，我创建 `.venv` 并安装 `pytest`，因为本节要运行测试。第三，我在这个目录里启动 `Claude Code CLI`，并告诉它本节只练一个小函数，不做 FastAPI、数据库和页面。第四，我先写 `spec.md`，用 `SDD` 固定函数目标和边界。第五，我写 `test_task_title.py`，先运行失败测试，体验 `TDD` 的 Red。第六，我写 `task_title.py` 的最小实现，再运行测试看到通过，体验 Green。第七，我新增一个很小的测试，观察当前实现是否已经覆盖这个行为。第八，我写 `review_note.md`，把规格、测试、实现和过度设计检查讲清楚。

如果你能这样讲出来，说明你不是只完成了一个函数，而是理解了一套工作流。后面做全栈项目时，你会反复使用这套语言：先说边界，再定义验证，再小步实现，再解释和复盘。

如果你讲不出来，也不要急着进入 `02`。回到刚才的文件，一个一个看：`spec.md` 说明做什么，`test_task_title.py` 说明怎么证明它对，`task_title.py` 说明最小实现，`review_note.md` 说明你学到了什么。把这四个文件串起来，就是本节真正的学习成果。

## 输入输出对照

| 输入 | 预期输出 | 学生要比较什么 |
|---|---|---|
| `mkdir vibecoding-method-lab && cd vibecoding-method-lab` | 当前目录变成 `vibecoding-method-lab` | 是否把方法实验和正式项目目录分开。 |
| `python -m venv .venv && source .venv/bin/activate && pip install pytest` | 当前目录出现 `.venv`，并且 `pytest --version` 能显示版本号 | 是否知道 `pytest` 来自本节虚拟环境。 |
| `claude` | 在当前目录启动 `Claude Code CLI` | 是否在正确目录内启动，而不是脱离项目上下文。 |
| `pytest test_task_title.py`（实现前） | 测试失败，常见原因是缺少 `task_title.py` | 是否真正经历了 TDD 的 Red 阶段。 |
| `pytest test_task_title.py`（实现后） | 至少 3 个基础测试全部通过；如果有额外测试，也必须全部通过且仍在规格范围内 | 是否进入 Green 阶段，并确认行为符合预期。 |
| `normalize_task_title("  学习   Claude Code  ")` | `"学习 Claude Code"` | 是否理解输入如何被整理成稳定输出。 |
| Review 提示词 | 一份只关注规格、测试、实现、过度设计的反馈 | 是否让 Claude 做聚焦 Review，而不是扩展项目。 |

## 验收标准

运行或检查：

```bash
pwd
pytest --version
pytest test_task_title.py
```

通过标准：

- 你创建了 `vibecoding-method-lab/`，并知道它不是正式项目目录。
- 你创建并激活 `.venv`，安装了 `pytest`。
- 你先写规格和测试，再写最小实现，并看到测试从失败到通过。
- 你写了 `review_note.md`，能解释 SDD、TDD、小步迭代和 Review。

需要停下处理：

- 如果你跳过失败测试，直接复制最终代码，先回到 Red 阶段重跑。
- 如果你把 FastAPI、SQLite、Jinja2 或 `task-vibe/` 提前引入本节，先收回到小函数实验范围。

## 卡点与过关

常见卡点：

- 忘记激活 `.venv`，导致 `pytest` 找不到。
- 把本节实验目录和下一节正式项目目录混在一起。
- 让 Claude 一次生成太多文件，超出小函数实验范围。
- 只看见测试通过，却没有写 Review 笔记。

过关前确认：

- 我已经创建并进入 `vibecoding-method-lab/`。
- 我已经创建并激活 `.venv`，并安装了 `pytest`。
- 我已经确认 `pytest --version` 可以显示版本号。
- 我已经在该目录内启动过 `Claude Code CLI`，并说明本节只练小函数。
- 我已经写出 `spec.md`，并能说清本次做什么、不做什么。
- 我已经先运行过失败测试，再写实现让测试通过。
- 我已经看到 `pytest test_task_title.py` 至少让 3 个基础测试全部通过；如果有额外测试，它们也仍在 `spec.md` 范围内并且全部通过。
- 我已经写出 `review_note.md`。
- 我知道下一节 `02` 才会创建正式全栈项目目录 `task-vibe/`。
