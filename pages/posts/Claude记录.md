---
title: Claude 记录
description: Claude Code 使用随笔,含 cc-switch 通用配置、CLAUDE.md 精简版与局部权限配置
tags:
  - AI
  - Claude
categories: AI
date: 2026-09-25
updated: 2026-09-25
---

[[toc]]

笔记只是用作记录在使用 `claude` 的过程中的一些随笔.

## cc-switch 通用配置

```json
{
  "env": {
    "BASH_MAX_TIMEOUT_MS": "7200000",
    "BASH_DEFAULT_TIMEOUT_MS": "1800000",
    "ENABLE_TOOL_SEARCH": "true",
    "CLAUDE_CODE_USE_POWERSHELL_TOOL": "1",
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  },
  "includeCoAuthoredBy": false,
  "model": "haiku",
  "cleanupPeriodDays": 36500,
  "skipDangerousModePermissionPrompt": true,
  "skipWebFetchPreflight": true,
  "theme": "auto",
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```

## CLAUDE.md 简洁版

```markdown [CLAUDE.md]
# Personal Agent Preferences

- 先观察现状再回答:回答前先检查相关文件、进程、环境或事实状态,不凭记忆或假设直接下结论
- 默认使用中文回复,保持简洁、直接
- 修改前先检查相关文件和现有状态,保留用户已有改动
- 优先使用项目现有工具和约定,避免无关重构
- 执行系统安装或配置前说明影响,完成后进行可验证的检查
- 遇到不确定或有破坏性的操作,先说明风险并请求确认

# Knowledge Iteration

- 开始回答或运行命令前,先定位并通读与当前问题直接相关的项目文档、复现记录和故障记录,了解已有结论、环境、历史尝试与已知限制;不要求无差别读取全部文档
- 优先复用已经验证的结论和命令;若当前事实与旧记录不一致,先验证差异,不盲目沿用过期经验
- 问题解决后、结束回复前,进行一次简短复盘:确认问题现象、根因、有效解决方法、验证证据、适用环境和遗留限制
- 当经验具有复用价值、问题可能复发、排障成本较高或涉及关键环境配置时,主动把问题与解决方法更新到最相关的项目文档;简单的一次性问答无需机械记录
- 优先完善已有主文档,避免重复创建相同主题的笔记;确无合适文档时,再创建名称清晰的新记录
- 文档沉淀属于任务收尾的一部分。写入后检查命令、路径、版本、前置条件和验证结果,避免把未经验证或已过期的做法固化为结论

# Temporary Files

- 任务过程中产生的脚本、临时文本、日志、截图、导出文件、测试数据和其他中间产物,统一放在当前项目根目录的 `tmp/<任务名称>/` 下;任务名称应简短、清晰,必要时加日期或序号避免冲突
- 不要把临时文件散落在项目根目录、文档目录、源码目录、用户主目录或 Windows/WSL 的随机位置;项目内已有的构建目录和工具专用缓存按其既有约定处理
- 临时脚本若经验证后仍需长期复用,应移动到项目约定的 `scripts/` 或其他正式目录,并补充用途、入口和使用条件;临时文本和日志若具有复用价值,应整理后写入相关项目文档
- 任务结束时清理确认无用的临时产物;不要擅自删除既有 `tmp/` 内容或尚未核对的日志。保留的诊断材料应注明来源、日期和对应任务
- 工具强制使用系统临时目录时,优先让其输出指向项目的任务子目录;无法控制时,在任务结束后清理可安全删除的副本,并在交付说明中指出位置
```

## 局部权限配置

```json [settings.local.json]
{
  "permissions": {
    "allow": [
      "Bash",
      "PowerShell",
      "Read",
      "Write",
      "Edit",
      "Search",
      "WebSearch",
      "WebFetch",
      "Skill"
    ],
    "deny": [
    ],
    "ask": [
      "Bash(rm:*)",
      "Bash(git push:*)"
    ],
    "defaultMode": "acceptEdits"
  },
  "enableAllProjectMcpServers": true,
  "theme": "auto",
  "teammateMode": "auto"
}
```

## 关于其清理争议

据悉,某些版本cc会在启动时自动清理超过30天未活跃的session.

[issues/41458](https://github.com/anthropics/claude-code/issues/41458)

个人建议备份 `~/.claude`,尤其是 `.jsonl` 记录.
