---
title: OpenClaw 搭建与使用
tags:
  - AI
  - OpenClaw
  - Codex
categories: AI
date: 2026-03-09
updated: 2026-03-09
---

# OpenClaw 搭建与使用

[[toc]]

::: info
本文默认搭建环境为 `Ubuntu`。
:::

- 先按官方文档把 `OpenClaw` 装起来
- 一旦安装、启动、Dashboard 或 Gateway 报错
- 不要自己盲猜，直接把错误、日志、配置和命令输出交给 `Codex`
- 让 `Codex` 帮你定位原因、给修复步骤，必要时直接改配置

一句话概括就是：

`OpenClaw` 负责跑，`Codex` 负责排障。

<!-- more -->

## 安装路径

### 1. 安装 OpenClaw

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 2. 跑 onboarding 向导

```bash
openclaw onboard --install-daemon
```

### 3. 检查 Gateway

```bash
openclaw gateway status
```

### 4. 打开控制面板

```bash
openclaw dashboard
```

本地默认地址通常是：

```txt
http://127.0.0.1:18789/
```

配置文件默认在：

```txt
~/.openclaw/openclaw.json
```

## `.openclaw/` 目录结构怎么看

如果你后面准备让 `Codex` 帮你修 `OpenClaw`，那它最常看的其实就是 `~/.openclaw/`。

前面那种“只有主配置、技能、扩展”的理解太粗了。实际跑起来之后，这个目录通常会比想象中复杂得多。按你本机现状，更接近下面这样：

```txt
~/.openclaw/
├── agents/         # 主 agent 相关状态或定义
├── alerts.json     # 告警相关状态
├── browser/        # 浏览器自动化或浏览器上下文相关数据
├── canvas/         # 画布或可视化工作区相关状态
├── completions/    # 补全或生成相关缓存/状态
├── credentials/    # 凭据与认证相关内容
├── cron/           # 定时任务相关内容，例如每日新闻、GitHub Trending、模型巡检
├── delivery-queue/ # 消息投递队列，渠道消息卡住时值得检查
├── devices/        # 设备接入或终端设备相关信息
├── exec-approvals.json
├── extensions/     # 扩展目录，像 memory-openviking 这类插件通常部署在这里
├── identity/       # 本机实例身份相关数据
├── logs/           # 日志目录，启动失败、鉴权失败、插件报错时优先看这里
├── media/          # 附件、图片、文件等媒体内容
├── memory/         # 记忆系统相关数据
├── openclaw.json
├── scripts/        # 自定义脚本目录
├── skills/         # 本地技能目录
├── subagents/      # 子 agent 相关状态
├── telegram/       # Telegram 渠道相关配置或状态
├── update-check.json
├── workspace/      # 工作区数据目录
├── workspace-default/
├── workspace-state.json
└── workspace-undefined/
```

可以按职责把它拆成几组来看。

### 1. 核心配置与身份

这组文件通常最值得优先给 `Codex` 看：

- `~/.openclaw/openclaw.json`：主配置文件，`gateway`、`channel`、`plugins`、`memory`、`fallback` 之类的问题优先看这里
- `~/.openclaw/identity`：本机实例身份相关数据
- `~/.openclaw/credentials`：凭据与认证相关内容
- `~/.openclaw/exec-approvals.json`：执行授权记录，和命令放行、工具调用权限有关
- `~/.openclaw/update-check.json`：更新检查状态，一般不是主故障点，但可以帮助判断版本探测行为

### 2. Agent 与运行时状态

这组目录通常和“它为什么没按预期工作”直接相关：

- `~/.openclaw/agents`：主 agent 相关状态或定义
- `~/.openclaw/subagents`：子 agent 相关状态
- `~/.openclaw/delivery-queue`：消息投递队列，渠道消息卡住时值得检查
- `~/.openclaw/alerts.json`：告警相关状态
- `~/.openclaw/completions`：补全或生成相关缓存/状态
- `~/.openclaw/canvas`：画布或可视化工作区相关状态
- `~/.openclaw/browser`：浏览器自动化或浏览器上下文相关数据
- `~/.openclaw/media`：附件、图片、文件等媒体内容
- `~/.openclaw/logs`：日志目录，启动失败、鉴权失败、插件报错时优先看这里

### 3. 自动化与渠道

如果你后面要加任务编排，这组会越来越重要：

- `~/.openclaw/cron`：定时任务相关内容，例如每日新闻、`GitHub Trending`、模型巡检
- `~/.openclaw/scripts`：自定义脚本目录
- `~/.openclaw/telegram`：Telegram 渠道相关配置或状态
- `~/.openclaw/devices`：设备接入或终端设备相关信息

### 4. 记忆、扩展与技能

这组就是你后面接插件、接记忆系统时最常动到的地方：

- `~/.openclaw/memory`：记忆系统相关数据
- `~/.openclaw/extensions`：扩展目录，像 `memory-openviking` 这类插件通常部署在这里
- `~/.openclaw/skills`：本地技能目录，安装说明和技能脚本一般都在这里

### 5. 工作区状态

如果你发现“同一个 OpenClaw 在不同项目里行为不一致”，优先看这组：

- `~/.openclaw/workspace`：工作区数据目录
- `~/.openclaw/workspace-default`：默认工作区
- `~/.openclaw/workspace-undefined`：未正确识别工作区时的兜底目录
- `~/.openclaw/workspace-state.json`：工作区状态索引

### 哪些最值得交给 Codex

如果你的目标是排障，不必一上来把整个 `~/.openclaw/` 打包给 `Codex`。优先级建议是：

1. `~/.openclaw/openclaw.json`
2. `~/.openclaw/logs`
3. 和当前故障直接相关的子目录，例如 `cron`、`memory`、`telegram`、`workspace-state.json`
4. 如果是插件问题，再补 `~/.openclaw/extensions/` 下对应插件目录

还有一个经验判断：

- 配置类问题，多半先看 `openclaw.json`
- 启动类问题，多半先看 `logs`
- 定时任务问题，多半先看 `cron`
- 记忆问题，多半先看 `memory`、`extensions`、`~/.openviking/ov.conf`
- 渠道问题，多半先看 `telegram`、`delivery-queue`
- 某个项目里行为异常，多半先看 `workspace*`

如果上面四步一路顺利，那你已经装好了。真正需要 `Codex` 出场的，是中间任何一步出错的时候。

## 先把 Codex 准备好

如果你打算用 `Codex` 帮你排障，建议先把它也装好。

### 安装 Codex CLI

```bash
npm install -g @openai/codex
```

## 正确的排障流程

这里是整篇文章最重要的部分。

遇到 `OpenClaw` 报错后，不要只把一句“它启动失败了”发给 `Codex`。那样信息严重不够。

你应该按下面顺序收集信息。

### 第一步：把原始错误保留下来

先把你刚才执行的命令和完整报错复制出来，例如：

```bash
openclaw onboard --install-daemon
```

然后把终端里原样输出的 `stderr/stdout` 全部保留，不要只摘一句你觉得重要的话，其实 `Codex` 能自己查看日志找出错误并修复。

### 第二步：跑官方排障梯子

官方 Troubleshooting 页面给了一个很实用的“前 60 秒排障梯子”。建议按顺序执行：

```bash
# 查看网关与会话状态
openclaw status
openclaw status --usage
openclaw status --all

# 健康检查与快速修复
openclaw doctor
openclaw doctor --deep

# 网关状态与探测
openclaw gateway probe
openclaw gateway status
openclaw gateway restart    # 重启

# 初始化配置与工作区
openclaw onboard --install-daemon

# 模型管理
openclaw models list
openclaw models set claude-haiku-4-5

# 通道管理
openclaw channels list
openclaw channels status --probe
openclaw channels add --channel telegram --token $BOT_TOKEN

# 插件管理
openclaw plugins list
openclaw plugins install ./myplugin.tgz

# 记忆搜索与索引
openclaw memory search "project plan"
openclaw memory index
```

如果你怕日志太长，可以先截取最近一段：

```bash
openclaw logs --follow
```

观察到报错后再 `Ctrl + C` 停掉，把那一段复制给 `Codex`。

### 第三步：附上配置片段

`OpenClaw` 的默认配置文件是：

```txt
~/.openclaw/openclaw.json
```

把和错误相关的配置段一起给 `Codex`。但要注意：

- `token`
- `password`
- 远程 URL 中的敏感字段
- 任何第三方 provider 的密钥

这些要先脱敏再贴。

## 最好用的 Codex 提问模板

下面这个模板，基本可以直接复用。

```txt
我在安装/启动 OpenClaw 时遇到错误。请你不要先猜结论，而是先根据我给你的命令输出判断最可能的根因，然后给我最小修复步骤。如果需要改配置，请指出具体文件和字段。

我执行的命令：
<这里粘贴命令>

原始报错：
<这里粘贴完整报错>

openclaw status --all：
<这里粘贴输出>

openclaw gateway status：
<这里粘贴输出>

openclaw doctor：
<这里粘贴输出>

日志片段：
<这里粘贴日志>

当前配置片段（已脱敏）：
<这里粘贴配置>
```

这个模板的重点在于两件事：

- 明确要求 `Codex` 先判断根因，不要直接乱给命令
- 把排障上下文一次性给全，减少来回追问

## 一个完整示例

假设你执行：

```bash
openclaw onboard --install-daemon
```

之后服务没有正常起来。你继续执行：

```bash
openclaw gateway status
openclaw doctor
openclaw logs --follow
```

日志里出现：

```txt
Gateway start blocked: set gateway.mode=local
```

这时你不要自己先改配置，而是把这些内容交给 `Codex`，例如：

```txt
我在本机安装 OpenClaw，运行 onboard 后 gateway 没起来。

报错关键字：
Gateway start blocked: set gateway.mode=local

请你结合 OpenClaw 的常见配置问题，告诉我应该检查哪些字段，并给我最小修改方案。

补充信息：
- openclaw gateway status: <粘贴输出>
- openclaw doctor: <粘贴输出>
- openclaw.json 相关片段: <粘贴配置>
```

在这种场景下，`Codex` 通常会帮你做三件事：

- 识别这是 `gateway.mode` 配置不对
- 指出应该检查 `~/.openclaw/openclaw.json`
- 给出修改后再执行 `openclaw gateway restart` 或重新启动的步骤

这比你自己在文档里盲翻快很多。

## 最常见的几类错误，怎么交给 Codex

### 1. `openclaw: command not found`

这类问题通常是安装路径或 `PATH` 问题。

你应该把下面这些输出一起交给 `Codex`：

```bash
node -v
npm -v
npm prefix -g
echo "$PATH"
which openclaw
```

可直接这样问：

```txt
OpenClaw 已安装，但命令找不到。请根据 node/npm 全局安装路径和 PATH 输出，判断是安装失败还是 shell PATH 没配对，并给我最小修复步骤。
```

### 2. Node 版本过低

官方前提是 `Node.js 22+`。

先执行：

```bash
node --version
```

如果版本不够，直接把版本号发给 `Codex`，让它按你的系统给升级方案。

例如：

```txt
我的系统是 Ubuntu 24.04，当前 node 版本是 v20.x。OpenClaw 要求 Node 22+。请给我一个不会污染现有环境的升级方案，并说明升级后如何验证 openclaw 还能正常运行。
```

### 3. Gateway 起不来

这是最值得交给 `Codex` 的问题之一。

官方文档里明确建议看：

```bash
openclaw gateway status
openclaw status
openclaw logs --follow
openclaw doctor
openclaw gateway status --deep
```

把这些输出交给 `Codex`，它通常能很快区分以下几类根因：

- `gateway.mode` 配置不对
- 配置文件和 service 使用的配置不一致
- 端口冲突
- bind/auth 组合不合法

### 4. `refusing to bind gateway ... without auth`

这个错误的意思一般不是程序坏了，而是“你想绑到非 loopback 地址，但又没配置认证”。

这时可以直接把下面这些信息给 `Codex`：

```bash
openclaw config get gateway.bind
openclaw config get gateway.auth.mode
openclaw config get gateway.auth.token
openclaw gateway status
openclaw logs --follow
```

推荐提问：

```txt
OpenClaw 提示 refusing to bind gateway without auth。请你根据 bind 和 auth 配置，告诉我应该改成仅本地监听，还是应该补 token/password，并解释原因。
```

### 5. `EADDRINUSE` 或端口占用

这说明端口已经被别的进程占用了。

这时不要只发一句“端口冲突”，而是把占用情况也给 `Codex`。

Linux/macOS：

```bash
lsof -i :18789
ss -ltnp | grep 18789
```

Windows PowerShell：

```powershell
Get-NetTCPConnection -LocalPort 18789
```

然后让 `Codex` 帮你判断：

- 是不是另一个 `OpenClaw` 实例
- 是不是别的服务占用了默认端口
- 更适合停掉旧进程，还是改 `gateway.port`

### 6. Dashboard 打不开或 `unauthorized`

官方排障页里提到，这类问题常见于：

- URL 打错
- token 不匹配
- gateway 实际运行着，但你当前 CLI 指向了错误目标

建议先执行：

```bash
openclaw gateway probe
openclaw gateway status
openclaw config get gateway.auth.mode
openclaw config get gateway.auth.token
```

如果你只是本机使用，先确认你访问的是：

```txt
http://127.0.0.1:18789/
```

再把输出交给 `Codex`，让它判断到底是鉴权问题还是 URL/端口问题。

## 让 Codex 直接修配置时的建议

如果 `Codex` 已经定位到问题，下一步往往就是改 `~/.openclaw/openclaw.json`。

这里我的建议是：

1. 先备份原配置
2. 再让 `Codex` 修改
3. 改完马上重跑验证命令

例如：

```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak
```

然后再让 `Codex` 处理。

改完后至少验证这几项：

```bash
openclaw gateway status
openclaw doctor
openclaw dashboard
```

如果之前问题跟 channel 相关，再补：

```bash
openclaw channels status --probe
```

## 一个我更推荐的实际工作流

如果你要长期折腾 `OpenClaw`，我建议固定用下面这套节奏：

1. 先按官方 Quick Start 安装 `OpenClaw`
2. 一旦报错，立刻保存原始输出
3. 跑一遍官方 Troubleshooting 的诊断命令
4. 脱敏后把日志和配置交给 `Codex`
5. 让 `Codex` 先判断根因，再决定是否改配置
6. 改完后重新跑 `gateway status`、`doctor`、`dashboard`

这套流程的好处是：

- 不会把问题越修越乱
- `Codex` 有足够信息，判断会更准
- 你自己也能顺手积累一套排障模板

## OpenClaw Dashboard

如果你除了想把 `OpenClaw` 跑起来，还想要一个更直观的状态面板，可以装这个项目：

```txt
https://github.com/xmanrui/OpenClaw-bot-review
```

它本质上是一个轻量级 Web Dashboard，直接读取本地 `OpenClaw` 配置和会话数据，不需要额外数据库。按仓库 README 的描述，它主要读取：

- `~/.openclaw/openclaw.json`
- 本地 session 文件

所以它和前面 `.openclaw/` 那一节是正好对上的。你可以把它理解成：

- `OpenClaw` 本体负责运行 agent
- `OpenClaw-bot-review` 负责把本地状态可视化

### 它能看什么

按当前仓库说明，这个 Dashboard 主要能看这些：

- Agent 总览
- 模型列表
- 会话管理
- Token 和响应时间统计
- 技能列表
- 告警中心
- Gateway 健康状态
- 平台连通性测试
- 一个像素风办公室视图

如果你已经开始接多个 bot、多个模型、多个平台，这种面板会比纯命令行直观很多。

### 最短安装方式

最直接的启动方式是：

```bash
git clone https://github.com/xmanrui/OpenClaw-bot-review.git
cd OpenClaw-bot-review
npm install
npm run dev
```

然后打开：

```txt
http://localhost:3000
```

它的基础要求也很简单：

- `Node.js 18+`
- 本地已经有 `OpenClaw`
- `~/.openclaw/openclaw.json` 存在且可读

### 自定义 OpenClaw 配置目录

如果你的 `OpenClaw` 不是用默认目录，而是放在别的路径，可以按仓库说明设置：

```bash
OPENCLAW_HOME=/opt/openclaw npm run dev
```

这时候 Dashboard 会去读：

```txt
/opt/openclaw/openclaw.json
```

所以如果你用的是非默认目录结构，也记得把这个信息一并告诉 `Codex`。

### Docker 方式

这个项目也支持 Docker。按 README，最短命令是：

```bash
docker build -t openclaw-dashboard .
docker run -d -p 3000:3000 openclaw-dashboard
```

如果你要挂自定义 `OpenClaw` 目录，则是：

```bash
docker run -d --name openclaw-dashboard -p 3000:3000 \
  -e OPENCLAW_HOME=/opt/openclaw \
  -v /path/to/openclaw:/opt/openclaw \
  openclaw-dashboard
```

### 安装这个 Dashboard 时，怎么配合 Codex

这部分和前文主线完全一致。

如果你安装 `OpenClaw-bot-review` 时报错，不要只说“面板打不开了”，而是把下面这些一起丢给 `Codex`：

```bash
node -v
npm -v
ls ~/.openclaw
cat ~/.openclaw/openclaw.json
npm install
npm run dev
```

如果你用了自定义目录，再补：

```bash
echo "$OPENCLAW_HOME"
ls "$OPENCLAW_HOME"
```

你可以直接这样问：

```txt
我想安装 OpenClaw-bot-review，但现在启动失败。请根据我的 node/npm 版本、openclaw 配置目录、npm install 输出和 npm run dev 输出，判断问题更像是依赖安装失败、OpenClaw 配置目录不对，还是 openclaw.json 无法读取。请给我最小修复步骤。
```

### 什么时候值得装它

如果你只是单 bot、单模型、本地自己玩，命令行通常已经够用。

但下面几种情况我会建议你装：

- 你已经接了多个 agent 或多个平台
- 你想快速确认 Gateway、Session、模型状态
- 你想让 `Codex` 帮你排查时，有一个更直观的状态面板作为辅助

## 用 embedding model 给 OpenClaw 加记忆

如果你想让它有“长期记忆”，可以接 `OpenViking` 的 `openclaw-memory-plugin`。

你提到的这个目录：

```txt
https://github.com/volcengine/OpenViking/tree/main/examples/openclaw-memory-plugin
```

本质上就是一个给 `OpenClaw` 提供长效记忆能力的插件示例。它的核心思路是：

- `OpenClaw` 负责对话和插件调度
- `OpenViking` 负责记忆抽取、存储和召回
- `embedding model` 负责把记忆编码成向量，供后续召回检索
- `VLM` 负责从对话里抽取值得记住的信息

### 最短安装路径

发给 `Codex` 的时候，可以直接说：
```text
帮我给openclaw安装这套记忆系统：https://github.com/volcengine/OpenViking/tree/main/examples/openclaw-memory-plugin
```

按 `OpenViking` 官方示例，最快的方式是在仓库根目录执行安装助手：

```bash
git clone https://github.com/volcengine/OpenViking.git
cd OpenViking
npx ./examples/openclaw-memory-plugin/setup-helper
```

安装助手会自动做这些事：

- 检查 `Python >= 3.10`、`Node.js >= 22`
- 创建 `~/.openviking/ov.conf`
- 部署 `memory-openviking` 到 `~/.openclaw/extensions/`
- 生成 `~/.openclaw/openviking.env`

如果你更想一把梭，也可以直接跑官方安装脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/volcengine/OpenViking/main/examples/openclaw-memory-plugin/install.sh | bash
```

### `ov.conf` 里最关键的两块

`OpenViking` 官方示例里，记忆系统最关键的是这两块：

- `embedding.dense`
- `vlm`

示例配置里默认使用的是火山引擎 Ark：

- `vlm.model`: `doubao-seed-2-0-pro-260215`
- `embedding.dense.model`: `doubao-embedding-vision-250615`

你可以把它理解成：

- `vlm` 负责“从对话里提炼出该记什么”
- `embedding.dense` 负责“把记忆转成可检索的向量”

所以一旦记忆效果不对，`Codex` 最该看的文件通常就是：

- `~/.openviking/ov.conf`
- `~/.openclaw/openclaw.json`
- `~/.openclaw/openviking.env`

### 启动方式

Linux / macOS 下，官方示例推荐这样启动：

```bash
source ~/.openclaw/openviking.env && openclaw gateway
```

成功时，网关日志里通常能看到类似：

```txt
[gateway] memory-openviking: local server started (http://127.0.0.1:1933, config: ...)
```

### 这类记忆错误，最适合丢给 Codex

`OpenViking` 官方示例列出来的几个典型问题，基本都很适合交给 `Codex`：

- `memory_store failed: fetch failed`
- `health check timeout`
- `extracted 0 memories`
- `memory shows disabled / memory-core`

你可以直接把下面这些一起交给 `Codex`：

```bash
openclaw status
openclaw logs --follow
cat ~/.openclaw/openclaw.json
cat ~/.openviking/ov.conf
```

然后配上这种提问：

```txt
我给 OpenClaw 接了 OpenViking 记忆插件，但记忆没有正常工作。

症状：
<这里粘贴具体报错>

请你根据 openclaw.json、ov.conf 和日志，判断问题更像是插件没挂上、OpenViking 没启动、embedding 配置错误，还是 VLM 配置错误。请给我最小修复步骤。
```

### 我对 embedding model 的建议

如果你只是先把链路跑通，优先目标不是“最强 embedding”，而是：

- API Key 正确
- `ov.conf` 可读
- `embedding.dense` 和 `vlm` 都能成功返回
- `OpenClaw` 确实把 `memory-openviking` 挂上了

先通，再优化模型。

不然很容易掉进一种假象：你以为是“召回效果差”，其实根因只是 `embedding` 根本没成功初始化。

## 还能顺手做什么

这篇文章主线是“遇到错误就交给 `Codex` 修”，所以这里只顺手提一下扩展方向，不展开：

- 可以加一些定时任务，例如每日新闻摘要、`GitHub Trending` 抓取
- 可以做 `OpenClaw` 模型巡检，确认主模型和 `fallback` 是否还可用
- 这些自动化任务后续也很适合继续让 `Codex` 帮你写和调

## 碎碎念

我对 `OpenClaw` 的观感其实挺明确的：它现在更像一个很有野心的半成品，而不是已经打磨成熟的工业化产品。

它有几个让我觉得很像“先驱者产品”的地方：

- 方向是对的：它试图把 `Codex` 这类 coding agent、通信渠道、插件系统、定时任务、记忆、网关控制面板揉成一个统一入口
- 结构是先进的：`gateway`、`channel`、`plugin`、`skills`、`extensions` 这些分层说明它不是只想做一个聊天壳子
- 体验还很毛：很多时候你能感觉到它已经把框架搭出来了，但边缘行为、配置一致性、排障体验还不够顺滑

所以我会把它看成一种“值得关注的早期基础设施”，而不是现阶段就能无脑托底的成品。

如果你拿它和 `Codex` 对比，会发现两者职责其实不同：

- `Codex` 更像一个很强的代码执行者和问题解决器
- `OpenClaw` 更像一个上层调度器，试图把模型、渠道、任务和状态都编排起来

换句话说，`OpenClaw` 的想象力在于“把很多东西连起来”，但它的痛点也恰恰在这里：

- 组件越多，出错面越广
- 配置越灵活，排障成本越高
- 一旦接入记忆、渠道、定时任务、fallback 模型，系统复杂度会迅速上升

实际上，`OpenClaw` 的 BUG 巨多，真的只是半成品状态，我直接一个期待后续大厂的产品。

## 总结

这篇文章真正想表达的其实只有一句话：

搭建 `OpenClaw` 时，最值得和 `Codex` 配合的，不是“让 `Codex` 当 OpenClaw 的模型”，而是“把安装和启动过程中遇到的错误交给 `Codex` 分析和修复”。

记住三个原则就够了：

- 不要只发一句模糊报错
- 先跑官方诊断命令，再把结果交给 `Codex`
- 涉及配置修改时，先备份，再让 `Codex` 动手

这样用，`Codex` 在 `OpenClaw` 搭建阶段的价值会非常直接。

## 参考资料

- OpenClaw 文档首页：<https://docs.openclaw.ai/>
- OpenClaw Quick Start：<https://docs.openclaw.ai/quickstart>
- OpenClaw Install：<https://docs.openclaw.ai/install/index>
- OpenClaw Troubleshooting：<https://docs.openclaw.ai/help/troubleshooting>
- OpenClaw Gateway Troubleshooting：<https://docs.openclaw.ai/gateway/troubleshooting>
- OpenAI Codex CLI Getting Started：<https://help.openai.com/en/articles/11096431-openai-codex-ci-getting-started>
- Codex CLI Sign in with ChatGPT：<https://help.openai.com/en/articles/11381614>
- Using Codex with your ChatGPT plan：<https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan>
- OpenClaw-bot-review：<https://github.com/xmanrui/OpenClaw-bot-review>
- OpenViking OpenClaw Memory Plugin：<https://github.com/volcengine/OpenViking/tree/main/examples/openclaw-memory-plugin>
- OpenViking OpenClaw Memory Plugin 安装说明：<https://github.com/volcengine/OpenViking/blob/main/examples/openclaw-memory-plugin/INSTALL-ZH.md>
