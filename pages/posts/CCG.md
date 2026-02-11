---
title: CCG
tags:
  - AI
categories: AI
date: 2026-02-01
updated: 2026-02-01
---

[[toc]]

::: info
本文整理了 Claude Code、CodeX 和 Gemini 三款 AI 编程工具的配置和使用教程。  
Reference:
 - https://oftem67e2m.feishu.cn/docx/GCYGd93qaoW0SAx0YeQcLgh1nnc
 - https://chxpro.com/ai/cc%E5%90%88%E9%9B%86
:::

<!-- more -->

## 概述

本教程将介绍三款强大的 AI 编程工具的配置和使用方法：

- **Claude Code** - Anthropic 官方 CLI 工具
- **CodeX** - AI 代码助手
- **Gemini** - Google AI 编程助手

## Claude Code 配置

### 安装

Claude Code 是 Anthropic 推出的官方命令行工具，支持 Windows、macOS 和 Linux 系统。

**安装方法：**

```bash
# 使用 npm 安装
npm install -g @anthropic-ai/claude-code

# 或使用 yarn
yarn global add @anthropic-ai/claude-code
```

### API 配置

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 创建 API Key
3. 配置环境变量：

```bash
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="your-api-key"

# macOS/Linux
export ANTHROPIC_API_KEY="your-api-key"
```

### cc-statusline(自定义状态行)
Reference:
 - [状态行配置](https://code.claude.com/docs/zh-CN/statusline)
 - [CCometixLine](https://github.com/Haleclipse/CCometixLine/)

```bash
# Install globally
npm install -g @cometix/ccline

# Or using yarn
yarn global add @cometix/ccline

# Or using pnpm
pnpm add -g @cometix/ccline

# Update
npm update -g @cometix/ccline
```
**Configure `cc-statusline`** :

Linux/MacOS:
```json [.claude/settings.json]
{
  "statusLine": {
    "type": "command", 
    "command": "~/.claude/ccline/ccline",
    "padding": 0
  }
}
```
Windows:
```json [.claude/settings.json]
{
  "statusLine": {
    "type": "command", 
    "command": "%USERPROFILE%\\.claude\\ccline\\ccline.exe",
    "padding": 0
  }
}
```

### 基本使用

**启动 Claude Code：**

```bash
# 在当前目录启动
claude

# 指定项目目录
claude --project /path/to/project
```

**常用功能：**

- 代码生成和补全
- 代码解释和分析
- Bug 修复建议
- 代码重构
- 技术问题解答

### 进阶使用

#### 配置文件：
```json [.claude/settings.json]
{
  "includeCoAuthoredBy": false,
  "env":{
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC":"1",
    "HTTP_PROXY":"http://127.0.0.1:21126",
    "HTTPS_PROXY":"http://127.0.0.1:21126",
    "CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE": "193000",
    "CLAUDE_CODE_ATTRIBUTION_HEADER":"0",
    "DISABLE_TELEMETRY": "1"
  },
  "statusLine": {
    "type": "command", 
    "command": "%USERPROFILE%\\.claude\\ccline\\ccline.exe",
    "padding": 0
  }
}
```
##### 免登录配置
`"hasCompletedOnboarding": true`

#### 提示词
```text [win]
# 运行环境是 windows，不要使用不兼容的 linux 命令
# 当写入失败时使用分段式写入
```
#### 安装插件

##### cc-line
```bash [cc-line]
npm install -g @cometix/ccline --registry https://registry.npmmirror.com
```
##### ui-ux-pro-max-skill
```bash [ui-pro]
# 全局安装
npm install -g uipro-cli

# 在项目中初始化（仅 Claude Code）
uipro init --ai claude

# 或一次性初始化全部助手配置
uipro init --ai all
```

##### CCG
```json [ccg]
{
    "ace-tool": {
        "type": "stdio",
        "command": "cmd",
        "args": [
        "/c",
        "npx",
        "ace-tool-rs",
        "--base-url",
        "https://acemcp.heroman.wtf/relay/",
        "--token",
        "ace_e2678dbe414e5498e30331ade67f38bdaedc4443"
        ],
        "env": {
        "RUST_LOG": "info"
        }
    }
}
```

````markdown [CCG Enhanced]
# Claude Code 增强配置 (CCG Enhanced)

## 一、核心原则

### 1.1 调研优先（强制）

修改代码前必须：

1. ** 检索相关代码 ** - 使用 `mcp__ace-tool__search_context` 或 Grep/Glob

2. ** 识别复用机会 ** - 查找已有相似功能，优先复用而非重写

3. ** 追踪调用链 ** - 使用 Grep 分析影响范围

### 1.2 修改前三问

1. 这是真问题还是臆想？（拒绝过度设计）

2. 有现成代码可复用吗？（优先复用）

3. 会破坏什么调用关系？（保护依赖链）

### 1.3 红线原则

- 禁止 copy-paste 重复代码

- 禁止破坏现有功能

- 禁止对错误方案妥协

- 禁止盲目执行不加思考

- 禁止基于假设回答（必须检索验证）

- 关键路径必须有错误处理

### 1.4 知识获取（强制）

遇到不熟悉的知识，必须联网搜索，严禁猜测：

- 通用搜索：`WebSearch` / `mcp__exa__web_search_exa`

- 库文档：`mcp___upstash_context7-mcp__resolve-library-id` → `query-docs`

- 开源项目：`mcp__mcp-deepwiki__deepwiki_fetch`

---

## 二、工作流增强（CCG）

### 2.1 上下文检索（生成代码前执行）

** 工具 **：`mcp__ace-tool__search_context`

** 检索策略 **：

- 使用自然语言构建语义查询（Where/What/How）

- 完整性检查：获取相关类、函数、变量的完整定义与签名

- 若上下文不足，递归检索直至信息完整

### 2.2 Prompt 增强（复杂任务推荐）

** 工具 **：`mcp__ace-tool__enhance_prompt`

** 触发 **：用户使用 `-enhance` 标记，或任务模糊需要结构化

### 2.3 需求对齐

若检索后需求仍有模糊空间，输出引导性问题列表，直至需求边界清晰（无遗漏、无冗余）。

### 2.4 工作流原则

1. ** 先检索，后生成 ** - 生成代码前必须先调用 search_context

2. ** 增强需求 ** - 复杂任务先明确需求边界

3. ** 智能路由 ** - 根据任务类型选择 Codex/Gemini/Claude

4. ** 交叉验证 ** - 关键决策可使用双模型并行分析

5. ** 代码主权 ** - Codex/Gemini 仅负责分析、规划、审查；所有代码实现由 Claude 完成

---

## 三、多模型协作

### 3.1 后端任务 → Codex

```powershell
"[任务描述]" | codeagent-wrapper --backend codex - [工作目录]
```

适用：后端 logic、算法实现、数据库操作、API 开发、性能优化、调试分析

### 3.2 前端任务 → Gemini

```powershell
"[任务描述]" | codeagent-wrapper --backend gemini - [工作目录]
```

适用：UI/UX 组件、CSS 样式、响应式布局、前端交互逻辑

### 3.3 会话复用

每次调用返回 `SESSION_ID: xxx`，后续用 `resume xxx` 复用上下文：

```powershell
"[后续任务]" | codeagent-wrapper --backend <codex|gemini> resume <SESSION_ID> - [工作目录]
```

### 3.4 并行调用

使用 `run_in_background: true` 启动后台任务，用 `TaskOutput` 等待结果。

必须等所有模型返回后才能进入下一阶段。

```python
# 示例：并行启动 Codex 和 Gemini
Bash (command='"任务描述" | codeagent-wrapper --backend codex ...', run_in_background=True)
Bash (command='"任务描述" | codeagent-wrapper --backend gemini ...', run_in_background=True)

# 等待结果
TaskOutput (task_id="<TASK_ID>", block=True, timeout=600000)
```

---

## 四、任务分级

| 级别 | 判断标准 | 处理方式 |
|------|----------|----------|
| 简单 | 单文件、明确需求、少于 20 行 | 直接执行 |
| 中等 | 2-5 个文件、需要调研 | 简要说明方案 → 执行 |
| 复杂 | 架构变更、多模块、不确定性高 | 完整规划流程 |

### 4.1 复杂任务流程

1. **RESEARCH** - 调研代码，不提建议

2. **PLAN** - 列出方案，等待用户确认

3. **EXECUTE** - 严格按计划执行

4. **REVIEW** - 完成后自检

触发：用户说 "进入 X 模式" 或任务符合复杂标准时自动启用

### 4.2 复杂问题深度思考

触发场景：多步骤推理、架构设计、疑难调试、方案对比

强制工具：`mcp__sequential-thinking__sequentialthinking`

---

## 五、工具速查

| 场景 | 推荐工具 |
|------|----------|
| 代码语义检索 | `mcp__ace-tool__search_context` |
| 精确字符串 / 正则 | `Grep` |
| 文件名匹配 | `Glob` |
| 代码库探索 | `Task` + `subagent_type=Explore` |
| 技术方案规划 | `EnterPlanMode` 或 `Task` + `subagent_type=Plan` |
| 库官方文档 | `mcp___upstash_context7-mcp__query-docs` |
| 开源项目文档 | `mcp__mcp-deepwiki__deepwiki_fetch` |
| 联网搜索 | `WebSearch` / `mcp__exa__web_search_exa` |
| 深度推理 | `mcp__sequential-thinking__sequentialthinking` |
| PDF 读取 | `mcp__pdf-reader__read_pdf` |
| 跨会话记忆 | `mcp__server-memory__*`（仅用户要求时） |
| 快捷操作 | Skill（`/commit`、`/debug`、`/review` 等） |

** 选择原则 **：语义理解用 `ace-tool`，精确匹配用 `Grep`

---

## 六、Git 规范

- 不主动提交 /push，除非用户明确要求

- Commit 格式：`<type>(<scope>): <description>`

- 不添加 Claude 署名标记

- 提交前：`git diff` 确认改动范围

- 禁止 `--force` 推送到 main/master

---

## 七、安全检查

- 禁止硬编码密钥 / 密码 /token

- 不提交 .env/credentials 等敏感文件

- 用户输入在系统边界必须验证

---

## 八、代码风格

- **KISS** - 能简单就不复杂

- **DRY** - 零容忍重复，必须复用

- ** 保护调用链 ** - 修改函数签名时同步更新所有调用点

完成后清理：临时文件、废弃代码、未使用导入、调试日志

---

## 九、交互规范

### 何时询问用户

- 存在多个合理方案时

- 需求不明确或有歧义时

- 改动范围超出预期时

- 发现潜在风险时

### 何时直接执行

- 需求明确且方案唯一

- 小范围修改（少于 20 行）

- 用户已确认过类似操作

### 敢于说不

发现问题直接指出，不妥协于错误方案

---

## 十、环境特定（Windows / PowerShell）

- 不支持 `&&`，使用 `;` 分隔命令

- 中文路径用引号包裹

- 管道传参：`"内容" | command` 替代 heredoc

---

## 输出设置

- 中文响应

- 禁用表情符号

- 禁止截断输出
````


#### 启动参数（常用）
```bash
# 跳过权限确认（仅在你确定命令安全时使用）
claude --dangerously-skip-permissions

# 继续上一轮会话
claude --continue

# 按会话 ID 恢复上下文
claude --resume <SESSION_ID>
```

#### CCG 工作流（推荐）
- 改代码前先做上下文检索，再动手实现，降低误改概率。
- 复杂任务先把需求结构化（边界、输入输出、验收标准），再开始编码。
- 关键决策可做双模型交叉验证（如后端方案 vs 前端交互方案）。
- 多模型协作时，固定一个模型负责最终落地，避免反复覆盖。

#### 会话复用（跨任务保持上下文）
```powershell
# 首次执行（示例：后端任务给 codex）
"[任务描述]" | codeagent-wrapper --backend codex - [工作目录]

# 后续继续同一会话
"[后续任务]" | codeagent-wrapper --backend codex resume <SESSION_ID> - [工作目录]
```

#### MCP
```bash
# 安装并注册搜索 MCP
claude mcp add huge-ai-search -- npx -y huge-ai-search

# 初始化配置
npx -p huge-ai-search huge-ai-search-setup
```

#### 加速代理
```text [BetterClaude - L站]
https://betterclau.de/claude/
```

#### 安全与稳定性优化
- 不要在配置文件里明文写 token，统一改为环境变量注入。
- 代理地址建议只保留你可控、可审计的节点，避免来源不明的中转。
- 保留 `DISABLE_TELEMETRY`、`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` 这类降噪配置，提升稳定性。

#### skills

##### 文章去 AI 味
- 去 AI 味提示词（作家增强 SKILL）：
  [https://github.com/OUBIGFA/De-AI-Prompt-Enhancer-Writer-Booster-SKILL](https://github.com/OUBIGFA/De-AI-Prompt-Enhancer-Writer-Booster-SKILL)

##### browserwing
- GitHub: [https://github.com/browserwing/browserwing](https://github.com/browserwing/browserwing)

```bash
npm install -g browserwing
browserwing --port 8080
```

## CodeX 配置

### 简介

CodeX 是一款强大的 AI 代码助手工具，可以集成到多种开发环境中，提供智能代码补全、生成和优化功能。

### 安装配置

**获取访问权限：**

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 获取 API 密钥
3. 配置开发环境

**环境配置：**

```bash
# 设置 API Key
export CODEX_API_KEY="your-codex-api-key"
```

### 使用方法

**IDE 集成：**

CodeX 可以集成到主流 IDE 中：
- VS Code
- Cursor
- Windsurf

**主要功能：**

- 智能代码补全
- 代码生成
- 代码解释
- 单元测试生成
- 代码优化建议

## Gemini 配置

### 简介

Gemini 是 Google 推出的多模态 AI 模型，支持代码生成、分析和优化等功能。

### 获取 API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/api-keys)
2. 使用 Google 账号登录
3. 创建新的 API Key
4. 复制并保存 API Key

### 配置使用

**环境变量配置：**

```bash
# 设置 Gemini API Key
export GOOGLE_API_KEY="your-gemini-api-key"
```

### 主要特点

- 多模态支持（文本、图片、代码）
- 长上下文窗口
- 快速响应
- 免费额度充足

## 使用建议

### 工具选择

**Claude Code 适合：**
- 需要深度代码分析
- 复杂的重构任务
- 高质量代码生成

**CodeX 适合：**
- 日常开发辅助
- 快速代码补全
- IDE 集成使用

**Gemini 适合：**
- 多模态任务
- 快速原型开发
- 成本敏感场景

### 使用技巧

1. **合理分配任务** - 根据任务特点选择合适的工具
2. **组合使用** - 发挥各工具的优势
3. **注意成本** - 监控 API 使用量
4. **代码审查** - AI 生成的代码需要人工审查
5. **持续学习** - 关注工具更新和新功能

## 总结

三款工具各有特色，建议根据实际需求选择使用：

- **Claude Code** - 最强代码理解能力
- **CodeX** - 最佳开发体验
- **Gemini** - 最优性价比

合理使用这些 AI 工具可以显著提升开发效率，但记住它们是辅助工具，最终的代码质量仍需要开发者把关。

---

**相关资源：**
- [Anthropic API](https://docs.anthropic.com/)
- [OpenAI Platform](https://platform.openai.com/)
- [Google AI Studio](https://aistudio.google.com/)
