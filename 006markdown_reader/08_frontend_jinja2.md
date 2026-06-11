# 08. 用 Jinja2 做出最小可用页面

## 预计用时

25-35 分钟。

## 本节位置

约 4 小时核心路线（00-10）的第 7 个学习单元前半段。把浏览器页面、FastAPI 路由和 SQLite 数据连成完整用户链路。

这一节的重点不是把页面做漂亮，也不是引入新的前端框架。你只需要做出一个能用的 HTML 页面，亲手看见“浏览器表单 -> FastAPI 路由 -> SQLite -> 渲染后的 HTML 页面”这条路径跑通。只要这条链路通了，后面再加样式、组件或更复杂交互才有意义。

## 工具使用规则

终端用于确认 `task-vibe/.venv`、启动服务和检查文件；浏览器用于提交表单、点击按钮、观察页面结果。`Claude Code CLI` 用于创建或解释最小 Jinja2 页面和相关路由。

## 学习目标

- 在 `task-vibe/` 目录内为任务管理系统添加一个最小 `Jinja2` 页面。
- 理解页面表单、FastAPI 路由和 SQLite 数据之间是怎样连起来的。
- 学会通过浏览器动作判断页面是否真的可用，而不只是“代码看起来对”。

## 三个身份提醒

- 产品负责人：本节只做最小可用页面，让表单和已有后端连起来，不加入前端框架或样式扩展。
- 测试者：在浏览器里实际执行新增、完成、删除和刷新，确认页面动作能改变 SQLite 中的数据。
- 学习者：能讲清“页面表单 -> FastAPI 路由 -> SQLite -> 重新渲染页面”这条完整路径。

## 本节产出物

- 当前工作目录：`task-vibe/`
- 新增目录：`task-vibe/templates/`
- 新增文件：`task-vibe/templates/index.html`
- 更新文件：`task-vibe/main.py`
- 一个可以在浏览器里执行新增、完成、删除操作的页面

## 操作步骤

1. 进入项目目录并确认当前文件存在。

```bash
cd task-vibe
source .venv/bin/activate
ls
python -m pip show fastapi jinja2 httpx2 python-multipart
```

本节的浏览器操作不需要虚拟环境，但启动 FastAPI 和渲染 Jinja2 模板需要 `task-vibe/.venv` 里的依赖。尤其是新开终端时，不要只 `cd task-vibe` 就直接启动服务；先激活 `.venv`，再运行服务命令。这里要特别记住 `python-multipart`：这一节会出现 `Form(...)` 和浏览器表单提交，FastAPI 解析这类表单数据时要依赖它；如果缺少这个包，常见报错会直接指向 `multipart/form-data` 或表单解析依赖。

2. 创建 `templates/` 目录，并准备一个最小 `index.html`。

Claude Code 提示词示例：

```text
我现在在 task-vibe/ 目录里

请帮我添加一个最小 Jinja2 页面，要求：
1. 新建 templates/index.html。
2. 首页用模板展示任务列表。
3. 页面上必须有新增任务表单、完成按钮、删除按钮。
4. 保持 HTML 简单，重点是让我理解页面如何和 FastAPI 路由连接。
5. 不要顺手加样式框架，不要重构无关文件。
```

阅读 Claude 输出并判断下一步：检查 `templates/index.html` 是否只完成最小页面目标。下面的 HTML 只用来对照结构，不要求完全一致。

参考修改示例：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <title>Task Vibe</title>
  </head>
  <body>
    <h1>任务管理系统</h1>

    <form method="post" action="/tasks">
      <input name="title" placeholder="输入任务标题" required>
      <button type="submit">新增</button>
    </form>

    <ul>
      {% for task in tasks %}
      <li>
        {{ task.title }} - {% if task.is_done %}已完成{% else %}未完成{% endif %}

        <form method="post" action="/tasks/{{ task.id }}/toggle" style="display:inline;">
          <button type="submit">完成切换</button>
        </form>

        <form method="post" action="/tasks/{{ task.id }}/delete" style="display:inline;">
          <button type="submit">删除</button>
        </form>
      </li>
      {% endfor %}
    </ul>
  </body>
</html>
```

完成后检查：

```bash
cat templates/index.html
```

先看懂这个文件里最重要的几个连接点：

- `templates/index.html` 必须放在 `Jinja2Templates(directory="templates")` 指向的目录里。目录名或文件名对不上时，后端会报找不到模板。
- `<form method="post" action="/tasks">` 的意思是：浏览器点击“新增”后，会用 `POST` 方法请求 `/tasks` 这个后端地址。
- `<input name="title">` 的 `name` 会变成后端表单字段名，所以路由里可以用 `title: str = Form(...)` 接住它。
- `action="/tasks/{{ task.id }}/toggle"` 和 `action="/tasks/{{ task.id }}/delete"` 会为每条任务生成不同的提交地址。比如第 3 条任务的完成按钮会提交到 `/tasks/3/toggle`。
- `{% for task in tasks %}` 里的 `tasks` 来自后端模板渲染时传入的数据。如果后端没有传 `tasks`，页面就没有任务列表可渲染。

如果 Claude 的 HTML 和参考修改示例不同，不要要求它逐字改成一样。先判断：是否有新增任务表单，是否有完成和删除按钮，`method` 与 `action` 是否能对应后端路由，是否没有加入样式框架或复杂前端逻辑，是否给出下一条浏览器或终端验证动作。如果不确定，在 Claude Code CLI 中输入：

```text
请帮我判断当前index.html文件是否满足spec和task目标：范围有没有变大、关键行为是否完整、下一条应该运行什么验证命令。如果不满足，请只给当前步骤的最小修改建议。
```

3. 更新 `main.py`，让首页渲染模板而不是返回纯 JSON。

Claude Code 提示词示例：

```text
请修改 main.py，让 GET / 首页渲染 templates/index.html，而不是继续返回纯 JSON。

要求：
1. 使用 Jinja2Templates(directory="templates")；
2. 首页路由接收 Request；
3. 首页渲染时传入 tasks，让模板里的 {% for task in tasks %} 可以工作；
4. 保留已有的数据库和 API 行为；
5. 不要加入样式框架，不要重构无关代码。
```

配套的 `main.py` 首页路由最小改法如下。参考修改示例：

```python
from fastapi import FastAPI, Form, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

@app.get("/")
def home(request: Request):
    tasks = list_tasks()
    return templates.TemplateResponse("index.html", {"request": request, "tasks": tasks})
```

完成后检查：

```bash
cat main.py
```

这里的 `home()` 做了两件事：先从 SQLite 读取当前任务，再把任务列表交给 `index.html`。`TemplateResponse("index.html", {"request": request, "tasks": tasks})` 中的 `"index.html"` 要和模板文件名完全一致；`tasks` 这个键名要和模板里的 `{% for task in tasks %}` 完全一致。

4. 为新增、完成、删除动作准备页面表单对应的后端路由。

如果前几节已经有 `create_task()`、`toggle_task()`、`delete_task()` 之类的 SQLite 函数，就把下面代码里的函数名替换成你项目里的真实函数名。重点是：每一个表单 `action` 都必须有一个匹配的 `@app.post(...)` 路由。

Claude Code 提示词示例：

```text
请检查 templates/index.html 里的三个表单 action，并在 main.py 中补齐对应的表单路由。

要求：
1. POST /tasks 接收 title 表单字段并新增任务；
2. POST /tasks/{task_id}/toggle 切换任务完成状态；
3. POST /tasks/{task_id}/delete 删除任务；
4. 每个表单动作完成后都 RedirectResponse 到 /；
5. 只修改表单路由相关代码，不改数据库表结构，不加入前端框架。
```

参考修改示例：

```python
@app.post("/tasks")
def create_task_route(title: str = Form(...)):
    create_task(title)
    return RedirectResponse(url="/", status_code=303)

@app.post("/tasks/{task_id}/toggle")
def toggle_task_route(task_id: int):
    toggle_task(task_id)
    return RedirectResponse(url="/", status_code=303)

@app.post("/tasks/{task_id}/delete")
def delete_task_route(task_id: int):
    delete_task(task_id)
    return RedirectResponse(url="/", status_code=303)
```

完成后检查：

```bash
cat main.py
```

这三个路由的工作方式一样：浏览器提交表单，FastAPI 找到对应的 `@app.post(...)` 函数，函数调用 SQLite 操作修改数据，然后用 `RedirectResponse(url="/", status_code=303)` 让浏览器回到首页。回到首页时，浏览器会重新请求 `GET /`，`home()` 会再次读取 SQLite，并重新渲染 `templates/index.html`。所以页面变化不是靠前端框架“假装更新”，而是靠数据库中的数据变化后重新渲染出来。

使用 `303` 的好处是：表单提交成功后，浏览器接下来会用 `GET /` 打开首页。这样你刷新页面时通常不会重复提交上一条 `POST` 请求，也更容易理解页面状态来自 SQLite。

5. 启动服务并在浏览器打开首页。

```bash
python -m uvicorn main:app --reload
```

打开 `http://127.0.0.1:8000/` 后，先观察三件事：页面应该是 HTML，不是 JSON；页面上应该有一个输入框和“新增”按钮；如果 SQLite 里已有任务，任务应该已经出现在列表中。此时不要急着加样式，先确认页面能把后端数据展示出来。

6. 在浏览器里新增一条任务，再测试完成和删除动作。

建议按这个顺序观察：

- 打开首页：确认浏览器地址是 `/`，页面能显示任务列表、输入框和按钮。
- 新增任务：输入 `学习 Claude Code` 并点击“新增”，浏览器会提交到 `POST /tasks`，随后跳回 `/`，新任务应该出现在列表里。
- 切换完成：点击某条任务的“完成切换”，浏览器会提交到 `/tasks/{id}/toggle`，随后跳回 `/`，这条任务的文字应该从“未完成”变成“已完成”，或反过来。
- 删除任务：点击“删除”，浏览器会提交到 `/tasks/{id}/delete`，随后跳回 `/`，这条任务应该从列表中消失。
- 刷新页面：按浏览器刷新按钮，列表应该保持刚才的结果。能保持，说明页面最终读到的是 SQLite 中的真实数据。

如果提交后看到 404，通常是 `form action` 写的路径没有对应路由。如果看到 405，通常是路径存在但方法不匹配，例如表单用 `POST`，后端却只写了 `@app.get(...)`。如果终端里出现 `TemplateNotFound` 或类似找不到模板的错误，优先检查 `templates/index.html` 的路径、文件名，以及 `Jinja2Templates(directory="templates")` 的目录设置。

## 输入输出对照

| 输入 | 预期输出 | 学生要比较什么 |
|---|---|---|
| 浏览器打开 `http://127.0.0.1:8000/` | 页面显示任务列表、输入框和按钮 | 页面是否真的是可操作界面，而不是 JSON |
| 在输入框中输入 `学习 Claude Code` 并点击新增 | 页面刷新后出现该任务 | 前端表单是否真的连到了后端 |
| 点击完成按钮 | 任务状态发生变化，例如显示“已完成” | 页面状态是否跟着数据变化 |
| 点击删除按钮 | 任务从列表中消失 | 删除动作是否真的生效 |
| 刷新浏览器页面 | 列表保持最新状态 | 数据是否真的保存进 SQLite，而不是只停留在页面上 |

## 验收标准

运行或检查：

```bash
python -m uvicorn main:app --reload
```

通过标准：

- `templates/index.html` 已存在。
- 浏览器打开 `http://127.0.0.1:8000/` 时，首页已经是 HTML 页面，而不是 JSON。
- 你已经亲手在浏览器完成过新增、完成、删除三种动作。
- 刷新浏览器后，任务列表仍然保持最新状态。
- 你知道这节的目标是打通“页面 -> 路由 -> 数据”的闭环。
- 你能指出每个表单的 `method` 和 `action` 分别对应哪一个 FastAPI 路由。
- 你能解释为什么提交成功后要 redirect 回 `/`，以及为什么刷新后数据仍然存在。

需要停下处理：

- 如果表单 `action` 路径和后端路由不一致，先修 404 问题再继续。
- 如果表单 `method` 和后端路由方法不一致，先修 405 问题再继续。
- 如果出现 `TemplateNotFound: index.html`，先确认模板路径和运行目录，不要误判成数据库问题。

## 常见卡点

- 忘了导入 `Request` 或 `Jinja2Templates`。
- 模板目录名不对，导致找不到 `index.html`。
- 表单 `action` 路径和后端路由不一致，会表现为提交后 404。
- 表单 `method` 和后端路由方法不一致，会表现为提交后 405。例如页面写 `method="post"`，后端却只有 `@app.get("/tasks")`。
- `TemplateNotFound: index.html` 不是数据库问题，而是模板路径问题。先确认项目运行目录是 `task-vibe/`，再确认文件在 `task-vibe/templates/index.html`。
- 页面里用的是 `task.id`，但后端返回的数据键名不一致。
- 忘了 `RedirectResponse(url="/", status_code=303)`，导致提交后停在接口响应上，而不是回到重新渲染后的首页。
- 试图在这一节顺手加 CSS 框架、前端状态管理或复杂组件，反而会模糊重点。本节只练习页面、路由、数据库三者如何接起来。
