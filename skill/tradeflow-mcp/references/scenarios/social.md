# 询盘、邮箱、WhatsApp与Meta

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

核对当前用户公司/渠道/邮箱绑定、会话双方和时间、附件、客户归属、收件人及草稿内容；查真实连接/能力状态。

普通本地会话、建档、标签/订单关联按原网站入口；生成建议/翻译保留来源并人工复核。发送前展示完整收件会话/正文/附件，得到明确授权后按原任务执行。

查会话消息/附件、客户关系、回复意图、任务和真实回执；发送结果未知先查原operationId和会话，禁止换键重发。

配置保存不等于真实渠道收发；SMTP/WhatsApp/Meta需要各自官方授权、资产、费用与发送权限。隔离环境只能验证本地业务和缺失前提的拒绝，不编造送达/广告执行成功。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/social.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="inquiries"></a>
## 独立站询盘

自然语言任务：请按当前权限完成“独立站询盘”所需操作，并回读实际结果。业务步骤：

1. 核对来源、国家、产品和联系方式。
2. 分派负责人后再进入回复流程。
3. AI 润色只能优化表达，不能虚构价格、库存或交期。
4. 发送前检查收件人、语言和附件。
5. 保留沟通历史和处理状态。
6. 关闭询盘时填写可复盘原因。

角色候选：BOSS、SALES。前置对象：inquiry、email-thread、channel、conversation、message、reply-intent、local-attachment、empty-provider-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_inquiries_by_id`：DELETE /api/inquiries/:id
- `get_inquiries`：GET /api/inquiries
- `get_inquiries_by_id_reply_context`：GET /api/inquiries/:id/reply-context
- `get_inquiries_by_id_threads`：GET /api/inquiries/:id/threads
- `get_inquiries_unread`：GET /api/inquiries/unread
- `post_inquiries_batch_delete`：POST /api/inquiries/batch-delete
- `post_inquiries_batch_send`：POST /api/inquiries/batch-send；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_by_id_ai_reply`：POST /api/inquiries/:id/ai-reply；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_by_id_analyze_tags`：POST /api/inquiries/:id/analyze-tags；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_by_id_read`：POST /api/inquiries/:id/read
- `post_inquiries_by_id_send`：POST /api/inquiries/:id/send；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_create`：POST /api/inquiries/create
- `post_inquiries_customer_by_accountId`：POST /api/inquiries/customer/:accountId
- `post_inquiries_sync_emails`：POST /api/inquiries/sync-emails；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_upload_excel`：POST /api/inquiries/upload-excel
- `put_inquiries_by_id`：PUT /api/inquiries/:id
- `put_inquiries_by_id_tags`：PUT /api/inquiries/:id/tags

验收情景编号：`capability:inquiries`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="mail"></a>
## 往来邮件

自然语言任务：请按当前权限完成“往来邮件”所需操作，并回读实际结果。业务步骤：

1. 先在“个人设置”保存本人邮箱连接，再进入“往来邮件”；使用“全部、未读、待回复、已发送”定位需要处理的会话。
2. 打开会话阅读完整往来，展开“邮件详情”核对发件人、收件人、抄送和回复地址，预览或下载需要的附件。
3. 点击“同步”触发后台取信，稍后重新读取；若出现“邮件刷新失败”，当前已加载邮件仍保留，点击“重试读取”，不要据空态判断没有邮件。
4. 新写邮件先查找收件客户；按钮提示“请先填写邮箱”时到客户档案补联系人邮箱，再返回选择客户。
5. 在回复表单填写收件人、可选抄送、主题和正文，核对附件以及产品、价格和交期；AI润色或翻译需要人工复核。
6. 发送后检查“邮件发送成功”及往来时间线；发送失败按具体错误修正配置或内容，结果不清楚时先查已发送记录。离开有未保存草稿会出现确认，选择继续编辑可保留输入。

角色候选：BOSS、SALES。前置对象：inquiry、email-thread、channel、conversation、message、reply-intent、local-attachment、empty-provider-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_inquiries_by_id`：DELETE /api/inquiries/:id
- `get_inquiries`：GET /api/inquiries
- `get_inquiries_by_id_reply_context`：GET /api/inquiries/:id/reply-context
- `get_inquiries_by_id_threads`：GET /api/inquiries/:id/threads
- `get_inquiries_unread`：GET /api/inquiries/unread
- `post_inquiries_batch_delete`：POST /api/inquiries/batch-delete
- `post_inquiries_batch_send`：POST /api/inquiries/batch-send；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_by_id_ai_reply`：POST /api/inquiries/:id/ai-reply；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_by_id_analyze_tags`：POST /api/inquiries/:id/analyze-tags；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_by_id_read`：POST /api/inquiries/:id/read
- `post_inquiries_by_id_send`：POST /api/inquiries/:id/send；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_create`：POST /api/inquiries/create
- `post_inquiries_customer_by_accountId`：POST /api/inquiries/customer/:accountId
- `post_inquiries_sync_emails`：POST /api/inquiries/sync-emails；外部前提候选：真实邮箱/发信授权或模型
- `post_inquiries_upload_excel`：POST /api/inquiries/upload-excel
- `put_inquiries_by_id`：PUT /api/inquiries/:id
- `put_inquiries_by_id_tags`：PUT /api/inquiries/:id/tags

验收情景编号：`capability:mail`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="social-dashboard"></a>
## 社媒运营面板

自然语言任务：请按当前权限完成“社媒运营面板”所需操作，并回读实际结果。业务步骤：

1. 进入“社媒增长中心”，选择日期范围，等待读取完成后查看当前周期会话、建档和回复指标。
2. 点击运营状态图的待建档、待回复或待跟进节点，进入对应WhatsApp会话或客户处理列表。
3. 在会话核对消息来源和客户归属，完成需要的建档、关联、回复或跟进后返回面板。
4. 使用“刷新社媒数据”读取处理后的统计；会话、客户和正式订单分别统计，不把草稿或平台接受数当成成交或送达。
5. 查看“发出，然后确认”的发送漏斗；待发、接受、失败和未知结果仍在发送意图分母，平台接受不显示为送达。
6. 没有接入渠道时使用“管理接入渠道”；读取失败保留当前周期并按错误重试。演示数据只说明虚构工作流，不证明外部渠道已接通。

角色候选：BOSS、SOCIAL_OPERATOR。前置对象：inquiry、email-thread、channel、conversation、message、reply-intent、local-attachment、empty-provider-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_social_conversations`：GET /api/social/conversations
- `get_social_conversations_by_id`：GET /api/social/conversations/:id
- `get_social_conversations_by_id_customer_workspace`：GET /api/social/conversations/:id/customer-workspace
- `get_social_conversations_by_id_media_by_messageId`：GET /api/social/conversations/:id/media/:messageId
- `get_social_conversations_by_id_reply_by_intentId`：GET /api/social/conversations/:id/reply/:intentId；外部前提候选：WhatsApp渠道或真实模型
- `get_social_metrics`：GET /api/social/metrics
- `patch_social_conversations_by_id`：PATCH /api/social/conversations/:id
- `post_social_conversations`：POST /api/social/conversations
- `post_social_conversations_by_id_followup`：POST /api/social/conversations/:id/followup
- `post_social_conversations_by_id_insights`：POST /api/social/conversations/:id/insights；外部前提候选：WhatsApp渠道或真实模型
- `post_social_conversations_by_id_reply`：POST /api/social/conversations/:id/reply；外部前提候选：WhatsApp渠道或真实模型
- `post_social_conversations_by_id_translate`：POST /api/social/conversations/:id/translate；外部前提候选：WhatsApp渠道或真实模型
- `post_social_conversations_by_id_upload`：POST /api/social/conversations/:id/upload

验收情景编号：`capability:social-dashboard`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="whatsapp"></a>
## WhatsApp 会话与客户

自然语言任务：请按当前权限完成“WhatsApp 会话与客户”所需操作，并回读实际结果。业务步骤：

1. 进入“WhatsApp 会话”，选择发送账号/渠道，搜索姓名或号码，并用会话列表筛选定位当前消息。
2. 需要新会话时点击“开始新对话”，选择发送账号、填写含国家代码的号码和可选姓名；创建后先核对会话对象，再写消息。
3. 阅读消息正文、时间与附件，按需要选择收到消息的翻译语言；客户侧栏可关联已有客户，再补充需求、负责人和订单上下文。
4. 在回复正文或附件说明中编辑内容，使用“添加附件”选择文件；检查翻译预览、收件会话与真实承诺后点击“发送”。
5. 服务窗口过期按提示使用获准模板；没有配置、权限或发送条件时先处理错误，不用普通文本绕过条件。
6. 发送后核对平台接受、送达或失败状态。显示“原发送结果待核对”时点击“核对原发送”，保持原提交，不再次发送相同内容。
7. 用“刷新会话”回读客户关联和消息；客户更新发生版本冲突时读取新资料再核对。本轮合成示例不向真实号码外发。

角色候选：BOSS、SALES、SOCIAL_OPERATOR。前置对象：inquiry、email-thread、channel、conversation、message、reply-intent、local-attachment、empty-provider-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_social_accounts_by_id_qr`：GET /api/social/accounts/:id/qr；外部前提候选：WhatsApp渠道或真实模型
- `get_social_channels`：GET /api/social/channels
- `get_social_channels_by_id_templates`：GET /api/social/channels/:id/templates；外部前提候选：WhatsApp渠道或真实模型
- `get_social_conversations`：GET /api/social/conversations
- `get_social_conversations_by_id`：GET /api/social/conversations/:id
- `get_social_conversations_by_id_customer_workspace`：GET /api/social/conversations/:id/customer-workspace
- `get_social_conversations_by_id_media_by_messageId`：GET /api/social/conversations/:id/media/:messageId
- `get_social_conversations_by_id_reply_by_intentId`：GET /api/social/conversations/:id/reply/:intentId；外部前提候选：WhatsApp渠道或真实模型
- `get_social_metrics`：GET /api/social/metrics
- `get_social_staff`：GET /api/social/staff
- `get_social_webhook`：GET /api/social/webhook（excluded，使用原协议）
- `patch_social_accounts_by_id`：PATCH /api/social/accounts/:id；外部前提候选：连接动作需真实WhatsApp扫码运行时；名称和成员管理为本地业务
- `patch_social_conversations_by_id`：PATCH /api/social/conversations/:id
- `post_social_accounts`：POST /api/social/accounts
- `post_social_accounts_signup`：POST /api/social/accounts/signup；外部前提候选：WhatsApp渠道或真实模型
- `post_social_accounts_signup_complete`：POST /api/social/accounts/signup/complete；外部前提候选：WhatsApp渠道或真实模型
- `post_social_conversations`：POST /api/social/conversations
- `post_social_conversations_by_id_followup`：POST /api/social/conversations/:id/followup
- `post_social_conversations_by_id_insights`：POST /api/social/conversations/:id/insights；外部前提候选：WhatsApp渠道或真实模型
- `post_social_conversations_by_id_reply`：POST /api/social/conversations/:id/reply；外部前提候选：WhatsApp渠道或真实模型
- `post_social_conversations_by_id_translate`：POST /api/social/conversations/:id/translate；外部前提候选：WhatsApp渠道或真实模型
- `post_social_conversations_by_id_upload`：POST /api/social/conversations/:id/upload
- `post_social_webhook`：POST /api/social/webhook（excluded，使用原协议）
- `put_social_channels`：PUT /api/social/channels

验收情景编号：`capability:whatsapp`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="meta-ads"></a>
## Meta 广告与主页

自然语言任务：请按当前权限完成“Meta 广告与主页”所需操作，并回读实际结果。业务步骤：

1. 进入“Meta 广告与主页”，选择Meta连接及广告账户；没有资产时在“Meta连接与资产”验证授权并保存，令牌仅由服务器保护。
2. 切换广告层级或公共主页，设置统计起止日期和投放状态；搜索只用于当前页，缺失指标显示“—”，触达不直接累加。
3. 查看广告名称/ID、预算、排期和指标，或主页公开资料；修改前确认实际资产、币种和授权范围。
4. 点击暂停、恢复或“编辑设置”后检查预览；广告预算、排期和恢复可能产生费用，主页修改会改变公开信息，确认后才提交至Meta。
5. 结果未知时点击“核对原操作”，读取原提交及广告/主页对象；页面不会因未知结果再次发送，不能把请求接受当成修改完成。
6. 读取失败点击“重试读取”，授权缺失按页面列出的权限处理；演示模式仅在演示公司保存虚构修改，不产生真实投放费用。

角色候选：BOSS、SOCIAL_OPERATOR。前置对象：inquiry、email-thread、channel、conversation、message、reply-intent、local-attachment、empty-provider-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_meta_ads_connections_by_id`：DELETE /api/meta-ads/connections/:id
- `get_meta_ads_connections`：GET /api/meta-ads/connections
- `get_meta_ads_connections_by_id_accounts_by_accountId_ads`：GET /api/meta-ads/connections/:id/accounts/:accountId/ads；外部前提候选：Meta真实授权资产与执行权限
- `get_meta_ads_connections_by_id_accounts_by_accountId_objects_by_objectId`：GET /api/meta-ads/connections/:id/accounts/:accountId/objects/:objectId；外部前提候选：Meta真实授权资产与执行权限
- `get_meta_ads_connections_by_id_operations_by_operationId`：GET /api/meta-ads/connections/:id/operations/:operationId；外部前提候选：Meta真实授权资产与执行权限
- `get_meta_ads_connections_by_id_pages_by_pageId`：GET /api/meta-ads/connections/:id/pages/:pageId；外部前提候选：Meta真实授权资产与执行权限
- `post_meta_ads_connections`：POST /api/meta-ads/connections；外部前提候选：真实Meta访问令牌与授权资产，原服务建连前验证供应商权限
- `post_meta_ads_connections_by_id_accounts_by_accountId_preview`：POST /api/meta-ads/connections/:id/accounts/:accountId/preview；外部前提候选：Meta真实授权资产与执行权限
- `post_meta_ads_connections_by_id_execute`：POST /api/meta-ads/connections/:id/execute；外部前提候选：Meta真实授权资产与执行权限
- `post_meta_ads_connections_by_id_pages_by_pageId_preview`：POST /api/meta-ads/connections/:id/pages/:pageId/preview；外部前提候选：Meta真实授权资产与执行权限
- `post_meta_ads_connections_by_id_sync`：POST /api/meta-ads/connections/:id/sync；外部前提候选：Meta真实授权资产与执行权限

验收情景编号：`capability:meta-ads`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="social-settings"></a>
## WhatsApp 接入配置

自然语言任务：请按当前权限完成“WhatsApp 接入配置”所需操作，并回读实际结果。业务步骤：

1. 老板先在用户管理创建独立“社媒运营”账号，再进入“WhatsApp 接入配置”；运营账号负责已接入会话，不以账号创建代替渠道授权。
2. 在Meta企业应用启用WhatsApp，取得测试号码的号码ID、WABA ID、访问令牌与App Secret；由管理员完成服务器的加密配置。
3. 填写渠道名称、号码ID、WABA ID、Meta控制台当前支持的API版本、访问令牌、App Secret与Webhook验证口令，点击“保存渠道”。
4. 在Meta回调设置使用本公司API的HTTPS地址加 /api/social/webhook，填写同一验证口令并订阅messages；回调属于对应公司环境。
5. 从获准测试接收号码发一条消息，在WhatsApp工作台核对会话、客户和发送账号，人工确认回复后查看真实送达状态。
6. 配置失败按字段或回调错误修正后重新保存；更换授权再次检查收发。保存成功不证明真实接通，共存或历史同步取决于账号资格，不自动导入个人聊天历史。

角色候选：BOSS、SOCIAL_OPERATOR。前置对象：inquiry、email-thread、channel、conversation、message、reply-intent、local-attachment、empty-provider-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_social_accounts_by_id_qr`：GET /api/social/accounts/:id/qr；外部前提候选：WhatsApp渠道或真实模型
- `get_social_accounts_config`：GET /api/social/accounts/config
- `get_social_channels`：GET /api/social/channels
- `get_social_channels_by_id_templates`：GET /api/social/channels/:id/templates；外部前提候选：WhatsApp渠道或真实模型
- `patch_social_accounts_by_id`：PATCH /api/social/accounts/:id；外部前提候选：连接动作需真实WhatsApp扫码运行时；名称和成员管理为本地业务
- `post_social_accounts`：POST /api/social/accounts
- `post_social_accounts_signup`：POST /api/social/accounts/signup；外部前提候选：WhatsApp渠道或真实模型
- `post_social_accounts_signup_complete`：POST /api/social/accounts/signup/complete；外部前提候选：WhatsApp渠道或真实模型
- `put_social_channels`：PUT /api/social/channels

验收情景编号：`capability:social-settings`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
