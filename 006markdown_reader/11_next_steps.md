# 11. 做一个小扩展，把方法完整用一遍

## 预计用时

可选加练，约 45-90 分钟。

## 本节位置

这是核心路线之外的课后延伸。完成 `00-10` 以后，如果你还想继续练，就在这里选择一个很小的扩展，从 `docs/extension-spec.md` 开始，完整走一遍 `SDD -> TDD -> 最小实现 -> 验证 -> Final Review`。

这一节的重点不是把扩展做成生产级功能，而是把本课程的方法迁移到一个新的小需求上。你只做 mini spec 里的第一条最小行为，先证明自己能独立启动下一轮练习：先收范围，再写测试，先看到失败，再最小实现，最后做 review。

## 工具使用规则

终端用于查看当前项目状态、运行测试、启动服务和检查文件。`Claude Code CLI` 用于帮助收敛扩展范围、写 mini spec、写第一条测试、运行测试、做最小实现和 final review；每一步都要限制范围，不要让 Claude 一次性大改项目。全课统一工具边界见 [AGENT.md](../AGENT.md)。

本节默认示例使用“任务优先级”。如果你选择“截止日期”“状态筛选”或“关键词搜索”，可以替换提示词里的扩展名称，但仍然只做第一条最小行为。

## 学习目标

- 把一个扩展想法收缩成可执行的 mini spec。
- 让 `Claude Code CLI` 帮你写第一条测试，并先看到它失败。
- 只实现 mini spec 中的一个最小行为，不顺手做完整大功能。
- 用同一条测试和一次手动验证确认行为成立。
- 写出 `docs/extension-review.md`，说明目标、改动、验证结果和下一步。

## 三个身份提醒

- 产品负责人：只选择一个很小的扩展方向，并把本轮实现限制在 mini spec 的第一条行为。
- 测试者：确认第一条扩展测试经历 Red 和 Green，再用最小手动验证证明真实行为成立。
- 学习者：能说明这次扩展如何复用了 `SDD -> TDD -> 最小实现 -> 验证 -> Review` 的方法。

## 本节产出物

- 当前工作目录：`task-vibe/`
- 扩展规格：`docs/extension-spec.md`
- 第一条扩展测试：推荐 `test_extension.py`
- 最小实现：只覆盖 mini spec 的第一条行为
- 扩展复盘：`docs/extension-review.md`

老师或学生自己检查时，重点看这轮扩展是否保持小范围、是否真的经历了“先失败，再通过”，以及 final review 是否能讲清楚这次改动。

## 操作步骤

1. 进入项目目录，确认当前项目已经完成前面章节的最小任务管理系统。

```bash
cd task-vibe
source .venv/bin/activate
ls
```

如果你要运行测试或服务，继续使用当前 `.venv`。如果只是读写 `docs/extension-spec.md`，虚拟环境不是必须，但保持环境一致会减少混乱。

2. 从下面 4 个扩展里选一个。一次只选一个，不要把多个方向合并成“增强版任务系统”：

- 任务优先级
- 截止日期
- 状态筛选
- 关键词搜索

Claude Code 提示词示例：

```text
我已经完成最小任务管理系统，现在要做第 11 节的小扩展练习。

请帮我在下面 4 个扩展里选择一个最适合做第一轮小步练习的方向：任务优先级、截止日期、状态筛选、关键词搜索。

要求：
1. 只推荐一个方向；
2. 说明为什么它适合第一轮练习；
3. 用一句话写出第一条最小可验证行为；
4. 不要写代码，不要修改文件；
5. 如果我想同时做多个方向，请提醒我收缩范围。
```

如果你不知道选哪个，默认选“任务优先级”。它适合练习“给任务增加一个字段”，第一条行为可以非常小：创建任务时没有指定优先级，系统默认保存为 `normal`。

3. 用 4 个问题防止 scope creep。只要有一个回答变复杂，就先缩小。

- 这个扩展是否只改变一个字段或一个已有列表行为？
- 第一条可验证结果是否能在 10-15 分钟内写出？
- 是否不需要登录、权限、部署、Docker、React 或新数据库？
- 是否能用一句话说清楚第一条测试？

Claude Code 提示词示例：

```text
我选择的扩展是“任务优先级”。请帮我做 scope check。

请只回答下面 4 点：
1. 这个扩展最小版本只改变什么？
2. 第一条测试应该验证哪一个行为？
3. 哪些想法必须放进“暂不实现”？
4. 这轮是否需要登录、Docker、React、部署或新数据库？

不要写代码，不要创建文件。
```

4. 让 `Claude Code CLI` 创建或更新 `docs/extension-spec.md`。这是 mini spec，不是实现计划大全。

Claude Code 提示词示例：

```text
我已经完成最小任务管理系统。请帮我为“任务优先级”创建或更新 docs/extension-spec.md。

要求：
1. 这是一份很小的扩展规格，仍然遵守 SDD、小步迭代、轻量 TDD 和 Review；
2. 只写字段变化、页面变化、验证规则、验收标准、第一条测试；
3. 明确写出“暂不实现”：排序、颜色样式、批量编辑、多优先级筛选、复杂校验；
4. 不要直接修改 main.py、db.py、templates/index.html 或测试文件；
5. 不要生成大段实现代码；
6. 如果发现范围变大，请把多余内容放进“暂不实现”。
```

如果你选择的不是优先级，把提示词里的“任务优先级”替换成“截止日期”“状态筛选”或“关键词搜索”。替换后仍然要求 Claude 只输出小规格，不要让它直接生成实现代码。

5. 阅读 Claude 写入的 `docs/extension-spec.md`。规格必须同时写清楚字段变化、页面变化、验证规则、验收标准和第一条测试。

参考修改示例：

```markdown
# 扩展规格：任务优先级

## 目标

给任务增加一个最小优先级字段，让新任务在没有指定优先级时默认保存为 normal。

## 新增字段

- priority：字符串，可选值为 `high`、`normal`、`low`

## 页面变化

- 新增任务时后续可以选择优先级
- 本轮第一步只要求列表能显示默认优先级

## 验证规则

- 如果没有传入优先级，保存为 `normal`
- 如果输入值不在允许范围内，暂时先不处理，放到后续练习

## 验收标准

- 创建一个不填写优先级的任务后，任务数据里有 `priority`
- 默认优先级是 `normal`
- 列表或接口结果里能看到 `normal`

## 第一条测试

- 创建一个不填写优先级的任务，断言返回结果或列表结果里显示 `priority == "normal"`

## 暂不实现

- 不做优先级排序
- 不做颜色样式
- 不做筛选
- 不做批量编辑
- 不做复杂错误提示
```

完成后检查：

```bash
cat docs/extension-spec.md
```

6. 让 Claude Code review mini spec 是否过大。这个 review 必须发生在写测试前。

Claude Code 提示词示例：

```text
请 review docs/extension-spec.md 是否足够小，适合第 11 节完成一轮 mini spec -> TDD -> 最小实现 -> final review。

要求：
1. 只检查范围，不写代码；
2. 判断第一条测试是否只覆盖一个行为；
3. 找出所有 scope creep；
4. 如果规格过大，请直接给出收缩后的版本；
5. 不要修改 main.py、db.py、templates/index.html 或测试文件。
```

如果 Claude 认为规格过大，先收缩 `docs/extension-spec.md`，不要继续写测试。常见过大信号是：同时做默认值、下拉框、颜色、排序、筛选和复杂校验。

7. 让 Claude Code 基于 mini spec 写第一条测试。推荐新建 `test_extension.py`，避免污染第 07 章的核心 API 测试。

Claude Code 提示词示例：

```text
请根据 docs/extension-spec.md 写第一条扩展测试，推荐创建 test_extension.py。

要求：
1. 只写第一条测试：创建一个不填写 priority 的任务，断言结果里 priority 是 normal；
2. 可以使用 FastAPI TestClient；
3. 不要修改 main.py、db.py、templates/index.html；
4. 不要一次写完整优先级功能的所有测试；
5. 写完后请在 Claude Code 里运行 python -m pytest -q test_extension.py，贴出完整输出；
6. 当前预期是失败，但失败应该来自功能还没实现，而不是测试语法错误或导入错误。
```

参考测试形状只用来对照，不要求完全一致：

```python
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_create_task_defaults_priority_to_normal():
    response = client.post("/tasks", json={"title": "带默认优先级"})
    assert response.status_code == 200
    data = response.json()
    assert data["priority"] == "normal"
```

完成后检查：

```bash
cat test_extension.py
```

如果 Claude 多写了 1-2 个测试，只要它们仍然围绕 mini spec 的第一条行为，并且没有引入排序、筛选、颜色等范围外功能，可以接受。如果它写了一整套扩展测试，请要求它收回到第一条测试。

8. 让 Claude Code 执行测试并分析失败，不要急着改实现。

Claude Code 提示词示例：

```text
请在 Claude Code 里运行 python -m pytest -q test_extension.py，并贴出完整输出。

要求：
1. 先不要修改任何实现文件；
2. 判断失败是否来自 priority 默认值尚未实现；
3. 如果是语法错误、导入错误或环境错误，请只修测试文件或环境提示，不要实现功能；
4. 请告诉我下一步最小实现应该改哪些文件，为什么只改这些文件。
```

判断方式：如果失败是缺少 `priority` 字段、数据库没有该列、返回 JSON 里没有该键，这通常是正确的 Red。它说明测试已经在检查 mini spec 的第一条行为。

9. 让 Claude Code 做最小实现。只允许实现第一条测试需要的行为。

Claude Code 提示词示例：

```text
当前失败的是 test_extension.py 里的第一条扩展测试。请只做让“创建任务时默认 priority 为 normal”通过的最小实现。

要求：
1. 允许修改 main.py 和 db.py；
2. 如需修改 templates/index.html，只能为了显示已有 priority，不要加入样式框架；
3. 可以给 tasks 表增加 priority 字段或在初始化逻辑中兼容这个字段；
4. 默认 priority 必须是 normal；
5. 不要实现排序、筛选、颜色、批量编辑或复杂校验；
6. 修改后请在 Claude Code 里重新运行 python -m pytest -q test_extension.py，贴出完整输出；
7. 如果仍然失败，请只修当前失败，不要重写整个项目。
```

如果 Claude 顺手实现了多个扩展，例如同时加了截止日期、搜索和优先级筛选，要让它收回：

```text
这超出了 docs/extension-spec.md 的范围。请只保留“创建任务时默认 priority 为 normal”需要的最小改动，撤回排序、筛选、颜色和其他扩展。
```

10. 重新运行同一条测试，并判断是否可以继续。

Claude Code 提示词示例：

```text
请重新运行 python -m pytest -q test_extension.py，并告诉我：
1. 第一条扩展测试是否通过；
2. 如果有额外测试，它们是否仍然在 docs/extension-spec.md 范围内；
3. 有没有 failed、error 或范围外改动；
4. 下一步应该做哪一个手动验证。
```

如果输出是 `1 passed`，可以继续。如果是 `2 passed`、`3 passed` 或更多，只要全部通过且额外测试仍在 mini spec 范围内，也可以继续。如果出现失败或 error，先不要进入 final review，只修当前失败行为。

11. 做一次最终验证。测试通过以后，再用终端或浏览器确认真实行为也成立。

Claude Code 提示词示例：

```text
请根据 docs/extension-spec.md 和当前实现，告诉我这一轮扩展的最小手动验证步骤。

要求：
1. 只验证第一条行为：默认 priority 是 normal；
2. 给出可以在终端或浏览器执行的最少步骤；
3. 不要要求我验证排序、筛选、颜色或其他暂不实现内容；
4. 如果需要启动服务，请使用 python -m uvicorn main:app --reload。
```

参考验证方式：

```bash
python -m pytest -q test_extension.py
python -m uvicorn main:app --reload
```

然后在浏览器中新建一条任务，确认页面或接口结果中能看到默认优先级 `normal`。如果你的第一条测试只验证 API 返回，也可以用对应的 `curl` 验证；关键是不要换成另一个未定义的新行为。

12. 让 Claude Code 创建 `docs/extension-review.md`，完成 final review。

Claude Code 提示词示例：

```text
请根据 docs/extension-spec.md、test_extension.py、当前 git diff、测试输出和我的手动验证结果，创建 docs/extension-review.md。

要求：
1. 说明本轮扩展目标；
2. 说明实际改了哪些文件；
3. 记录测试命令和结果；
4. 记录手动验证结果；
5. 写出 Claude 的 review 建议，最多 3 条；
6. 留出“我的总结”小节，用第一人称写，语言要像学生自己能讲出来；
7. 如果发现范围外改动，请在 review 里标出来，不要帮我继续实现新功能。
```

参考修改示例：

```markdown
# 扩展 Review：任务优先级

## 本轮目标

完成 mini spec 的第一条行为：创建任务时如果没有指定 priority，默认保存为 normal。

## 实际改动

- docs/extension-spec.md：记录扩展范围和第一条测试
- test_extension.py：新增默认优先级测试
- db.py / main.py：为任务增加 priority 默认值
- templates/index.html：如果本轮显示了 priority，记录页面展示变化

## 测试结果

命令：python -m pytest -q test_extension.py
结果：通过

## 手动验证

我创建了一条没有选择优先级的新任务，页面或接口结果显示 priority 为 normal。

## Claude Review 建议

1. 当前只完成默认值，排序和筛选不要急着加。
2. 如果下一轮继续做优先级，可以先补“用户选择 high/low”的测试。
3. 如果 main.py 变长，再考虑拆分数据库操作。

## 我的总结

这次我没有一上来做完整优先级系统，而是先用 mini spec 固定第一条行为，再用测试证明默认 normal 这件事。下一轮我可以继续做“创建任务时选择 high 或 low”。
```

完成后检查：

```bash
cat docs/extension-review.md
```

## 输入输出对照

| 输入 | 预期输出 | 学生要比较什么 |
|---|---|---|
| `我要给任务增加优先级` | `docs/extension-spec.md`，包含字段变化、页面变化、第一条测试、暂不实现 | 是否仍然保持范围小、可测试 |
| `请根据 mini spec 写第一条测试` | `test_extension.py` 中只有当前第一条行为测试 | 是否没有一次写完整扩展测试套件 |
| `python -m pytest -q test_extension.py`（实现前） | 失败，但失败来自功能尚未实现 | 是否真正经历 Red |
| 最小实现后重新运行同一条测试 | 通过；额外测试如果存在也都在范围内 | 是否进入 Green，并且没有被范围外测试带偏 |
| `docs/extension-review.md` | 包含目标、改动、测试、手动验证、Claude 建议、我的总结 | 是否完成 final review，而不是只改完代码 |

## 验收标准

运行或检查：

```bash
python -m pytest -q test_extension.py
cat docs/extension-review.md
```

通过标准：

- 你已经完成核心路线 `00-10`。
- `docs/extension-spec.md` 已经把范围收缩到一个可完成的小扩展。
- 第一条扩展测试已经真实经历过 Red，再进入 Green。
- 最小实现后重新运行同一条测试时，当前行为通过；如果有额外测试，它们也仍然在 mini spec 范围内。
- `docs/extension-review.md` 已完成，并且记录了目标、改动、测试、手动验证、Claude 建议和自己的总结。
- 你知道以后每一轮练习，仍然要遵守 `SDD + 轻量 TDD + 小步迭代 + Review`。
- 你知道这套课程到这里已经结束，之后可以按自己的节奏继续扩展。

需要停下处理：

- 如果 Claude 一次写了整套扩展功能，先收回到 mini spec 的第一条行为。
- 如果测试失败后你准备重写整个项目，先停下，只修当前失败行为。
- 如果 review 还没写，或者范围已经失控，不要把这一轮扩展当成完成。

## 常见卡点

- 把“扩展”理解成“大改项目”。
- 没写 mini spec，就直接让 Claude 改代码。
- 一开始就想改数据库、页面、接口所有层，但没拆第一条测试。
- 看到 Claude 多写了测试，就不判断范围是否还符合 mini spec。
- 测试失败后让 Claude 重写整个项目，而不是只修当前失败行为。
- 已经没有时间时仍然硬做完整功能，导致 review 没写、范围也失控。

到这里，这套 Python 新人 Vibecoding 入门练习就完整结束了。后面的练习，不再是按章节往下走，而是由你自己选择一个小扩展继续练。
