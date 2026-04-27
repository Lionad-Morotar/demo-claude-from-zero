# Review: B-AI核心术语表.md

## 事实准确性

### [1] 代表模型版本 — 部分修改
- **核实**:
  - **Claude 4 / Gemini 2.5 / LLaMA 4 / Qwen 3**: 均属实（截至 2026 年 4 月）
  - **GPT-4.1**: 于 2025-04-14 发布，但 **2026-02 已被 OpenAI 正式退役**
  - **Qwen 3**: 表述不够精确，最新为 Qwen3.6
- **建议**: 
  - 将 GPT-4.1 标注为"已退役（2026-02）"，或替换为当前 OpenAI 代表模型
  - 将"Qwen 3"精确化为"Qwen 3.x 系列（最新为 Qwen3.6）"

### [2] 上下文窗口数据 — 基本正确
- **核实**: GPT-4.1 ~1M 属实（但模型已退役）；Claude 4 ~200K 属实；GPT-4o ~128K 属实。

### [3] GPT-4 ~1.8T 参数 / Claude 4 未公开 / LLaMA 4 数万亿 — 需要修改
- **核实**: 
  - "1.8T"为社区推测，OpenAI **从未官方披露** GPT-4 参数数量
  - Claude 4 参数确实未公开
  - LLaMA 4 使用 MoE 架构属实
- **建议**: 
  - 将 GPT-4 "~1.8T 参数"改为"参数数量未官方披露，社区推测约 1-1.8T"
  - 将"Claude 4 系列未公开"限定为"Claude 4 系列参数数量未公开"，避免与前面列出的型号矛盾

### [4] OpenClaw 项目 — 属实，但分类错误
- **核实**: 项目真实存在（GitHub: openclaw/openclaw，MIT 许可证）。
- **问题**: 术语表将其放在"Claude 生态层"——OpenClaw 是通用 AI 网关，支持多种模型，不属于 Claude 专属生态。
- **建议**: 移至"通用 AI 基础设施"或"开源 Agent 网关"类别。

### [5] wwwinsights.com 来源 — 需要修改
- **问题**: 非学术/非官方渠道，LLM 定义应引用原始论文或权威教材。
- **建议**: 替换为 LLM 原始论文或权威教材引用。

### [6] developers.openai.com 链接 — 基本有效
- **核实**: OpenAI 开发者文档域名已迁移至 developers.openai.com。

### [7] IBM LangGraph 链接 — 需要修改
- **问题**: LangGraph 官方文档在 python.langchain.com，IBM 文章属于第三方来源。
- **建议**: 将来源改为 LangChain 官方文档（python.langchain.com）。

### [8] anthropic.com/product/claude-code — 建议验证
- **建议**: 验证 URL 是否有效，或替换为 anthropic.com/claude-code。

### [9] code.claude.com/docs/zh-TW/quickstart — 建议修改
- **问题**: URL 含 zh-TW（繁体中文），但本书为简体中文教材。
- **建议**: 替换为简体中文版本（如存在）或标注语言版本。

### [10] anthropic.com/news/claude-4-family — 建议验证

### [11] docs.openclaw.ai — 正确，无需修改

### [12] claude.com/docs/skills/overview — 需要修改
- **问题**: Skills 官方文档应在 code.claude.com/docs/en/skills/。
- **建议**: 修正路径。

## 逻辑/覆盖度

### [B] "Claude 4 未公开"与具体型号数据的矛盾 — 需要修改
- **问题**: 第 162 行称"Claude 4 系列未公开"，但第 49 行和第 82 行列出了具体型号和上下文窗口数据。
- **建议**: 将"未公开"限定为"参数数量未公开"。

### [G] "LLaMA 4 达数万亿参数（MoE 架构）" — 需要补充来源
- **问题**: LLaMA 系列传统上使用 Dense 架构，LLaMA 4 使用 MoE 是重大架构转变。
- **建议**: 补充来源引用。

### [H] 缺失 Claude Code 核心术语 — 建议补充
- 缺失项: Prompt Cache、Auto Mode、Permission Mode、Settings.json、Cost/Token Pricing、Elicitation、Worktree 等。
- **建议**: 补充缺失的核心术语，使术语表与正文章节保持一致。

### [E] 上下文窗口数据重复 — 建议精简
- **问题**: 第 82-84 行和第 92-93 行数据完全重复。
- **建议**: 删除重复。

### [F] OpenClaw 分类错误 — 需要修改
- **问题**: OpenClaw 被放在"Claude 生态层"。
- **建议**: 移至通用 AI 基础设施类别。

## 总体评价

术语表结构清晰，但存在模型版本过时（GPT-4.1 已退役）、内部逻辑矛盾（"Claude 4 未公开"与具体型号并存）、来源质量参差不齐（wwwinsights.com 不应作为 LLM 定义来源）、以及缺失 Claude Code 核心术语等问题。修改后可用性将显著提升。
