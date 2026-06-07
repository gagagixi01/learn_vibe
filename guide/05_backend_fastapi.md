# 05. 创建最小 FastAPI 后端

## 预计用时

20-25 分钟。

## 本节位置

约 4 小时核心路线（00-10）的第 4 个学习单元后半段。先跑通最小后端入口，再接数据库和页面。

## 工具使用规则

终端用于确认 `task-vibe/.venv`、启动 `uvicorn`、执行 `curl`、停止和重启服务。`Claude Code CLI` 用于创建或检查最小 FastAPI 后端骨架，并解释 `main.py`。

## 学习目标

- 在 `task-vibe/` 目录内创建一个最小可运行的 FastAPI 应用。
- 理解 `main.py`、`FastAPI()`、路由函数之间的最小关系。
- 学会用 `uvicorn` 启动服务，并用 `curl` 检查接口是否真的可用。
- 看懂一次最基础的 HTTP 请求和响应：浏览器或 `curl` 发出请求，FastAPI 执行对应路由函数，然后把 Python 字典变成 JSON 响应。
- 为下一节接入 SQLite 数据库准备稳定的后端入口。

## 本节产出物

- 当前工作目录：`task-vibe/`
- 新增文件：`task-vibe/main.py`
- 你会得到一个只有两个路由的最小后端：
  - `GET /`
  - `GET /health`
- 你可以在终端看到 `curl` 返回的 JSON，并能区分服务成功启动和启动失败。

## 操作步骤

1. 确认你已经进入项目目录。

```bash
cd task-vibe
source .venv/bin/activate
pwd
python -m pip show fastapi uvicorn httpx2 python-multipart
```

从第 02 节开始，正式项目依赖都安装在 `task-vibe/.venv` 里。启动 FastAPI 服务前要先激活这个环境，否则你可能调用到全局 Python 里的 `uvicorn`，或者根本找不到 `fastapi`。`curl` 本身不需要虚拟环境，但服务启动命令需要。这里把 `python-multipart` 也一起检查，是为了和正式项目的标准依赖集合保持一致，后面做到表单页面时就不会突然缺包。

2. 用 Claude Code CLI 聚焦当前一步，只让它创建最小后端骨架。

Claude Code 提示词示例：

```text
我现在在 task-vibe/ 目录里

请帮我创建最小可运行的 FastAPI 后端，要求：
1. 只修改或创建当前步骤必需的文件。
2. 创建 main.py。
3. 使用最小代码提供 GET / 和 GET /health 两个路由。
4. 不要加入数据库、模板、登录、Docker、React。
5. 回答时请直接给出完整 main.py，并告诉我启动命令和我应该看到的 curl 输出。
```

3. 阅读 Claude 输出并判断下一步：检查 `task-vibe/main.py` 是否只实现本节需要的最小后端。

完成后检查：

```bash
cat main.py
```


下面的代码只用来对照结构，不要求完全一致。
![[Pasted image 20260606212658.png]]

参考修改示例：

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Task Vibe is running"}

@app.get("/health")
def read_health():
    return {"status": "ok"}
```

先把这段代码拆开看：

- `main.py` 是这节的后端入口文件。你启动服务时会告诉 `uvicorn`：“请去 `main.py` 里找 FastAPI 应用对象。”
- `from fastapi import FastAPI` 是导入 FastAPI 提供的应用类。现在不需要理解类的全部细节，只要知道它是创建后端应用的工具。
- `app = FastAPI()` 创建了一个名叫 `app` 的应用对象。后面的路由都会挂在这个对象上；启动命令里的 `main:app` 也正是在找这个变量。
- `@app.get("/")` 表示：当有人用 HTTP `GET` 方法访问网站根路径 `/` 时，执行它下面紧跟着的 `read_root()` 函数。
- `@app.get("/health")` 表示：当有人访问 `/health` 时，执行 `read_health()`。`health` 路由常用来判断服务是否还活着。
- `return {"message": "Task Vibe is running"}` 和 `return {"status": "ok"}` 返回的是 Python 字典。FastAPI 会自动把它们转换成 JSON，所以终端里会看到 `{"message":"Task Vibe is running"}` 这样的 HTTP 响应正文。

这个版本故意保持最小，只做两件事：创建 `app = FastAPI()`，定义两个最基础的 `GET` 路由。你现在先不要加数据库、模板、复杂目录结构。原因是初学者最容易把“服务没有启动”“路由写错”“数据库连接失败”“页面模板找不到”混在一起；这一节只验证后端入口、应用对象、路由和 JSON 响应这条最短链路。等这条链路稳定后，下一节再接 SQLite，后面再考虑页面或模板，排错会清楚很多。

如果 Claude 给出的 `main.py` 和参考修改示例不同，不要要求它改到逐字一样。先判断五件事：是否只改 `main.py`，是否没有加入数据库或页面，是否保留 `/` 和 `/health`，是否能解释关键代码，是否给出下一条终端验证命令。如果不确定，在 Claude Code CLI 中输入：

```text
请不要追求和指南参考代码逐字一致。请帮我判断当前本地文件是否满足本节目标：范围有没有变大、关键行为是否完整、下一条应该运行什么验证命令。如果不满足，请只给当前步骤的最小修改建议。
```

4. 在终端内启动服务。

```bash
python -m uvicorn main:app --reload
```
![[Pasted image 20260606212810.png]]
这条命令也可以拆开读：

- `python -m uvicorn` 表示用当前已激活虚拟环境里的 Python 去启动 `uvicorn`。这样比直接输入裸 `uvicorn` 更稳，因为它能避免误用全局环境。
- `uvicorn` 是运行 FastAPI 应用的本地开发服务器。你的 Python 代码本身只是定义了应用，还需要服务器把它挂到 `http://127.0.0.1:8000` 上，外部请求才能进来。
- `main:app` 的意思是“从 `main.py` 这个模块里，找到名为 `app` 的变量”。所以文件名必须是 `main.py`，变量名必须是 `app`。如果你把文件名或变量名改了，启动命令也要一起改。
- `--reload` 表示开发模式自动重载。你修改 `main.py` 并保存后，`uvicorn` 会尝试自动重启服务，适合学习阶段使用。

启动后不要急着输入下一条命令，先读服务终端的日志。不同版本的日志顺序可能略有差异，但成功启动通常会看到这些关键信号：

```text
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

如果你看到 `Uvicorn running on http://127.0.0.1:8000`，并且最后没有红色报错、没有 `Traceback`、没有 `Error loading ASGI app`，就可以认为服务已经在本机 8000 端口等待请求。这个终端此时会停在那里，不会回到普通命令提示符，这是正常的：它正在持续运行服务器。需要停止时按 `Ctrl+C`。

5. 保持服务运行，打开第二个终端窗口，再进入同一个目录执行检查命令。

```bash
cd task-vibe
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8000/health
```
![[Pasted image 20260606212919.png]]

`curl` 是终端里的 HTTP 客户端。你可以把它理解成“用命令行访问一个网址”，它会把服务器返回的响应正文直接打印出来。这里两条 `curl` 命令默认发送的都是 `GET` 请求，正好对应 `@app.get("/")` 和 `@app.get("/health")`。

比较输出时，先看路径是否对应，再看 JSON 里的键和值是否一致：

- 访问 `/` 应该得到 `{"message":"Task Vibe is running"}`。重点是键名 `message` 和字符串 `Task Vibe is running`。
- 访问 `/health` 应该得到 `{"status":"ok"}`。重点是键名 `status` 和字符串 `ok`。

JSON 里的空格通常不重要，比如 `{"status":"ok"}` 和 `{ "status": "ok" }` 表达的是同一份数据；但是键名、大小写、字符串内容、访问路径都重要。`status` 写成 `Status`，`ok` 写成 `OK`，或者把 `/health` 写成 `/heath`，都应该当作不一致来处理。

6. 如果两个接口都返回预期 JSON，再回到服务终端按 `Ctrl+C` 停止服务，确认你能重新启动一次。能够启动、访问、停止、再启动，说明这个最小后端入口已经稳定。

7. 如果你想做额外确认，也可以在浏览器访问：

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/health`

页面应直接显示 JSON 文本，而不是 404 页面。

8. 判断是否可以进入下一节。

- 成功信号：`uvicorn` 能启动，`GET /` 返回 `{"message":"Task Vibe is running"}`，`GET /health` 返回 `{"status":"ok"}`。
- 成功信号：服务终端出现 `Application startup complete`，并且每次 `curl` 后都能看到对应的 `200 OK` 访问日志。
- 成功信号：你停止服务后再次运行 `python -m uvicorn main:app --reload`，它仍然能正常启动。
- 失败信号：终端出现 `Error loading ASGI app`、`ModuleNotFoundError`、`Address already in use`、`404 Not Found` 或返回的 JSON 内容不一致。
- 失败信号：你以为服务启动了，但 `curl` 一直连不上 `127.0.0.1:8000`。
- 处理方式：先判断错误发生在哪一层。启动命令报错，优先检查目录、文件名、变量名和 Python 语法；`curl` 连不上，优先确认 `uvicorn` 是否还在运行、端口是否是 8000；返回 404，优先检查 `@app.get(...)` 里的路径；返回 JSON 不一致，优先检查 `return` 的字典内容。
- 处理方式：不要进入下一节；把 `main.py` 全文、启动命令、完整报错、`curl` 输出一起发给 Claude Code CLI，并要求它只分析这一节的后端启动问题。

## 输入输出对照

| 输入 | 预期输出 | 学生要比较什么 |
|---|---|---|
| `pwd` | 路径以 `/task-vibe` 结尾 | 你是否真的在项目目录内操作 |
| `python -m uvicorn main:app --reload` | 日志里出现 `Uvicorn running on http://127.0.0.1:8000` 和 `Application startup complete` | 服务是否使用当前 `.venv` 成功启动，而不是导入报错 |
| `curl http://127.0.0.1:8000/` | `{"message":"Task Vibe is running"}` | 是否命中了 `/` 路由，JSON 的键名、值、大小写是否一致 |
| `curl http://127.0.0.1:8000/health` | `{"status":"ok"}` | 是否命中了 `/health` 路由，健康检查返回是否正确 |

## 验收标准

运行或检查：

```bash
python -m uvicorn main:app --reload
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8000/health
```

通过标准：

- `uvicorn` 能启动，`GET /` 返回 `{"message":"Task Vibe is running"}`，`GET /health` 返回 `{"status":"ok"}`。
- 服务终端出现 `Application startup complete`，并且每次 `curl` 后都能看到对应的 `200 OK` 访问日志。
- 你停止服务后再次运行 `python -m uvicorn main:app --reload`，它仍然能正常启动。

需要停下处理：

- 如果终端出现 `Error loading ASGI app`、`ModuleNotFoundError`、`Address already in use`、`404 Not Found` 或返回的 JSON 内容不一致，先停下排查启动和路由问题。
- 如果你以为服务启动了，但 `curl` 一直连不上 `127.0.0.1:8000`，先确认 `uvicorn` 是否仍在运行、端口是否是 8000。
- 如果还没定位清楚问题，不要进入下一节；把 `main.py` 全文、启动命令、完整报错、`curl` 输出一起发给 Claude Code CLI，并要求它只分析这一节的后端启动问题。

## 卡点与过关

常见卡点：

- 还没进入 `task-vibe/` 就执行 `uvicorn`，导致 Python 找不到 `main.py`。
- `uvicorn` 日志里出现 `Error loading ASGI app. Could not import module "main"`，通常说明你不在 `task-vibe/` 目录，或者文件没有保存为 `main.py`。
- 文件名写成 `app.py`，但启动命令仍然写 `python -m uvicorn main:app --reload`，于是模块名对不上。
- 把 `app = FastAPI()` 写成别的变量名，却没有同步修改启动目标。
- 复制代码时多了缩进或少了冒号，导致 Python 语法错误。
- 本机 8000 端口已经被别的服务占用，这时可以先停止旧进程，或者临时改用 `python -m uvicorn main:app --reload --port 8001`，但 `curl` 也要一起改端口。
- `curl` 显示 `Failed to connect`，通常说明服务没启动、服务已经被你按 `Ctrl+C` 停掉，或者端口写错。
- `curl` 返回 `{"detail":"Not Found"}`，通常说明 FastAPI 正在运行，但你访问的路径没有匹配到 `@app.get(...)`。先检查斜杠和拼写。
- `curl` 输出和预期 JSON 不同，先不要改复杂结构，只检查 `return` 后面的字典。键名和字符串内容要和本节要求一致。

过关前确认：

- `task-vibe/main.py` 已存在。
- 你知道 `FastAPI()` 在这节里扮演的是“应用入口”角色。
- 你已经亲手执行过 `source .venv/bin/activate` 和 `python -m uvicorn main:app --reload`，不是只看代码。
- 你已经亲手执行过两个 `curl` 命令，并核对过 JSON 输出。
- 你能看懂 `uvicorn` 日志里的成功启动信号和常见失败信号。
- 你能用一句话说清楚：这一节的目标不是做功能，而是先把最小后端和路由结构跑起来。
