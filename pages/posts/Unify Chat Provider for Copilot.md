---
title: Unify Chat Provider for Copilot
tags:
  - AI
categories: AI
date: 2026-01-24
updated: 2026-02-08
---

[[toc]]

::: info
Source: [vscode-unify-chat-provider](https://github.com/smallmain/vscode-unify-chat-provider) by [SmallMain](https://linux.do/t/topic/1381609)  
This second-pass write-up follows the repository's documentation style and terminology.
:::
<!-- more -->

## Overview

Unify Chat Provider integrates multiple LLM API providers into VS Code's GitHub Copilot Chat through the Language Model API.  
The core idea is simple: keep Copilot Chat as the UI, and plug in many providers and model families behind it.

### What is it?

`vscode-unify-chat-provider` is a provider orchestration layer for Copilot Chat. It supports:

- Multiple API formats (OpenAI Chat Completions, OpenAI Responses, Anthropic Messages, Ollama Chat, Gemini)
- BYOK provider setup
- One-click provider/model onboarding
- One-click migration from other apps/extensions
- Import/export of full config state

It also includes deep provider/model parameter controls, so advanced users can tune behavior without leaving VS Code.

### Request flow

The runtime path is:

- VS Code Chat UI -> VS Code Language Model API -> Unify Chat Provider -> external model API -> streamed response in Copilot Chat

## Features (Repo-Aligned)

- Broad compatibility across major LLM API styles
- 45+ provider adaptations and 200+ built-in model recommendations (per repo docs)
- Visual provider/model management from Command Palette workflows
- Auto-fetch official model lists for supported providers
- Provider and model-level overrides (`extraHeaders`, `extraBody`, timeout, capabilities, thinking/web search options)
- Import/export support (JSON/Base64/URL/URI paths in official docs)
- Multiple provider configs and multiple variants of the same model ID via suffix strategy

## Getting Started

### Installation

1. Open VS Code.
2. Go to the Extensions marketplace.
3. Search for `Unify Chat Provider`.
4. Install the extension.

### Basic operation

The command prefix is `Unify Chat Provider:` (or `ucp:`).  
Most workflows are command-driven:

- Add provider
- Add provider from well-known list
- Import config from other applications
- Manage providers
- Refresh all providers' official models

### Quick path

1. Run `Unify Chat Provider: Add Provider From Well-Known Provider List`.
2. Choose a provider and complete auth (API key or browser login, depending on provider).
3. Save config.
4. Open Copilot Chat and select your model.

## Cookbook-Style Examples

### Add a provider quickly

Use the well-known provider list when available.  
This path is usually faster and safer than manual setup because it pre-fills API format and recommended defaults.

### Migrate from another tool

Run `Unify Chat Provider: Import Config From Other Applications`.  
The extension detects supported config files and lets you review/edit before saving.

### Manual configuration (advanced)

Manual setup requires:

- API format
- Base URL
- Auth method
- Models and capabilities

This is useful when you use a custom gateway or a provider not covered by one-click templates.

## Provider and Model Management

### Providers

- You can create multiple provider configs.
- Provider names must be unique.
- Providers can be duplicated, exported, and deleted from the management UI.

### Models

- Each provider can hold multiple models.
- Model IDs can be duplicated across different providers.
- Auto-fetch official models can be enabled per provider.
- Manual model configs can coexist with auto-fetched models.

## Parameter Controls

The repository exposes detailed controls at provider and model levels, including:

- Timeout behavior
- Model capability flags (tool calling, image input)
- Sampling parameters (temperature, top-p/top-k, penalties)
- Thinking controls
- Web search controls
- Extra headers/body injection for provider-specific needs

## Practical Notes

- This extension is best for users who want Copilot Chat UI plus broad provider flexibility.
- It is also a strong fit for users migrating from several AI coding tools into one unified VS Code workflow.
- Some cookbook scenarios in the repo include explicit ToS risk warnings (for example, account-based client impersonation flows). Read and follow those warnings carefully.

## Troubleshooting Checklist

1. Verify API key/account status.
2. Verify API base URL and selected API format.
3. Check model capability mismatches (tool calling/image input/thinking behavior).
4. Use provider/model management screens to inspect effective config.
5. Refresh official model lists if provider model metadata changed.

## License

The project is licensed under MIT.

## What's Next

There are also some other Vibe Coding extensions in VS Code, such as: 
 - `Cline`
 - `Roo Code`
 - `Kilo Code`

Simple Usage:

```json
{
  "baseUrl": "https://example.com/v1",
  "apiKey": "YOUR_API_KEY"
}
```


