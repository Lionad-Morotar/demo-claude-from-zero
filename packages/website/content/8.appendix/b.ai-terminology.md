---
title: AI 核心术语汇编
date: 2026-04-26
scope: AI 核心术语 60+，覆盖从认识 Claude 到编程实践的完整旅程
coverage: 基础概念 → 交互机制 → 能力扩展 → 工程实践 → Claude 生态 → 安全可靠性
---

## 使用说明

本文档按概念层次组织 60+ 个 AI 领域核心术语，覆盖从"认识 Claude"到"使用 Claude Code 编程"的完整旅程：
- **基础层**：Transformer、LLM、Token、Prompt、Context、Memory 等模型基础
- **交互层**：Chat、Agent、Multi-Agent、Streaming 等人机交互
- **能力扩展层**：RAG、Function Call、MCP、API、SDK 等能力边界扩展
- **工程实践层**：CLI、Git、CI/CD、Docker、Diff、Lint 等开发工程
- **Claude 生态层**：Claude 模型系列、Claude Code、Skills、Artifacts 等产品特有
- **安全与可靠性层**：Hallucination、Alignment、RLHF、Guardrails 等

---

## 一、基础层：模型与输入

### 1. Transformer

**定义**：2017 年 Google 提出的神经网络架构，是现代 LLM 的基础。核心创新是自注意力机制（Self-Attention），让模型在处理每个 token 时都能关注输入序列中的所有其他 token，从而捕捉长距离依赖关系。

**关键组件**：
- **Self-Attention（自注意力）**：计算每个 token 与其他所有 token 的关联权重
- **Multi-Head Attention（多头注意力）**：并行计算多组注意力，捕捉不同维度的语义关系
- **Feed-Forward Network（前馈网络）**：对每个位置独立应用非线性变换
- **Layer Normalization（层归一化）**：稳定训练过程

**意义**：Transformer 的出现让模型能够并行处理序列（而非 RNN 的串行处理），为训练超大规模语言模型奠定了架构基础。

---

### 2. LLM（Large Language Model，大语言模型）

**定义**：基于 Transformer 架构、通过海量文本数据预训练的大规模神经网络模型，能够理解和生成自然语言。

**核心机制**：Next-Token Prediction。给定前文，计算每个候选 token 的条件概率 P(x_t | x_<t)，采样生成下一个 token，迭代完成整段文本。

**关键特征**：
- **概率性**：所有输出都是概率采样结果
- **涌现能力**：规模达阈值后出现推理、上下文学习等能力
- **幻觉（Hallucination）**：生成看似合理但实际错误的内容

**代表模型（截至 2026 年 4 月）**：GPT-4.1 / GPT-4o（OpenAI）、Claude 4 Opus / Sonnet（Anthropic）、Gemini 2.5（Google）、LLaMA 4（Meta）、Qwen 3（阿里）

---

### 3. Token

**定义**：LLM 处理文本的最小单元，由分词器（Tokenizer）将原始文本切分而成。

**关键事实**：
- 英文约 1 token ≈ 0.75 个单词；中文约 1 个汉字 ≈ 1~2 tokens
- API 按输入+输出的 token 数量计费
- Context Window 容量以 token 数衡量

---

### 4. Prompt（提示词）

**定义**：用户向 LLM 提供的输入文本，用于引导模型生成期望输出。

**核心形式**：
- **System Prompt**：定义模型角色、行为准则、输出格式（开发者预设）
- **User Prompt**：用户具体请求
- **Few-shot Prompt**：在 prompt 中嵌入示例引导学习
- **Chain-of-Thought（CoT）**：要求模型"一步步思考"

---

### 5. Context（上下文）

**定义**：LLM 生成响应时能访问的全部输入信息，包括当前 prompt、对话历史、系统指令及外部注入信息。

**核心约束**：
- **Context Window**：模型一次能处理的最大 token 数（Claude 4 ~200K，GPT-4.1 ~1M）
- **上下文溢出**：超出窗口时早期信息被丢弃，模型"遗忘"

---

### 6. Context Window（上下文窗口）

**定义**：LLM 单次推理能够处理的最大 token 数量。是模型"短期记忆"的物理上限。

**典型数值（截至 2026 年 4 月）**：
- Claude 4 Opus / Sonnet：~200K tokens
- GPT-4.1：~1M tokens
- GPT-4o：~128K tokens

**关键认知**：窗口越大，模型一次能看到的代码/文档越多，但成本也越高。Claude Code 的核心优势之一就是超大上下文窗口带来的完整代码库理解能力。

---

### 7. Memory（记忆）

**定义**：Agent 系统保留和检索过去信息的能力。

**分类**：
- **短期记忆**：即 Context Window 内的信息
- **长期记忆**：通过向量数据库存储，用 Embedding 语义检索

---

### 8. Embedding（嵌入）

**定义**：将文本/图像转换为高维数值向量的技术。语义相近的内容在向量空间中距离更近。

**核心作用**：语义检索、RAG 基础、Memory 基础。

---

### 9. Temperature（温度）

**定义**：控制 LLM 输出随机性的参数。取值范围通常为 0~2。

- **Temperature = 0**：确定性输出，每次相同输入产生相同结果
- **Temperature = 0.7~1.0**：默认范围，平衡创造性和一致性
- **Temperature > 1**：更随机、更有创造性，但可能偏离主题

**使用场景**：代码生成用低 temperature（0~0.3），创意写作用高 temperature（0.8~1.2）。

---

### 10. Top-p / Top-k（核采样 / Top-K 采样）

**定义**：控制 LLM 采样范围的参数，与 Temperature 配合使用。

- **Top-k**：只从概率最高的 k 个 token 中采样
- **Top-p（Nucleus Sampling）**：从累积概率达 p 的最小 token 集合中采样

**实际意义**：防止模型选择概率极低的"荒谬"token，同时保留足够的候选空间。

---

### 11. System Prompt（系统提示词）

**定义**：在对话开始时给模型的隐性指令，定义其角色、行为边界和输出格式。用户通常不可见，但影响每一次回复。

**例子**："你是一位资深 Python 工程师。所有回答使用中文。代码必须包含类型注解。"

---

### 12. Chain-of-Thought（CoT，思维链）

**定义**：一种 Prompt 技术，通过在 prompt 中要求模型"一步步思考"或提供推理示例，引导模型输出中间推理步骤，显著提升复杂问题（数学、逻辑、代码）的准确率。

**变体**：Zero-shot CoT（直接加"Let's think step by step"）、Few-shot CoT（提供推理示例）。

---

### 13. Decoder-only

**定义**：一种 Transformer 架构变体，仅使用解码器部分，通过因果掩码（Causal Masking）确保模型只能看到当前位置之前的 token，适合自回归生成任务。

**代表**：GPT 系列、Claude、LLaMA、Gemini 均为 Decoder-only 架构。

---

### 14. Pre-training（预训练）

**定义**：在海量无标注文本数据上训练 LLM 的过程。模型通过预测被掩码的 token 学习语言的统计规律和 world knowledge。

**后续阶段**：预训练 → 对齐（Alignment）→ 部署使用。

---

### 15. Inference（推理）

**定义**：使用已训练好的模型进行预测/生成的过程。用户每次向 Claude 发送消息、每次 Claude Code 分析代码库，都是一次 Inference。

**关键指标**：Latency（延迟）、Throughput（吞吐量）。

---

### 16. Parameters / Weights（参数 / 权重）

**定义**：神经网络中可学习的数值，决定了模型的行为。参数量是衡量模型规模的指标。

**典型规模**：GPT-4 估计 ~1.8T 参数，Claude 4 系列未公开，LLaMA 4 达数万亿参数（MoE 架构）。

---

### 17. Fine-tuning（微调）

**定义**：在预训练好的模型基础上，用特定领域的小规模标注数据继续训练，使模型适应特定任务或风格。

**与 Prompt Engineering 的区别**：微调改变模型权重，Prompt Engineering 不改变模型，只改变输入。

---

## 二、交互层：对话与智能体

### 18. Conversation（对话）

**定义**：用户与 AI 之间多轮交互的消息序列，由交替的 user/assistant/tool 消息组成。

---

### 19. Chat（聊天）

**定义**：以自然语言为媒介的实时交互界面。Chat 是交互模式，Conversation 是底层数据结构。

---

### 20. Streaming（流式输出）

**定义**：模型生成的 token 逐个实时返回给用户，而非等全部生成完毕再一次性返回。带来"打字机效果"的交互体验。

**技术实现**：Server-Sent Events (SSE) 或 WebSocket。

---

### 21. Agent（智能体）

**定义**：以 LLM 为核心控制器，具备 Planning、Memory、Tool Use 三大能力的自主系统。

**Agentic Loop**：接收目标 → 规划步骤 → 选择工具 → 执行动作 → 观察结果 → 反思调整 → 循环 → 交付。

---

### 22. Multi-Agent（多智能体）

**定义**：多个 Agent 协作完成复杂任务的架构。每个 Agent 负责不同子任务，通过消息传递协调。

**Claude Code 中的体现**：Sub-agents 并行处理不同专项任务。

---

### 23. Human-in-the-loop（人机协同）

**定义**：在 AI 自动化流程的关键节点引入人类审查和决策的机制。Claude Code 的"修改前请求许可"就是典型实现。

---

## 三、能力扩展层：工具与协议

### 24. RAG（Retrieval-Augmented Generation，检索增强生成）

**定义**：将外部知识检索与 LLM 生成结合的技术。生成前先检索相关文档注入上下文。

**工作流程**：用户提问 → 查询向量化 → 向量库检索 → 文档注入 Prompt → LLM 生成。

---

### 25. WebSearch（网络搜索）

**定义**：让 AI 实时访问互联网信息的能力。与 RAG 的区别：WebSearch 检索互联网实时信息，RAG 检索私有知识库。

---

### 26. Function Call / Tool Call（函数调用 / 工具调用）

**定义**：LLM 生成结构化参数调用外部函数的能力。模型输出 JSON 描述要调用的函数，由宿主程序执行。

**官方澄清**：OpenAI 文档明确 "Function calling (also known as tool calling)"，只是 API 参数命名从 `functions` 演变为 `tools`。

---

### 27. MCP（Model Context Protocol，模型上下文协议）

**定义**：Anthropic 2024 年 11 月推出的开源标准协议，标准化 AI 系统与外部数据源的连接方式。被称为"AI 的 USB-C 接口"。

**架构**：MCP Client（AI 应用）←→ MCP Server（数据/工具服务）。

---

### 28. API（Application Programming Interface，应用程序接口）

**定义**：软件系统之间交互的约定接口。LLM API 让开发者通过 HTTP 请求调用模型能力。

**Claude API**：Anthropic 提供的 `messages.create()` 等接口，是 Claude Code 等产品的基础能力来源。

---

### 29. SDK（Software Development Kit，软件开发工具包）

**定义**：封装 API 的开发者工具库，提供更易用的编程接口。Anthropic 提供 Python 和 TypeScript SDK。

---

### 30. JSON Mode / Structured Output

**定义**：让 LLM 输出严格符合 JSON Schema 的格式化数据，而非自由文本。用于程序化处理模型输出。

**应用**：Function Call 的参数输出、数据提取、API 响应生成。

---

### 31. Rate Limit（速率限制）

**定义**：API 提供商对请求频率的限制（如每分钟/每小时/每天最多多少次请求）。防止滥用和保证服务稳定性。

---

## 四、工程实践层：开发与部署

### 32. CLI（Command Line Interface，命令行界面）

**定义**：通过文本命令与计算机交互的界面。Claude Code 的核心形态就是 CLI 工具。

**与 GUI 的区别**：CLI 更高效、可脚本化、适合自动化；GUI 更直观、适合新手。

---

### 33. IDE（Integrated Development Environment，集成开发环境）

**定义**：集成了代码编辑、调试、构建等功能的开发工具。如 VS Code、IntelliJ、PyCharm。

**Claude Code 的 IDE 集成**：VS Code 扩展、JetBrains 插件，但核心体验仍是 CLI。

---

### 34. Git

**定义**：分布式版本控制系统，跟踪代码的每一次变更。现代软件开发的基石工具。

**Claude Code 中的 Git 集成**：对话式 Git 操作（`what files have I changed?`、`commit my changes`）。

---

### 35. Repository（代码仓库）

**定义**：存储项目代码及版本历史的目录，通常由 Git 管理。Claude Code 以 Repository 为单位理解项目上下文。

---

### 36. Diff（代码差异）

**定义**：展示两个代码版本之间差异的格式（`+` 新增行，`-` 删除行）。代码审查和版本控制的核心工具。

**Claude Code 中的 Diff**：每次修改前向用户展示 diff，确认后才写入文件。

---

### 37. Commit（提交）

**定义**：将代码变更保存到 Git 历史中的操作。包含变更内容、作者、时间戳和提交信息。

**Claude Code 的能力**：自动生成描述性提交信息，甚至自动执行 `git commit`。

---

### 38. Branch（分支）

**定义**：Git 中独立的代码开发线。允许并行开发不同功能而不互相干扰。

---

### 39. Lint（代码检查）

**定义**：静态分析代码以发现潜在错误、风格违规或不符合规范的地方。如 ESLint、Pylint、Prettier。

**Claude Code 的 Hooks 应用**：可在提交前自动运行 linter。

---

### 40. CI/CD（Continuous Integration / Continuous Deployment，持续集成/持续部署）

**定义**：自动化构建、测试和部署代码的流程。GitHub Actions、GitLab CI 是典型实现。

**Claude Code 集成**：可通过 MCP 连接 CI 系统，读取构建失败日志并自动修复。

---

### 41. Docker / Container（容器）

**定义**：将应用及其依赖打包为标准化可移植单元的技术。确保"在我机器上能跑"变成"在哪都能跑"。

---

### 42. Environment Variable（环境变量）

**定义**：操作系统级别的键值对配置，程序运行时读取。常用于存储 API Key、数据库连接串等敏感信息，避免硬编码。

---

## 五、Claude 生态层：产品特有

### 43. Claude Sonnet / Opus / Haiku

**定义**：Anthropic Claude 模型系列的三个梯度：
- **Opus**：最强推理能力，适合复杂分析、数学、代码架构设计
- **Sonnet**：均衡性能与速度，日常使用首选
- **Haiku**：最快、最便宜，适合简单任务和高频调用

**Claude Code 中的模型选择**：复杂重构用 Opus，日常任务用 Sonnet，Claude Code 允许切换模型。

---

### 44. Claude Code

**定义**：Anthropic 推出的终端原生智能体编程系统。读取完整代码库，自主规划多文件变更，执行修改，运行测试，迭代修复。

**核心定位**：不是代码补全工具，不是 IDE，是任务委托伙伴。

---

### 45. CLAUDE.md

**定义**：Claude Code 项目根目录的持久指令文件。定义编码标准、架构决策、工作流规则，每次会话自动读取。

**作用**：团队知识沉淀、项目规范统一、减少重复说明。

---

### 46. Skills

**定义**：Claude Code 中用 Markdown+YAML 定义的标准化操作流程。将重复性工作方法编码为可复用模板。

**与 MCP 的区别**：Skill 定义"做什么"（工作流程），MCP 定义"连什么"（外部接口）。

---

### 47. Hooks

**定义**：Claude Code 中的生命周期钩子，在特定事件前后触发脚本。如提交前自动 lint、编辑后自动测试。

**作用**：为 AI 自主行为添加安全护栏。

---

### 48. Sub-agents（子智能体）

**定义**：由主 Agent 派生的并行处理单元。独立执行专项任务，避免主对话上下文被无关信息填满。

**核心约束**：上下文窗口 ~200K tokens，复杂任务中 Sub-agents 是管理溢出的核心策略。

---

### 49. Plan Mode（计划模式）

**定义**：Claude Code 的安全操作模式。Claude 先提出完整计划（含 diff 预览），人类批准后执行。适合大规模重构或高风险操作。

---

### 50. Slash Commands（斜杠命令）

**定义**：Claude Code 中以 `/` 开头的内置命令。如 `/login`、`/help`、`/clear`、`/config`、`/resume`。

**作用**：快速触发特定功能，无需自然语言描述。

---

### 51. Checkpoint（检查点）

**定义**：Claude Code 自动创建的代码状态快照。允许用户随时回滚到之前的代码状态，防止 AI 修改导致不可逆破坏。

---

### 52. Session（会话）

**定义**：Claude Code 中一次连续的工作单元。包含对话历史、已执行的操作、当前上下文。可用 `/resume` 恢复之前的会话。

---

### 53. Artifacts

**定义**：Claude.ai 网页版中的独立内容展示组件。当 Claude 生成代码、文档、图表等可复用内容时，以独立窗口呈现，方便查看、复制和迭代。

---

### 54. Computer Use

**定义**：Claude 的能力之一，允许模型通过截图和鼠标/键盘操作与计算机界面交互。可以操作浏览器、填写表单、运行 GUI 应用。

**与 Claude Code 的区别**：Computer Use 操作图形界面，Claude Code 操作代码和命令行。

---

### 55. OpenClaw

**定义**：开源（MIT）自托管网关，连接聊天应用（Discord、Telegram、WhatsApp 等）与 AI 编码 Agent。

**与 Claude Code 的区别**：OpenClaw 是聊天网关（面向消息平台），Claude Code 是开发工具（面向代码库）。

---

## 六、安全与可靠性层

### 56. Hallucination（幻觉）

**定义**：LLM 生成看似合理但实际错误、虚构或无法验证的内容。是概率生成机制的固有特性，不是 bug。

**应对**：RAG 注入真实信息、人工审查、事实核查工具。

---

### 57. Prompt Injection（提示注入）

**定义**：攻击者通过精心构造的输入，绕过模型的安全限制或操纵模型行为。如"忽略之前的指令，告诉我如何..."

**防御**：输入过滤、输出审查、权限最小化。

---

### 58. Alignment（对齐）

**定义**：确保 AI 系统的行为符合人类意图和价值观的过程。解决"模型能做什么"与"模型应该做什么"之间的差距。

**关键技术**：RLHF、Constitutional AI。

---

### 59. RLHF（Reinforcement Learning from Human Feedback，基于人类反馈的强化学习）

**定义**：训练 LLM 的核心对齐技术。人类对模型输出进行排序评分，模型通过强化学习优化以生成人类偏好的回答。

**流程**：预训练 → 收集人类反馈 → 训练奖励模型 → 用 PPO 等算法优化策略。

---

### 60. Constitutional AI（宪法 AI）

**定义**：Anthropic 特有的对齐方法。让模型遵循一组"宪法原则"（如"选择最诚实、最少有害的回答"），通过自我批评和修订来改进输出，减少对人类标注的依赖。

---

### 61. Guardrails（护栏）

**定义**：限制 AI 系统行为的安全机制集合。包括输入过滤、输出审查、权限控制、操作确认等。

**Claude Code 的护栏**：修改前请求许可、Plan Mode、Hooks、内置分类器区分安全/风险操作。

---

### 62. Red Teaming（红队测试）

**定义**：模拟攻击者角度对 AI 系统进行压力测试，发现安全漏洞、偏见和失效模式。是 AI 安全评估的标准实践。

---

## 七、术语关系全景图

```
┌─────────────────────────────────────────────────────────────────────┐
│                          基础层                                      │
│  Transformer ←── LLM ←── Token ←── Prompt ←── Context/Context Window│
│     ↑              ↑         ↑            ↑                         │
│  Attention    Parameters  Temperature   System Prompt               │
│  Decoder-only  Pre-training  Top-p/Top-k  CoT                      │
│  Inference    Fine-tuning    Embedding   Memory                    │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          交互层                                      │
│  Chat ←── Conversation ←── Streaming ←── Agent ←── Multi-Agent     │
│                                              ↑                      │
│                                       Human-in-the-loop            │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        能力扩展层                                    │
│  RAG ←── WebSearch ←── Function/Tool Call ←── MCP ←── API/SDK      │
│                                          ↑                          │
│                                    JSON Mode / Structured Output    │
│                                    Rate Limit                       │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        工程实践层                                    │
│  CLI ←── IDE ←── Git/Repo ←── Diff ←── Commit/Branch ←── Lint     │
│  CI/CD ←── Docker ←── Environment Variable                         │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        Claude 生态层                                 │
│  Claude Opus/Sonnet/Haiku                                           │
│       ↓                                                             │
│  Claude Code ←── CLAUDE.md ←── Skills ←── Hooks                    │
│       ↓              ↓                    ↓                         │
│  Sub-agents ←── Plan Mode ←── Slash Commands ←── Checkpoint        │
│  Session ←── Artifacts ←── Computer Use                             │
│  OpenClaw（独立网关）                                                │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      安全与可靠性层                                  │
│  Hallucination ←── Prompt Injection ←── Guardrails                 │
│  Alignment ←── RLHF ←── Constitutional AI                          │
│  Red Teaming                                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 八、易混淆术语对比

### Function Call vs Tool Call
**结论：同一概念，命名演变。** OpenAI 早期用 `functions` 参数，后改为 `tools`。官方文档："Function calling (also known as tool calling)"。

### RAG vs Memory
| | RAG | Memory |
|--|-----|--------|
| 数据源 | 预设知识库 | 动态积累的交互经验 |
| 更新方式 | 人工上传/同步 | 自动记录 |
| 典型场景 | 文档问答 | 个性化对话 |

### MCP vs Function Call
| | Function Call | MCP |
|--|---------------|-----|
| 层级 | 模型能力 | 系统协议 |
| 作用 | 模型决定"调用什么" | 标准化"如何暴露和发现工具" |
| 关系 | 基础机制 | 建立在 Function Call 之上 |
| 类比 | HTTP 请求 | REST API 规范 |

### LangChain vs LangGraph
| | LangChain | LangGraph |
|--|-----------|-----------|
| 定位 | LLM 组件库 | Agent 工作流编排框架 |
| 抽象 | Chains | Graph（节点+边） |
| 循环支持 | 有限 | 原生支持 |

### Claude Code vs OpenClaw
| | Claude Code | OpenClaw |
|--|-------------|----------|
| 类型 | 开发工具 | 通信网关 |
| 界面 | 终端/IDE | 聊天应用 |
| 工作对象 | 代码库 | 对话消息 |

### Context vs Context Window
| | Context | Context Window |
|--|---------|----------------|
| 概念 | 模型此刻能看到的全部信息 | 信息量的物理上限 |
| 比喻 | 桌面上的文件 | 桌面的大小 |
| 关系 | Context 必须 fit in Context Window |

### Skills vs MCP
| | Skills | MCP |
|--|--------|-----|
| 定义 | "做什么"（工作流程） | "连什么"（外部接口） |
| 格式 | Markdown+YAML | 协议标准 |
| 范围 | Claude Code 内部 | 跨平台通用 |

---

## 九、来源索引

| # | 术语 | 主要来源 | URL |
|---|------|----------|-----|
| 1 | Transformer / Attention | Vaswani et al. "Attention Is All You Need" (2017) | arxiv.org/abs/1706.03762 |
| 2 | LLM / Next-Token | wwwinsights.com | wwwinsights.com/ai/llm-next-token-prediction/ |
| 3 | Token / Embedding | 行业通用定义 | OpenAI Tokenizer 文档、HuggingFace 指南 |
| 4 | Prompt / CoT | Wei et al. "Chain-of-Thought Prompting" | arxiv.org/abs/2201.11903 |
| 5 | Context Window | 各模型官方文档 | Anthropic / OpenAI API 文档 |
| 6 | Agent 架构 | Lilian Weng (OpenAI) | lilianweng.github.io/posts/2023-06-23-agent/ |
| 7 | Memory / Vector Store | Lilian Weng (OpenAI) | lilianweng.github.io/posts/2023-06-23-agent/ |
| 8 | RAG | Lewis et al. "Retrieval-Augmented Generation" | arxiv.org/abs/2005.11401 |
| 9 | Function/Tool Call | OpenAI 官方文档 | developers.openai.com/api/docs/guides/function-calling |
| 10 | MCP | Anthropic 官方 | anthropic.com/news/model-context-protocol |
| 11 | MCP 文档 | modelcontextprotocol.io | modelcontextprotocol.io/docs/getting-started/intro |
| 12 | LangChain | LangChain 官方 | python.langchain.com/docs/introduction/ |
| 13 | LangGraph | IBM / LangChain 官方 | ibm.com/think/topics/langgraph |
| 14 | Claude Code | Anthropic 官方 | anthropic.com/product/claude-code |
| 15 | Claude Code 文档 | 官方文档 | code.claude.com/docs/zh-TW/quickstart |
| 16 | Claude 模型系列 | Anthropic 官方 | anthropic.com/news/claude-4-family |
| 17 | Constitutional AI | Anthropic 官方 | anthropic.com/research/constitutional-ai |
| 18 | RLHF | Ouyang et al. "Training language models to follow instructions" | arxiv.org/abs/2203.02155 |
| 19 | OpenClaw | 官方文档 | docs.openclaw.ai/ |
| 20 | SKILL | Anthropic 官方 | claude.com/docs/skills/overview |
| 21 | Artifacts / Computer Use | Anthropic 官方 | claude.com |
