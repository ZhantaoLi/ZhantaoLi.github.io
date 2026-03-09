---
title: CPA（CLI Proxy API）搭建与使用
tags:
  - AI
  - Codex
categories: AI
date: 2026-03-09
updated: 2026-03-09
---

# CPA（CLI Proxy API）搭建与使用

[[toc]]

CLIProxyAPI 是一款使用 Go 语言编写的开源 AI 代理工具。

如果你已经在本机或服务器上登录过 `Codex`、`Claude Code`、`Gemini CLI`、`Qwen Code` 之类的 CLI，接下来通常会遇到一个问题：这些能力各自可用，但很难统一给别的客户端或 SDK 复用。

`CLIProxyAPI` 的价值就在这里。它把这些 CLI/OAuth 能力包装成统一的 API 服务，对外暴露 OpenAI / Gemini / Claude / Codex 兼容接口。这样你就可以把本地 CLI 账户，转换成一个稳定的代理入口，供 `Codex`、`Claude Code`、`Amp CLI`，或者你自己的脚本直接调用。

本文以本地 `Docker Compose` 部署为主，目标是完成下面这条链路：

1. 启动 `CLIProxyAPI`
2. 完成某个提供商的 OAuth 登录
3. 用统一 API 测通请求
4. 让 `Codex` 或其他客户端接入它

<!-- more -->

## 它到底解决什么问题

`CLIProxyAPI` 不是新的大模型平台，而是一个协议适配层。

它解决的核心问题有三个：

- 把多个 CLI/OAuth 入口统一成一个 API 地址
- 用一套 OpenAI / Claude / Gemini 兼容接口访问不同模型
- 支持多账户轮询、工具调用、流式响应和图片输入

截至 `2026-03-09`，官方文档已经明确支持 `Gemini CLI`、`OpenAI Codex`、`Claude Code`、`Qwen Code`、`iFlow` 等来源，并支持 OpenAI `Chat Completions` 与 `Responses` 两类常见调用方式。

## 适合什么场景

如果你有下面这些需求，这个项目基本就对路：

- 希望把 `Codex`、`Claude Code`、`Gemini CLI` 统一到一个本地网关
- 想把 CLI 登录态复用给别的编辑器、脚本或 SDK
- 想用一个代理端口管理多个账号，做轮询或故障切换
- 想统一模型入口，而不是每个客户端都单独配一遍

如果你只是单机、单工具、单账号使用，且没有复用需求，那直接用官方 CLI 往往更简单。

## 部署前准备

建议先准备好以下环境：

- 一台本机或服务器
- `Docker` 与 `Docker Compose`
- 至少一个可登录的上游账号，例如 `Codex`、`Claude Code` 或 `Gemini CLI`
- 一个你自己定义的客户端访问密钥(``api-keys``)，用于调用代理服务
- 一个单独的管理密钥(``remote-management.secret-key``)，用于 Web UI 和管理 API

本文默认使用本机部署，服务监听在 `127.0.0.1:8317`。

## 基础目录与配置思路

官方默认使用项目根目录下的 `config.yaml`，也可以通过 `--config` 指向别的路径。

有两个字段建议先理解清楚：

- `api-keys`：给客户端调用代理服务时用的，不是上游平台的 API Key
- `auth-dir`：CLI 登录后的凭据目录，OAuth 产物会保存在这里

一个示例的 `config.yaml` 如下：

```yaml
port: 8317
remote-management:
  allow-remote: true
  secret-key: "ABCD-1234"   # 管理密钥
  disable-control-panel: false
auth-dir: "/data/auths"
debug: false
logging-to-file: false
usage-statistics-enabled: false
request-retry: 3
quota-exceeded:
   switch-project: true
   switch-preview-model: true
api-keys:
  - "EFGH-5678" # API调用密钥
```

上面这份配置示例保留了远程管理开关，主要是为了方便后文演示 `Web UI` 和管理 `API`。如果你只是本机自用，把 `remote-management.allow-remote` 改成 `false` 会更稳妥。

## 方式一：用 Docker Compose 搭起来

### 1. 获取项目

```bash
git clone https://github.com/router-for-me/CLIProxyAPI.git
cd CLIProxyAPI
cp config.example.yaml config.yaml
```

然后把 `config.yaml` 改成你自己的最小配置，或者在官方示例基础上做裁剪。

### 2. 启动服务

```bash
docker compose up -d
```

查看日志：

```bash
docker compose logs -f
```

如果你只是先本地试跑，到这里服务本体就已经启动了。

## 进行 OAuth 登录

服务启动后，还需要给对应的 provider 做登录授权。官方文档提供的是容器内执行方式。

### 登录 Gemini

```bash
docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --login
```

### 登录 Codex

```bash
docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --codex-login
```

### 登录 Claude

```bash
docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --claude-login
```

### 登录 Qwen

```bash
docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --qwen-login
```

执行后，程序会给你一个浏览器登录流程。完成授权后，凭据会被保存到 `auth-dir` 指定的目录。

这里有两个实用结论：

- 同一种 provider 可以重复登录多个账号，后续交给代理做轮询
- 你不一定要同时登录所有 provider，先登录自己当前最需要的那一个即可

## 先用 API 自测一遍

别急着接编辑器，先直接用 `curl` 验证代理是否能工作。

### OpenAI Chat Completions 接口

```bash
curl -X POST http://127.0.0.1:8317/v1/chat/completions \
  -H "Authorization: Bearer <api-keys>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5(high)",
    "messages": [
      { "role": "user", "content": "请用三点说明 CLIProxyAPI 的用途" }
    ]
  }'
```

### OpenAI Responses 接口

```bash
curl -X POST http://127.0.0.1:8317/v1/responses \
  -H "Authorization: Bearer <api-keys>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5(medium)",
    "input": "帮我总结部署 CLIProxyAPI 的最小步骤"
  }'
```

上面这两个例子说明两件事：

- `CLIProxyAPI` 可以作为 OpenAI 兼容网关使用
- 模型名后面可以带括号，例如 `gpt-5(high)`，用于附加推理等级或思考量

如果这里已经能返回结果，后面的接入基本就是改客户端配置而已。

## 接入 Codex

如果你想让本地 `Codex` 走 `CLIProxyAPI`，官方文档给的是修改 `~/.codex/config.toml` 和 `~/.codex/auth.json`。

### `~/.codex/config.toml`

```toml
model_provider = "cliproxyapi"
model = "gpt-5-codex"
model_reasoning_effort = "high"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
```

### `~/.codex/auth.json`

```json
{
  "OPENAI_API_KEY": "<api-keys>"
}
```

这里最关键的是两点：

- `base_url` 指向代理的 `/v1`
- `OPENAI_API_KEY` 写的是你在 `config.yaml` 里定义的客户端密钥，不是 OpenAI 官方 Key

配好后，`Codex` 的请求就会先打到本地代理，再由代理转发给你已经登录过的上游 provider。

## 接入 Claude Code

如果你想让 `Claude Code` 走同一个代理，可以使用环境变量方式。

```bash
export ANTHROPIC_BASE_URL=http://127.0.0.1:8317
export ANTHROPIC_AUTH_TOKEN=<api-keys>

export ANTHROPIC_DEFAULT_OPUS_MODEL=gpt-5(high)
export ANTHROPIC_DEFAULT_SONNET_MODEL=gpt-5(medium)
export ANTHROPIC_DEFAULT_HAIKU_MODEL=gemini-2.5-flash
```

这个思路很适合做“协议和模型解耦”：

- 客户端照样认为自己在请求 Claude 风格接口
- 实际底层模型可以切到 `GPT-5` 或 `Gemini`
- 统一由代理做模型路由

## 管理界面与管理 API

只要你设置了 `remote-management.secret-key`，就可以使用官方管理能力。

### Web UI

默认访问地址：

```txt
http://127.0.0.1:8317/management.html
```

首次进入后输入管理密钥即可。

### 管理 API

基础路径：

```txt
http://127.0.0.1:8317/v0/management
```

它适合做这些事情：

- 查看或修改运行时配置
- 发起登录授权 URL
- 管理认证文件与密钥条目
- 看日志和使用情况

如果你后面想自己做面板，或者把配置管理流程自动化，这一层非常有用。

## 常见坑

### 1. `401 Unauthorized`

最常见原因不是 OAuth 失败，而是客户端带错了 `api-keys`。业务请求要带的是你自己在 `config.yaml` 里配置的客户端密钥。

### 2. `management.html` 打不开或返回 `404`

优先检查这几个点：

- `remote-management.secret-key` 是否为空
- `remote-management.disable-control-panel` 是否被设成了 `true`
- 你访问的端口是不是代理服务实际监听的端口

### 3. OAuth 已经做了，但模型仍然不可用

常见原因有：

- 你登录的是 `Claude`，却在请求 `gpt-5`
- 模型名写错，或者用了当前 provider 不支持的名称
- 凭据目录不是你以为的那个目录

### 4. 客户端能连上，但协议不对

这个问题非常常见：

- OpenAI 兼容客户端通常写到 `http://127.0.0.1:8317/v1`
- Claude 兼容客户端通常写到 `http://127.0.0.1:8317`
- Gemini CLI 的 OAuth 模式走 `CODE_ASSIST_ENDPOINT=http://127.0.0.1:8317`

路径写错时，看起来像“能连”，实际请求协议并不匹配。

## 碎碎念

由于最近 OpenAI 注册机盛行，也是提前感受到 AI 时代的共产主义。搭配上 cli-proxy-api 的使用，用不完，根本用不完。

## 参考资料

- 官方仓库：<https://github.com/router-for-me/CLIProxyAPI>
- 官方文档首页：<https://help.router-for.me/cn/>
- [手把手带你用上AI神器 - CLIProxyAPI](https://linux.do/t/topic/1011966)
- [CPA -账户清理工具](https://clean.daiju.live)
