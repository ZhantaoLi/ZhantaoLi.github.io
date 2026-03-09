---
title: Skills 记录
tags:
  - AI
  - Skills
categories: AI
date: 2026-03-09
updated: 2026-03-09
---

# Skills 记录

[[toc]]

这篇主要整理我最近看到的一批值得关注的 Skill 来源，方便后续回看、补装和二次研究。

<!-- more -->

## 01. Anthropic 官方 Skill 合集

**地址**：https://github.com/anthropics/skills/tree/main/skills

去年11月刚推出 Skill 时发布的12个官方 Skill。 非常适合用来理解 Skill 的基础结构和使用场景。

**两个例子仔细看：**

*   **skill-creator**：创建 Skill 的 Skill，后续自己制作时必用。
    
*   **docx/pptx/excel**：怎么读写 Office 三件套。
    

## 02. skills.sh

**地址**：https://skills.sh/

Vercel 官方推出的 Skill 超市，质量很高，安装更方便。 不仅方便搜索，最主要是有 Trending 可以查看趋势。

比如，想使用 SEO Audit，输入关键字，进入详情页，复制命令，在命令行执行即可。

_注：_`_npx_` _命令需要先安装 Node.js。_

这个命令会把 Skill 保存在单独的目录，同时通过 link 的方式引用到各个工具的目录下。

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills       # 搜索技能的技能
npx skills add https://github.com/coreyhaines31/marketingskills --skill seo-audit
```

不得不说，Vercel 在开发者体验方面做得确实不错。 **应该作为广撒网搜 Skill 的首选地。**

## 03. skillsmp

**地址**：https://skillsmp.com/zh

号称收录了8w多个 Skill，数量最多，但重复度和质量比较宽松，可以作为一个补充。 进到详情后，点击可以跳转到 GitHub 原网页查看详细说明，再使用。 看情况是主动收集的 GitHub 上所有的 Skill 整理而成的。

## 04. Superpowers

**地址**：https://github.com/obra/superpowers

一位资深开发者创建的用于开发的最佳实践 Skill 合集。 **值得学习的是他的开发工作流——头脑风暴，先问清楚再开工。**

与 Claude Code 适配比较深，在 OpenCode 也可以用。 OpenCode 里我推荐新建一个 Agent，专门允许使用它的 Skill 们，和 `oh-my-opencode` 的 Sisyphus 隔离开，因为功能有重叠。

## 05. Coze 技能商店

**地址**：https://www.coze.cn/skills

更日常，偏向生产力、内容创作等方向的 Skill。 适合用来解决日常问题和提升个人效率。

里面有各路 AI 自媒体大佬的作品，例如花叔、苍何等。 **可以近距离围观大佬是怎么用 Skill 的。**

## 06. Claude 编程大赛冠军的 Claude Code 配置

**地址**：https://github.com/affaan-m/everything-claude-code

Claude Code 的深度玩家，夺得了在纽约举办的 Anthropic x Forum Ventures 黑客松冠军。 在积累了海量实战经验后，他整理出了一套顶级配置指南，完全开源。

**不仅仅是 Skill，是全面的 Claude Code 配置。** 也许是一套 `oh-my-claudecode` 的配置，非常适合深度开发者使用，尤其是深度拥抱 AI 的独立开发者。

Skill 里面的 `continuous-learning` 值得注意，可以实现 Skill 的个性化进化。 **这才是 Skill 的正确用法：公开的 Skill 只是参考，属于你自己的才真有用。**


推荐：
npx skills add https://github.com/vercel-labs/skills --skill find-skills
[Superpowers](https://github.com/obra/superpowers)
---

学用 Skill 第一阶段，从这些出发就够了。 熟练使用后，下一阶段就是制作自己专属的 Skill。

