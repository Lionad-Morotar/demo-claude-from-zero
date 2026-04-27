# Review: A-常用命令速查表.md

## 事实准确性

### [1] `claude update` / `claude --update` — 需要修改
- **核实**: `claude update` **属实**；`claude --update` **不属实**。
- **建议**: 删除 `claude --update`，保留 `claude update`。

### [2] `claude doctor` — 需要修改
- **核实**: 官方存在 `/doctor`（slash command），但**未找到** `claude doctor` 作为 CLI 子命令。
- **建议**: 将 `claude doctor` 改为 `/doctor`。

### [3] `--permission-mode` 及三个值 — 正确，无需修改
- **核实**: 全部属实，CLI reference 确认。

### [4] `--resume`/`--continue`/`-p`/`--output-format` — 正确，无需修改
- **核实**: 全部属实，CLI reference 确认。

### [5] `--model` 及模型 ID — 正确，无需修改
- **核实**: `--model` 存在；`claude-opus-4-7` 等 ID 官方使用。

### [6] `--append-system-prompt` — 正确，无需修改
- **核实**: CLI reference 明确列出。

### [7] `/compact` — 正确，无需修改
- **核实**: 官方 Commands 文档确认。

### [8] `/permissions` — 正确，无需修改
- **核实**: 官方 Commands 文档确认，功能为"Manage allow, ask, and deny rules"。

### [9] `/init`、`/memory`、`/agents`、`/mcp`、`/skills` — 部分修改
- **核实**: 全部属实；但 `/plugins` 应为 **`/plugin`**（单数）；**`/hooks` 不存在**为 slash command。
- **建议**: 将 `/plugins` 改为 `/plugin`；删除 `/hooks`。

### [10] `/review`、`/security-review`、`/bug` — 基本正确
- **核实**: `/review` 和 `/security-review` 属实；`/bug` 实际是 `/feedback` 的 alias。
- **建议**: 将 `/bug` 改为 `/feedback`（alias: `/bug`）。

### [11] `Esc Esc` 功能 — **全书最严重的自相矛盾**
- **核实**: 官方定义为 "Rewind or summarize — Restore code and/or conversation to a previous point, or summarize from a selected message"。
- **问题**: 全书三个章节给出三种不同描述——4.4 章"撤销修改"、5.4 章"恢复菜单"、附录 A"跳到上一条消息"——**全部错误**。
- **建议**: **统一全书 `Esc+Esc` 描述为官方定义**。

### [12] `Shift+Tab` — 正确，无需修改
- **核实**: 官方 Interactive mode 文档确认用于 cycle permission modes。

### [13] `Ctrl+R` — **完全错误**
- **核实**: 官方文档明确 `Ctrl+R` = "Reverse search command history"（反向搜索命令历史）。
- **问题**: 速查表称"切换 verbose 输出"——完全错误。verbose 模式实际通过 `--verbose` 参数或 `Ctrl+O` 开启。
- **建议**: 将 `Ctrl+R` 修正为"反向搜索命令历史"；verbose 模式单独列出。

### [14] `#` 开头添加 memory — 基本正确
- **核实**: Boris Cherny 文章确认 "press the # key to give Claude an instruction that it will automatically incorporate into the relevant CLAUDE.md"。
- **建议**: 补充说明 `#` 键的精确行为：生成指令并由 Claude 自动整合到 CLAUDE.md。

### [15] `permissions.allow/deny/ask` — 正确，无需修改
- **核实**: `/permissions` 命令描述明确包含 "allow, ask, and deny rules"。

### [16] `claude-opus-4-7` 模型 ID — 正确，无需修改
- **核实**: 官方 API 文档和 Prompt Caching 定价表均使用此格式。

### [17] `apiKeyHelper` — **需要删除**
- **核实**: 官方 settings 文档和 CLI reference 中**未出现**此字段。
- **建议**: 删除 `apiKeyHelper` 字段，或替换为官方支持的认证方式。

### [18] json.schemastore.org schema URL — 正确，无需修改
- **核实**: GitHub issue #11795 明确承认该 schema 存在。

### [19] `WebFetch(domain:...)` 权限语法 — 建议验证
- **问题**: settings 文档的转义文本中出现了 `WebFetch` 字样，但未提取到完整语法示例。
- **建议**: 验证后保留，否则删除或标注"待验证"。

### [20] `PreCompact` 事件 — 正确，无需修改
- **核实**: 官方 Hooks 文档明确列出 `PreCompact` 和 `PostCompact`。

### [21] `$CLAUDE_FILE_PATHS` — **需要删除**
- **核实**: 官方 Hooks 文档中**未定义**此环境变量。
- **建议**: 删除 `$CLAUDE_FILE_PATHS`，统一全书环境变量为官方确认的列表。

### [22] `CLAUDE_CODE_USE_BEDROCK` / `CLAUDE_CODE_USE_VERTEX` — 正确，无需修改
- **核实**: CLI reference 明确列出。

### [23] npm 包名 `@anthropic-ai/claude-code` — 正确，无需修改
- **核实**: npm registry 和官方安装文档均确认。

### [24] 延伸阅读链接格式 — 部分有效
- **核实**: `docs.anthropic.com/en/docs/...` 格式较 7.1-7.3 章使用的旧格式更可能有效。

## 系统性问题

### 环境变量名全书混乱
全书环境变量名极度混乱：
- 5.4 章: `$CLAUDE_TOOL_INPUT`、`$CLAUDE_TOOL_INPUT_FILE_PATH`
- 7.3 章: `$TOOL_INPUT`
- 7.4 章: `$TOOL_NAME`、`$TOOL_INPUT`
- 附录 A: `$CLAUDE_FILE_PATHS`、`$CLAUDE_TOOL_NAME`、`$CLAUDE_TOOL_INPUT`

**只有 `$CLAUDE_PROJECT_DIR`、`$CLAUDE_PLUGIN_ROOT`、`$CLAUDE_PLUGIN_DATA`、`$CLAUDE_ENV_FILE`、`$CLAUDE_CODE_REMOTE` 是官方文档确认的环境变量**。其余均为作者自行构造。

### settings.json 全书四种格式并存
附录 A 出现了本书第四种 settings.json 格式，与 5.4 章、7.3 章格式均不相同，需要统一。

## 总体评价

速查表作为"权威参考"，将大量未经核实的命令、参数、环境变量列入。读者使用速查表时期望"100% 准确"，但附录 A 中混入了许多在正文章节中已被质疑的内容。速查表的错误比正文更具破坏力，因为读者不会逐个质疑速查表条目。**建议用 `claude --help` 和官方文档逐条核实所有 CLI 参数和 Slash 命令，统一全书矛盾描述，删除所有非官方环境变量。**
