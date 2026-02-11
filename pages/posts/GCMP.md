---
title: GCMP
tags:
  - AI
categories: AI
date: 2026-02-07
updated: 2026-02-07
---

[[toc]]

::: info
Source: [GCMP](https://github.com/VicBilibily/GCMP) by [VicBilibily](https://github.com/VicBilibily)
:::
<!-- more -->

## Overview

GCMP is a Visual Studio Code extension that expands the model choices available in GitHub Copilot Chat.  
Like *Unify Chat Provider for Copilot*, it acts as a bridge between Copilot's chat experience and external LLM providers. The big difference is focus: GCMP is built around strong first-class support for Chinese-native model providers, while still supporting OpenAI/Anthropic-compatible endpoints.

If you want Copilot Chat UX but broader model access, GCMP is one of the most practical options right now.

## What GCMP Actually Solves

GitHub Copilot is excellent as a product, but model and provider flexibility can be limited depending on your region, budget, or preferred vendors. GCMP addresses that by letting you:

- Use multiple model providers inside the Copilot Chat workflow
- Bring your own API key per provider
- Add OpenAI-compatible and Anthropic-compatible custom endpoints
- Switch models quickly from the model picker without leaving VS Code

In short: same chat workflow, many more model backends.

## Built-In Provider Coverage

Based on the official repository, GCMP includes broad support for providers such as:

- Zhipu AI (GLM series)
- MiniMax
- Moonshot AI (Kimi)
- DeepSeek
- Alibaba Cloud Bailian (Qwen family)
- Volcengine Ark
- Kuaishou StreamLake
- Mthreads

It also supports compatible provider modes so you can connect third-party gateways that follow OpenAI or Anthropic API conventions.

## Installation and First Run

1. Open VS Code Extensions and install `GCMP` (`vicanent.gcmp`).
2. Open **GitHub Copilot Chat**.
3. In the model selector, choose **Manage Models**.
4. Pick a provider and configure its API key.
5. Enable your target model and start chatting.

That flow is straightforward, and it keeps everything inside VS Code's native chat panel.

## Why It Feels Powerful in Practice

### 1. Regional and provider flexibility

If your day-to-day stack includes domestic providers, GCMP removes a lot of friction. You can keep one editor workflow while choosing models that match your latency, pricing, and availability constraints.

### 2. Strong customization path

GCMP exposes advanced settings for provider overrides and compatible models. That means you can tune:

- Base URL
- Headers
- Model capabilities
- Extra request body parameters

This is especially useful when you rely on custom gateways or provider-specific options.

### 3. More than just chat

GCMP also includes:

- Inline completion modes (FIM and NES)
- Token usage statistics and status bar insights
- Context window occupancy visibility
- AI-assisted commit message generation

So it is not only "chat model switching"; it is closer to a full Copilot-side enhancement layer.

## Example Configuration Direction

You can configure model behavior through `settings.json`, for example:

```json [settings.json]
{
  "gcmp.maxTokens": 16000,
  "gcmp.editToolMode": "gpt-5",
  "gcmp.rememberLastModel": true
}
```

And for custom compatible models, GCMP supports rich provider/model definitions (including custom headers and extra body fields), which makes integration with OpenAI-compatible services much easier.

## Good Fit vs. Not a Good Fit

GCMP is a strong fit if you:

- Want to stay in Copilot Chat but use many non-default models
- Need Chinese-native providers as first-class options
- Care about deeper control over model routing and parameters

It may be overkill if you:

- Only use one provider and never switch
- Prefer a minimal setup with almost no configuration

## Final Thoughts

GCMP and Unify Chat Provider target a similar problem space: expanding Copilot's model ecosystem.  
GCMP stands out by combining broad provider support, practical regional coverage, and advanced configuration depth in a single extension.

If your workflow depends on model optionality instead of vendor lock-in, GCMP is worth trying.

## What's Next

There are also some other Vibe Coding extensions in VS Code, such as: 
 - `Cline`
 - `Roo Code`
 - `Kilo Code`

Simple Usage:

```json [API config example]
{
  "baseUrl": "https://example.com/v1",
  "apiKey": "YOUR_API_KEY"
}
```


