---
title: Codex 排障
description: Codex 排障记录:接入非 GPT 模型、联动 MCP/skill、Computer Use 插件修复与 codex-auto-review 配置
tags:
  - AI
  - Codex
categories: AI
date: 2026-09-25
updated: 2026-09-25
---

[[toc]]

## Codex 接入非 gpt 模型

可以通过本地路由来将其他模型重定向为 gpt 模型。

### Method 1 - cc-switch

cc-switch 提供一个桌面应用来管理所有支持的 AI 工具,包括 Codex。软件支持路由来重定向模型。

- https://github.com/farion1231/cc-switch

软件也有一些 Codex 应用增强:切换第三方时保留官方登录、统一 Codex 会话历史。

### Method 2 - CodexPlusPlus

Codex++ 是面向 Codex App 的外部增强启动器和管理工具。它不修改 Codex App 原始安装文件,而是通过外部 launcher 启动 Codex,并使用 Chromium DevTools Protocol 注入增强脚本。

- https://github.com/BigPizzaV3/CodexPlusPlus

## 联动各种软件(MCP/skill)

首先,MCP(Model Context Protocol)是一种开源标准,用于将 AI 应用程序连接到外部系统。
AI Agent 可以通过 skill 或者 MCP 来联动各种软件,实现对软件的管理和控制,例如 浏览器、Visio 或各种专业软件。

一些 MCP 资源网站:

- https://mcp.so
- https://smithery.ai
- https://www.modelscope.cn/mcp
- https://lobehub.com/mcp
- https://glama.ai

当然也可以直接与 AI 沟通去构建 skill & mcp 来实现联动各种软件。

## Computer Use 插件不可用

这与 Codex 的插件更新逻辑有关。Codex 在更新插件时会先删除旧的临时目录 `.tmp`,如果事先安装了 chrome 插件,那么这个目录中会包含 chrome 插件使用的 native host,即 `extension-host.exe`。我们都知道 Windows 系统会对正在运行的 `.exe` 或其所在目录加锁,不允许删除,那么如果更新的时候 chrome 相关服务在使用,就会导致目录清理失败,留下一个不完整的目录,但 Codex 配置仍然指向这个半成品目录,所以就找不到正确的插件信息,也就更新失败了。

### Method 1 - 开源脚本

一个解决脚本:

- https://github.com/JMC2002/codex_computer_use_fix

### Method 2 - Codex 提示词

可以直接问 Codex:

```txt
我在 Windows 版 Codex 更新后,Chrome 插件和 Computer Use 插件突然消失或不可用。请帮我排查并尽量修复。

要求:
1. 先备份 ~/.codex/config.toml、~/.codex/.codex-global-state.json、chrome-native-hosts.json 等相关配置。
2. 检查 codex plugin marketplace list 和 codex plugin list,确认 openai-bundled 是否存在,chrome@openai-bundled 和 computer-use@openai-bundled 是否 installed, enabled。
3. 检查 ~/.codex/plugins/cache/openai-bundled/chrome/latest 是否指向完整目录,确认 scripts/browser-client.mjs 等关键文件是否存在。
4. 检查 Chrome native host 和 Codex Chrome Extension 是否正常。
5. 检查 Computer Use runtime 是否能正常启动。
6. 如发现 marketplace 或 latest 链接异常,请在备份后修复。
7. 如果出现 os error 740 / 请求的操作需要提升,再判断是否需要修改 [windows] sandbox = "unelevated",不要一开始就盲改。
8. 修复后告诉我具体原因、改了哪些文件、验证结果。
```

```txt
帮我按“桌面版 Codex 插件分层健康检查”排查,不要先假设是 sandbox 问题。

要求:
1. 先备份 ~/.codex/config.toml、~/.codex/.codex-global-state.json、~/.codex/chrome-native-hosts.json 和 Chrome native host 注册表。
2. 不要使用 PATH 里的 codex;先从 config.toml 的 CODEX_CLI_PATH 或桌面版安装目录找配套 codex.exe,再运行 plugin marketplace list / plugin list。
3. 重点检查 openai-bundled 是否错误指向 ~/.codex/.tmp;如果是,改回桌面版 resources/plugins/openai-bundled。
4. 检查 chrome/latest 是否存在、是否指向稳定版本目录、是否有 scripts/browser-client.mjs 和 extension-host.exe。
5. 分别检查 Chrome native host manifest、Chrome 扩展安装/启用状态、Chrome 是否正在运行。
6. 检查 Computer Use 文件完整性、系统中是否有 codex-computer-use-* pipe、当前 node runtime 是否暴露 nativePipe。
7. 只有出现 os error 740 时才考虑修改 [windows] sandbox;出现 os error 2/5 时先按 pipe 缺失、路径失效、文件占用或 marketplace/latest 异常排查。
8. 最后给我一个表:现象、证据、根因、修改文件、验证命令、结果。
```

## 为中转站配置 codex-auto-review

**1. 生成模型目录覆盖文件,让 gpt-5.5 的自动审批审查也使用 gpt-5.5:**

```bash
codex debug models --bundled 2>/dev/null \
  | jq '(.models [] | select (.slug == "gpt-5.5")).auto_review_model_override = "gpt-5.5"' \
  > ~/.codex/models-override.json
```

后面那个的 `gpt-5.5` 可以替换成你自己想要的 review 模型

**2. 在 `~/.codex/config.toml` 中配置**

```toml
model = "gpt-5.5"
model_catalog_json = "~/.codex/models-override.json"
```

**3. 验证配置是否被 Codex 读到**

```bash
codex debug models 2>/dev/null \
    | jq '.models [] | select (.slug=="gpt-5.5") | {slug, auto_review_model_override}'
```

一般会输出

```json
{
  "slug": "gpt-5.5",
  "auto_review_model_override": "gpt-5.5"
}
```

**4. 重启 Codex 即可**
