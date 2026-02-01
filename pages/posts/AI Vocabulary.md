---
title: AI Vocabulary
tags:
 - AI
categories: AI
date: 2026-01-31
updated: 2026-02-01
---

本文整理了 AI Agent 领域的核心概念和术语，帮助理解当前 AI 技术的发展趋势。

<!-- more -->

## AI Agent（AI 代理）

AI Agent 是一种能够感知环境、做出决策并执行行动以实现特定目标的自主系统。与简单的生成式 AI 不同，AI Agent 能够：

- 执行复杂的多步骤任务
- 与第三方系统交互
- 在最少人工干预下朝着长期目标工作
- 具备推理、规划和记忆能力

## Agentic AI（代理式 AI）

Agentic AI 是指利用 AI Agent 自主完成任务的 AI 类型。2025 年被认为是 Agentic AI 的关键发展年，AI 正从简单的聊天机器人向能够自主行动的"代理系统"转变。

## Agent Skills（代理技能）

Agent Skills 是 GitHub Copilot 引入的概念，指增强 AI 助手能力的专门功能模块。Agent Skills 本质上是包含指令、脚本和资源的文件夹，Copilot 可以加载这些内容来执行特定的、可重复的任务。

**主要特点：**

- **领域定制**：可针对特定领域任务进行定制
- **可复用性**：创建可重复使用的能力，减少重复工作
- **自动激活**：Copilot 根据用户提示自动激活相关技能
- **工作流组合**：可组合多个技能构建复杂工作流

**核心能力包括：**

- 代码生成与重构
- 自动生成文档
- 代码库分析与理解
- 自主任务执行
- 工作流自动化

> 参考：[GitHub Copilot Agent Skills](https://docs.github.com/zh/copilot/concepts/agents/about-agent-skills)

## MCP（Model Context Protocol）

MCP，全称为 Model Context Protocol，即模型上下文协议。是 Anthropic 在 2024 年 11 月推出的一种开放标准协议，旨在为大型语言模型 (LLMs) 与外部数据源、工具和服务之间建立标准化的交互框架，就像是 AI 领域的"通用插头"或"USB-C 接口"。

其核心目标是解决 AI 模型与实时数据、外部系统连接时的"信息孤岛"和"集成碎片化"问题，让 AI 不仅能生成文本，还能安全、高效地访问和操作外部资源。

### 核心组件

MCP 采用客户端-服务器（Client-Server）架构：

- **MCP Host（宿主应用）**：运行 AI 模型的应用环境，如 Claude Desktop、Cursor IDE、Cherry Studio 等
- **MCP Client（客户端）**：集成在 Host 中的模块，负责与 MCP Server 建立连接并管理通信
- **MCP Server（服务器）**：轻量级服务，提供对特定数据源或工具的标准化访问

### Server 提供的三类功能

- **Resources（资源）**：结构化的数据来源，如文件、数据库记录或 API 响应
- **Tools（工具）**：执行外部操作的功能，如发送邮件、查询数据库
- **Prompts（提示）**：预定义的指令模板，用于优化任务执行

> 参考：[Model Context Protocol](https://modelcontextprotocol.io/)

## Function Calling（函数调用）

Function Calling（也称 Tool Calling）是让 LLM 能够可靠地连接和使用外部工具或 API 的机制。

**工作流程：**

1. 用户提供自然语言请求
2. LLM 分析请求，判断是否需要外部操作
3. LLM 生成结构化输出（通常是 JSON），指定要调用的函数和参数
4. 外部应用执行实际的函数调用
5. 结果返回给 LLM，生成最终响应

> 注意：LLM 本身不执行函数，只是识别需要的工具并请求执行。

## RAG（Retrieval-Augmented Generation）

RAG，即检索增强生成，是一种优化 LLM 输出的 AI 框架。它允许模型在生成响应前，从外部知识库检索相关信息，而非仅依赖训练数据。

**核心优势：**

- 减少"幻觉"（生成虚假信息）
- 提供实时、最新的信息
- 响应更准确、更具上下文相关性

**Agentic RAG** 是 2025 年的重要趋势，AI Agent 动态、智能地利用 RAG 作为工具之一，实现更复杂的任务处理。

## Multi-Agent System（多代理系统）

多个 AI Agent 在共享环境中交互、协作的框架，用于完成复杂任务。

## Context Window（上下文窗口）

AI 模型的"短期记忆"，指模型一次能处理的最大 token 数量。

## Prompt Engineering（提示工程）

设计和优化输入提示的技术，以获得 AI 模型更好的输出结果。

## Hallucination（幻觉）

AI 模型生成看似合理但实际上虚假或不准确信息的现象。

## Fine-tuning（微调）

在预训练模型基础上，使用特定数据集进行额外训练，使模型适应特定任务或领域。

## Token

AI 模型处理文本的基本单位，可以是单词、子词或字符。

## Embedding（嵌入）

将文本转换为数值向量的技术，用于捕捉语义信息，是 RAG 等技术的基础。

## Chain-of-Thought（思维链）

让 AI 模型逐步推理的提示技术，通过展示中间步骤提高复杂问题的解决能力。

## Agent Orchestration（代理编排）

协调多个 AI Agent 协同工作的机制，实现数据和洞察的实时共享。

## Temperature

控制 AI 模型输出随机性的参数。较高温度值（如 0.8）会产生更随机的输出，较低值（如 0.2）则更确定性。
