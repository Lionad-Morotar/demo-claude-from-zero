---
seo:
  title: Claude From Zero
  description: 从零开始掌握 Claude Code：AI 编程完全指南。面向中文开发者的 Claude Code 实战手册。
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
从零开始掌握 [Claude Code]{.text-gradient-flow}

#description
一本面向中文开发者的 AI 编程完全指南。覆盖认识、安装、上手、核心功能、进阶配置、实战开发与心法层 —— 把 Claude Code 真正变成你日常工作的一部分。

#links
  :::u-button
  ---
  to: /intro/what-is-claude-code
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  开始阅读
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/Lionad-Morotar/demo-claude-from-zero
  target: _blank
  ---
  在 GitHub 查看
  :::

#default
  :::prose-pre
  ---
  code: |
    # CLAUDE.md
    - 优先使用 TypeScript + Vue 举例
    - 测试用 Vitest，禁止简化
    - Commit 信息使用中文
    - 输出风格：祈使语气、直接纠错
  filename: CLAUDE.md
  ---

  ```md [CLAUDE.md]
  # CLAUDE.md
  - 优先使用 TypeScript + Vue 举例
  - 测试用 Vitest，禁止简化
  - Commit 信息使用中文
  - 输出风格：祈使语气、直接纠错
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
完整七章+附录 · 从认知到实战

#description
本书按照学习路径划分为七章，外加一份附录速查。每一章都是独立的知识闭环，也可以按顺序读完构建完整图景。

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /intro/what-is-claude-code
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  从第 1 章开始
  :::

#default
:chapter-path
::

::u-page-section{class="dark:bg-neutral-950"}
#title
为什么是这本书

#features
  :::u-page-feature
  ---
  icon: i-lucide-languages
  ---
  #title
  中文优先

  #description
  完全用中文思维写就。术语首次出现时附英文原文（中文（English）），让你不会在英文术语和中文叙述之间反复切换。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-target
  ---
  #title
  实战导向

  #description
  每一章都配套真实场景与可运行的代码示例，从「Claude Code 能做什么」直接跳到「我要怎么用 Claude Code 做完它」。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-brain
  ---
  #title
  心法层独立成章

  #description
  Prompt 设计、上下文管理、安全边界、Boris Cherny 的实战经验 —— 这些「软实力」单独成章，不被工具细节淹没。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-bot
  ---
  #title
  AI 友好

  #description
  自带 LLMs.txt、/raw/*.md 端点和「在 Claude / ChatGPT 中打开」按钮 —— 让 AI 能直接抓取整本书做你的助教。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-branch
  ---
  #title
  开源持续更新

  #description
  全文托管在 GitHub，Claude Code 生态变化时本书同步迭代。每页都有「编辑此页」按钮，欢迎 PR。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  全文搜索 + 章节速查

  #description
  按 ⌘K 全文检索任意关键词，附录章节预置常用命令、AI 术语、资源链接速查表。
  :::
::

::div{class="relative overflow-hidden isolate bg-[#F5F2ED]"}
  :claude-backdrop

  ::u-page-section{class="relative z-10 bg-transparent"}
    :::u-page-c-t-a
    ---
    links:
      - label: 开始阅读
        to: '/intro/what-is-claude-code'
        trailingIcon: i-lucide-arrow-right
      - label: 在 GitHub 查看源码
        to: 'https://github.com/Lionad-Morotar/demo-claude-from-zero'
        target: _blank
        variant: subtle
        icon: i-simple-icons-github
    title: 准备好让 Claude Code 进入你的日常工作流了吗？
    description: 加入数千名正在用 AI 改变开发方式的中文开发者 —— 从今天起，开始你的 Claude Code 旅程。
    class: bg-transparent text-stone-900 !ring-0 shadow-none cta-clean
    ---
    :::
  ::
::
