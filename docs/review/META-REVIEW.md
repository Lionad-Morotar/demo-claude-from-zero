# META-REVIEW: 跨文档一致性审查

## 概述

本次审查覆盖 docs/content/ 下全部 33 份文档，产出 33 份独立 review + 本 META-REVIEW。以下是在跨文档层面发现的系统性一致性问题，按严重程度排序。

---

## 1. Esc+Esc 快捷键功能 — 全书最严重自相矛盾（高优先级）

**问题**: 同一快捷键在三个章节中被赋予三种完全不同的功能：

| 章节 | 描述 |
|-----|------|
| 4.4-Git 工作流 | "撤销所有正在进行的修改" |
| 5.4-Hooks 与 Plan 模式 | "打开恢复菜单" |
| 附录 A | "跳到上一条用户消息进行编辑" |

**官方定义**: "Rewind or summarize — Restore code and/or conversation to a previous point, or summarize from a selected message"

**结论**: **三个描述全部错误**。速查表作为"权威参考"反而增加了第三种错误说法。

**建议**: 统一全书 `Esc+Esc` 描述为官方定义；在速查表中特别标注该快捷键的双重功能（恢复/总结）。

---

## 2. 环境变量名全书混乱（高优先级）

**问题**: 全书在不同章节中使用了至少 6 种不同的环境变量名来引用 Hooks 输入，其中**仅有 5 个是官方确认的**：

| 章节 | 使用的变量名 | 官方确认？ |
|-----|------------|----------|
| 5.4-Hooks | `$CLAUDE_TOOL_INPUT`、`$CLAUDE_TOOL_INPUT_FILE_PATH` | ❌ 否 |
| 7.3-安全 | `$TOOL_INPUT` | ❌ 否 |
| 7.4-心法 | `$TOOL_NAME`、`$TOOL_INPUT` | ❌ 否 |
| 附录 A | `$CLAUDE_FILE_PATHS`、`$CLAUDE_TOOL_NAME`、`$CLAUDE_TOOL_INPUT` | ❌ 否 |
| 官方文档 | `$CLAUDE_PROJECT_DIR`、`$CLAUDE_PLUGIN_ROOT`、`$CLAUDE_PLUGIN_DATA`、`$CLAUDE_ENV_FILE`、`$CLAUDE_CODE_REMOTE` | ✅ 是 |

**官方机制**: Hooks 通过 **stdin** 接收 JSON，正确读取方式为 `jq -r '.tool_input.command' < /dev/stdin`。

**建议**: 删除全书所有非官方环境变量，统一改为 stdin 读取方式。

---

## 3. settings.json 格式全书四种并存（高优先级）

**问题**: 全书在不同章节中呈现了至少四种不同的 settings.json 格式：

| 章节 | 特有字段/语法 |
|-----|-------------|
| 5.4-Hooks | `"hooks": { "PreToolUse": [{ "matcher": "Bash", "hooks": [...] }] }` |
| 7.3-安全 | `permissions.allow`、`permissions.deny`（无 `ask`） |
| 7.4-心法 | 未涉及 settings.json |
| 附录 A | `permissions.allow`、`permissions.deny`、`permissions.ask`、`permissions.defaultMode`、`WebFetch(domain:...)`、`mcp__github` |

**建议**: 通过官方 settings schema 确认精确格式，全书统一为一种格式。

---

## 4. 官方文档链接格式不一致（高优先级）

**问题**: 全书至少使用了三种不同的官方文档域名/路径格式：

| 章节 | 使用的域名格式 |
|-----|--------------|
| 6.5、7.2、7.3 | `docs.anthropic.com/claude/docs/claude-code`（旧格式，疑似已失效） |
| 附录 A | `docs.anthropic.com/en/docs/claude-code/...`（较新格式） |
| 附录 C | `docs.claude.com/en/docs/claude-code/...`（疑似错误域名） |
| 官方实际 | `code.claude.com/docs/en/...`（当前格式） |

**建议**: 批量验证所有链接，统一使用当前官方文档域名 `code.claude.com/docs/en/`。

---

## 5. Boris Cherny 身份描述不一致（中优先级）

**问题**: 同一人物在不同章节中的身份描述逐级降级：

| 章节 | 描述 |
|-----|------|
| 7.1-提示词 | "Claude Code 作者" |
| 7.4-心法 | "工程师" |
| **官方/权威来源** | **"Creator and Head of Claude Code at Anthropic"** |

**建议**: 统一为"Claude Code 创建者/负责人（Creator & Head）"。

---

## 6. `--permission-mode` / `Shift+Tab` 在多章重复但细节有差异（中优先级）

**问题**: 该内容在 5.4、7.1、7.3、7.4、附录 A 等多章出现，描述基本一致但：
- 附录 A 未提及 `auto` 和 `dontAsk` 两个额外模式
- 7.1 和 7.3 对 `Shift+Tab` 的描述过于简化，未说明是循环切换
- 7.3 错误地列出了 `/acceptEdits` slash command（不存在）

**建议**: 在首次出现的章节（建议 5.4 或 7.3）给出完整准确的描述，后续章节引用而非重复。

---

## 7. 模型 ID 命名格式不一致（低优先级）

**问题**: 
- 7.2 章: "Opus 4.7"、"Sonnet 4.6"（简称）
- 附录 A: "claude-opus-4-7"、"claude-sonnet-4-5"（完整 ID）

两者均为官方使用格式，但全书应统一风格或说明对应关系。

**建议**: 在首次出现时说明两种格式的对应关系，后续统一使用一种。

---

## 8. 附录 C 对附录 A/B 内容的错误引用（中优先级）

**问题**: 附录 C 第 416 行：
- 称"附录 A（常见问题）"——实际为"常用命令速查表"
- 称"附录 B（团队落地模板）"——实际为"AI 核心术语表"

**建议**: 修正对附录 A/B 的内容描述。

---

## 9. Hook 示例中的 `$TOOL_INPUT` 错误跨越多章（高优先级）

**问题**: 5.4、7.3、7.4 章的 Hook 示例均错误地使用 `$TOOL_INPUT` 环境变量，而非从 stdin 读取 JSON。

**影响**: 读者复制这些示例后，Hook 脚本将无法正确接收工具输入数据。

**建议**: 全书统一修正为 stdin 读取方式。

---

## 10. 精确数字缺乏来源的问题在全书中普遍存在（中优先级）

以下为部分示例：

| 章节 | 数字 | 核实结果 |
|-----|------|---------|
| 7.1 | "数倍"代码质量差距 | ❌ 无依据 |
| 7.1 | "30%"复述暴露率 | ❌ 个人轶事 |
| 7.2 | "5x/3x"工作量/质量 | ❌ 无依据 |
| 7.2 | "80K"高质量利用区 | ❌ 作者推导 |
| 7.2 | "75%/50%/65%"准确率 | ❌ 特定实验点泛化 |
| 7.2 | "80%/95%"压缩阈值 | ❌ 无依据 |
| 7.2 | "50%-80%"cache 命中率 | ❌ 作者设定 |
| 7.4 | "50%"以上 bug 率降低 | ❌ 无依据 |
| 7.4 | "7-12 倍"ROI | ❌ 假设链推理 |

**建议**: 建立全书统一的数字引用标准——所有精确数字必须有来源，否则使用定性描述。

---

## 总结

全书最紧迫的三个系统性问题：

1. **Esc+Esc 描述统一** — 三个错误描述需全部修正
2. **环境变量和 stdin 读取方式统一** — 影响 Hook 脚本的实际可用性
3. **官方文档链接批量验证** — 15+ 个链接可能失效或指向错误域名

其余问题（settings.json 格式、Boris Cherny 身份、模型命名等）可在修改具体章节时同步修正。
