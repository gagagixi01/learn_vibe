# 06. 接入 SQLite 并创建 tasks 表

## 预计用时

20-25 分钟。前半段写最小数据库代码，后半段专门核对“文件、表、字段、写入、查询”这条链路是否真的跑通。

## 本节位置

约 4 小时核心路线（00-10）的第 5 个学习单元。前面几节里的任务数据还可以理解成“临时变量里的演示数据”：程序一停，数据就没了。本节开始把任务真正保存到 `SQLite` 文件里，让后续接口不只是内存演示。

请先把边界分清楚：本节只准备数据持久化，不实现 API 行为。你会创建 `tasks.db`、创建 `tasks` 表、插入并查询测试数据；第 07 节才会把这些数据库能力接到 FastAPI 的路由里。

## 工具使用规则

终端用于确认 `task-vibe/.venv`、运行数据库初始化命令、检查 `tasks.db`、执行 SQLite 查询。`Claude Code CLI` 用于生成或解释最小数据库代码，并在失败时分析表结构和报错。

如果你刚接触数据库，可以把终端里的验证命令当成“验收工具”。代码写完并不等于数据已经保存成功；只有你能看到 `tasks.db` 文件、能看到 `tasks` 表结构、能查到插入的测试任务，才算完成这一节。

## 学习目标

- 在 `task-vibe/` 目录内用最小方式接入 SQLite，并知道 `tasks.db` 是一个真实存在的本地数据库文件。
- 学会创建 `tasks` 表，并理解四个核心字段：`id`、`title`、`is_done`、`created_at`。
- 理解 `get_connection()`、`sqlite3.Row`、`commit()`、`close()` 分别解决什么问题。
- 能用 Python 的 `sqlite3` 模块初始化数据库，也能直接用 SQL 核对表结构和查询结果。
- 为下一节实现任务列表、新增、切换完成状态、删除功能打好数据基础，但本节不写 API 路由。

## 本节产出物

- 当前工作目录：`task-vibe/`
- 新增文件：`task-vibe/db.py`
- 运行后会生成数据库文件：`task-vibe/tasks.db`
- 数据库中会出现一张最小表：`tasks`
- 你会得到一段 `sqlite3` Python 示例和一段可直接对照的 SQL 查询示例

这里有两个名字很容易混在一起：

- `tasks.db` 是数据库文件，放在 `task-vibe/` 目录下。
- `tasks` 是数据库文件里面的一张表,专门存任务记录。

后面你运行 `sqlite3 tasks.db ".schema tasks"` 时，意思是：打开 `tasks.db` 这个文件，然后查看里面名为 `tasks` 的表长什么样。

## 操作步骤

1. 进入项目目录，确认你还在 `task-vibe/` 内。

```bash
cd task-vibe
source .venv/bin/activate
pwd
python -m pip show fastapi pytest httpx2 python-multipart
```

这一步看起来普通，但它决定 `tasks.db` 会被创建在哪里。因为本节代码里的 `DB_PATH = "tasks.db"` 使用的是相对路径，所以你在哪个目录运行初始化命令，SQLite 就会倾向于在那个目录创建数据库文件。`pwd` 输出应当以 `task-vibe` 结尾；如果不是，请先切回项目目录。

本节会运行 `python -c ...` 和 `python - <<'PY'` 这类命令，它们必须使用 `task-vibe/.venv` 对应的 Python。`sqlite3 tasks.db ...` 是系统命令，本身不依赖虚拟环境；但为了避免在不同终端之间混乱，建议从本节开始先完成 `cd task-vibe` 和 `source .venv/bin/activate`，再运行后续验证命令。

2. 新建 `db.py`，把“连接数据库”和“初始化表”两件事先做好。

Claude Code 提示词示例：

```text
我现在在 task-vibe/ 目录里

请帮我用最小方式接入 SQLite，要求：
1. 创建 db.py。
2. 使用 Python 内置 sqlite3 模块，不要引入 ORM。
3. 创建 tasks 表，字段必须是 id、title、is_done、created_at。
4. 提供 init_db() 和 get_connection()。
5. 告诉我初始化命令、SQL 查询命令，以及我应该看到的输出。
6. 不要实现 API，不要修改到下一节才需要的功能。
```

这段提示词的重点是把范围锁住：本节只要数据库层。不要让 Claude 提前生成 FastAPI 的 `GET /tasks`、`POST /tasks`、切换完成状态或删除接口，那些属于下一节。

3. 阅读 Claude 输出并判断下一步：检查 `db.py` 是否只完成连接数据库和初始化表。

完成后检查：

```bash
cat db.py
```

下面的代码只用来对照结构，不要求完全一致。

参考修改示例：

```python
import sqlite3

DB_PATH = "tasks.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            is_done INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()
```

先读懂这段代码，再继续运行：

- `DB_PATH = "tasks.db"`：告诉 Python 要连接当前目录下的 `tasks.db`。如果文件不存在，SQLite 会在第一次连接和写入结构时创建它。
- `get_connection()`：负责打开一条到数据库文件的连接。你可以把 `conn` 理解成“Python 和数据库文件之间的一根线”。
- `sqlite3.Row`：让查询结果更像字典。默认情况下，SQLite 查询出来的一行更像 tuple，只能按位置取值；设置 `conn.row_factory = sqlite3.Row` 后，后面就可以用 `row["title"]` 这样的方式读字段，对初学者和 API 返回 JSON 都更直观。
- `init_db()`：负责准备表结构。它不插入业务数据，只保证 `tasks` 表存在。
- `CREATE TABLE IF NOT EXISTS tasks`：如果还没有 `tasks` 表，就创建；如果已经有了，就不重复创建。这样初始化命令可以多运行几次，不会因为表已存在而失败。
- `conn.commit()`：确认本次连接里的改动要写入数据库文件。创建表、插入数据、更新数据、删除数据之后都应该记得提交。初学者最常见的问题之一就是插入时忘了 `commit()`，结果下一次查询发现数据没有留下来。
- `conn.close()`：用完连接后关闭它。关闭不是删除数据库，而是释放文件连接；关闭后如果还要查询，就重新调用 `get_connection()`。

`tasks` 表的四个字段也要先建立清楚：

- `id INTEGER PRIMARY KEY AUTOINCREMENT`：每条任务的唯一编号，由 SQLite 自动递增生成。后面删除或切换某条任务时，会靠它找到具体记录。
- `title TEXT NOT NULL`：任务标题，必须有值，不能是空的 `NULL`。
- `is_done INTEGER NOT NULL DEFAULT 0`：任务是否完成。SQLite 没有强制的布尔类型，本课用 `0` 表示未完成，用 `1` 表示已完成。
- `created_at TEXT NOT NULL`：创建时间。本课先用易读的时间字符串保存，例如 `2026-06-05 10:00:00`，方便你直接在终端看懂结果。

如果 Claude 的写法和参考修改示例不同，不要先追求格式一致。先判断：是否只创建或修改 `db.py`，是否仍然使用 Python 内置 `sqlite3`，是否没有提前写 API，是否保留 `id/title/is_done/created_at` 四个字段，是否告诉你下一条数据库验证命令。如果不确定，在 Claude Code CLI 中输入：

```text
请帮我判断当前db.py文件是否满足spec内的目标：范围有没有变大、关键行为是否完整、下一条应该运行什么验证命令。如果不满足，请只给当前步骤的最小修改建议。
```
![[Pasted image 20260606215519.png]]

4. 手动运行初始化代码，生成数据库文件和数据表。

```bash
python -c "from db import init_db; init_db(); print('db initialized')"
```

看到 `db initialized` 只表示 Python 命令顺利跑完。真正的验证还要看两件事：`tasks.db` 文件是否在 `task-vibe/` 里，以及 `tasks` 表结构是否和本节要求一致。

5. 用 SQLite 查询表结构，确认字段真的创建成功。

```bash
sqlite3 tasks.db ".schema tasks"
```

你应该看到类似下面的输出，排版可能是一行，也可能因为终端宽度显示成多行：

```sql
CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            is_done INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        );
```

逐项核对：

- 表名必须是 `tasks`。如果表名写成 `task`、`todo` 或 `todos`，下一节按 `tasks` 查询时就会失败。
- 字段必须包含 `id`、`title`、`is_done`、`created_at`。字段名要完全一致，少一个字母都算不一致。
- `id` 应该是主键，并且自动递增；你不需要在插入任务时手动填 `id`。
- `title` 和 `created_at` 应该是 `TEXT NOT NULL`；这表示它们存文本，而且不应该为空。
- `is_done` 应该是 `INTEGER NOT NULL DEFAULT 0`；这会让新任务默认处于未完成状态。

如果这条命令没有任何输出，通常说明 `tasks` 表没有创建成功，或者你打开的是另一个目录里的空 `tasks.db`。这时先回到第 1 步确认 `pwd`，再重新运行初始化命令。

6. 再插入一条测试数据，确认 Python 真的能把一行任务写入 `tasks.db`。这段代码可以直接在终端运行：

```bash
python - <<'PY'
from datetime import datetime

from db import get_connection, init_db

init_db()

conn = get_connection()
conn.execute(
    "INSERT INTO tasks (title, is_done, created_at) VALUES (?, ?, ?)",
    ("学习 FastAPI", 0, datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
)
conn.commit()
conn.close()
print("inserted 1 task")
PY
```

这里的 `INSERT INTO tasks (title, is_done, created_at)` 明确写出要插入哪三个字段。没有写 `id` 是因为 `id` 会自动生成。

`VALUES (?, ?, ?)` 里的三个问号是参数占位符，真正的数据在下一行的 tuple 里：`"学习 FastAPI"` 对应 `title`，`0` 对应 `is_done`，格式化后的当前时间对应 `created_at`。字段顺序和数据顺序必须一一对应，不能写了三个字段却只传两个值，也不能把时间传到 `is_done` 的位置。

这段插入代码里的 `conn.commit()` 也很关键。没有它，程序表面上可能不报错，但你随后查询时可能看不到刚才插入的任务。`conn.close()` 放在最后，表示这次写入已经完成，可以释放连接。

7. 直接查询刚才插入的任务，确认 `title`、`is_done`、`created_at` 都能正常工作。

```bash
sqlite3 tasks.db "SELECT id, title, is_done, created_at FROM tasks ORDER BY id DESC;"
```

你应该看到类似这样的结果：

```text
1|学习 FastAPI|0|2026-06-05 10:00:00
```

这一行用 `|` 分隔字段。第一个值是 SQLite 自动生成的 `id`；第二个值是任务标题；第三个值 `0` 表示未完成；第四个值是创建时间。只要这四列都能查出来，就说明“Python 连接数据库、插入数据、提交、关闭连接、再用 SQL 查询验证”这条链路跑通了。

8. 如果你的电脑没有 `sqlite3` 命令行工具，也可以临时用 Python 查询。这个方法还能顺便看到 `sqlite3.Row` 的作用：

```bash
python - <<'PY'
from db import get_connection

conn = get_connection()
rows = conn.execute(
    "SELECT id, title, is_done, created_at FROM tasks ORDER BY id DESC"
).fetchall()

for row in rows:
    print(dict(row))

conn.close()
PY
```

如果 `sqlite3.Row` 已经设置好，`dict(row)` 会输出类似下面的内容：

```text
{'id': 1, 'title': '学习 FastAPI', 'is_done': 0, 'created_at': '2026-06-05 10:00:00'}
```

这说明每一行结果都能按字段名读取。下一节写 API 时，我们会把这种查询结果整理成响应数据；但现在只验证数据库层，不处理 HTTP 请求。

这里先用最容易理解的 `TEXT` 保存 `created_at`，因为本课程目标是帮助初学者先跑通完整链路，而不是一开始就讲复杂的时间类型设计。

9. 验证本节结果。

按 `## 操作步骤` 从第 1 步做到第 8 步，不要只运行初始化命令就跳过查询。验证要分三层看：

- 文件层：`tasks.db` 是否出现在 `task-vibe/` 目录里。
- 结构层：`tasks` 表是否真的包含 `id`、`title`、`is_done`、`created_at` 四个字段。
- 数据层：插入测试任务后，查询是否能看到一行包含标题、完成状态和创建时间的记录。

如果三层都通过，本节目标就完成了。如果只通过第一层，例如只看到了 `tasks.db` 文件，但 `.schema tasks` 没有表结构，仍然不能进入下一节。

10. 判断是否可以进入下一节。

- 成功信号：`tasks.db` 文件已经生成，而且位置在 `task-vibe/tasks.db`，不是上一级目录或其他目录。
- 成功信号：运行 Python 初始化和查询命令前，你已经在 `task-vibe/` 中激活 `task-vibe/.venv`。
- 成功信号：`.schema tasks` 能显示 `CREATE TABLE tasks`，并且四个字段是 `id`、`title`、`is_done`、`created_at`。
- 成功信号：插入一条测试数据后，查询能查到一行结果，且 `id` 自动出现，`title` 是你插入的标题，`is_done` 是 `0`，`created_at` 是可读的时间文本。
- 成功信号：重复运行 `init_db()` 不会报“表已经存在”，因为 SQL 使用了 `CREATE TABLE IF NOT EXISTS`。
- 失败信号：`no such table: tasks`。这通常表示表没有创建，或者你正在查询错误目录里的另一个 `tasks.db`。
- 失败信号：`unable to open database file`。这通常和当前目录、路径权限或父目录不存在有关，先用第 1 步的 `pwd` 排查。
- 失败信号：`ModuleNotFoundError: No module named 'db'`。这通常表示你不在 `task-vibe/` 目录里运行命令，Python 找不到当前目录下的 `db.py`。
- 失败信号：插入时报字段数量不匹配，例如写了 `title, is_done, created_at` 三个字段，却只传了两个值。
- 失败信号：能创建数据库文件，但查不到 `id/title/is_done/created_at` 这四个字段，说明表结构没有按本节要求落地。
- 处理方式：不要进入下一节；把 `db.py` 全文、初始化命令、`.schema tasks` 输出、查询输出一并发给 Claude Code CLI，并要求它只修复本节的数据库初始化问题，不要提前生成 API。

## 输入输出对照

| 操作 | 预期输出 | 学生要比较什么 |
|---|---|---|
| 第 4 步初始化数据库 | 输出 `db initialized`，并在当前目录生成 `tasks.db` | 初始化脚本是否成功执行，数据库文件是否建在 `task-vibe/` |
| 第 5 步查看 schema | 出现 `CREATE TABLE tasks` 以及四个字段定义 | 表名和字段名是否完全一致 |
| 第 6 步插入测试任务 | 输出 `inserted 1 task` | 插入代码是否运行到 `commit()` 和 `close()` |
| 第 7 步查询任务 | 插入数据后能看到类似 `1|学习 FastAPI|0|2026-06-05 10:00:00` | `id` 是否自动生成，`is_done` 是否是 `0`，`created_at` 是否不是空值 |
| 第 8 步 Python 查询 | 能看到包含 `id`、`title`、`is_done`、`created_at` 的字典 | `sqlite3.Row` 是否让查询结果可以按字段名读取 |

## 验收标准

运行或检查：

```bash
sqlite3 tasks.db ".schema tasks"
sqlite3 tasks.db "SELECT id, title, is_done, created_at FROM tasks ORDER BY id DESC;"
```

通过标准：

- `tasks.db` 文件已经生成，而且位置在 `task-vibe/tasks.db`。
- 运行 Python 初始化和查询命令前，你已经在 `task-vibe/` 中激活 `task-vibe/.venv`。
- `.schema tasks` 能显示 `CREATE TABLE tasks`，并且四个字段是 `id`、`title`、`is_done`、`created_at`。
- 插入一条测试数据后，查询能查到一行结果，且 `id` 自动出现，`title` 是你插入的标题，`is_done` 是 `0`，`created_at` 是可读的时间文本。
- 重复运行 `init_db()` 不会报“表已经存在”，因为 SQL 使用了 `CREATE TABLE IF NOT EXISTS`。

需要停下处理：

- 如果出现 `no such table: tasks`、`unable to open database file`、`ModuleNotFoundError: No module named 'db'` 或字段数量不匹配，先不要进入下一节。
- 如果能创建数据库文件，但查不到 `id/title/is_done/created_at` 这四个字段，说明表结构没有按本节要求落地。
- 把 `db.py` 全文、初始化命令、`.schema tasks` 输出、查询输出一并发给 Claude Code CLI，并要求它只修复本节的数据库初始化问题，不要提前生成 API。

## 卡点与过关

常见卡点：

- 目录不对：你以为自己在 `task-vibe/`，实际在上一级目录，于是 `tasks.db` 被创建到错误位置。排查顺序是先看 `pwd`，再看当前目录是否有 `db.py`，最后再重新运行初始化。
- 虚拟环境不对：你直接运行 `python -c ...`，但没有先 `source .venv/bin/activate`，导致使用了全局 Python。虽然本节主要用 Python 内置 `sqlite3`，但后续导入项目文件和保持环境一致都依赖正确的 `.venv`。
- 只看到了数据库文件，却没有表：SQLite 可以创建一个空的 `tasks.db` 文件，但空文件不等于表已经存在。一定要用 schema 验证看到 `CREATE TABLE tasks`。
- 忘记调用 `conn.commit()`：`execute()` 只是执行 SQL，`commit()` 才是确认保存。插入、更新、删除之后少了 `commit()`，最容易出现“运行时好像没错，但查询不到数据”的困惑。
- 太早 `close()`：`close()` 应该放在本次操作全部结束之后。如果在 `execute()` 前就关闭连接，后面再用这个 `conn` 会报错。关闭后需要重新 `get_connection()`。
- 字段名不一致：`is_done` 写成 `done`，`created_at` 写成 `created`，或者表名写成 `todos`，短期看只是名字不同，下一节接 API 时就会因为 SQL 找不到字段而失败。
- 字段和值数量不一致：SQL 里写了三个字段，就要提供三个值。顺序也要一致，否则可能把 `0` 写进标题，把时间写进完成状态。
- 把 `is_done` 写成 `TEXT`：后面做切换完成状态时需要稳定地在 `0` 和 `1` 之间切换，用 `INTEGER` 更直接。
- 把 `created_at` 写成 Python 表达式但没有先格式化：本节使用 `datetime.now().strftime(...)` 生成可读字符串，先降低理解成本。
- `sqlite3` 命令行工具在本机不可用：可以先用第 8 步的 Python 查询替代，但仍然要确认表结构和字段，不要只凭“没有报错”判断成功。
- 让 Claude 提前写 API：如果本节混入路由、请求体、响应模型，学习重点会变乱。现在只要数据库能建表、连接、写入、查询；HTTP 行为留到第 07 节。

过关前确认：

- `task-vibe/db.py` 已存在。
- `task-vibe/tasks.db` 已生成。
- 我已经在运行 Python 数据库命令前激活 `task-vibe/.venv`。
- `tasks` 表字段完整包含 `id`、`title`、`is_done`、`created_at`。
- 你已经至少成功插入并查询过一条测试任务。
- 你能解释 `tasks.db` 是数据库文件，`tasks` 是表，四个字段分别负责编号、标题、完成状态和创建时间。
- 你能解释 `sqlite3.Row` 让查询结果更容易按字段名读取。
- 你能解释为什么写入后要 `commit()`，为什么用完连接要 `close()`。
- 你能解释：下一节写 API 时，数据库层至少已经能“建表、连接、写入、查询”，但本节本身还没有实现 API 行为。
