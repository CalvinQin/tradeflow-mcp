# 展会、线索与现场目录

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

核对展会日期、成员/处理权限、草稿/发布版本、目录范围、客户意向产品和线索身份；准备真实本地名片字节。

普通展会/成员/线索维护使用原对象与版本。发布生成不可变客户目录；后续更改创建新版本。OCR先识别再人工校对，转客户/订单前核对关联。

回读展会、成员、发布目录版本、兴趣商品、负责人/下一步；原公开协议验证目录和留资结果。

OCR/翻译是外部模型前提，不把自动识别当确认事实；公开目录不泄漏原始名片，未绑定线索不能猜归属。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/exhibitions.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="exhibitions"></a>
## 展会中心

自然语言任务：请按当前权限完成“展会中心”所需操作，并回读实际结果。业务步骤：

1. 开始与结束时间影响现场入口和统计。
2. 成员权限决定谁能处理线索。
3. 先保存草稿，再预览客户页面。
4. 发布后客户访问不可变版本；后续更新会创建新版本。
5. 当前后台翻译使用 DeepSeek V4 Flash；历史 Gemini 译文可安全复用。
6. 确认姓名、公司、联系方式、兴趣产品和负责人。
7. 公开入口不会暴露原始名片文件。
8. 优先处理待跟进和高意向线索。
9. 删除展会前检查客户、媒体与公开目录影响。

角色候选：BOSS、SALES。前置对象：exhibition、catalog、lead、member、visit、business-card-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_exhibition_leads_by_id`：DELETE /api/exhibition-leads/:id
- `delete_exhibitions_by_id_background_images`：DELETE /api/exhibitions/:id/background-images
- `delete_exhibitions_by_id_permanent`：DELETE /api/exhibitions/:id/permanent
- `delete_exhibitions_by_id_visits`：DELETE /api/exhibitions/:id/visits
- `get_calendar_exhibitions`：GET /api/calendar/exhibitions
- `get_exhibition_leads_by_id`：GET /api/exhibition-leads/:id
- `get_exhibition_leads_by_id_business_card`：GET /api/exhibition-leads/:id/business-card
- `get_exhibition_leads_by_id_interests_by_interestId_photo`：GET /api/exhibition-leads/:id/interests/:interestId/photo
- `get_exhibitions`：GET /api/exhibitions
- `get_exhibitions_by_id`：GET /api/exhibitions/:id
- `get_exhibitions_by_id_analytics`：GET /api/exhibitions/:id/analytics
- `get_exhibitions_by_id_deletion_preview`：GET /api/exhibitions/:id/deletion-preview
- `get_exhibitions_by_id_leads`：GET /api/exhibitions/:id/leads
- `get_exhibitions_by_id_leads_page`：GET /api/exhibitions/:id/leads/page
- `get_exhibitions_by_id_my_channel`：GET /api/exhibitions/:id/my-channel
- `get_exhibitions_by_id_visits`：GET /api/exhibitions/:id/visits
- `patch_exhibition_leads_by_id`：PATCH /api/exhibition-leads/:id
- `patch_exhibitions_by_id`：PATCH /api/exhibitions/:id
- `post_exhibition_leads_by_id_activities`：POST /api/exhibition-leads/:id/activities
- `post_exhibition_leads_by_id_conversions`：POST /api/exhibition-leads/:id/conversions
- `post_exhibition_leads_by_id_followups_by_taskId_complete`：POST /api/exhibition-leads/:id/followups/:taskId/complete
- `post_exhibition_sync`：POST /api/exhibition-sync
- `post_exhibitions`：POST /api/exhibitions
- `post_exhibitions_by_id_catalog_translations_by_locale_retry`：POST /api/exhibitions/:id/catalog-translations/:locale/retry；外部前提候选：真实付费模型、OCR或供应商
- `post_exhibitions_by_id_close`：POST /api/exhibitions/:id/close
- `post_exhibitions_by_id_end`：POST /api/exhibitions/:id/end
- `post_exhibitions_by_id_interest_photos`：POST /api/exhibitions/:id/interest-photos
- `post_exhibitions_by_id_leads`：POST /api/exhibitions/:id/leads
- `post_exhibitions_by_id_publish`：POST /api/exhibitions/:id/publish
- `put_exhibition_leads_by_id`：PUT /api/exhibition-leads/:id
- `put_exhibitions_by_id_catalog`：PUT /api/exhibitions/:id/catalog
- `put_exhibitions_by_id_members`：PUT /api/exhibitions/:id/members

验收情景编号：`capability:exhibitions`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="exhibition-leads"></a>
## 展会线索详情

自然语言任务：请按当前权限完成“展会线索详情”所需操作，并回读实际结果。业务步骤：

1. 逐项核对 OCR 识别结果，不把自动识别当作已确认事实。
2. 缺失或模糊字段可留空并标记待补充，不要猜测填写。
3. 原始名片仅供授权人员核对，公开入口不会暴露文件。
4. 选择真实沟通过的产品，避免用目录全选代替客户意向。
5. 记录数量、目标市场、认证或交期等关键约束。
6. 翻译内容用于辅助沟通，产品事实仍以已发布资料为准。
7. 高意向线索应给出明确负责人和可执行的下一步。
8. 更新状态时补充沟通结果，避免只改标签不留依据。
9. 转为客户或订单前再次确认联系方式与业务主体。

角色候选：BOSS、SALES。前置对象：exhibition、catalog、lead、member、visit、business-card-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_exhibition_leads_by_id`：DELETE /api/exhibition-leads/:id
- `delete_exhibitions_by_id_visits`：DELETE /api/exhibitions/:id/visits
- `get_exhibition_leads_by_id`：GET /api/exhibition-leads/:id
- `get_exhibition_leads_by_id_business_card`：GET /api/exhibition-leads/:id/business-card
- `get_exhibition_leads_by_id_interests_by_interestId_photo`：GET /api/exhibition-leads/:id/interests/:interestId/photo
- `get_exhibitions_by_id_leads`：GET /api/exhibitions/:id/leads
- `get_exhibitions_by_id_leads_page`：GET /api/exhibitions/:id/leads/page
- `get_exhibitions_by_id_visits`：GET /api/exhibitions/:id/visits
- `patch_exhibition_leads_by_id`：PATCH /api/exhibition-leads/:id
- `post_exhibition_leads_by_id_activities`：POST /api/exhibition-leads/:id/activities
- `post_exhibition_leads_by_id_conversions`：POST /api/exhibition-leads/:id/conversions
- `post_exhibition_leads_by_id_followups_by_taskId_complete`：POST /api/exhibition-leads/:id/followups/:taskId/complete
- `post_exhibition_ocr_business_card`：POST /api/exhibition-ocr/business-card；外部前提候选：真实付费模型、OCR或供应商
- `post_exhibition_ocr_business_card_preview`：POST /api/exhibition-ocr/business-card-preview；外部前提候选：真实付费模型、OCR或供应商
- `post_exhibition_sync`：POST /api/exhibition-sync
- `post_exhibitions_by_id_catalog_translations_by_locale_retry`：POST /api/exhibitions/:id/catalog-translations/:locale/retry；外部前提候选：真实付费模型、OCR或供应商
- `post_exhibitions_by_id_leads`：POST /api/exhibitions/:id/leads
- `put_exhibition_leads_by_id`：PUT /api/exhibition-leads/:id
- `put_exhibitions_by_id_catalog`：PUT /api/exhibitions/:id/catalog
- `put_exhibitions_by_id_members`：PUT /api/exhibitions/:id/members

验收情景编号：`capability:exhibition-leads`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="public-exhibition"></a>
## 展会公开目录

自然语言任务：请按当前权限完成“展会公开目录”所需操作，并回读实际结果。业务步骤：

1. 扫描展会二维码进入公开目录，检查展会名称、已发布目录、业务联系人和语言；语言切换不改变原产品事实。
2. 搜索或筛选分类，打开产品详情，使用“复制型号/数据/参数”或把真实兴趣产品加入意向清单。
3. 打开意向清单填写数量、目标价及特殊要求；照片参考仅用于表达需求，不把目录全选当成真实兴趣。
4. 在联系表填写所需姓名、公司和联系方式；可按页面入口上传名片并识别，逐项核对识别结果后再留资。
5. 阅读并勾选隐私授权，未勾选时表单定位到授权错误；检查兴趣清单后点击当前语言的提交按钮，等待明确成功回执。
6. 提交失败保留资料按字段提示修正；公开页不会展示原始名片文件，内部人员再核对负责人和后续跟进。需要目录时使用“导出目录”并检查PDF内容。

角色候选：PUBLIC。前置对象：exhibition、catalog、lead、member、visit、business-card-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_public_exhibition_channels_by_code`：GET /api/public/exhibition-channels/:code（excluded，使用原协议）
- `get_public_exhibition_channels_by_code_qr`：GET /api/public/exhibition-channels/:code/qr（excluded，使用原协议）
- `post_exhibitions_by_id_catalog_translations_by_locale_retry`：POST /api/exhibitions/:id/catalog-translations/:locale/retry；外部前提候选：真实付费模型、OCR或供应商
- `post_exhibitions_by_id_publish`：POST /api/exhibitions/:id/publish
- `post_public_exhibition_channels_by_code_business_card_ocr`：POST /api/public/exhibition-channels/:code/business-card-ocr（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_catalog_download`：POST /api/public/exhibition-channels/:code/catalog-download（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_events`：POST /api/public/exhibition-channels/:code/events（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_interest_photos`：POST /api/public/exhibition-channels/:code/interest-photos（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_leads`：POST /api/public/exhibition-channels/:code/leads（excluded，使用原协议）
- `put_exhibitions_by_id_catalog`：PUT /api/exhibitions/:id/catalog

验收情景编号：`capability:public-exhibition`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
