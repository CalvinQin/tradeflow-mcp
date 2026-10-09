# 客户、复盘、跟进与治理

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

以公司主体、渠道身份和负责人定位客户；查最近沟通、版本、正式订单、开放跟进、删除/分享引用；相似名称不能单独作为同一主体证据。

普通建档、地址/标签、已发生沟通和复盘按当前字段保存；跟进结果保留沟通证据。导入/合并/转移先取原网站候选与影响预览，明确用户授权后执行。

回读档案、联系人/地址、时间线和当天待办；核对负责人、等级、最新沟通和下次时间。删除后查回收站，恢复后查正式列表。

E级不生成首次或重复跟进；人工非E暂停/关闭保留。新事实可按规则恢复E造成的暂缓。正式订单决定成交/复购；PI草稿不计成交。外部AI回复建议和推送需各自配置与授权。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/customers.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="customers"></a>
## 客户管理

自然语言任务：请按当前权限完成“客户管理”所需操作，并回读实际结果。业务步骤：

1. 合并或删除前确认是否为同一真实主体。
2. 不要仅凭相似名称判断重复客户。
3. 填写公司、国家、地址、联系方式和负责人。
4. 同一公司可保留多个联系人及不同渠道。
5. 先看最近互动，再安排下一步。
6. 删除前检查订单与公开分享引用。

角色候选：BOSS、SALES、SOCIAL_OPERATOR。前置对象：owned-account、foreign-account、contact、address、tag、activity、followup、review、deleted-account；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_customers_by_id`：DELETE /api/customers/:id
- `delete_customers_workspace_by_id`：DELETE /api/customers/workspace/:id
- `delete_customers_workspace_by_id_activities_by_activityId`：DELETE /api/customers/workspace/:id/activities/:activityId
- `get_customers`：GET /api/customers
- `get_customers_check_follow_ups`：GET /api/customers/check-follow-ups
- `get_customers_workspace`：GET /api/customers/workspace
- `get_customers_workspace_by_id`：GET /api/customers/workspace/:id
- `get_customers_workspace_by_id_context`：GET /api/customers/workspace/:id/context
- `get_customers_workspace_by_id_context_media_by_kind_by_mediaId`：GET /api/customers/workspace/:id/context/media/:kind/:mediaId
- `get_customers_workspace_by_id_order_candidates`：GET /api/customers/workspace/:id/order-candidates
- `get_customers_workspace_duplicates`：GET /api/customers/workspace/duplicates
- `get_customers_workspace_followups_preview`：GET /api/customers/workspace/followups/preview
- `get_customers_workspace_matches`：GET /api/customers/workspace/matches
- `get_customers_workspace_options`：GET /api/customers/workspace/options
- `get_customers_workspace_overdue_report`：GET /api/customers/workspace/overdue-report
- `get_customers_workspace_source_identity`：GET /api/customers/workspace/source-identity
- `get_customers_workspace_tags`：GET /api/customers/workspace/tags
- `get_customers_workspace_transfer_owners`：GET /api/customers/workspace/transfer-owners
- `get_customers_workspace_trash`：GET /api/customers/workspace/trash
- `get_customers_workspace_trash_by_id`：GET /api/customers/workspace/trash/:id
- `post_customers`：POST /api/customers
- `post_customers_test_push`：POST /api/customers/test-push
- `post_customers_workspace`：POST /api/customers/workspace
- `post_customers_workspace_by_id_bind_order`：POST /api/customers/workspace/:id/bind-order
- `post_customers_workspace_by_id_followups`：POST /api/customers/workspace/:id/followups
- `post_customers_workspace_by_id_reply_suggestion`：POST /api/customers/workspace/:id/reply-suggestion；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_by_id_transfer`：POST /api/customers/workspace/:id/transfer
- `post_customers_workspace_duplicates_review`：POST /api/customers/workspace/duplicates/review；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_followups_batch`：POST /api/customers/workspace/followups/batch
- `post_customers_workspace_import`：POST /api/customers/workspace/import
- `post_customers_workspace_merge`：POST /api/customers/workspace/merge
- `post_customers_workspace_merge_review`：POST /api/customers/workspace/merge/review；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_tags`：POST /api/customers/workspace/tags
- `post_customers_workspace_trash_by_id_restore`：POST /api/customers/workspace/trash/:id/restore
- `put_customers_by_id`：PUT /api/customers/:id
- `put_customers_workspace_by_id`：PUT /api/customers/workspace/:id
- `put_customers_workspace_by_id_activities_by_activityId`：PUT /api/customers/workspace/:id/activities/:activityId
- `put_customers_workspace_by_id_addresses`：PUT /api/customers/workspace/:id/addresses
- `put_customers_workspace_by_id_review`：PUT /api/customers/workspace/:id/review
- `put_customers_workspace_by_id_tags`：PUT /api/customers/workspace/:id/tags
- `put_customers_workspace_stages`：PUT /api/customers/workspace/stages
- `put_customers_workspace_tags_by_tagId`：PUT /api/customers/workspace/tags/:tagId

验收情景编号：`capability:customers`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="customer-followup"></a>
## 快速跟进与客户分级

自然语言任务：请按当前权限完成“快速跟进与客户分级”所需操作，并回读实际结果。业务步骤：

1. 在客户档案或待跟进任务中打开快速跟进，先读最近沟通和待办，批量记录前检查已选客户。
2. 填写“本次跟进内容”；可留空，系统将记录“已跟进”，需要业务证据时应写清实际沟通和下一步。
3. 在“客户分级”选择保留原级别或E、D、C1/C2、B1/B2；E级为暂缓，暂不安排跟进，成单/复购由真实订单决定。
4. 核对“下次联系”的服务器自动建议和法定假期提示；可选真实约定日期，或点击“恢复自动安排”。自动安排读取失败点击“重试读取”。
5. 点击“记录本次跟进”或“统一记录…项跟进”，保存后在客户时间线和任务列表回读内容、分级及日期。
6. 提交结果未知时保留输入，点击“重试核对结果”核对同一次提交，不重新录入；离开前处理未保存提示。

角色候选：BOSS、SALES、SOCIAL_OPERATOR。前置对象：owned-account、foreign-account、contact、address、tag、activity、followup、review、deleted-account；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_customers_workspace_by_id`：DELETE /api/customers/workspace/:id
- `delete_customers_workspace_by_id_activities_by_activityId`：DELETE /api/customers/workspace/:id/activities/:activityId
- `delete_todos_by_id`：DELETE /api/todos/:id
- `get_customers_workspace`：GET /api/customers/workspace
- `get_customers_workspace_by_id`：GET /api/customers/workspace/:id
- `get_customers_workspace_followups_preview`：GET /api/customers/workspace/followups/preview
- `get_todos`：GET /api/todos
- `post_customers_workspace`：POST /api/customers/workspace
- `post_customers_workspace_by_id_followups`：POST /api/customers/workspace/:id/followups
- `post_customers_workspace_duplicates_review`：POST /api/customers/workspace/duplicates/review；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_followups_batch`：POST /api/customers/workspace/followups/batch
- `post_customers_workspace_merge_review`：POST /api/customers/workspace/merge/review；外部前提候选：客户工作台真实模型配置
- `post_todos`：POST /api/todos
- `post_todos_followups_by_id_complete`：POST /api/todos/followups/:id/complete
- `put_customers_workspace_by_id`：PUT /api/customers/workspace/:id
- `put_customers_workspace_by_id_activities_by_activityId`：PUT /api/customers/workspace/:id/activities/:activityId
- `put_customers_workspace_by_id_review`：PUT /api/customers/workspace/:id/review
- `put_todos_by_id`：PUT /api/todos/:id

验收情景编号：`capability:customer-followup`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="customer-reviews"></a>
## 客户复盘与证据

自然语言任务：请按当前权限完成“客户复盘与证据”所需操作，并回读实际结果。业务步骤：

1. 打开客户档案，在“阿里店铺与询盘复盘”核对店铺、买家编号及导入时间，先读记录中的来源或待确认原因。
2. 展开最新复盘，读取统计区间、沟通状态、建议等级、分级依据以及买家最近消息和卖家最近回复；未显示的时间不补成事实。
3. 查看需求明细、买家主页与“原始会话”链接，再展开“查看 Accio 提交的客户资料”核对接待账号和背景字段。
4. 建议等级仅供人工复核，当前客户分级、负责人及已填资料按档案保留；更早复盘从时间线继续查阅。
5. 需要补充背景与实际沟通时在“客户背景与本次沟通”修改并“保存全部”；版本冲突先核对新资料，结果未知点击“重试核对提交”。原始Agent复盘仍作为来源记录保留。
6. 订单、名片、展会或询盘证据读取失败时在对应证据分区重试；身份未确认的导入由老板在待处理队列核对，不猜测负责人。

角色候选：BOSS、SALES、SOCIAL_OPERATOR。前置对象：owned-account、foreign-account、contact、address、tag、activity、followup、review、deleted-account；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_customers_workspace_by_id`：DELETE /api/customers/workspace/:id
- `delete_customers_workspace_by_id_activities_by_activityId`：DELETE /api/customers/workspace/:id/activities/:activityId
- `get_customers_workspace_by_id`：GET /api/customers/workspace/:id
- `get_customers_workspace_by_id_context`：GET /api/customers/workspace/:id/context
- `get_customers_workspace_by_id_context_media_by_kind_by_mediaId`：GET /api/customers/workspace/:id/context/media/:kind/:mediaId
- `get_customers_workspace_followups_preview`：GET /api/customers/workspace/followups/preview
- `get_customers_workspace_tags`：GET /api/customers/workspace/tags
- `get_system_mcp_clients_reviews`：GET /api/system/mcp-clients/reviews
- `post_customers_workspace_duplicates_review`：POST /api/customers/workspace/duplicates/review；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_merge_review`：POST /api/customers/workspace/merge/review；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_tags`：POST /api/customers/workspace/tags
- `post_system_mcp_clients_reviews_by_id_dismiss`：POST /api/system/mcp-clients/reviews/:id/dismiss
- `post_system_mcp_clients_reviews_by_id_resolve`：POST /api/system/mcp-clients/reviews/:id/resolve
- `put_customers_workspace_by_id`：PUT /api/customers/workspace/:id
- `put_customers_workspace_by_id_activities_by_activityId`：PUT /api/customers/workspace/:id/activities/:activityId
- `put_customers_workspace_by_id_review`：PUT /api/customers/workspace/:id/review
- `put_customers_workspace_by_id_tags`：PUT /api/customers/workspace/:id/tags
- `put_customers_workspace_tags_by_tagId`：PUT /api/customers/workspace/tags/:tagId

验收情景编号：`capability:customer-reviews`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="customer-review-dashboard"></a>
## 客户复盘面板

自然语言任务：请按当前权限完成“客户复盘面板”所需操作，并回读实际结果。业务步骤：

1. 老板在客户工作区打开“客户复盘数据面板”，选择“周视图”或“月视图”；时间按北京时间，周为周一至周日。
2. 使用上一期、下一期或日期选择切换周期，再点击“刷新客户复盘面板”读取当前报告。
3. 在“跟进成效与逾期”查看团队汇总与人员明细，核对已评估任务、逾期、成单和复购各自分母，正式关联订单与PI草稿分开。
4. 从具体客户行打开档案，核对负责人、任务日期、实际完成时间和关联订单；返回面板保留当前周期及查询上下文。
5. 需要核对删除客户时切换“客户回收站”，阅读原负责人、删除人、删除时间及保留截止时间。
6. 报告读取失败按错误重试，不用此前数据判断本期完成；其他岗位看到只读权限提示，不能借链接查看老板报告。

角色候选：BOSS。前置对象：owned-account、foreign-account、contact、address、tag、activity、followup、review、deleted-account；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_customers_workspace_followups_preview`：GET /api/customers/workspace/followups/preview
- `get_customers_workspace_overdue_report`：GET /api/customers/workspace/overdue-report

验收情景编号：`capability:customer-review-dashboard`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="customer-recycle"></a>
## 客户回收站

自然语言任务：请按当前权限完成“客户回收站”所需操作，并回读实际结果。业务步骤：

1. 老板从“客户复盘数据面板 → 客户回收站”进入，使用搜索定位客户、联系人、国家或原负责人。
2. 检查客户、原负责人、删除人/时间及“保留至”，点击客户的“找回”打开完整恢复资料。
3. 核对是否仍在15天保留期以及系统canRestore提示；在“恢复后的负责人”选择列表中允许的接收人。
4. 点击“恢复客户”，成功后回到客户列表检查负责人和历史资料；恢复不是新建客户，也不重算历史订单。
5. 结果未知时保留同一次恢复请求并按提示重试核对，不重复创建；读取失败先“刷新客户回收站”。
6. 超过保留期时按钮显示“已超过保留期”；有保护或负责人不可用时按提示处理，不改写保留截止时间。

角色候选：BOSS。前置对象：owned-account、foreign-account、contact、address、tag、activity、followup、review、deleted-account；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_customers_workspace_by_id`：DELETE /api/customers/workspace/:id
- `get_customers_workspace_by_id`：GET /api/customers/workspace/:id
- `get_customers_workspace_trash`：GET /api/customers/workspace/trash
- `get_customers_workspace_trash_by_id`：GET /api/customers/workspace/trash/:id
- `post_customers_workspace_trash_by_id_restore`：POST /api/customers/workspace/trash/:id/restore
- `put_customers_workspace_by_id`：PUT /api/customers/workspace/:id

验收情景编号：`capability:customer-recycle`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="customer-governance"></a>
## 客户导入、合并与归属

自然语言任务：请按当前权限完成“客户导入、合并与归属”所需操作，并回读实际结果。业务步骤：

1. 批量导入点击“批量导入 → 下载 Excel 模板”，填写客户名称、来源、分级与联系人等真实字段，上传XLSX或CSV。
2. 预览解析行和错误，选择“全部归属自己”或当前岗位允许的业务员接收范围；不能依赖旧文件负责人列自动覆盖归属。
3. 确认导入后核对成功、失败及客户档案；取消有已解析数据的导入时先处理放弃确认。
4. 重名治理打开“重名客户检查”，查看AI建议与证据，选择保留主档，点击“预览合并”逐项比较联系人、地址、订单和跟进。
5. 需要时使用“AI 核对并整理”，人工修改整理结果，再点击“确认合并”或“合并已选建议”；主档来源与负责人保留，订单金额和历史单据不改写。
6. 转交使用“客户转交”选择当前可用负责人并核对移交预览；返回档案检查归属。检查、合并或转交失败按原错误处理，证据不足的主体不要合并。

角色候选：BOSS、SALES、SOCIAL_OPERATOR。前置对象：owned-account、foreign-account、contact、address、tag、activity、followup、review、deleted-account；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_customers_workspace_duplicates`：GET /api/customers/workspace/duplicates
- `get_customers_workspace_matches`：GET /api/customers/workspace/matches
- `get_customers_workspace_source_identity`：GET /api/customers/workspace/source-identity
- `get_customers_workspace_tags`：GET /api/customers/workspace/tags
- `get_customers_workspace_transfer_owners`：GET /api/customers/workspace/transfer-owners
- `post_customers_workspace_by_id_bind_order`：POST /api/customers/workspace/:id/bind-order
- `post_customers_workspace_by_id_transfer`：POST /api/customers/workspace/:id/transfer
- `post_customers_workspace_duplicates_review`：POST /api/customers/workspace/duplicates/review；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_import`：POST /api/customers/workspace/import
- `post_customers_workspace_merge`：POST /api/customers/workspace/merge
- `post_customers_workspace_merge_review`：POST /api/customers/workspace/merge/review；外部前提候选：客户工作台真实模型配置
- `post_customers_workspace_tags`：POST /api/customers/workspace/tags
- `put_customers_workspace_by_id_addresses`：PUT /api/customers/workspace/:id/addresses
- `put_customers_workspace_by_id_tags`：PUT /api/customers/workspace/:id/tags
- `put_customers_workspace_stages`：PUT /api/customers/workspace/stages
- `put_customers_workspace_tags_by_tagId`：PUT /api/customers/workspace/tags/:tagId

验收情景编号：`capability:customer-governance`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
