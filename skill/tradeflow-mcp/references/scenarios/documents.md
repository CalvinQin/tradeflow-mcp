# 贸易单据与报关

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

选真实订单或单独PI草稿，读取当前单据版本、公司对外资料、付款资料、历史商品快照与报关字段；未知HS Code先补实证。

普通修订保留版本与来源事实；切换对象前先完成授权保存。AI建议读取当前修订后展示差异，确认后写入；按当前单据导出PDF/XLSX。

回读修订、版本、金额和商品行；导出后取原件全部字节并校验hash，打开核对分页/字体/数量/币种。

PI草稿不能替代正式报关订单；目录更新不静默改写历史单据。POST导出后按回执读后续块，不能为了读文件重复导出；缓存回读仍检查当前对象ACL。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/documents.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="documents"></a>
## 单据工作台

自然语言任务：请按当前权限完成“单据工作台”所需操作，并回读实际结果。业务步骤：

1. 左侧先列正式订单，再单独列 PI 草稿，并保留真实订单状态。
2. 切换订单或单据前会先完成当前修改的保存。
3. 逐行检查品名、型号、数量、价格和产品图。
4. AI 建议必须先读取当前修订，确认卡通过后才写入。
5. 修改后自动保存；失败时保留编辑内容，可点击重试，未保存内容不会被后台刷新静默覆盖。
6. 检查抬头、币种、金额、付款方式、条款与图片。
7. 导出后打开文件抽查分页和中文字体。

角色候选：BOSS、SALES、PACKER、SOCIAL_OPERATOR。前置对象：formal-order、company-profile、blank-document、version、customs-fields；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id_customs_documents`：DELETE /api/orders/:id/customs-documents
- `delete_trade_documents_blank_by_documentId`：DELETE /api/trade-documents/blank/:documentId
- `get_trade_documents`：GET /api/trade-documents
- `get_trade_documents_blank`：GET /api/trade-documents/blank
- `get_trade_documents_blank_by_documentId`：GET /api/trade-documents/blank/:documentId
- `get_trade_documents_by_orderId_by_type`：GET /api/trade-documents/:orderId/:type
- `get_trade_documents_by_orderId_by_type_versions`：GET /api/trade-documents/:orderId/:type/versions
- `get_trade_documents_company_profiles`：GET /api/trade-documents/company-profiles
- `post_orders_by_id_customs_documents`：POST /api/orders/:id/customs-documents
- `post_orders_by_id_packing_print_export`：POST /api/orders/:id/packing-print/export
- `post_trade_documents_blank`：POST /api/trade-documents/blank
- `post_trade_documents_blank_by_documentId_export`：POST /api/trade-documents/blank/:documentId/export
- `post_trade_documents_blank_by_documentId_order`：POST /api/trade-documents/blank/:documentId/order
- `post_trade_documents_blank_by_documentId_preview`：POST /api/trade-documents/blank/:documentId/preview
- `post_trade_documents_by_orderId_by_type_export`：POST /api/trade-documents/:orderId/:type/export
- `post_trade_documents_by_orderId_by_type_preview`：POST /api/trade-documents/:orderId/:type/preview
- `post_trade_documents_by_orderId_by_type_sync`：POST /api/trade-documents/:orderId/:type/sync
- `post_trade_documents_by_orderId_by_type_versions_by_revision_restore`：POST /api/trade-documents/:orderId/:type/versions/:revision/restore
- `post_trade_documents_by_orderId_by_type_writeback_review`：POST /api/trade-documents/:orderId/:type/writeback/review
- `put_trade_documents_blank_by_documentId`：PUT /api/trade-documents/blank/:documentId
- `put_trade_documents_by_orderId_by_type`：PUT /api/trade-documents/:orderId/:type

验收情景编号：`capability:documents`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="customs"></a>
## 报关资料

自然语言任务：请按当前权限完成“报关资料”所需操作，并回读实际结果。业务步骤：

1. PI 草稿不能替代正式报关订单。
2. 订单产品和数量是报关明细的基础。
3. HS Code 不确定时向负责人确认，不要猜测。
4. 产品目录更新不会自动改写已保存历史单据。
5. 先预览，再导出并打开文件抽查。
6. 发现订单事实错误时回到订单修正来源。

角色候选：BOSS、SALES、ACCOUNTANT。前置对象：formal-order、company-profile、blank-document、version、customs-fields；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id_customs_documents`：DELETE /api/orders/:id/customs-documents
- `patch_orders_by_id_customs_status`：PATCH /api/orders/:id/customs-status
- `post_orders_by_id_customs_documents`：POST /api/orders/:id/customs-documents
- `post_orders_by_id_packing_print_export`：POST /api/orders/:id/packing-print/export

验收情景编号：`capability:customs`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
