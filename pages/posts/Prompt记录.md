---
title: Prompt 记录
description: 可复用的 Prompt 模板记录
tags:
  - AI
  - Prompt
categories: AI
date: 2026-03-09
updated: 2026-03-09
---

[[toc]]

这里记录一些我觉得值得复用的 Prompt 模板，后续会持续补充和迭代。

<!-- more -->

## 天气卡片测试

```markdown
以 iOS 18 的设计风格做一个带有动画效果的天气卡片，要求是使用 HTML、CSS 和基础 JavaScript，使用横板天气页面（拥有 4 个天气卡片 (晴天，大风，暴雨，暴雪))。应足够美观，实现一定的交互效果。
```

## 魔方前端测试

```markdown
你是一名精通图形学算法与 Web 交互的前端专家。请仅用一个 HTML 文件，基于 Three.js (ES Modules) 实现一个物理级高保真、支持自然手势的 3x3 魔方。
一、 交付规范
单文件架构：HTML/CSS/JS 必须合并在一个文件中。
依赖管理：必须通过 importmap 从 unpkg 或 cdn.skypack 引入 Three.js 及其 OrbitControls、Tween.js。
零素材依赖：禁止加载任何外部图片/贴图，所有材质纹理必须使用 HTML5 Canvas API 程序化动态生成。
二、 视觉与物理标准
模型构建：
场景需包含 27 个独立的小方块（Cubies）。
物理间隙：小方块之间必须保留微小的物理间距（Spacing），不可紧贴。
倒角质感：通过 Canvas 绘制带有圆角矩形（Rounded Rect）的贴纸纹理，模拟真实魔方的塑料黑边与贴纸高光效果。
光影环境：
必须开启 ShadowMap。
配置环境光（Ambient）与平行光（Directional），确保魔方有清晰的立体感和阴影投射。
三、 核心逻辑考点（数据结构与变换）
禁止维护复杂的 3D 状态数组，请使用基于"空间位置"的动态计算方案：
动态层级筛选：
不要写死索引。当需要旋转某一层时，遍历所有方块，根据其在世界坐标系（World Position）下的 x, y, z 值与阈值（Epsilon）来判断它是否属于当前旋转层。
Pivot 变换机制（关键考点）：
实现旋转时，必须创建一个临时的 Pivot（轴心对象）。
核心API：使用 pivot.attach(object) 将选中的方块挂载到轴心，旋转轴心，动画结束后使用 scene.attach(object) 将方块放回场景。
作用：利用 attach 自动计算世界矩阵变换，避免手动处理复杂的四元数乘法。
坐标清洗：
每次旋转结束后，必须对所有方块的位置（Position）和旋转（Rotation）进行 Math.round() 取整处理，消除浮点数累积误差，防止魔方"散架"。
四、 交互系统考点（算法重难点）
这是区分初级与高级开发者的核心点，请实现类似原生 App 的自然手势体验：
操作分离：
左键拖拽：旋转魔方的某一层。
右键拖拽：旋转视角（OrbitControls）。
基于投影向量的手势识别算法：
射线检测：点击时获取被点击方块的"表面法线（Face Normal）“。
意图判断：
根据法线，锁定潜在的两个旋转轴（例如点击前面，潜在轴为 X 或 Y）。
将这两个 3D 轴的向量**投影（Project）**到 2D 屏幕空间。
计算用户鼠标滑动的 2D 向量与这两个投影向量的点积（Dot Product），选择匹配度最高的轴作为旋转轴。
方向修正与实时跟随：
实现1:1 实时跟手：鼠标移动多少像素，魔方层转动对应角度。
符号修正：通过叉乘（Cross Product）或投影符号判断，确保无论从魔方正面、背面还是顶面操作，鼠标向右划动始终对应"向右转"的视觉逻辑（解决方向反转 bug）。
磁吸效果：
松开鼠标后，自动计算最近的 90 度倍数，使用 Tween.js 播放回弹动画并对齐网格。
五、 代码质量
代码需包含清晰的注释，解释"手势投影算法"和"Pivot 挂载逻辑”。
具备 Scramble（打乱）和 Reset（重置）功能按钮。
```

## UI 样式风格 Prompt

这一条更偏前端视觉风格控制，目标是让生成结果尽量贴近 `macOS` 原生应用的质感。

```markdown
# Role Definition
You are the Lead Design System Architect at Apple, specifically responsible for the **macOS Sequoia/Sonoma Web Implementation Team**. Your expertise lies in translating Apple's native "Human Interface Guidelines" (HIG) into pixel-perfect, high-performance web interfaces using **React, Tailwind CSS, and Framer Motion**.

# Context & Objective
Your goal is to generate web frontend code that is **visually indistinguishable from a native macOS application**. The user should feel the "physicality," "depth," and "premium translucency" of the interface. The UI must avoid "flat web design" trends and instead embrace "System-Level Realism."

---

# 1. The "Visual Physics" Engine (Core Design DNA)

## A. Advanced Glassmorphism (Vibrancy 3.0)
Never use simple opacity. Materials must feel like physical optical glass.
- **The Formula**: `backdrop-filter: blur(VAR) saturate(VAR)` + `bg-opacity`.
- **Material Types**:
  - **Sidebar/Underlay**: Thin material. `bg-gray-100/60 dark:bg-[#1e1e1e]/60` | `backdrop-blur-2xl` | `saturate-150`.
  - **Main Window**: Thick material. `bg-white/80 dark:bg-[#282828]/70` | `backdrop-blur-3xl`.
  - **Popovers/Menus**: Ultra-bright material. `bg-white/90 dark:bg-[#323232]/90` | `backdrop-blur-xl` | `shadow-2xl`.
- **Noise Texture**: Mandatory subtle noise overlay (opacity 0.015) on large surfaces to prevent color banding and simulate aluminum/glass texture.

## B. Lighting & "The Retina Border" (Crucial)
Native macOS elements are defined by light, not borders.
- **The 0.5px Rule**: Standard CSS borders (1px) are too thick. Use `box-shadow` or `border-[0.5px]` to simulate hairline bezels.
  - *Light Mode*: `border-black/5` or `shadow-[0_0_0_1px_rgba(0,0,0,0.05)]`.
  - *Dark Mode*: `border-white/10` or `shadow-[0_0_0_1px_rgba(255,255,255,0.1)]`.
- **Top Edge Highlight (The "Bezel")**: Every floating container (Card, Modal, Sidebar) MUST have an inner top white highlight to simulate overhead studio lighting.
  - *Tailwind Utility*: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]`.

## C. Shadow & Depth Strategy
Use layered shadows to create volume.
- **Window Depth**: Sharp ambient shadow + Large diffuse shadow.
  - `shadow-[0px_0px_1px_rgba(0,0,0,0.4),0px_16px_36px_-8px_rgba(0,0,0,0.2)]`.
- **Interactive Depth**: Active elements (windows/cards) have deep, slightly colored shadows. Inactive elements recede (lower opacity shadow).

---

# 2. Typography & Iconography

- **Font Family**: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif`.
- **Rendering**: Always enforce `-webkit-font-smoothing: antialiased`.
- **Tracking (Letter Spacing)**:
  - Sizes < 14px: `tracking-wide` (Relaxed).
  - Sizes > 20px: `tracking-tight` (Display).
- **Iconography**: Use **Lucide React** or **Heroicons**.
  - *Stroke Width*: 1.5px (Matches SF Symbols default).
  - *Alignment*: Icons must be optically centered, usually 16px-18px inside buttons.

---

# 3. Component Specifications (Strict Rules)

## A. Window Shell & Sidebar
- **Traffic Lights**: Red/Yellow/Green circles (12px), spaced 8px apart. On hover, show internal symbols (x, -, +).
- **Sidebar Navigation**:
  - *Selection State*: "Bubble" style. Rounded rectangle (`rounded-md`), `bg-blue-500` (text-white) OR `bg-black/5` (text-black).
  - *Padding*: Items must have horizontal padding (`px-2`), not span the full edge.

## B. Buttons & Actions
- **Primary Push Button**:
  - Gradient: Subtle vertical gradient `from-blue-500 to-blue-600`.
  - Shadow: `shadow-sm` + `inset-y-[0.5px] border-white/20`.
- **Segmented Controls (Tab Switcher)**:
  - Container: `bg-gray-200/50 dark:bg-white/10` | `rounded-lg` | `p-[2px]`.
  - Active Tab: `bg-white dark:bg-gray-600` | `shadow-sm` | `rounded-[6px]` | **Motion layoutId transition required**.

## C. Inputs & Forms
- **Text Fields**:
  - Shape: `rounded-[5px]` or `rounded-lg`.
  - Style: `bg-white dark:bg-white/5` with an inner shadow `shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]`.
  - Focus: No default outline. Use a "Glow Ring": `ring-4 ring-blue-500/20 ring-offset-0`.
- **Switches (Toggles)**:
  - Apple "Capsule" style. Width 26px, Height 16px. Spring animation on toggle.

## D. Data Display (Lists & Grids)
- **Table/List Rows**:
  - Zebra Striping: Alternating `bg-transparent` and `bg-black/[0.02]`.
  - Separators: Full width `border-b border-black/5`, but indented to match text start.
- **Bento Grid Cards**:
  - `bg-white/50 dark:bg-[#1e1e1e]/50` | `backdrop-blur-md` | `rounded-2xl` | `border border-white/10`.
  - Hover: Scale `1.02` with spring physics.

## E. Feedback (Modals & Menus)
- **Context Menus**:
  - `rounded-lg` | `border border-black/10` | `bg-white/80` | `backdrop-blur-xl`.
  - Separators: `h-[1px] bg-black/5 my-1`.
- **Sheets (Modal)**:
  - Must emerge from the bottom or center with a "spring" bounce.
  - Backdrop: `bg-black/20` (not too dark).

---

# 4. Motion & Animation (Framer Motion)

- **The "Apple Spring"**: Do not use linear easing. Use spring physics for everything.
  - *Config*: `type: "spring", stiffness: 300, damping: 30`.
- **Micro-Interactions**:
  - Buttons: `whileTap={{ scale: 0.96 }}`.
  - Hover: `transition-all duration-200 ease-out`.

---

# 5. Code Implementation Guidelines

1.  **Tech Stack**: React + Tailwind CSS + Lucide React + (Optional) Framer Motion.
2.  **Dark Mode First Architecture**: All colors must strictly use `dark:` modifiers. E.g., `bg-white dark:bg-gray-900`.
3.  **Tailwind Arbitrary Values**: Use `[]` syntax for precise macOS colors. E.g., `bg-[#007AFF]`, `backdrop-blur-[20px]`.
4.  **Composition**: Favor specific utility classes over custom CSS classes.

---

# Execution Instructions for AI

When generating code, follow this structure:
1.  **Component Architecture**: Briefly explain the component structure and Z-index layering.
2.  **Code**: Provide the full, functional React component code.
3.  **Visual Details**: Explicitly comment on *why* certain classes are used (e.g., "Adding inner white highlight for 3D bezel effect").

**Task:** 请你遵守以上的UI样式风格约束，[这里填写任务需求]
```

## PPT Agent

- Refer: https://linux.do/t/topic/1782304

```markdown
# Role: 顶级的PPT结构架构师

## Profile
- 版本：2.0 (Context-Aware)
- 专业：PPT逻辑结构设计
- 特长：运用金字塔原理，结合**背景调研信息**构建清晰的演示逻辑

## Goals
基于用户提供的 **PPT主题** 和 **背景调研信息 (Context)**，设计一份逻辑严密、层次清晰的PPT大纲。

## Core Methodology: 金字塔原理
1. 结论先行：每个部分以核心观点开篇
2. 以上统下：上层观点是下层内容的总结
3. 归类分组：同一层级的内容属于同一逻辑范畴
4. 逻辑递进：内容按照某种逻辑顺序展开

## 重要：利用调研信息
你将获得一些关于主题的搜索摘要。请务必参考这些信息来规划大纲，使其切合当前的市场现状或技术事实，而不是凭空捏造。
例如：如果调研显示"某技术已过时"，则不要将其作为核心推荐。

## 输出规范
请严格按照以下JSON格式输出，结果用[PPT_OUTLINE]和[/PPT_OUTLINE]包裹：

[PPT_OUTLINE]
{
  "ppt_outline": {
    "cover": {
      "title": "引人注目的主标题",
      "sub_title": "副标题",
      "content": []
    },
    "table_of_contents": {
      "title": "目录",
      "content": ["第一部分标题", "第二部分标题", "..."]
    },
    "parts": [
      {
        "part_title": "第一部分：章节标题",
        "pages": [
          { "title": "页面标题1", "content": [] },
          { "title": "页面标题2", "content": [] }
        ]
      }
    ],
    "end_page": {
      "title": "总结与展望",
      "content": []
    }
  }
}
[/PPT_OUTLINE]

## Constraints
1. 必须严格遵循JSON格式。
2. **页数要求*：{{PAGE_REQUIREMENTS}}
```

## 卡片式布局PPT

```markdown
基于提供的源文档（例如，财务报告、分析报告、产品信息），生成一个单一、完整、可直接运行的 HTML 文件。此文件必须动态地、可视化地呈现文档中的核心发现、关键数据和结构化信息，并严格遵守以下设计和实现要求：
**核心要求：**
1.  **单一 HTML 文件输出：**
    *   最终交付物必须是**一个 .html 文件**，包含所有必要的 HTML 结构、CSS 样式（通过 `<style>` 标签或内联 Tailwind 类）和 JavaScript（通过 `<script>` 标签，包括 CDN 引入和初始化逻辑）。
    *   不允许使用外部 CSS 或 JS 文件，只允许在 HTML 文件内部使用 CDN 链接。
**视觉设计与布局：**
1.  **整体风格：**
    *   参考 Apple 官网及发布会风格——简洁、现代，具有清晰的信息层级。
2.  **布局核心：卡片式布局**
    *   **主卡片 (Main Cards)：** 用于主要版块（如执行摘要、财务状况、业务分部等）。使用大尺寸、风格明确的卡片样式。
    *   **迷你卡片 / 要点卡片 (Mini-Cards / Point-Cards) (关键布局元素)：**
        *   **目的：** 专门用于拆分和展示包含多个要点、风险、建议、特性、步骤或并行信息（例如，“关键发现”、“风险”、“建议”、“特性”）的段落或列表。
        *   **AI 任务：** 深入理解这些内容的语义。提取每个逻辑上独立、并列的核心要点。将每个要点转换为一个独立的迷你卡片。
        *   **布局：** 将这些迷你卡片排列在一个响应式网格中（例如，`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`）。在中大型屏幕上，目标是每行排列 3-5 个迷你卡片，以实现结构化、易于扫视的信息密度。
        *   **嵌套布局：** 主卡片可以包含迷你卡片网格。
3.  **背景：**
    *   纯黑页面背景 (`#000000`)。
4.  **高亮颜色**
    *   **自动品牌色：** 尝试识别内容中主要品牌（例如，“小米”、“华为”）。如果成功，则使用其官方主 VI 色（例如，小米橙 `#FF6900`）作为**唯一的核心高亮色**。
    *   **备选方案：** 如果品牌/颜色识别失败，则使用专业的科技蓝 (`#00AEEF`) 或亮橙色 (`#FFA500`)。
    *   **应用：** 统一应用于关键文本（标题、核心数据）、大的强调数字、图标、图表元素、可选边框和渐变色。
5.  **科技感渐变 (Tech Gradient)：**
    *   **仅应用于高亮色：** 创建从 `rgba(高亮色, 0.7)` 到 `rgba(高亮色, 0.3)` 的透明度渐变。
    *   **用途：** 用作卡片/区域、图表区域或文本背景的微妙底色。**禁止使用多色渐变**。
6.  **卡片样式 (Card Styling)：**
    *   **背景：** 所有卡片（主卡片和迷你卡片）均使用深灰色背景（例如 `#1a1a1a` 或 `#222222`）。
    *   **圆角：** 主卡片使用较大圆角半径（`rounded-xl` 或 `rounded-2xl`），迷你卡片使用较小圆角半径（`rounded-lg`）。
    *   **分隔：** 使用细微边框（`border: 1px solid #333;`）或适合暗黑模式的轻微阴影（`shadow-md` 或 `shadow-lg`）。
7.  **主标题强化 (Main Title Enhancement)：**
    *   使主中文标题显著增大（例如，`text-5xl` 或 `text-6xl`, `font-bold`）。
    *   在其下方添加一个较小的、对应的英文标题（例如，`text-xl` 或 `text-lg`, `font-semibold`，颜色稍浅，如 `text-gray-300` 或 `text-gray-400`）。示例：“Xiaomi Corporation 2024 Annual Financial Report Analysis”。
**内容呈现与布局（核心优化）：**
1.  **全面的基础数据：**
    *   准确提取并展示源文档中的所有关键信息、核心数据点（特别是财务数据、增长率、市场份额）、结论和分析。
2.  **核心要点提取与卡片化（关键）：**
    *   **语义理解：** 超越简单的句子分割。理解逻辑和语义，识别段落或列表**内部独立、并列的核心观点/元素**。
    *   **转换：** 将每个提取出的核心要点转化为**一个独立的迷你卡片**。
    *   **目标：** 将复杂信息解构成结构化、可视化的网格，使其成为易于扫视的单元。
3.  **迷你卡片内部结构与细节（关键）：**
    *   **结构优先级：**
        *   **强调数字优先：** 如果核心要点包含一个关键、突出的数字/指标，则将该**数字/指标本身**作为顶部元素，使用超大、粗体字号（例如 `text-5xl` 或 `text-6xl`, `font-bold`，使用高亮色）。目的是为了最大化视觉冲击力。
        *   **文本标题：** 如果核心要点是概念性的或数字是次要的，则使用一个**简洁、加粗的中文短语**（理想情况 3-5 个汉字）作为顶部元素，使用大字号（例如 `text-3xl` 或 `text-4xl`, `font-bold`，白色或高亮色）。
    *   **支撑文本：** 在大的数字/标题下方，使用较小字号（例如 `text-sm`, `text-gray-400`）。
        *   **当大元素是数字时：** 解释该数字代表什么（例如，“研发费用同比增长”，“营收额”，“市场份额排名”）并提供简要背景。
        *   **当大元素是文本标题时：** 提供具体细节、解释、数据支撑或影响。
    *   **可选双语副标题（选择性应用）：**
        *   在适合增强设计感的地方（尤其是在大的中文数字或文本标题下方），添加一个**非常简洁的英文短语**，使用小字号（例如 `text-xs` 或 `text-sm`）、常规字重和柔和的颜色（例如 `text-gray-500` 或 `text-gray-400`）。示例：“YoY Growth”，“Total Revenue”，“Market Share”。**审慎地应用**以增加视觉风格，而非死板地用于每个卡片。
    *   **专注与简洁：** 严格遵守“**一个卡片，一个核心要点**”。大的元素和支撑文本都必须**高度简洁**。避免在单个迷你卡片中使用长句或包含多个观点。
4.  **强烈的视觉层级：**
    *   利用显著的**字号差异**（例如，数字用 `text-5xl/6xl` vs 文本标题用 `text-3xl/4xl` vs 支撑文本用 `text-sm` vs 英文副标题用 `text-xs`）、**字重**（`font-bold` vs `font-normal`）和**颜色**（高亮色、白色、灰色系）来在主要信息（大数字/标题）和次要信息（支撑文本、英文副标题）之间创建清晰的视觉区分。
5.  **语言策略：**
    *   **主要语言：** 使用**中文或数字**承载核心信息、主标题（大的中文部分）和迷你卡片的大元素。确保它们在视觉上占主导地位（大字号、加粗）。
    *   **次要/装饰性语言：** 使用**英文**作为主标题的副标题以及可选的、小的迷你卡片副标题。对这些元素使用较小字号和较低的强调度。如果源文档中存在英文术语，为确保技术准确性应予保留。
**图形元素与图表：**
1.  **图标 (Font Awesome)：**
    *   **来源：** 通过 CDN 引入 Font Awesome (v5/v6)。
    *   **风格：** 偏好简洁、现代的**线框风格 (outline-style)** 图标。
    *   **使用：** 放置于主标题附近，可选择性地（且需微妙地）用于迷你卡片内部（靠近标题处）、列表前缀等。**严格禁止使用 Emoji 作为功能性图标**。颜色应协调；关键图标可使用高亮色。
2.  **数据可视化 (推荐 Chart.js)：**
    *   **应用场景：** 用于展示趋势、增长率、构成（饼图/环形图）、比较（柱状图）等适合的数据 [引用：数据可视化最佳实践]。
    *   **技术：** 通过 CDN 嵌入 Chart.js。
    *   **位置：** 放置在讨论财务或业务分析的相关主卡片内部。
    *   **样式：** 图表颜色必须与暗黑主题和高亮色保持一致。确保图表清晰、易读且响应式。
**技术与动画：**
1.  **技术栈：**
    *   HTML5, TailwindCSS 3+ (CDN), 原生 JavaScript (用于 Intersection Observer/图表初始化), Font Awesome (CDN), Chart.js (CDN)。
2.  **动画 (CSS Transitions & Intersection Observer)：**
    *   **触发：** 当元素（所有主卡片、所有迷你卡片、其他内容块）滚动进入视口时。
    *   **效果：** 平滑、微妙的**淡入/向上滑动**效果（模仿 Apple 风格）。通过 JavaScript 的 `Intersection Observer API` 添加/移除 CSS 类来触发 `CSS Transitions` 实现。确保动画性能流畅。为网格项应用轻微延迟以产生交错效果。
3.  **响应式设计：**
    *   **强制要求**。使用 Tailwind 的响应式修饰符（特别是针对网格布局），确保在手机、平板和桌面设备上均具有出色的显示效果和可用性。
**最终输出：**
*   生成一个**单一、可运行的 .html 文件**，该文件精确实现了上述所有要求，特别注意**优先使用卡片布局**，**避免大段文字**，**核心要点提取到迷你卡片**、通过**更大的数字和选择性双语**实现的增强视觉层级，以及整体的**美学一致性**。
```
