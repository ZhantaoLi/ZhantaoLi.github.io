---
title: AI Vocabulary
description: AI 概念与术语整理
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

词元，AI 模型处理文本的基本单位，可以是单词、子词或字符。

## Embedding（嵌入）

将文本转换为数值向量的技术，用于捕捉语义信息，是 RAG 等技术的基础。
embedding model

## Reranking（重排序）

在 RAG 中，模型生成多个候选响应后，对它们进行评估和排序，以选择最相关的结果。

## Chain-of-Thought（思维链）

让 AI 模型逐步推理的提示技术，通过展示中间步骤提高复杂问题的解决能力。

## Agent Orchestration（代理编排）

协调多个 AI Agent 协同工作的机制，实现数据和洞察的实时共享。

## Temperature

控制 AI 模型输出随机性的参数。较高温度值（如 0.8）会产生更随机的输出，较低值（如 0.2）则更确定性。

---


1. 输入层（Input Layer）

接收原始图像数据，图像通常被表示为一个三维数组，其中两个维度代表图像的宽度和高度，第三个维度代表颜色通道（例如，RGB图像有三个通道）。

2. 卷积层（Convolutional Layer）

用卷积核提取局部特征，如边缘、纹理等。

公式：

$$ y[i,j] = \sum_{m=0}^{M-1} \sum_{n=0}^{N-1} x[i+m, j+n] * k[m,n] + b $$

x：输入图像。
k：卷积核（权重矩阵）。
b：偏置。
应用一组可学习的滤波器（或卷积核）在输入图像上进行卷积操作，以**提取局部特征**。

每个滤波器在输入图像上滑动，生成一个特征图（Feature Map），表示滤波器在不同位置的激活。

卷积层可以有多个滤波器，每个滤波器生成一个特征图，所有特征图组成一个特征图集合。

3. 激活函数（Activation Function）
通常在卷积层之后应用非线性激活函数，如 ReLU（Rectified Linear Unit），以**引入非线性特性**，使网络能够学习更复杂的模式。

ReLU 函数定义为 ：f(x)=max(0,x)，即如果输入小于 0 则输出 0，否则输出输入值。
Sigmoid : f(x)=1/(1+exp(-x))，将输入映射到 (0,1) 区间。
Tanh : f(x)=(exp(x)-exp(-x))/(exp(x)+exp(-x))，将输入映射到 (-1,1) 区间。

4. 池化层（Pooling Layer）

**下采样**(Subsampling)
用于降低特征图的空间维度，减少计算量和参数数量，同时保留最重要的特征信息。
最常见的池化操作是最大池化（Max Pooling）和平均池化（Average Pooling）。
最大池化选择区域内的最大值，而平均池化计算区域内的平均值。

5. 归一化层（Normalization Layer，可选）

例如，局部响应归一化（Local Response Normalization, LRN）或批归一化（Batch Normalization）。
这些层有助于加速训练过程，提高模型的稳定性。

6. 全连接层（Fully Connected Layer）

在 CNN 的末端，将前面层提取的特征图展平（Flatten）成一维向量，然后输入到全连接层。
全连接层的每个神经元都与前一层的所有神经元相连，用于综合特征并进行最终的分类或回归。

7. 输出层（Output Layer）

根据任务的不同，输出层可以有不同的形式。

对于分类任务，通常使用 Softmax 函数将输出转换为概率分布，表示输入属于各个类别的概率。

8. 损失函数（Loss Function）

用于衡量模型预测与真实标签之间的差异。

常见的损失函数包括**交叉熵损失**（Cross-Entropy Loss）用于多分类任务，**均方误差**（Mean Squared Error, MSE）用于回归任务。

9. 优化器（Optimizer）

用于根据损失函数的梯度**更新网络的权重**。常见的优化器包括随机梯度下降（SGD）、Adam、RMSprop等。

10. 正则化（Regularization，可选）

包括 Dropout、L1/L2 正则化等技术，用于**防止模型过拟合**。

这些层可以堆叠形成更深的网络结构，以提高模型的学习能力。

CNN 的深度和复杂性可以根据任务的需求进行调整。
