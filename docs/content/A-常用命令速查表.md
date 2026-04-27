---
title: 常用命令速查表
date: 2026-04-26
---

# 常用命令速查表

> 本附录是 **Claude Code 日常操作的速查表**，覆盖 CLI 启动参数、会话内 Slash 命令、键盘快捷键、`settings.json` 关键配置、Hooks 事件、CLAUDE.md / Skills / MCP 标准结构、对话模式与故障排查。
>
> **使用方式**：本文档不需要从头读到尾。建议按 `Cmd + F` / `Ctrl + F` 关键字检索（例如搜 `compact`、`hooks`、`PreToolUse`、`bypassPermissions` 等）快速定位。每个章节都尽量做到「一眼可查、复制即用」。
>
> **受众**：
> - 产品经理 / 非技术读者：可重点看「一、二、三、九、十」节，掌握日常会话操作。
> - 工程师 / 进阶用户：可重点看「四、五、六、七、八、十」节，掌握配置、自动化与排错。
>
> **注意事项**：Claude Code 的 CLI 选项与 Slash 命令在持续演进，部分参数在不同版本中可能有别名或行为差异。本速查表以 2026 年 Q1 起的稳定版为基准，对于不能 100% 确认的部分，使用「通常」「一般」等保守措辞，并在「延伸阅读」中给出可追溯到官方文档的入口。

---

## 一、CLI 启动与会话管理

启动 Claude Code 通常通过 `claude` 命令进入交互式会话。也可以通过命令行参数实现「无头执行」「指定权限模式」「恢复会话」等功能。

### 1.1 基础启动命令

| 命令 | 作用 | 备注 |
| --- | --- | --- |
| `claude` | 启动交互式会话（默认 default 权限模式） | 在项目根目录执行，自动加载 `CLAUDE.md` |
| `claude --version` | 查看当前 CLI 版本 | 排查 bug 时优先确认版本 |
| `claude --help` | 查看帮助文档 | 列出所有顶级参数 |
| `claude update` 或 `claude --update` | 更新 CLI 到最新版本 | 部分平台通过 `npm i -g` 升级 |
| `claude doctor` | 运行环境自检 | 检查 Node 版本、网络、登录状态等 |
| `claude logout` | 登出当前账号 | 切换账号或排查鉴权问题 |
| `claude config` | 打开本地配置（账号、模型等） | 也可使用会话内 `/config` |

### 1.2 权限模式相关启动参数

权限模式（permission mode）控制 Claude 在执行工具调用前是否需要人工确认。

| 启动方式 | 权限模式 | 适用场景 |
| --- | --- | --- |
| `claude` | `default` | 默认行为，写操作需确认 |
| `claude --permission-mode plan` | `plan` | 仅规划，不直接修改文件 |
| `claude --permission-mode acceptEdits` | `acceptEdits` | 自动接受编辑，仍会询问 Bash 等高风险动作 |
| `claude --permission-mode bypassPermissions` | `bypassPermissions` | **跳过所有确认**，⚠️ 仅在沙盒 / 容器中使用 |

> **铁律**：`bypassPermissions` 不应在你的主开发机直接使用。建议配合 Devcontainer / Docker / 一次性虚拟机 / 临时云沙盒。

### 1.3 会话恢复与导出

| 命令 | 作用 | 备注 |
| --- | --- | --- |
| `claude --resume` | 列出最近会话并恢复 | 选择历史会话继续 |
| `claude --resume <session-id>` | 恢复指定会话 | session-id 可在 `~/.claude/` 中找到 |
| `claude --continue` | 直接继续上一次会话 | 等同于挑选最近一条 |
| `claude -p "<prompt>"` | 一次性执行（headless）| 适合脚本 / CI 调用，不进入交互模式 |
| `claude -p "<prompt>" --output-format json` | 输出结构化 JSON | 便于其他程序消费 |

### 1.4 模型与上下文

| 命令 | 作用 |
| --- | --- |
| `claude --model <model-id>` | 指定模型（如 `claude-opus-4-7`、`claude-sonnet-4-5` 等） |
| `claude --append-system-prompt "<text>"` | 在系统提示后追加一段自定义内容 |
| `claude --add-dir <path>` | 启动时额外纳入一个工作目录到允许范围 |

> 实际可用模型 ID 以 `claude --help` 或官方文档为准。

---

## 二、会话内 Slash 命令

进入交互式会话后，输入以 `/` 开头的命令可以触发内置功能。下表列出最常用的内置命令（不同版本略有出入，输入 `/help` 可查看当前会话支持的全部命令）。

### 2.1 上下文与会话管理

| 命令 | 作用 | 典型场景 |
| --- | --- | --- |
| `/clear` | 清空当前会话上下文 | 切换到无关任务前 |
| `/compact` | 压缩当前上下文，保留要点 | 长对话上下文逼近上限 |
| `/compact <focus>` | 带焦点压缩 | `/compact 仅保留与登录态相关的内容` |
| `/resume` | 列出会话以恢复 | 误关终端后找回 |
| `/exit` 或 `Ctrl + D` | 退出会话 | 正常结束 |
| `/cost` | 查看当前会话 Token / 价格估算 | 月底盘点成本 |
| `/status` | 查看模型、目录、版本等运行状态 | 排查异常 |
| `/config` | 打开配置面板 | 切换主题、模型默认值 |
| `/login` / `/logout` | 登录 / 登出 | 切换账号 |

### 2.2 模式与权限

| 命令 | 作用 |
| --- | --- |
| `/model` | 切换当前会话所用模型 |
| `/permissions` | 查看与编辑当前权限 allow / deny 列表 |
| `Shift + Tab`（快捷键，非 Slash） | 在 default → acceptEdits → plan 之间循环切换 |

### 2.3 项目级元信息

| 命令 | 作用 |
| --- | --- |
| `/init` | 在当前目录初始化 `CLAUDE.md`（如不存在） |
| `/memory` | 查看 / 编辑被加载的记忆文件（CLAUDE.md 等） |
| `/agents` | 查看 / 配置子智能体 |
| `/hooks` | 查看 / 编辑 Hooks 配置 |
| `/mcp` | 查看 / 管理 MCP Server 连接 |
| `/skills` | 查看 / 启用本地 Skills（部分版本） |
| `/plugins` | 管理 Claude Code 插件 |

### 2.4 实用工具

| 命令 | 作用 |
| --- | --- |
| `/review` | 触发对当前 diff 的代码评审（如已安装相应 skill） |
| `/security-review` | 触发安全评审（如已安装） |
| `/bug` | 提交一条 bug 反馈给 Anthropic |
| `/help` | 列出当前会话所有可用 Slash 命令 |

> 所有内置 Slash 命令都可以通过自定义命令（项目根 `.claude/commands/<name>.md`，或 `~/.claude/commands/<name>.md`）扩展。

### 2.5 自定义 Slash 命令模板

```markdown
<!-- 文件路径：.claude/commands/recap.md -->
---
description: 给出当前任务的中文进度摘要
argument-hint: "[关注点]"
---

请用中文输出当前任务的：
1. 已完成事项（要点 list）
2. 阻塞 / 风险
3. 下一步建议

如果传入了关注点 $ARGUMENTS，请围绕该关注点展开。
```

使用：在会话内输入 `/recap 登录流程`，即可触发。

---

## 三、键盘快捷键

| 快捷键 | 作用 |
| --- | --- |
| `Esc` | 中断当前请求 / 工具执行 |
| `Esc Esc`（连按两次） | 跳到上一条用户消息进行编辑 |
| `Ctrl + C` | 取消当前输入 / 退出会话（连按两次） |
| `Ctrl + D` | 退出会话（输入框为空时） |
| `↑` / `↓` | 在历史输入间切换 |
| `Tab` | 文件路径 / 命令自动补全 |
| `Shift + Tab` | 在权限模式间循环（default / acceptEdits / plan） |
| `Ctrl + R` | 切换 verbose 输出 / 详细模式 |
| `Ctrl + L` | 清屏（不清空上下文，区别于 `/clear`） |
| `\ + Enter` 或 `Option + Enter` | 多行输入换行 |
| `#` 开头 | 直接添加一条 memory（记忆条目） |

> 不同终端 / 操作系统下，部分快捷键可能由终端拦截（例如 iTerm2 的 `Ctrl + R` 用作历史搜索）。如冲突，可在终端配置中调整或使用 Slash 命令替代。

---

## 四、settings.json 配置项速查

Claude Code 通过分层 `settings.json` 控制行为，优先级（高 → 低）：

1. **企业策略**（`/Library/Application Support/ClaudeCode/managed-settings.json` 或 `/etc/claude-code/managed-settings.json`）
2. **命令行参数**
3. **项目本地（不入版本控制）**：`<project>/.claude/settings.local.json`
4. **项目共享（入版本控制）**：`<project>/.claude/settings.json`
5. **用户全局**：`~/.claude/settings.json`

### 4.1 关键字段

| 字段 | 作用 | 示例 |
| --- | --- | --- |
| `permissions.allow` | 不询问直接允许的工具调用 | `"Bash(pnpm test:*)"` |
| `permissions.deny` | 始终拒绝的工具调用 | `"Bash(rm -rf *)"` |
| `permissions.ask` | 始终询问的工具调用 | `"Bash(git push:*)"` |
| `permissions.defaultMode` | 启动默认权限模式 | `"acceptEdits"` |
| `permissions.additionalDirectories` | 额外允许访问的目录 | `["/tmp/work"]` |
| `env` | 环境变量 | `{ "FOO": "bar" }` |
| `model` | 默认模型 | `"claude-opus-4-7"` |
| `apiKeyHelper` | 自定义 token 获取脚本 | `"~/.claude/get-token.sh"` |
| `hooks` | Hooks 配置 | 详见第五节 |
| `enableAllProjectMcpServers` | 自动信任项目级 MCP | `true` |
| `enabledMcpjsonServers` | 显式允许的 `.mcp.json` server 列表 | `["postgres"]` |

### 4.2 推荐的项目级最小配置

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(pnpm install)",
      "Bash(pnpm dev:*)",
      "Bash(pnpm test:*)",
      "Bash(pnpm lint:*)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Read(./**)",
      "WebFetch(domain:docs.anthropic.com)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)",
      "Read(./.env*)",
      "Read(./secrets/**)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(pnpm publish:*)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```

### 4.3 权限规则语法速查

| 写法 | 含义 |
| --- | --- |
| `"Read"` | 允许 / 拒绝整个 Read 工具 |
| `"Bash(pnpm test)"` | 仅允许这一条精确命令 |
| `"Bash(pnpm test:*)"` | 允许 `pnpm test` 后接任意参数 |
| `"Bash(pnpm:*)"` | 允许所有 `pnpm` 子命令 |
| `"Read(./src/**)"` | 仅允许读 `./src` 下文件 |
| `"WebFetch(domain:example.com)"` | 仅允许抓取指定域名 |
| `"mcp__github"` | 允许某 MCP server 的所有工具 |
| `"mcp__github__create_issue"` | 允许某 MCP server 的具体工具 |

---

## 五、Hooks 事件类型

Hooks 是「在特定生命周期事件触发时由 Claude Code 主进程执行的本地命令」。它由 **harness（外部进程）执行**，不是由 Claude 自己执行 —— 因此可用于强制约束模型行为（例如拦截危险命令、统一格式化、播放提示音）。

### 5.1 事件列表

| 事件 | 触发时机 | 常见用途 |
| --- | --- | --- |
| `PreToolUse` | 工具调用前 | 拦截危险命令、注入 context |
| `PostToolUse` | 工具调用后 | 自动 lint / format、写日志 |
| `UserPromptSubmit` | 用户提交一条消息后、模型处理前 | 注入项目状态、过滤敏感词 |
| `SessionStart` | 会话开始时 | 加载额外 context、播放欢迎语 |
| `SessionEnd` | 会话结束时 | 备份记忆、统计 token |
| `Stop` | 主 Agent 停止响应时 | 通知 / 提醒 |
| `SubagentStop` | 子 Agent 停止时 | 子任务追踪 |
| `Notification` | 系统通知（如等待输入超时） | 桌面提醒 |
| `PreCompact` | `/compact` 触发前 | 自定义压缩策略、保留关键信息 |

### 5.2 Hook 配置示例

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/guard-rm.js",
            "timeout": 5000
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm exec prettier --write \"$CLAUDE_FILE_PATHS\""
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date +%H:%M)] $(git rev-parse --short HEAD)\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "afplay /System/Library/Sounds/Glass.aiff" }
        ]
      }
    ]
  }
}
```

### 5.3 Hook 退出码语义

| 退出码 | 含义 |
| --- | --- |
| `0` | 通过 / 成功；stdout 内容会作为 context 注入（部分事件） |
| `2` | **阻塞**该工具调用；stderr 作为反馈给模型 |
| 其他非 0 | 错误，记录但不阻塞（具体取决于事件类型） |

也可以通过 stdout 输出 JSON 实现更细粒度的控制（如 `{"decision": "block", "reason": "..."}`）。

### 5.4 Hook 中常用环境变量 / 输入

- `CLAUDE_PROJECT_DIR`：项目根目录
- `CLAUDE_FILE_PATHS`：当前操作涉及的文件路径
- `CLAUDE_TOOL_NAME` / `CLAUDE_TOOL_INPUT`：工具元信息
- stdin：完整的 JSON payload，包含 `tool_name`、`tool_input`、`session_id` 等

---

## 六、CLAUDE.md 推荐结构

`CLAUDE.md` 是「Claude 进入项目时第一份必读的文档」。建议放在项目根，并保持精简（控制在 200 行内，复杂内容拆到子文档并通过 `@path/to/file.md` 引入）。

### 6.1 标准模板

```markdown
# 项目名

## 项目简介
1-2 段说明项目目标、技术栈、核心业务名词。

## 技术栈
- 语言：TypeScript 5.x
- 框架：Nuxt 4 / Vue 3
- 数据库：PostgreSQL + Drizzle ORM
- 包管理：pnpm（**禁止使用 npm/yarn**）

## 目录约定
- `apps/web` —— 前端应用
- `packages/ui` —— 共享 UI 组件
- `packages/types` —— 跨端 TS 类型

## 命令
- `pnpm dev:web` —— 启动 Web 开发服务器
- `pnpm test` —— 运行所有测试
- `pnpm lint` —— Lint + typecheck

## 编码规范
- 严格 TS：禁止 `any`、禁止 `// @ts-ignore`
- 命名：组件 PascalCase，文件 kebab-case
- 测试：每个 service 必须有单元测试

## 工作流
- 分支风格：trunk-based
- Commit message：中文，祈使语气
- PR：先 self-review，再请求他人

## 上下文外部链接
@docs/architecture.md
@docs/glossary.md
```

### 6.2 字段建议

| 字段 | 是否必须 | 说明 |
| --- | --- | --- |
| 技术栈 | 强烈建议 | 让 Claude 默认输出符合栈的代码 |
| 命令 | 强烈建议 | 自测 / 启动 / 部署的命令 |
| 编码规范 | 推荐 | 命名、注释、错误处理偏好 |
| 工作流 | 推荐 | 分支、提交、评审约定 |
| 黑名单 | 推荐 | 「禁止做的事」比「鼓励做的事」更有效 |

### 6.3 记忆分层

- 项目共享：`<project>/CLAUDE.md`
- 项目本地（不入库）：`<project>/CLAUDE.local.md`
- 用户全局：`~/.claude/CLAUDE.md`
- 会话临时：用 `#` 开头实时追加

---

## 七、Skills 目录结构

Skills 是「带元数据的可复用过程性知识 + 资源」。Claude 在需要时按需加载，不污染常驻上下文。

### 7.1 标准目录

```
.claude/skills/<skill-name>/
├── SKILL.md           # 必须，含 frontmatter 元数据
├── references/        # 可选，详细参考资料
│   └── api.md
├── scripts/           # 可选，可执行脚本
│   └── run.sh
└── assets/            # 可选，模板 / 静态资源
    └── template.html
```

### 7.2 SKILL.md 模板

```markdown
---
name: changelog-writer
description: 当用户要求"写 changelog""更新 CHANGELOG"或在合并 PR 后整理变更日志时使用。基于 git log 与 PR 描述生成符合 Keep a Changelog 规范的中文条目。
---

# Changelog Writer

## 何时触发
- 用户说"写 changelog""更新版本说明""整理 release notes"
- 合并 PR 后，用户希望沉淀对外版本说明

## 步骤
1. 询问目标版本号（语义化版本）
2. 从 `git log <last-tag>..HEAD` 提取提交
3. 按 Added / Changed / Fixed / Removed 分类
4. 写入 `CHANGELOG.md` 顶部，保留既有内容

## 规范
- 中文为主，技术名词保留英文
- 每条 ≤ 1 行，必要时附 PR 链接
- 用户视角而非实现视角

## 反例
- 「重构 user service」← 实现视角，禁止
- 「登录失败时显示更明确的错误信息」← 用户视角，✅
```

### 7.3 触发要点

- `description` 必须**写明触发条件**（动词 + 场景），Claude 通过它决定是否激活。
- Skill 的「正文」只在被激活后才注入上下文，因此可以写得详细。
- 项目级 Skill：`<project>/.claude/skills/`；用户级：`~/.claude/skills/`。

---

## 八、MCP 配置速查

MCP（Model Context Protocol）是 Claude Code 接入「外部工具 / 数据源」的统一协议。常见 MCP server 包括：文件系统、Git、数据库、浏览器自动化、搜索、第三方 SaaS 等。

### 8.1 配置位置

| 路径 | 作用域 |
| --- | --- |
| `<project>/.mcp.json` | 项目共享，应入库 |
| `~/.claude/mcp.json`（或在 settings.json 内） | 用户全局 |

### 8.2 .mcp.json 示例

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### 8.3 调用方式

- 启动后输入 `/mcp` 查看已连接 server 与可用工具
- 工具名形式：`mcp__<server>__<tool>`，可在 `permissions.allow` 中按此匹配
- 信任策略：项目级 MCP 默认会在首次启动时询问；可设置 `enableAllProjectMcpServers: true` 自动信任

### 8.4 调试技巧

| 问题 | 排查 |
| --- | --- |
| MCP 启动失败 | 单独跑 `command + args`，看 stderr |
| 工具不出现 | `/mcp` 看连接状态、`claude doctor` 看版本 |
| 权限被拒 | 检查 `permissions.deny` 是否覆盖 |
| 凭证泄漏 | MCP 的 env 来自 shell；用 `${VAR}` 占位避免 commit |

---

## 九、常用对话模式速查

「问对问题」往往比「写对 prompt」更重要。下表汇总几种被反复验证有效的对话模式。

### 9.1 Plan 请求模式（先想清楚再动手）

```
进入 plan 模式（/plan 或 Shift+Tab 切换），然后描述：

我要给登录接口加上短信验证码功能。请先调研现有代码，
给出一份方案：
1. 涉及哪些文件
2. 需要新增哪些类型 / 接口
3. 改动顺序
4. 风险点 / 待确认问题
不要直接修改代码。
```

### 9.2 状态摘要请求模式（保持上下文同步）

```
请用中文给我一份当前任务的进度摘要：
1. 已完成
2. 进行中（具体卡在哪）
3. 待办
4. 任何需要我决策的问题
```

### 9.3 根因分析模式（不要止于「能跑了」）

```
现象：<bug 描述>
请：
1. 提出 3 个可能的根因，按概率排序
2. 给出每个根因的验证方法
3. 不要直接改代码，先告诉我你倾向哪个
```

### 9.4 假设确认模式（消除歧义）

```
开始之前，列出你为完成这个任务做出的所有假设。
我会逐条确认 / 修正。
```

### 9.5 Pre-mortem 模式（事前复盘）

```
假设这次改动一周后线上出了事故。请列出：
1. 最可能的 5 种事故
2. 各自的兆头 / 监控点
3. 现在能加哪些防御
```

### 9.6 评审模式（让 Claude 当评审）

```
请以严格的 senior reviewer 视角审查 git diff：
- 安全
- 边界条件
- 命名 / 可读性
- 测试覆盖
对每条 finding 标注严重性（blocker / major / minor / nit）。
```

### 9.7 教学模式（边做边学）

```
完成后，用中文给我一份学习笔记：
- 你做了什么
- 为什么这样做（替代方案与权衡）
- 我后续应该补哪些知识
```

---

## 十、故障排查

### 10.1 常见问题速查表

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| `socket hang up` / 网络超时 | 代理 / DNS / 公司防火墙 | 设置 `HTTPS_PROXY`、切换网络、`claude doctor` |
| 上下文溢出 | 一次性塞入太多文件 | `/compact <focus>` 或 `/clear` 后重新组织任务 |
| 权限被频繁询问 | `permissions.allow` 不够 | 完成后用 `claude-mem` / 复盘把高频命令加入 allow |
| Hook 始终失败 | 超时 / 命令找不到 | 单独 shell 跑该命令；检查 `timeout`；用绝对路径 |
| Cache 失效 | 系统提示 / 工具定义变动 | 把易变内容放最后，稳定内容放最前；分层缓存 |
| `bypassPermissions` 被拒 | 在受管理环境（managed settings）被锁 | 改用 `acceptEdits` 或在容器中运行 |
| MCP 工具不可见 | server 未启动 / 未信任 | `/mcp`、`enableAllProjectMcpServers`、看 stderr |
| Skill 没被触发 | description 不匹配用户意图 | 改写 description，加上动词 + 场景关键词 |
| 模型「自信地给错误答案」 | 缺少 ground truth | 强制 Claude 先 grep / read 实际代码再回答 |
| 编辑被回滚 | Hook 拦截 / lint 失败 | 看 `Stop`/`PostToolUse` 输出；先手动跑 lint |
| 会话越用越慢 | 上下文巨大 | 阶段性 `/compact`；长任务拆 session |
| `Edit` 报「未读取过文件」 | 未先 Read 即 Edit | 先 Read 再 Edit；或直接 Write 整文件 |
| 中文乱码 | 终端 locale | 终端设置 `LANG=zh_CN.UTF-8` 或 `en_US.UTF-8` |
| Token 成本异常 | 反复重复读大文件 | 用 grep 局部搜索；启用 prompt cache |
| 子 Agent 不工作 | `agents` 配置 / mode 参数 | 不传 `mode: "auto"`；检查 `/agents` |

### 10.2 常用排查命令

```bash
# 自检环境
claude doctor

# 看版本
claude --version

# 看当前会话状态
/status

# 看成本与 token
/cost

# 看权限
/permissions

# 看 hooks
/hooks

# 看记忆
/memory

# 看 MCP
/mcp
```

### 10.3 一份「卡住时」的标准操作

1. `Esc` 中断当前请求
2. `/status` 看模型 / 模式 / 目录是否符合预期
3. `/cost` 看是否上下文已经爆炸
4. 如已爆炸 → `/compact` 带焦点压缩
5. 仍异常 → `/clear` 重新进入任务，把刚才的关键结论作为开场白手动喂入
6. 仍异常 → `claude doctor`，必要时升级 / 重启
7. 仍异常 → `/bug` 反馈

---

## 十一、附：常用环境变量

| 环境变量 | 作用 |
| --- | --- |
| `ANTHROPIC_API_KEY` | API Key（自托管 / SDK 场景） |
| `ANTHROPIC_MODEL` | 覆盖默认模型 |
| `ANTHROPIC_BASE_URL` | 自定义 API endpoint（私有部署 / 代理） |
| `CLAUDE_CODE_USE_BEDROCK` / `CLAUDE_CODE_USE_VERTEX` | 启用 Bedrock / Vertex 后端 |
| `DISABLE_TELEMETRY` | 关闭遥测 |
| `DISABLE_AUTOUPDATER` | 关闭自动更新 |
| `HTTPS_PROXY` / `HTTP_PROXY` | 代理 |
| `CLAUDE_PROJECT_DIR` | 在 hook 内可读取，指向项目根 |

> 具体支持的环境变量请以 `claude --help` 与官方文档为准。

---

## 十二、附：常用文件路径

| 路径 | 作用 |
| --- | --- |
| `~/.claude/` | 用户全局配置根 |
| `~/.claude/settings.json` | 用户全局 settings |
| `~/.claude/CLAUDE.md` | 用户全局 memory |
| `~/.claude/commands/` | 用户全局自定义 Slash 命令 |
| `~/.claude/skills/` | 用户全局 Skills |
| `~/.claude/hooks/` | 用户全局 Hooks 脚本（约定俗成） |
| `<project>/.claude/settings.json` | 项目共享 settings |
| `<project>/.claude/settings.local.json` | 项目本地 settings（不入库） |
| `<project>/.claude/commands/` | 项目自定义 Slash 命令 |
| `<project>/.claude/skills/` | 项目 Skills |
| `<project>/CLAUDE.md` | 项目 memory（必入库） |
| `<project>/CLAUDE.local.md` | 项目本地 memory（不入库） |
| `<project>/.mcp.json` | 项目 MCP 配置 |

---

## 十三、附：高频「Bash 工具」白名单建议

下表是工程师日常项目中可以预先放进 `permissions.allow` 的命令，能有效减少打断。请按你自己的项目实际栈裁剪。

### 13.1 包管理（pnpm 优先）

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm install)",
      "Bash(pnpm add:*)",
      "Bash(pnpm remove:*)",
      "Bash(pnpm dev:*)",
      "Bash(pnpm build:*)",
      "Bash(pnpm test:*)",
      "Bash(pnpm lint:*)",
      "Bash(pnpm typecheck)",
      "Bash(pnpm format)",
      "Bash(pnpm exec:*)",
      "Bash(pnpm dlx:*)"
    ]
  }
}
```

### 13.2 Git 只读 / 低危操作

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git status -s)",
      "Bash(git diff)",
      "Bash(git diff --cached)",
      "Bash(git diff:*)",
      "Bash(git log)",
      "Bash(git log:*)",
      "Bash(git show:*)",
      "Bash(git branch)",
      "Bash(git branch -a)",
      "Bash(git remote -v)",
      "Bash(git rev-parse:*)",
      "Bash(git stash list)",
      "Bash(git tag)",
      "Bash(git fetch)",
      "Bash(git fetch:*)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(git reset --hard:*)",
      "Bash(git rebase:*)",
      "Bash(git checkout --:*)"
    ],
    "deny": [
      "Bash(git push --force:*)",
      "Bash(git push -f:*)",
      "Bash(rm -rf *)"
    ]
  }
}
```

### 13.3 文件系统 / 检索工具

```json
{
  "permissions": {
    "allow": [
      "Bash(ls:*)",
      "Bash(pwd)",
      "Bash(fd:*)",
      "Bash(rg:*)",
      "Bash(jq:*)",
      "Bash(cat:*)",
      "Bash(wc:*)",
      "Bash(head:*)",
      "Bash(tail:*)",
      "Bash(tree:*)"
    ]
  }
}
```

### 13.4 Docker / 容器（按需开放）

```json
{
  "permissions": {
    "allow": [
      "Bash(docker ps)",
      "Bash(docker compose ps)",
      "Bash(docker compose logs:*)",
      "Bash(docker logs:*)"
    ],
    "ask": [
      "Bash(docker compose up:*)",
      "Bash(docker compose down:*)",
      "Bash(docker run:*)"
    ],
    "deny": [
      "Bash(docker system prune:*)",
      "Bash(docker volume rm:*)"
    ]
  }
}
```

---

## 十四、附：CI / 无人值守场景

Claude Code 也可在 CI 中以 `headless` 模式运行（例如自动对 PR 做评审、批量重构）。

### 14.1 单次执行

```bash
# 把 prompt 直接传入，输出 JSON 便于解析
claude -p "审查当前 git diff 并把问题写入 review.md" \
  --output-format json \
  --permission-mode acceptEdits
```

### 14.2 GitHub Actions 片段

```yaml
name: claude-review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - name: Install Claude Code
        run: npm i -g @anthropic-ai/claude-code
      - name: Run review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "对本 PR 的 diff 做 senior reviewer 评审，输出 markdown 到 review.md" \
            --permission-mode acceptEdits \
            --output-format text
      - name: Comment on PR
        run: gh pr comment ${{ github.event.pull_request.number }} --body-file review.md
```

> CI 场景中一般禁用 `bypassPermissions`，使用 `acceptEdits` + 严格 `deny` 规则更安全。

### 14.3 与 Hook 联动的「全自动 commit」

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$CLAUDE_PROJECT_DIR\" && git add -A && git diff --cached --quiet || git commit -m \"chore(claude): autosave $(date +%H%M)\"'"
          }
        ]
      }
    ]
  }
}
```

> ⚠️ 自动 commit 适合「实验分支」或独立 worktree，不要直接对接主分支。

---

## 十五、附：Sub-agents（子智能体）配置速查

子智能体是「带独立上下文窗口、独立系统提示、独立工具白名单」的小 Claude，由主 Agent 通过 `Task` 工具调用。适合并行调研、隔离上下文、强制执行某种角色。

### 15.1 目录与文件

```
.claude/agents/
├── reviewer.md       # 项目级
└── researcher.md
~/.claude/agents/
└── chinese-writer.md # 用户全局
```

### 15.2 子智能体 Markdown 模板

```markdown
---
name: code-reviewer
description: 审查最近的 git diff，给出 blocker/major/minor 分级反馈
tools:
  - Read
  - Grep
  - Glob
  - Bash(git diff:*)
  - Bash(git log:*)
model: claude-opus-4-7
---

你是一位严格的资深代码评审员。原则：
- 优先指出安全 / 数据正确性问题
- 关注边界条件、错误路径、并发
- 不放过命名歧义与可读性
- 反例使用代码片段说明

输出格式：
## Blockers
- ...
## Majors
- ...
## Minors / Nits
- ...
```

### 15.3 调用方式

主 Agent 会根据子智能体的 `description` 自动判断是否分派。也可由用户显式触发：

```
请用 code-reviewer 子智能体评审当前的 git diff。
```

### 15.4 何时用子智能体（vs 直接干）

| 场景 | 推荐 |
| --- | --- |
| 一次性、强角色、上下文重 | ✅ Sub-agent |
| 持续迭代、需要主对话上下文 | ❌ 直接干 |
| 需要并行（同时跑多份调研） | ✅ Sub-agent |
| 需要隔离危险动作（只读评审） | ✅ Sub-agent |

---

## 十六、附：高频 Prompt 片段库

下面这些片段可以收藏到自定义 Slash 命令（`.claude/commands/`）中，按需调用。

### 16.1 「读懂代码」三连

```
任务：理解 <path/to/file.ts>。
请：
1. 用 5 行以内中文概括它做了什么
2. 列出它依赖的关键模块（不超过 8 条）
3. 列出调用它的地方（用 grep 实证）
不要修改任何文件。
```

### 16.2 「最小修复」原则

```
我要修这个 bug：<现象描述>
约束：
- 单文件、最少行变更
- 不引入新依赖
- 必须新增 / 修改至少 1 个测试覆盖该 case
- 修完后跑 `pnpm test` 直到通过
```

### 16.3 「重构前必答」

```
重构开始前请回答：
1. 当前结构的痛点（具体例子）
2. 你计划的目标结构（一句话 + 一张文字版示意）
3. 兼容策略（如何保证调用方不动）
4. 回滚方案（万一失败如何 5 分钟内回滚）
```

### 16.4 「解释给非技术」

```
用一段话向产品经理解释这次改动：
- 解决了什么问题
- 用户能感知到什么
- 上线后我们应该观察哪个指标
不要出现技术术语。
```

### 16.5 「质量门禁」收尾

```
完成前必须：
1. `pnpm typecheck` 通过
2. `pnpm lint` 无 error
3. `pnpm test` 全绿
4. 自己 git diff 自检一遍，列出 3 条「我作为评审最担心的点」
```

---

## 十七、附：术语索引

| 术语 | 含义 |
| --- | --- |
| Harness | Claude Code 主进程，负责调度模型、执行工具、跑 hooks |
| Tool | Claude 可以发起的动作（Bash / Read / Edit / WebFetch / MCP 工具…） |
| Slash Command | 以 `/` 开头的会话内命令，由 harness 解释 |
| Permission Mode | 控制工具确认策略的全局开关 |
| Memory | 自动加载到上下文的项目 / 用户偏好（CLAUDE.md 等） |
| Skill | 「按需加载」的过程性知识包 |
| Hook | 在生命周期事件触发的本地命令 |
| MCP Server | 通过 Model Context Protocol 提供工具 / 资源的外部进程 |
| Subagent | 主 Agent 派遣的临时子任务执行者 |
| Compact | 把当前上下文压缩成摘要以释放 token |
| Plan Mode | 只规划不写盘的安全模式 |
| Headless | 无人值守 / 非交互式运行（`-p` 参数） |
| Cache（Prompt Caching）| 把稳定前缀缓存以减少重复 token 计费 |
| Trunk-based | 单主干分支开发模式，强调短分支与频繁合并 |

---

## 十八、附：常见误用与纠正

| 误用 | 纠正 |
| --- | --- |
| 把所有上下文一次性塞进 prompt | 让 Claude 主动 grep / read 实际代码 |
| 用 `bypassPermissions` 在主机上「跑得快」 | 改为 `acceptEdits` + 容器隔离 |
| 把秘密写进 `CLAUDE.md`（会入库）| 放进 `CLAUDE.local.md` 或环境变量 |
| 用 `cat`/`echo` 代替工具 | 优先 Read / Write / Edit 等专用工具 |
| 在长会话里反复贴大文件 | 阶段性 `/compact <focus>`，或拆 session |
| 让 Claude 自己说"做完了"就结束 | 强制走质量门禁（typecheck/lint/test） |

---

## 延伸阅读

- [Claude Code 官方文档总入口](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Slash Commands 官方文档](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Hooks 官方文档](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Settings & 权限官方文档](https://docs.anthropic.com/en/docs/claude-code/settings)
- [CLI Reference 官方文档](https://docs.anthropic.com/en/docs/claude-code/cli-reference)
- [Skills 官方文档](https://docs.anthropic.com/en/docs/claude-code/skills)
- [MCP（Model Context Protocol）官方站](https://modelcontextprotocol.io/)
- [MCP 在 Claude Code 中的使用](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Memory（CLAUDE.md）官方文档](https://docs.anthropic.com/en/docs/claude-code/memory)
- [Subagents 官方文档](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Anthropic 官方博客：Best Practices for Claude Code](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Prompt Caching 官方文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
