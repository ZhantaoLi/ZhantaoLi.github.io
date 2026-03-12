---
title: GCMP
tags:
  - AI
categories: AI
date: 2026-02-02
updated: 2026-02-02
---

[[toc]]

::: info
项目地址: [GCMP](https://github.com/VicBilibily/GCMP) by [VicBilibily](https://github.com/VicBilibily)  
扩展市场: [vicanent.gcmp](https://marketplace.visualstudio.com/items?itemName=vicanent.gcmp)
:::

<!-- more -->

## 项目简介

GCMP (GitHub Copilot Model Provider) 是一个强大的 VS Code 扩展，通过集成国内主流原生大模型提供商，为开发者提供更加丰富、更适合本土需求的 AI 编程助手选择。该扩展让你能够在 GitHub Copilot Chat 中使用国内各大 AI 模型，无需切换工具或学习新界面。

### 核心特性

- **多提供商支持**: 内置支持智谱AI、火山方舟、MiniMax、MoonshotAI、DeepSeek、快手万擎、阿里云百炼等国内主流 AI 提供商
- **OpenAI/Anthropic 兼容**: 支持自定义接入任何提供兼容接口的第三方云服务模型
- **原生集成**: 深度集成 VS Code 的 GitHub Copilot Chat，保持一致的用户体验
- **灵活配置**: 支持 BYOK (Bring Your Own Key)，完全掌控 API 密钥和配置
- **丰富功能**: 包含代码补全、Token 统计、提交消息生成等实用功能

## 快速开始

### 1. 安装扩展

在 VS Code 扩展市场搜索 `GCMP` 并安装，或使用扩展标识符：

```
vicanent.gcmp
```

### 2. 配置使用

1. 打开 VS Code 的 `GitHub Copilot Chat` 面板
2. 在模型选择器的底部选择 `管理模型`
3. 从弹出的模型提供商列表中选择所需的提供商
4. 首次使用时，按提示设置对应提供商的 API Key
5. 配置完成后，返回模型选择器添加并启用模型
6. 选中目标模型后，即可开始与 AI 助手进行对话

## 支持的 AI 提供商

### 智谱AI (GLM系列)

**官网**: [bigmodel.cn](https://bigmodel.cn/)

- **编程套餐**: GLM-4.7(Thinking)、GLM-4.6、GLM-4.6V(Thinking)、GLM-4.5-Air
- **按量计费**: GLM-4.7、GLM-4.7-FlashX、GLM-4.6、GLM-4.6V、GLM-4.5-Air
- **免费模型**: GLM-4.7-Flash、GLM-4.6V-Flash

### MiniMax

**官网**: [platform.minimaxi.com](https://platform.minimaxi.com/)

- **Coding Plan 编程套餐**: MiniMax-M2.1、MiniMax-M2
- **按量计费**: MiniMax-M2.1、MiniMax-M2.1-Lightning、MiniMax-M2

### MoonshotAI (Kimi K2系列)

**官网**: [platform.moonshot.cn](https://platform.moonshot.cn/)

- **会员权益**: Kimi 会员计划套餐附带的 `Kimi For Coding`
- **预置模型**: Kimi-K2.5(Thinking)、Kimi-K2-0905-Preview、Kimi-K2-Turbo-Preview、Kimi-Latest
- **思考模型**: Kimi-K2-Thinking、Kimi-K2-Thinking-Turbo

### DeepSeek (深度求索)

**官网**: [platform.deepseek.com](https://platform.deepseek.com/)

- **预置模型**: DeepSeek-V3.2(Reasoner)

::: tip 使用建议
使用 DeepSeek-V3.2 (Reasoner) 时建议在设置中展开思考内容：
```json
"chat.agent.thinkingStyle": "expanded"
```
:::

### 阿里云百炼 (通义大模型)

**官网**: [bailian.console.aliyun.com](https://bailian.console.aliyun.com/)

- **Coding Plan 套餐**: Qwen3-Coder-Plus
- **通义千问系列**: Qwen3-Max(Thinking)、Qwen3-VL-Plus、Qwen3-VL-Flash、Qwen-Plus、Qwen-Flash

### 火山方舟 (豆包大模型)

**官网**: [volcengine.com/product/ark](https://www.volcengine.com/product/ark)

- **Coding Plan 套餐**: Ark-Code-Latest (智能调度模型)
  - 支持指定模型：Doubao-Seed-Code、Kimi-K2.5、GLM-4.7、Deepseek v3.2、Kimi-K2-Thinking
- **豆包系列**: Doubao-Seed-1.8、Doubao-Seed-1.6、Doubao-Seed-1.6-Lite
- **协作奖励计划**: GLM-4.7、DeepSeek-V3.2(Thinking)、DeepSeek-V3.1-terminus、Kimi-K2-250905、Kimi-K2-Thinking-251104
- **上下文缓存**: 实验性支持 Doubao-Seed-1.8(Caching)、GLM-4.7(Caching)

### 快手万擎 (StreamLake)

**官网**: [streamlake.com/product/kat-coder](https://streamlake.com/product/kat-coder)

- **KwaiKAT Coding Plan**: KAT-Coder-Pro-V1
- **KAT-Coder系列**: KAT-Coder-Pro-V1(按量付费)、KAT-Coder-Air-V1

## 高级功能

### FIM / NES 内联补全建议

GCMP 支持两种代码补全技术：

- **FIM (Fill In the Middle)**: 通过上下文预测中间缺失的代码，适合快速补全单行或短片段代码
- **NES (Next Edit Suggestions)**: 根据当前编辑上下文提供更精准的代码补全建议，支持多行代码生成

::: warning 注意
使用 FIM/NES 补全功能前，必须先在对话模型配置中设置对应提供商的 API Key 并验证可用。补全功能复用对话模型的 API Key 配置。
:::

### Token 消耗统计

GCMP 内置了完整的 Token 消耗统计功能，帮助你追踪和管理 AI 模型的使用情况：

- 实时显示 Token 消耗
- 按模型、按时间段统计
- 成本估算功能
- 详细的使用报告

### 上下文窗口占用比例

状态栏实时显示当前会话的上下文窗口使用情况，帮助你：

- 监控上下文窗口占用
- 避免超出模型限制
- 优化对话策略

### AI 驱动的提交消息生成

GCMP 支持在提交前自动读取当前仓库的改动，生成符合项目风格的提交信息：

- 自动分析已暂存/未暂存/新文件
- 提取关键 diff 片段
- 结合历史提交风格
- 生成规范的提交消息

## 自定义模型配置

### OpenAI / Anthropic Compatible Provider

GCMP 提供 OpenAI / Anthropic Compatible Provider，用于支持任何 OpenAI 或 Anthropic 兼容的 API。

**配置方式**：

1. 通过 `GCMP: Compatible Provider 设置` 命令启动配置向导
2. 在 `settings.json` 中编辑 `gcmp.compatibleModels` 配置项

**示例配置**：

```json
{
  "gcmp.compatibleModels": [
    {
      "id": "custom-model",
      "name": "My Custom Model",
      "provider": "openai",
      "baseURL": "https://api.example.com/v1",
      "apiKey": "your-api-key",
      "model": "gpt-4",
      "extraBody": {
        "temperature": 0.7,
        "top_p": 0.9
      }
    }
  ]
}
```

## 高级配置

GCMP 支持通过 VS Code 设置来自定义 AI 模型的行为参数：

```json
{
  // 上下文窗口占用比例显示
  "gcmp.contextWindowDisplay": true,
  
  // Token 统计功能
  "gcmp.tokenStatistics": true,
  
  // 内联补全建议
  "gcmp.inlineCompletion": {
    "enabled": true,
    "provider": "zhipu",
    "model": "glm-4.7"
  },
  
  // 提交消息生成
  "gcmp.commitMessage": {
    "enabled": true,
    "mode": "auto"
  }
}
```

::: tip 提示
`settings.json` 中的所有参数修改会立即生效，无需重启 VS Code。
:::

## 使用技巧

### 1. 选择合适的模型

根据不同的任务选择最适合的模型：

- **代码生成**: GLM-4.7、Kimi-K2.5、DeepSeek-V3.2
- **代码审查**: Qwen3-Max、MiniMax-M2.1
- **快速问答**: GLM-4.7-Flash、Kimi-K2-Turbo
- **复杂推理**: DeepSeek-V3.2(Reasoner)、Kimi-K2-Thinking

### 2. 利用搜索功能

对于需要最新信息的问题，使用支持联网搜索的模型：

- 智谱AI: 使用 `#zhipuWebSearch` 参数
- MiniMax: 使用 `#minimaxWebSearch` 参数

### 3. 监控使用量

定期查看状态栏的用量信息，合理分配不同提供商的使用：

- 编程套餐适合日常开发
- 按量计费适合高峰期补充
- 免费模型适合简单查询

### 4. 优化上下文

注意上下文窗口占用比例，避免超出限制：

- 定期清理对话历史
- 只包含必要的代码上下文
- 使用精简的提示词

## 常见问题

### Q: 如何获取 API Key？

A: 访问对应提供商的官网，注册账号后在控制台或设置页面获取 API Key。

### Q: 编程套餐和按量计费如何选择？

A: 
- **编程套餐**: 固定月费，适合高频使用，通常包含额外功能（如联网搜索）
- **按量计费**: 按实际使用付费，适合偶尔使用或测试

### Q: 可以同时使用多个提供商吗？

A: 可以！GCMP 支持配置多个提供商，你可以根据需要随时切换。

### Q: 如何查看详细的使用统计？

A: 在输出面板选择 `GitHub Copilot Inline Completion via GCMP` 输出通道，可查看具体运行情况和调试信息。

## 总结

GCMP 是一个功能强大、配置灵活的 VS Code 扩展，它打破了 AI 编程助手的提供商限制，让开发者能够自由选择最适合自己的 AI 模型。无论你是想使用国内大模型以获得更好的中文支持和访问速度，还是想要更灵活的模型选择和成本控制，GCMP 都是一个值得尝试的优秀工具。

