# AI会话、知识库、用量与OCR

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

先读实际供应商/模型/图片能力/配置状态、本人访问范围、业务上下文与知识文档；模型付费和OCR需真实前提。

本地会话和知识资料维护使用原权限/版本；真实问题选择非流式MCP入口，需流式时使用原SSE。知识解析/重索引检查任务，OCR识别后人工核对再保存。

查会话/安全结果、知识解析状态与引用、按人/模型Token和人民币用量、OCR配额/审计；业务写入另查对象回执。

不得把内部推理或供应商密钥当结果返回。停生成不等于业务写入完成，AI记录清理不清OCR审计。隔离环境模型未配置时核验真实拒绝；不能把模拟模型输出记为真实成功。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/ai.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="ai-center"></a>
## 智能指挥中心

自然语言任务：请按当前权限完成“智能指挥中心”所需操作，并回读实际结果。业务步骤：

1. Gemini 当前固定使用托管 gemini-3.8-flash。
2. DeepSeek 当前提供 V4 Flash · 0731 与 V4 Pro · 0813；选择器会按北京时间自动标注当前高峰/低谷时段及每百万 tokens 的缓存、输入、输出价格。
3. DeepSeek 高峰时段为北京时间 09:00–12:00、14:00–18:00，其余时间按低谷价格显示；实际账单仍以 DeepSeek 官方为准。
4. 图片能力按当前模型目录逐个识别；DeepSeek、OpenRouter 等供应商不会再被整家固定标成仅文本。
5. 留空不会覆盖既有密钥，显式清除才会删除。
6. 自定义供应商需同时核对地址、模型和兼容接口。
7. 先保存或使用当前编辑配置测试。
8. 查看错误分类、延迟、Token 和余额。
9. 不要把真实密钥复制到文档或聊天。

角色候选：PLATFORM_ADMIN。前置对象：conversation、local-document、knowledge-record、usage-record、unconfigured-provider、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_ai_chat_conversations_by_conversationId`：DELETE /api/ai/chat/conversations/:conversationId
- `delete_ai_config_by_provider_key`：DELETE /api/ai/config/:provider/key
- `delete_ai_config_embedding_key`：DELETE /api/ai/config/embedding/key
- `delete_ai_decision_key`：DELETE /api/ai/decision/key
- `delete_ai_knowledge_by_documentId`：DELETE /api/ai/knowledge/:documentId
- `delete_ai_usage`：DELETE /api/ai/usage
- `get_ai_chat_conversations`：GET /api/ai/chat/conversations
- `get_ai_chat_conversations_by_conversationId`：GET /api/ai/chat/conversations/:conversationId
- `get_ai_chat_models`：GET /api/ai/chat/models
- `get_ai_config`：GET /api/ai/config
- `get_ai_decision_config`：GET /api/ai/decision/config
- `get_ai_deepseek_balance`：GET /api/ai/deepseek-balance；外部前提候选：真实付费模型、OCR或供应商
- `get_ai_knowledge`：GET /api/ai/knowledge
- `get_ai_runs_by_runId`：GET /api/ai/runs/:runId
- `get_ai_usage`：GET /api/ai/usage
- `patch_ai_knowledge_by_documentId_status`：PATCH /api/ai/knowledge/:documentId/status
- `post_ai_chat`：POST /api/ai/chat；外部前提候选：真实付费模型、OCR或供应商
- `post_ai_chat_stream`：POST /api/ai/chat/stream（stream，使用原协议）
- `post_ai_config`：POST /api/ai/config
- `post_ai_config_embedding`：POST /api/ai/config/embedding
- `post_ai_config_features`：POST /api/ai/config/features
- `post_ai_config_models_discover`：POST /api/ai/config/models/discover
- `post_ai_confirm`：POST /api/ai/confirm
- `post_ai_decision_config`：POST /api/ai/decision/config
- `post_ai_decision_test`：POST /api/ai/decision/test；外部前提候选：真实付费模型、OCR或供应商
- `post_ai_knowledge_upload`：POST /api/ai/knowledge/upload
- `post_ai_parse_address`：POST /api/ai/parse-address；外部前提候选：真实模型解析或翻译配置
- `post_ai_parse_product`：POST /api/ai/parse-product；外部前提候选：真实模型解析或翻译配置
- `post_ai_recognize_payment_proof`：POST /api/ai/recognize-payment-proof；外部前提候选：付款凭证真实DeepSeek视觉配置
- `post_ai_scan_waybill`：POST /api/ai/scan-waybill；外部前提候选：真实Paddle面单识别配置
- `post_ai_test`：POST /api/ai/test；外部前提候选：真实付费模型、OCR或供应商
- `post_ai_test_embedding`：POST /api/ai/test/embedding；外部前提候选：真实付费模型、OCR或供应商
- `post_ai_translate`：POST /api/ai/translate；外部前提候选：真实模型解析或翻译配置
- `post_ai_translate_batch`：POST /api/ai/translate-batch；外部前提候选：真实模型解析或翻译配置
- `post_ai_upload`：POST /api/ai/upload
- `put_ai_chat_conversations_by_conversationId`：PUT /api/ai/chat/conversations/:conversationId

验收情景编号：`capability:ai-center`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="ai-chat"></a>
## AI 对话与业务助手

自然语言任务：请按当前权限完成“AI 对话与业务助手”所需操作，并回读实际结果。业务步骤：

1. 打开“AI 对话与业务助手”，在侧边栏选择已有会话或点击“新对话”；会话标题用于确认当前上下文。
2. 点击“工具与插件”选择需要的业务能力，核对当前模型；提问时写出具体订单号、客户或产品，必要时附上文件。
3. 发送后阅读安全阶段提示、来源和文件结果。需要中止时停止当前生成，再检查已返回结果；停止本身不证明任何写入完成。
4. 业务动作出现确认卡时逐项核对对象、修改字段和影响；明确确认后再执行，结果未知先读取原对象或回执。
5. 打开回答中的附件或引用检查内容；需要诊断时使用页头“导出脱敏诊断包”，不要把密钥或原始敏感日志放入问题。
6. 连接、模型或权限错误按当前错误提示处理，保留原会话再重试；外部模型费用与可用能力取决于企业配置。页头教程按钮用于随时重读操作说明。

角色候选：BOSS、SALES。前置对象：conversation、local-document、knowledge-record、usage-record、unconfigured-provider、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_ai_chat_conversations_by_conversationId`：DELETE /api/ai/chat/conversations/:conversationId
- `get_ai_chat_conversations`：GET /api/ai/chat/conversations
- `get_ai_chat_conversations_by_conversationId`：GET /api/ai/chat/conversations/:conversationId
- `get_ai_chat_models`：GET /api/ai/chat/models
- `post_ai_chat`：POST /api/ai/chat；外部前提候选：真实付费模型、OCR或供应商
- `post_ai_chat_stream`：POST /api/ai/chat/stream（stream，使用原协议）
- `post_ai_config_models_discover`：POST /api/ai/config/models/discover
- `put_ai_chat_conversations_by_conversationId`：PUT /api/ai/chat/conversations/:conversationId

验收情景编号：`capability:ai-chat`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="knowledge"></a>
## 受控知识库

自然语言任务：请按当前权限完成“受控知识库”所需操作，并回读实际结果。业务步骤：

1. 平台管理员进入“智能指挥中心 → 受控知识库”，先读现有文档的标题、分类和启用状态。
2. 选择“知识文件”，按输入框列出的格式上传，可填写标题和分类；没有选文件会提示“请先选择知识文件”。
3. 提交后等待“知识文件已解析并加入受控知识库”，在列表检查文档及解析结果；上传失败保留待上传文件按错误重试。
4. 按需要点击启用/停用，回读文档状态；停用用于暂不参与检索，原文档仍可管理。
5. 机器人回答中的引用仍需核对原文和本人对象权限；文档上传成功不证明每种问题都已正确检索。
6. 删除先阅读“全部知识片段会永久删除”的确认，核对目标文档再提交；成功后文档不再供机器人引用，失败查询列表后再决定处理。

角色候选：PLATFORM_ADMIN。前置对象：conversation、local-document、knowledge-record、usage-record、unconfigured-provider、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_ai_knowledge_by_documentId`：DELETE /api/ai/knowledge/:documentId
- `get_ai_knowledge`：GET /api/ai/knowledge
- `patch_ai_knowledge_by_documentId_status`：PATCH /api/ai/knowledge/:documentId/status
- `post_ai_knowledge_upload`：POST /api/ai/knowledge/upload

验收情景编号：`capability:knowledge`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="ai-usage"></a>
## AI 用量、成本与诊断

自然语言任务：请按当前权限完成“AI 用量、成本与诊断”所需操作，并回读实际结果。业务步骤：

1. 平台管理员进入智能指挥中心，点击“刷新统计”并核对当前统计周期、供应商、模型和功能。
2. 阅读输入/输出Token、人民币成本、失败率及费用未确认数量；费用未确认的调用不计入已知成本，不把估算当成官方账单。
3. 切换调用明细、按模型、按人员或按日期页签，查看对应请求的成功/失败、用量和所属功能，定位异常日期或配置。
4. 诊断使用配置测试与最近失败入口，记录错误分类和延迟；真实错误详情按受保护服务端日志核对，避免公开密钥。
5. OCR页数与配额使用独立审计账本，不与AI Token合并；需要OCR统计切换“面单 / 名片 OCR”。
6. 清空AI用量先确认影响，执行后只清AI账本，OCR审计不会随之删除；清零失败先刷新核对，不把按钮点击当成已清理。

角色候选：PLATFORM_ADMIN。前置对象：conversation、local-document、knowledge-record、usage-record、unconfigured-provider、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_ai_usage`：DELETE /api/ai/usage
- `get_ai_deepseek_balance`：GET /api/ai/deepseek-balance；外部前提候选：真实付费模型、OCR或供应商
- `get_ai_usage`：GET /api/ai/usage

验收情景编号：`capability:ai-usage`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="ocr"></a>
## 业务 OCR 与用量审计

自然语言任务：请按当前权限完成“业务 OCR 与用量审计”所需操作，并回读实际结果。业务步骤：

1. 按业务对象进入识别入口：展会/客户名片、仓库面单或订单收款凭证；公开展会仅按留资授权使用名片入口，管理统计在智能中心。
2. 上传清晰图片或允许的PDF，等待读取或识别结果。销售名片、仓库面单、本人收款各受原岗位和对象权限限制，不能通过OCR扩大访问。
3. 名片逐项核对姓名、公司、联系方式和归属，缺失字段留待补充；面单检查承运商与单号，识别失败不代表文件未上传。
4. 付款凭证逐张核对币种、实际到账金额与识别依据；修改金额或币种时填写人工修正依据，再“确认识别金额无误”或“确认人工核对金额”。
5. 业务保存后回读原名片、面单或订单。已保存文件但识别失败时只“重新识别”，不重复上传已成功文件；OCR结果不代替人工确认或真实到账。
6. 平台管理员进入“面单 / 名片 OCR”，查看北京时间今日配额、按人员记录和成功/失败审计；服务未配置时按提示处理，当前实拍只覆盖审计与配额，未执行识别。

角色候选：BOSS、SALES、PACKER、SOCIAL_OPERATOR、PLATFORM_ADMIN、PUBLIC。前置对象：conversation、local-document、knowledge-record、usage-record、unconfigured-provider、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `post_ai_recognize_payment_proof`：POST /api/ai/recognize-payment-proof；外部前提候选：付款凭证真实DeepSeek视觉配置
- `post_ai_scan_waybill`：POST /api/ai/scan-waybill；外部前提候选：真实Paddle面单识别配置
- `post_exhibition_ocr_business_card`：POST /api/exhibition-ocr/business-card；外部前提候选：真实付费模型、OCR或供应商
- `post_exhibition_ocr_business_card_preview`：POST /api/exhibition-ocr/business-card-preview；外部前提候选：真实付费模型、OCR或供应商

验收情景编号：`capability:ocr`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
