# 07. 用轻量 TDD 实现核心任务 API

## 预计用时

35-45 分钟。

## 本节位置

约 4 小时核心路线（00-10）的第 6 个学习单元。用轻量 `TDD` 验证任务 API 的核心行为，再写最小实现。

## 工具使用规则

终端用于确认 `task-vibe/.venv`、启动服务、执行 `curl` 验证接口。`Claude Code CLI` 用于创建 `test_app.py`、运行 `pytest`、按单个功能生成或修复 API 代码，并解释失败测试原因。本节所有测试都优先让 Claude Code 执行，学生负责读输出、确认范围、再决定是否进入下一步。

## 学习目标

- 在 `task-vibe/` 目录内用轻量 TDD 实现四个核心能力：列表、创建、切换完成状态、删除。
- 学会先写“预期行为”，再写最小实现，而不是一上来就盲写代码。
- 理解“先失败，再实现，再通过”的最小 TDD 节奏。
- 能为每个功能分别判断成功和失败，而不是只看“程序大概能跑”。

## 三个身份提醒

- 产品负责人：把本节范围收在列表、创建、切换、删除四个 API 行为里，不顺手做页面或额外功能。
- 测试者：用测试映射表、单个 pytest node id、完整测试套件和 `curl` 逐一验证每个行为。
- 学习者：能说明四个接口各自的成功信号、常见失败信号，以及为什么要按 Red 到 Green 的顺序推进。

## 本节产出物

- 当前工作目录：`task-vibe/`
- 新增文件：`task-vibe/test_app.py`
- 你会补充 `task-vibe/main.py`，让它支持：
  - `GET /tasks`
  - `POST /tasks`
  - `POST /tasks/{task_id}/toggle`
  - `POST /tasks/{task_id}/delete`
- 你会得到一组可直接运行的测试，以及每个功能清晰的成功/失败标准。

## 操作步骤

1. 进入 `task-vibe/`，确认前两节的 `main.py` 和 `db.py` 都已存在。在终端执行：

```bash
cd task-vibe
source .venv/bin/activate
ls
python -m pip show fastapi pytest httpx2 python-multipart
```

你至少应该能看到 `main.py`、`db.py`，以及前面练习留下的虚拟环境或依赖文件。这里不要先打开浏览器，也不要急着启动 `uvicorn`。这一节的训练重点是：先让测试说清楚“程序应该做什么”，再让实现去满足这个行为。

`pytest`、`fastapi.testclient`、`httpx2` 和后面的 `uvicorn` 都依赖 `task-vibe/.venv` 里的包。每次新开终端做这一节，都先执行 `source .venv/bin/activate`，再运行测试或服务；否则红色报错可能不是业务行为失败，而是环境没有准备好。尤其是 `TestClient` 报 `ModuleNotFoundError: No module named 'httpx2'` 时，先回到第 02 节补装 `httpx2`，再继续判断 API 行为。

2. 先不要急着改实现。先写出你希望 API 做什么，也就是测试。

Claude Code 提示词示例：

```text
我现在在 task-vibe/ 目录里

请先只创建 test_app.py，用轻量 TDD 写出本节 API 的四个预期行为：
1. GET /tasks 返回任务列表 JSON；
2. POST /tasks 可以新增任务；
3. POST /tasks/{task_id}/toggle 可以切换完成状态；
4. POST /tasks/{task_id}/delete 可以删除任务。

要求：
1. 只创建或修改 test_app.py；
2. 不要修改 main.py；
3. 不要直接实现 API；
4. 每个测试函数名要能说明它验证的行为，但不要求和指南里的参考名字完全一样；
5. 创建后请你在 Claude Code 里执行 python -m pytest -q test_app.py，贴出完整输出，确认当前失败来自 API 未实现，而不是测试语法错误；
6. 如果测试文件本身有语法错误或导入错误，请只修 test_app.py，然后再次在 Claude Code 里运行同一条命令；
7. 最后请给我一张“测试映射表”，列出 list、create、toggle、delete 四个行为分别对应哪个 pytest node id，例如 test_app.py::某个测试函数名。
```

`Tips` :如果你要继续做其他功能，也保持同样节奏：一次只推进一个行为。

3. 创建 `test_app.py`，先定义四类预期行为：
   - 读取任务列表时，应该返回列表 JSON。
   - 新增任务后，列表里应该出现新任务。
   - 切换完成状态后，`is_done` 应该从 `0` 变成 `1`，或者从 `1` 变回 `0`。
   - 删除任务后，列表里不应再出现该任务。

这四类行为就是本节 API 练习的边界。你可以把它们看成四个小关卡：

- `list` 只关心“我能不能拿到任务集合”。即使当前没有任何任务，返回 `[]` 也是正确的，因为空列表仍然是一个列表。
- `create` 关心“我提交一个标题后，系统有没有真的生成一条任务”。测试会检查返回内容里是否有原来的 `title`，以及新任务是否默认未完成。
- `toggle` 关心“系统有没有根据当前状态做反向切换”。它不是简单把 `is_done` 写成某个固定值，而是要先知道现在是 `0` 还是 `1`。
- `delete` 关心“删除以后，后续列表里还看不看得到它”。删除接口返回成功只是第一层信号，真正重要的是列表结果已经变化。

轻量 TDD 的核心不是一次写出完美测试，而是让每个测试都能表达一个清楚的预期行为。对 Python 新手来说，测试函数名也很重要：`test_list_tasks_returns_json_list` 就是在说“列表接口应该返回 JSON 列表”，`test_create_task_adds_one_task` 就是在说“创建接口应该新增一条任务”。当你以后看到失败信息时，测试名会先告诉你，是哪个功能没有通过测试。

阅读 Claude 输出并判断下一步：检查 `test_app.py` 是否表达了本节四个核心行为。下面的测试只用来对照结构，不要求完全一致；如果 Claude Code 生成的函数名不同，只要测试行为清楚、运行结果可验证，就可以继续。

参考修改示例：

```python
from fastapi.testclient import TestClient

from db import init_db
from main import app

client = TestClient(app)

def setup_module():
    init_db()

def test_list_tasks_returns_json_list():
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_task_adds_one_task():
    response = client.post("/tasks", json={"title": "写测试"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "写测试"
    assert data["is_done"] == 0

def test_toggle_task_changes_is_done():
    created = client.post("/tasks", json={"title": "切换状态"}).json()
    response = client.post(f"/tasks/{created['id']}/toggle")
    assert response.status_code == 200
    assert response.json()["is_done"] == 1

def test_delete_task_removes_task_from_list():
    created = client.post("/tasks", json={"title": "删除任务"}).json()
    response = client.post(f"/tasks/{created['id']}/delete")
    assert response.status_code == 200
    tasks = client.get("/tasks").json()
    assert all(task["id"] != created["id"] for task in tasks)
```

完成后检查：

```bash
cat test_app.py
python -m pytest -q test_app.py
```

这两条命令也让 Claude Code 在它的环境里执行并贴出输出。你可以在自己的终端复查，但本节的练习节奏以 Claude Code 的执行结果为准：Claude Code 创建测试，Claude Code 运行测试，Claude Code 根据失败继续做最小修改。

从这里开始，不要完全1比1的复制教程里面的测试函数名。你要对照Claude Code给出的“测试映射表”，后面每一轮都用你本地真实存在的 pytest node id。映射表最少应该能回答：

```text
list   -> test_app.py::你的列表测试函数名
create -> test_app.py::你的新增测试函数名
toggle -> test_app.py::你的切换测试函数名
delete -> test_app.py::你的删除测试函数名
```

4. 先让 Claude Code 运行测试，亲眼看到失败。先把下面这段提示词交给 Claude Code，再让它执行测试：

Claude Code 提示词示例：

```text
我现在在 task-vibe/ 目录里。

请先不要修改任何代码，只做测试执行和失败分析。

要求：
1. 在 Claude Code 里执行 pytest -q；
2. 贴出完整输出；
3. 不要修改 main.py；
4. 不要修改 db.py；
5. 不要修改 test_app.py；
6. 只判断当前失败属于哪一类：缺路由、断言失败、导入/环境问题；
7. 请用 list、create、toggle、delete 四个行为视角总结当前失败分别落在哪一组；
8. 最后告诉我现在最先应该处理的是哪一个行为组，但先不要帮我改代码。
```

你要检查 Claude 返回什么：

- 它是否真的执行了 `pytest -q`，而不是只口头分析。
- 它是否贴出了完整失败输出，而不是只摘几行。
- 它是否告诉你最先应该处理的行为组，例如先做 `list`。
- 它是否保持在“只分析失败”的范围内，没有提前修改文件，也没有一次性实现所有接口。

这一步的价值非常大。一个好的失败测试不是“程序坏了”这么笼统，而是告诉你“当前实现离预期行为差在哪里”。
常见失败可以这样读：

- 如果看到 `404 Not Found`，通常表示路由还没有写，例如 `/tasks` 或 `/tasks/{task_id}/toggle` 不存在。
- 如果看到 `500 Internal Server Error`，说明路由可能已经存在，但函数内部出错了，例如 SQL 字段名写错、忘了初始化数据库、对空数据使用了错误的索引。
- 如果看到 `AssertionError`，说明接口能返回结果，但结果和测试期待不一致，例如返回的不是列表、`title` 不相等、`is_done` 没有变成期待值。
- 如果看到 `ImportError` 或 `ModuleNotFoundError`，先检查你是不是在 `task-vibe/` 目录里运行 `pytest`，以及 `main.py`、`db.py`、`test_app.py` 是否在同一层。
- 如果看到 `ModuleNotFoundError: No module named 'httpx2'`，说明测试客户端依赖没有装进当前 `.venv`。先运行 `python -m pip install httpx2`，再用 `python -m pip show httpx2` 确认安装成功。

不要害怕红色失败。TDD 里的第一次失败是有用的失败：它证明测试真的在检查某个行为，而不是永远都会通过的空测试。你现在要做的不是马上修完所有红色，而是从最靠前、最明确的失败开始，问自己：“这个失败对应哪个行为组？我只需要补哪一点代码才能让它变绿？”

5. 从现在开始，不要一次粘贴完整实现。把四个测试当成四轮小练习：每一轮都让 Claude Code 只运行一个映射测试，只补一个行为，再让 Claude Code 运行同一个测试确认它通过。

刚才运行 `pytest -q` 时，可能会看到好几个失败。这是正常的，因为 `test_app.py` 已经提前写出了四个行为，而 `main.py` 还没有实现它们。新手最容易在这里慌掉，然后一次性把所有代码都贴进去。更好的做法是：先让一个测试变绿，再做下一个。

### 第 1 轮：只做 `GET /tasks`

这一轮只关心“读取任务列表时，接口能不能返回 JSON 数组”。先让 Claude Code 只运行映射表里 `list` 对应的那一条测试。

如果当前还没有 `/tasks` 路由，常见失败是 `404 Not Found`。这个失败说明 FastAPI 应用可以被测试找到，但它还不知道 `GET /tasks` 应该交给哪个函数处理。

Claude Code 提示词示例：

```text
当前失败的是映射表里 list 对应的测试。请只做让 GET /tasks 这一类测试通过的最小修改。

要求：
1. 允许修改 main.py；
2. 可以导入 get_connection 和 init_db，并在应用启动时初始化数据库；
3. 只新增 GET /tasks 路由；
4. 不要实现 POST /tasks、toggle、delete 或前端页面；
5. 修改后请你在 Claude Code 里运行映射表里 list 对应的 pytest node id，贴出完整输出；
6. 如果仍然失败，请只分析并修复这个 list 测试，不要顺手实现其他行为。
```


检查 Claude Code 对 `main.py` 的修改，先确认已经导入数据库工具，并在应用启动时初始化表。下面的导入和初始化代码只用来对照结构，不要求完全一致。

参考修改示例：
```python
from fastapi import FastAPI

from db import get_connection, init_db

app = FastAPI()
init_db()

@app.get("/")
def read_root():
    return {"message": "Task Vibe is running"}

@app.get("/health")
def read_health():
    return {"status": "ok"}
```

检查列表接口部分的代码。

参考修改示例：
```python
@app.get("/tasks")
def list_tasks():
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]
```

让 Claude Code 执行检查，并贴出 pytest 输出，判断标准是：这一条测试确实验证 `GET /tasks` 返回 JSON 列表，并且它通过。

这一轮通过时，你要理解的核心点是：`@app.get("/tasks")` 把 HTTP 路径和 Python 函数连起来；`list_tasks()` 从 SQLite 读出多行记录；`[dict(row) for row in rows]` 把数据库行转换成 FastAPI 可以返回的 JSON 列表。即使数据库里没有任务，返回 `[]` 也是正确结果。

如果 Claude 输出和参考修改示例不同，不要让它为了“长得一样”而重写。先让它帮你判断当前这一轮是否满足目标：

```text
请帮我判断当前本地文件是否满足list功能设定的目标：范围有没有变大、关键行为是否完整、下一条应该运行什么验证命令。如果不满足，请只给当前步骤的最小修改建议。
```

### 第 2 轮：只做 `POST /tasks`

这一轮只关心“提交一个标题后，系统能不能创建一条新任务”。

Claude Code 提示词示例：

```text
当前失败的是映射表里 create 对应的测试。请只做让 POST /tasks 这一类测试通过的最小修改。

要求：
1. 允许修改 main.py；
2. 可以新增 TaskCreate 请求体模型；
3. 新增任务时写入 SQLite，并返回刚创建的任务；
4. 不要实现 toggle、delete 或前端页面；
5. 不要重写已经通过的 GET /tasks；
6. 修改后请你在 Claude Code 里运行映射表里 create 对应的 pytest node id，贴出完整输出；
7. 如果仍然失败，请只分析并修复这个 create 测试。
```

Claude code先在 `main.py` 顶部补两个导入。
参考修改示例：

```python
from datetime import datetime

from pydantic import BaseModel
```

再在 `app = FastAPI()` 后面补一个请求体模型。`TaskCreate` 的作用是告诉 FastAPI：“创建任务时，前端或测试会传一个 JSON，其中应该有 `title` 字段。”

参考修改示例：

```python
class TaskCreate(BaseModel):
    title: str
```

然后只补创建接口。参考修改示例：

```python
@app.post("/tasks")
def create_task(payload: TaskCreate):
    conn = get_connection()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor = conn.execute(
        "INSERT INTO tasks (title, is_done, created_at) VALUES (?, ?, ?)",
        (payload.title, 0, created_at),
    )
    conn.commit()
    task_id = cursor.lastrowid
    row = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks WHERE id = ?",
        (task_id,),
    ).fetchone()
    conn.close()
    return dict(row)
```


这一轮通过时，你要理解的核心点是：`POST` 用来提交新数据；`payload.title` 来自请求 JSON；`INSERT` 把任务写进 SQLite；`commit()` 才是真正保存；最后再查一次刚创建的任务，是为了把包含 `id`、`title`、`is_done`、`created_at` 的完整结果返回给调用者。
### 第 3 轮：只做 `POST /tasks/{task_id}/toggle`

这一轮只关心“给定某条任务的 id，能不能把完成状态反过来”。先让 Claude Code 只运行映射表里 `toggle` 对应的那一条测试。

Claude Code 提示词示例：

```text
当前失败的是映射表里 toggle 对应的测试。请只做让 POST /tasks/{task_id}/toggle 这一类测试通过的最小修改。

要求：
1. 允许修改 main.py；
2. 先根据 task_id 查询当前任务；
3. 把 is_done 从 0 切到 1，或从 1 切回 0；
4. 更新后重新查询并返回更新后的任务；
5. 不要实现 delete 或前端页面，不要重写已经通过的接口；
6. 修改后请你在 Claude Code 里运行映射表里 toggle 对应的 pytest node id，贴出完整输出；
7. 如果仍然失败，请只分析并修复这个 toggle 测试。
```

只补切换接口。参考修改示例：

```python
@app.post("/tasks/{task_id}/toggle")
def toggle_task(task_id: int):
    conn = get_connection()
    row = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks WHERE id = ?",
        (task_id,),
    ).fetchone()
    new_value = 0 if row["is_done"] else 1
    conn.execute("UPDATE tasks SET is_done = ? WHERE id = ?", (new_value, task_id))
    conn.commit()
    updated = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks WHERE id = ?",
        (task_id,),
    ).fetchone()
    conn.close()
    return dict(updated)
```

判断标准：这一条测试确实验证完成状态会反向切换，并且它通过。这里需要特别关注，main.py代码内对于toggle的判断逻辑应该与SQLite内的值类型保持一致，用整数进行测试，如果大模型用bool来测试要大模型提示词进行修正。
```bash
toggle状态在数据库内是整数型，请按照整数数值重新编写测试并更新main.py内toggle接口代码
```

这一轮通过时，你要理解的核心点是：路径里的 `{task_id}` 会变成函数参数 `task_id`；切换不是固定写成 `1`，而是先读取当前 `is_done`，再决定新值；`UPDATE` 后也要 `commit()`；最后重新查询，是为了确认返回的是更新后的状态。

### 第 4 轮：只做 `POST /tasks/{task_id}/delete`

这一轮只关心“删除以后，列表里不应该再看到那条任务”。

这个测试也会先创建一条任务，再删除这条任务，最后重新读取列表。常见失败是 `404 Not Found`，说明删除路由还没有写；如果删除后列表里仍然能看到任务，通常说明没有执行 `DELETE`，或者忘了 `commit()`。

Claude Code 提示词示例：

```text
当前失败的是映射表里 delete 对应的测试。请只做让 POST /tasks/{task_id}/delete 这一类测试通过的最小修改。

要求：
1. 允许修改 main.py；
2. 只新增删除接口；
3. 使用 DELETE FROM tasks WHERE id = ?；
4. 记得 commit；
5. 不要改已经通过的 list、create、toggle，也不要新增前端页面；
6. 修改后请你在 Claude Code 里运行映射表里 delete 对应的 pytest node id，贴出完整输出；
7. 如果仍然失败，请只分析并修复这个 delete 测试。
```

只补删除接口。参考修改示例：

```python
@app.post("/tasks/{task_id}/delete")
def delete_task(task_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"deleted": True}
```

这一轮通过时，你要理解的核心点是：删除不是从页面上“隐藏”任务，而是从 SQLite 的 `tasks` 表里删除对应记录；`WHERE id = ?` 用来保证只删除这一条；`commit()` 后，下一次列表查询才看不到它。

6. 四轮都通过后，让 Claude Code 再运行完整测试套件，确认四个行为放在一起也能工作。

```bash
请执行 pytest -q，测试4个功能是否都正常
```

判断完整测试套件是否通过时，不要只盯着是不是刚好 `4 passed`。本节最低要求是四个核心行为测试都通过：列表、创建、切换、删除。如果 Claude Code 额外写了 1-2 个测试，只要它们仍然围绕这四个行为，并且 pytest 显示全部通过，也可以进入下一步。如果出现 `failed`、`error` 或某个核心行为没有对应测试，就先不要继续。把完整输出交给 Claude Code，让它只修当前失败的行为，然后在 Claude Code 里重新运行同一条测试。

测试通过后，再把 `main.py` 和下面的最终对照版本比较，不要求逐字完全一样，但核心结构应该一致：导入依赖、初始化数据库、定义请求体、保留 `/` 和 `/health`、实现列表/创建/切换/删除四个接口。

最终对照版本：

```python
from datetime import datetime

from fastapi import FastAPI
from pydantic import BaseModel

from db import get_connection, init_db

app = FastAPI()
init_db()

class TaskCreate(BaseModel):
    title: str

@app.get("/")
def read_root():
    return {"message": "Task Vibe is running"}

@app.get("/health")
def read_health():
    return {"status": "ok"}

@app.get("/tasks")
def list_tasks():
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/tasks")
def create_task(payload: TaskCreate):
    conn = get_connection()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor = conn.execute(
        "INSERT INTO tasks (title, is_done, created_at) VALUES (?, ?, ?)",
        (payload.title, 0, created_at),
    )
    conn.commit()
    task_id = cursor.lastrowid
    row = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks WHERE id = ?",
        (task_id,),
    ).fetchone()
    conn.close()
    return dict(row)

@app.post("/tasks/{task_id}/toggle")
def toggle_task(task_id: int):
    conn = get_connection()
    row = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks WHERE id = ?",
        (task_id,),
    ).fetchone()
    new_value = 0 if row["is_done"] else 1
    conn.execute("UPDATE tasks SET is_done = ? WHERE id = ?", (new_value, task_id))
    conn.commit()
    updated = conn.execute(
        "SELECT id, title, is_done, created_at FROM tasks WHERE id = ?",
        (task_id,),
    ).fetchone()
    conn.close()
    return dict(updated)

@app.post("/tasks/{task_id}/delete")
def delete_task(task_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"deleted": True}
```

这个最终版本不是让你一开始就整段粘贴，而是用来在四轮练习结束后核对结构。读代码时仍然按四个行为分块看：列表先查数据库，创建先插入再查回，切换先读取当前值再更新，删除执行 `DELETE` 后提交事务。读懂这四段，比“代码能跑”更重要。

7. 全部功能完成后，再用 `curl` 做一轮手动检查，确认真实 HTTP 行为和测试结论一致。

`curl` 不是测试的替代品，也不是第 1 到第 4 轮 TDD 的起点。它是在 `pytest -q` 通过以后，帮助你确认真实 HTTP 请求也符合刚才的测试结论。它们和映射表里的四个行为是一一对应的：

- `curl http://127.0.0.1:8000/tasks` 对应映射表里的 `list` 测试，你要看返回值是不是 JSON 数组。
- `curl -X POST ... /tasks ... '{"title":"写测试"}'` 对应映射表里的 `create` 测试，你要看返回 JSON 里是否有 `id`、原始 `title`、默认 `is_done`。
- `curl -X POST ... /tasks/1/toggle` 对应映射表里的 `toggle` 测试，你要看同一条任务的 `is_done` 是否发生变化。
- `curl -X POST ... /tasks/1/delete` 以及删除后的再次 `GET /tasks` 对应映射表里的 `delete` 测试，你要看列表里是否已经没有那条任务。

注意：手动 `curl` 里的 `/tasks/1/...` 假设数据库里确实存在 `id=1` 的任务。如果你的返回里新任务 `id` 是 `3`，就把后续命令里的 `1` 换成 `3`。测试代码会自动使用刚创建任务的 `id`，所以它比手动命令更不容易写错。

## 输入输出对照

| 输入 | 预期输出 | 学生要比较什么 |
|---|---|---|
| 让 Claude Code 运行 `pytest -q`（还没实现前） | 出现失败，例如 404、500 或断言失败 | 你是否真的先看到了失败，而不是跳过这一步 |
| 让 Claude Code 运行 `pytest -q`（实现后） | 至少四个核心行为测试全部通过；额外测试也必须在范围内并全部通过 | 四个核心行为是否都通过，是否没有被额外测试带偏范围 |
| `curl http://127.0.0.1:8000/tasks` | `[]` 或任务列表 JSON | 列表接口是否返回 JSON 数组 |
| `curl -X POST http://127.0.0.1:8000/tasks -H "Content-Type: application/json" -d '{"title":"写测试"}'` | 返回新任务 JSON，包含 `id`、`title`、`is_done`、`created_at` | 创建后的字段是否完整 |
| `curl -X POST http://127.0.0.1:8000/tasks/1/toggle` | 返回更新后的任务 JSON，`is_done` 发生变化 | 切换状态是否真的生效 |
| `curl -X POST http://127.0.0.1:8000/tasks/1/delete` | 返回删除结果，例如 `{"deleted":true}` | 删除后是否还能在列表里看到该任务 |

## 验收标准

运行或检查：

```bash
python -m pytest -q test_app.py
curl http://127.0.0.1:8000/tasks
```

通过标准：

- `task-vibe/test_app.py` 已存在。
- 你已经保存或记录 Claude Code 给出的测试映射表，知道 `list`、`create`、`toggle`、`delete` 分别对应本地哪个 pytest node id。
- 你已经真的先看到了失败，而不是跳过 Red 阶段。
- 你已经在运行 `pytest` 和启动服务前激活 `task-vibe/.venv`。
- 至少四个核心行为测试全部通过；如果有额外测试，它们也必须在范围内并全部通过。
- `list`、`create`、`toggle`、`delete` 四个行为都有对应验证，不是只做了其中一两个。
- 你能说清楚每个功能各自的成功标准和失败标准。
- 你理解这一节的重点不是“写很多代码”，而是“先定义行为，再用最小实现满足行为”。

需要停下处理：

- 如果你跳过“先让 Claude Code 运行失败测试”这一步，先回到最初的测试执行和映射表整理。
- 如果新开终端后忘记激活 `task-vibe/.venv`，先修环境问题，再判断测试失败是否真的来自业务代码。
- 如果你一次想把四个功能全做完，先收回到单行为循环：一个测试、一个最小实现、同一条测试再验证。

## 常见卡点

- 跳过“让 Claude Code 先运行失败测试”这一步，直接上手改实现，最后很难判断自己到底修好了什么。
- 新开终端后忘记激活 `task-vibe/.venv`，导致 `pytest`、`httpx2` 或 `uvicorn` 报找不到包。先回到第 1 步确认目录和环境，再判断测试失败是否真的来自业务代码。
- 一次想把四个功能全做完，结果出错后不知道是哪一步引入的问题。
- 测试里创建了数据，但没有意识到数据库会保留旧数据，导致你对列表长度的判断混乱。
- `toggle` 时没有先查当前值，直接写死成 `1`，这样第二次切换就不对了。
- 删除接口返回了成功，但实际没有执行 `DELETE` 或没有 `commit()`。
