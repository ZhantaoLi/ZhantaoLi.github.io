---
title: CCG by CC-Switch
tags:
  - AI
categories: AI
date: 2026-02-01
updated: 2026-02-01
---

[[toc]]

::: info
CCG = Claude Code + Codex + Gemini CLI 配置方案  
Reference:
 - https://docs.packyapi.com/docs/
:::

<!-- more -->

## 概述

本教程将指导你使用 **CC-Switch** 在同一台电脑上**统一管理与一键切换** Claude Code、Codex、Gemini CLI 三款 AI 编程工具的配置。

**CCG:**
- **C**laude Code - Anthropic 官方 CLI 工具
- **C**odex - OpenAI 代码助手
- **G**emini CLI - Google AI 编程工具

通过 CC-Switch，你可以轻松管理多个 API 供应商配置，一键切换，无需手动编辑配置文件。

---

- ✅ 一次性安装 3 个 CLI：`claude` / `codex` / `gemini`
- ✅ 用 CC-Switch 图形化管理 **API Key + 请求地址**（无需手改配置文件）
- ✅ 一键启用/切换供应商配置
- ✅ 通过终端快速验证功能
- ✅ 常用命令速查 + 典型报错解决方案

---

## 1. 前置准备：创建 API 令牌

在开始配置前，你需要在 API 站控制台创建对应分组的 API 令牌（Key）：

- **Claude Code**：创建 CC 分组令牌
- **Codex**：创建 Codex 分组令牌
- **Gemini**：创建 Gemini 分组令牌

::: tip 提示
具体创建方法请参考你所使用的 API 服务商文档。
:::

---

## 2. 环境检查与 CLI 安装

### 2.1 确认 Node.js 环境

在终端执行：

```bash
npm list -g --depth-0
```

- 若提示"命令未找到"，需要先安装 [Node.js](https://nodejs.org/zh-cn/download)
- Node.js 正常后再继续后续步骤
```bash
node -v
npm -v
```

### 2.2 安装三大 CLI

在终端执行：

```bash
npm i -g @anthropic-ai/claude-code@latest
npm i -g @openai/codex@latest
npm i -g @google/gemini-cli@latest

claude --version
codex --version
gemini --version
```

### 2.3 运行命令生成配置目录

::: warning 重要
必须先运行 CLI，这样用户目录下才会生成配置目录，方便后续配置。
:::

```bash
claude
codex
gemini
```

能进入交互界面或出现选项即表示安装成功。

---

## 3. 安装 CC-Switch

### 项目信息

- **更新日志**：https://github.com/farion1231/cc-switch/blob/main/CHANGELOG.md
- **下载地址**：https://github.com/farion1231/cc-switch/releases/latest

### 核心功能

- 一键切换 API 配置
- 可视化配置管理
- 内置API站模板
- MCP 服务器管理
- 系统托盘快捷切换

### 3.1 Windows 安装

1. 进入 Release 页面下载 Windows 安装包
2. 优先下载 `.msi` 安装包
3. 安装后启动 CC-Switch

### 3.2 macOS 安装

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

安装完成后在"启动台/应用程序"打开 CC-Switch。

### 3.3 Linux 安装

```bash
wget https://github.com/farion1231/cc-switch/releases/download/v3.10.3/CC-Switch-v3.10.3-Linux-x86_64.deb
sudo dpkg -i CC-Switch-v3.10.3-Linux-x86_64.deb
```

::: tip 提示
路径中的 `v3.10.3` 可以根据需要替换为实际版本号。
:::

---

## 4. 用 CC-Switch 配置 CCG

::: tip 提示
CC-Switch 已内置部分API站模板，无需手动编辑配置文件。
:::

### 配置流程（三者通用）

1. 打开 CC-Switch
2. 选择对应分组 (Claude / Codex / Gemini)
3. 供应商选择对应的API站
4. 粘贴对应分组的 API Key
5. 点击"添加"
6. 回到主界面点击"启用"，显示"使用中"
7. 终端验证对话功能

---

## 5. 手动配置（可选）

如果不使用 CC-Switch，可以手动修改配置文件。

### 5.1 Claude Code 手动配置

**配置目录：**

Windows:
```text
%userprofile%\.claude
```

macOS/Linux:
```text
~/.claude
```

**创建/编辑 `settings.json`：**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://www.example.com/v1",
    "ANTHROPIC_AUTH_TOKEN": "your-api-key"
  }
}
```

::: tip 说明
将 `https://www.example.com/v1` 替换为你的API站 URL，`your-api-key` 替换为实际的 API Key。
:::

**验证：**

```bash
claude
```

### 5.2 Codex 手动配置

**配置目录：**

Windows:
```text
%userprofile%\.codex
```

macOS/Linux:
```text
~/.codex
```

**需要的文件：**
- `config.toml`（核心配置）
- `auth.json`（API Key）
- `AGENTS.md`（可选，全局提示词）

**`config.toml` 示例：**

```toml
model_provider = "custom"
model = "gpt-5.2-codex"
model_reasoning_effort = "high"
network_access = "enabled"
disable_response_storage = true
windows_wsl_setup_acknowledged = true
model_verbosity = "high"

[model_providers.custom]
name = "custom"
base_url = "https://www.example.com/v1"
wire_api = "responses"
requires_openai_auth = true
```

**`auth.json` 示例：**

```json
{
  "OPENAI_API_KEY": "your-api-key"
}
```

::: warning 注意
部分API站可能需要使用特殊的 base_url，请参考服务商文档。
:::

**验证：**

```bash
codex
```

### 5.3 Gemini 手动配置

Gemini CLI 使用 `.env` 配置文件。

**配置示例：**

```text
GOOGLE_GEMINI_BASE_URL=https://www.example.com
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=gemini-2.5-pro
```

::: tip 说明
将 `https://www.example.com` 替换为你的API站 URL。
:::

**验证：**

```bash
gemini
```

---

## 6. 常用命令速查

### 6.1 Claude Code 常用命令

**基础命令：**

```bash
# 进入交互模式
claude

# 带初始问题启动
claude "解释这个项目"

# 单次问答模式
claude -p "解释这个函数"

# 管道输入分析
cat logs.txt | claude -p "帮我总结错误"

# 继续上次对话
claude --continue

# 更新 CLI
claude update

# 管理 MCP
claude mcp

# 指定模型
claude --model sonnet

# 详细日志
claude --verbose
```

### 6.2 Codex 常用命令

Codex CLI 内常用斜杠命令（在交互界面输入）：

- `/model` - 选择模型
- `/review` - 审查工作区变更
- `/resume` - 从历史会话继续
- `/new` - 开新对话
- `/init` - 生成 `AGENTS.md` 模板
- `/compact` - 压缩上下文
- `/diff` - 查看 git diff
- `/mention` - 将文件/目录加入上下文
- `/mcp` - 列出可用 MCP 工具
- `/exit` - 退出

---

## 7. 故障排查

### 7.1 连接失败

**典型报错：**

```text
Connection failed: error sending request for url
```

**排查步骤：**

1. 确认本机网络通畅
2. 如使用代理，尝试关闭
3. 终端运行 CLI 验证是否正常
4. 重启 IDE 或终端

### 7.2 401 Unauthorized

**核心原因：**

- 环境变量覆盖了配置文件
- API Key 不正确
- 请求地址配置错误

**排查步骤：**

1. 检查并清理系统环境变量：`OPENAI_API_KEY` / `OPENAI_BASE_URL`
2. 验证配置文件中的 API Key 是否正确
3. 确认 base_url 配置正确

### 7.3 403 Forbidden

**常见原因：**

- 套餐/权限不足
- 模型不在可用范围内

**解决方法：**

1. 使用 `Ctrl+C` 中断对话
2. 检查当前 key 所属分组/套餐
3. 确认所调用模型在可用范围内

### 7.4 Windows 乱码问题

**解决步骤：**

1. 按 `Win + R` 输入：`intl.cpl`
2. 进入"管理"选项卡
3. 修改"系统区域设置"
4. 重启电脑

### 7.5 网络问题（MTU）

**适用场景：**

容器/CLI 沙盒环境中的网络异常

**解决方法：**

- 将 MTU 调整为 `1500`
- 在代理客户端（如 Clash）中设置

---

## 8. 最佳实践

### 配置建议

- **优先使用 CC-Switch**：减少手动配置错误
- **配置后立即验证**：确保三个 CLI 都能正常回复
- **任务拆分**：避免把任务描述得太笼统
- **避免频繁压缩**：如果经常需要 `/compact`，说明任务拆分不够细
- **检查环境变量**：401 错误时优先检查环境变量

### 使用技巧

1. **Claude Code** - 适合深度代码分析和复杂重构
2. **Codex** - 适合日常开发和快速迭代
3. **Gemini** - 适合多模态任务和快速原型

---

::: tip 完成
完成以上步骤，你的 CCG（Claude / Codex / Gemini）环境就搭建完成了！
:::

