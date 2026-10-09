# 订单、PI、付款与关联

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

确认本人客户、产品/规格、币种、付款档案、国家/地址、数量、单价与费用；回读 editVersion、付款阶段、金额签名和既有凭证。

使用订单 wireInput 和网站金额计算；PI草稿可按原协议保存不完整资料，转正式订单前补齐必要商业事实。凭证先上传真实字节，再逐张填金额与阶段；关联订单先预览客户/对象与组关系。

按订单id回读客户、商品快照、价格、币种、总额、凭证、状态与版本；检查持久记录和任务/关联组。旧版本应拒绝，失败不得显示已保存。

产品价格后续修改不重算订单快照；改币种/付款计划按网站新校验。尾款不复用首付凭证；月结只合并同负责人/客户/币种/账户/账期。各关联订单金额、凭证与成本仍独立。审批/收款/删除保留用户明确授权与网站预览。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/orders.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="orders"></a>
## 所有订单

自然语言任务：请按当前权限完成“所有订单”所需操作，并回读实际结果。业务步骤：

1. 筛选条件可组合使用，清除条件后恢复全量。
2. 正式订单与 PI 草稿属于不同业务阶段。
3. 先确认币种和付款方式，再填写产品、金额与物流资料。
4. 编辑历史订单时保留原业务事实；主动切换币种或付款计划会触发新校验。
5. 右上角关闭按钮会先检查未保存修改。
6. 每张凭证填写独立金额，多张合计必须等于本阶段应收。
7. 赊账与客户月结可先计业绩，到账后在订单详情补齐凭证。
8. 不同币种、付款账户或账期不会合并成同一月结单。
9. 打包、面单、报关与物流资料在对应工作台维护。
10. 删除前核对订单号、客户、业绩影响和媒体引用。
11. 历史订单快照不能被产品目录后续修改静默覆盖。

角色候选：BOSS、SOCIAL_OPERATOR。前置对象：customer、product、payment-profile、draft-order、formal-order、receipt-image、linked-orders；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id`：DELETE /api/orders/:id
- `delete_orders_by_id_costs_by_entryId`：DELETE /api/orders/:id/costs/:entryId
- `delete_orders_by_id_customs_documents`：DELETE /api/orders/:id/customs-documents
- `delete_orders_by_id_logistics_share_by_shareId`：DELETE /api/orders/:id/logistics-share/:shareId
- `delete_orders_by_id_unlink`：DELETE /api/orders/:id/unlink
- `get_orders`：GET /api/orders
- `get_orders_by_id`：GET /api/orders/:id
- `get_orders_by_id_costs`：GET /api/orders/:id/costs
- `get_orders_by_id_costs_attachments_by_assetId`：GET /api/orders/:id/costs/attachments/:assetId
- `get_orders_by_id_costs_history`：GET /api/orders/:id/costs/history
- `get_orders_by_id_packing_images_zip`：GET /api/orders/:id/packing-images.zip
- `get_orders_by_id_packing_print`：GET /api/orders/:id/packing-print
- `get_orders_by_id_pi`：GET /api/orders/:id/pi；外部前提候选：PI含需翻译字段时使用真实模型
- `get_orders_imports_operations_by_operationId`：GET /api/orders/imports/operations/:operationId
- `get_orders_stats_customer_sources`：GET /api/orders/stats/customer-sources
- `get_orders_stats_dashboard`：GET /api/orders/stats/dashboard
- `get_orders_stats_history`：GET /api/orders/stats/history
- `get_orders_stream`：GET /api/orders/stream（stream，使用原协议）
- `patch_orders_by_id_costs_by_entryId`：PATCH /api/orders/:id/costs/:entryId
- `patch_orders_by_id_customs_status`：PATCH /api/orders/:id/customs-status
- `post_orders`：POST /api/orders
- `post_orders_by_id_change_owner`：POST /api/orders/:id/change-owner
- `post_orders_by_id_confirm_balance`：POST /api/orders/:id/confirm-balance
- `post_orders_by_id_costs`：POST /api/orders/:id/costs
- `post_orders_by_id_costs_attachments`：POST /api/orders/:id/costs/attachments
- `post_orders_by_id_costs_completion`：POST /api/orders/:id/costs/completion
- `post_orders_by_id_credit_statement_settle`：POST /api/orders/:id/credit-statement/settle
- `post_orders_by_id_customs_documents`：POST /api/orders/:id/customs-documents
- `post_orders_by_id_detail_share`：POST /api/orders/:id/detail-share
- `post_orders_by_id_logistics_share`：POST /api/orders/:id/logistics-share
- `post_orders_by_id_packing_list`：POST /api/orders/:id/packing-list
- `post_orders_by_id_packing_print_export`：POST /api/orders/:id/packing-print/export
- `post_orders_by_id_shipping_labels`：POST /api/orders/:id/shipping-labels
- `post_orders_by_id_urge`：POST /api/orders/:id/urge；外部前提候选：外发或企业微信真实连接
- `post_orders_imports_confirm`：POST /api/orders/imports/confirm
- `post_orders_imports_parse`：POST /api/orders/imports/parse
- `post_orders_imports_review`：POST /api/orders/imports/review
- `post_orders_link`：POST /api/orders/link
- `post_orders_stats_goal`：POST /api/orders/stats/goal
- `post_orders_unlink_group`：POST /api/orders/unlink-group
- `put_orders_by_id`：PUT /api/orders/:id

验收情景编号：`capability:orders`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="my-orders"></a>
## 我的订单

自然语言任务：请按当前权限完成“我的订单”所需操作，并回读实际结果。业务步骤：

1. 页面默认限制为当前业务员名下订单。
2. 草稿箱用于暂存未提交内容，不是文件备份。
3. 提交失败时按字段下方行内提示修复第一处错误。
4. 切换币种后重新核对价格、汇率和付款方式。
5. 关闭有修改的弹窗时系统会要求确认。
6. 定金单创建时记录首款，发货前再确认尾款。
7. 全款赊账或月结到账后从订单详情补齐凭证。
8. 状态变化应与真实资料同步。
9. 复制订单时不会复用旧凭证、打包图或面单。

角色候选：SALES、BOSS、SOCIAL_OPERATOR。前置对象：customer、product、payment-profile、draft-order、formal-order、receipt-image、linked-orders；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id`：DELETE /api/orders/:id
- `delete_orders_by_id_costs_by_entryId`：DELETE /api/orders/:id/costs/:entryId
- `delete_orders_by_id_unlink`：DELETE /api/orders/:id/unlink
- `get_orders`：GET /api/orders
- `get_orders_by_id`：GET /api/orders/:id
- `get_orders_by_id_costs`：GET /api/orders/:id/costs
- `get_orders_by_id_costs_attachments_by_assetId`：GET /api/orders/:id/costs/attachments/:assetId
- `get_orders_by_id_costs_history`：GET /api/orders/:id/costs/history
- `get_orders_by_id_pi`：GET /api/orders/:id/pi；外部前提候选：PI含需翻译字段时使用真实模型
- `get_orders_imports_operations_by_operationId`：GET /api/orders/imports/operations/:operationId
- `get_orders_stats_customer_sources`：GET /api/orders/stats/customer-sources
- `get_orders_stats_dashboard`：GET /api/orders/stats/dashboard
- `get_orders_stats_history`：GET /api/orders/stats/history
- `get_orders_stream`：GET /api/orders/stream（stream，使用原协议）
- `patch_orders_by_id_costs_by_entryId`：PATCH /api/orders/:id/costs/:entryId
- `post_orders`：POST /api/orders
- `post_orders_by_id_change_owner`：POST /api/orders/:id/change-owner
- `post_orders_by_id_confirm_balance`：POST /api/orders/:id/confirm-balance
- `post_orders_by_id_costs`：POST /api/orders/:id/costs
- `post_orders_by_id_costs_attachments`：POST /api/orders/:id/costs/attachments
- `post_orders_by_id_costs_completion`：POST /api/orders/:id/costs/completion
- `post_orders_by_id_credit_statement_settle`：POST /api/orders/:id/credit-statement/settle
- `post_orders_by_id_detail_share`：POST /api/orders/:id/detail-share
- `post_orders_by_id_shipping_labels`：POST /api/orders/:id/shipping-labels
- `post_orders_by_id_urge`：POST /api/orders/:id/urge；外部前提候选：外发或企业微信真实连接
- `post_orders_imports_confirm`：POST /api/orders/imports/confirm
- `post_orders_imports_parse`：POST /api/orders/imports/parse
- `post_orders_imports_review`：POST /api/orders/imports/review
- `post_orders_link`：POST /api/orders/link
- `post_orders_stats_goal`：POST /api/orders/stats/goal
- `post_orders_unlink_group`：POST /api/orders/unlink-group
- `put_orders_by_id`：PUT /api/orders/:id

验收情景编号：`capability:my-orders`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="pi"></a>
## PI 管理

自然语言任务：请按当前权限完成“PI 管理”所需操作，并回读实际结果。业务步骤：

1. 填写客户、产品、币种、价格、定金比例与付款方式。
2. 资料未完成时可保存草稿继续编辑。
3. 确认产品型号、数量、单价、运费、税率和有效期。
4. 需要变更报价时在收款确认前修改。
5. 按全款或定金阶段上传凭证并填写逐张金额。
6. 赊账场景需明确选择单笔赊账或客户月结。
7. 转换后进入正式订单和履约流程。

角色候选：BOSS、SALES、SOCIAL_OPERATOR。前置对象：customer、product、payment-profile、draft-order、formal-order、receipt-image、linked-orders；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id`：DELETE /api/orders/:id
- `delete_trade_documents_blank_by_documentId`：DELETE /api/trade-documents/blank/:documentId
- `get_orders`：GET /api/orders
- `get_orders_by_id`：GET /api/orders/:id
- `get_orders_by_id_pi`：GET /api/orders/:id/pi；外部前提候选：PI含需翻译字段时使用真实模型
- `get_orders_imports_operations_by_operationId`：GET /api/orders/imports/operations/:operationId
- `get_trade_documents`：GET /api/trade-documents
- `get_trade_documents_blank`：GET /api/trade-documents/blank
- `get_trade_documents_blank_by_documentId`：GET /api/trade-documents/blank/:documentId
- `get_trade_documents_by_orderId_by_type`：GET /api/trade-documents/:orderId/:type
- `get_trade_documents_by_orderId_by_type_versions`：GET /api/trade-documents/:orderId/:type/versions
- `get_trade_documents_company_profiles`：GET /api/trade-documents/company-profiles
- `post_orders`：POST /api/orders
- `post_orders_imports_confirm`：POST /api/orders/imports/confirm
- `post_orders_imports_parse`：POST /api/orders/imports/parse
- `post_orders_imports_review`：POST /api/orders/imports/review
- `post_trade_documents_blank`：POST /api/trade-documents/blank
- `post_trade_documents_blank_by_documentId_export`：POST /api/trade-documents/blank/:documentId/export
- `post_trade_documents_blank_by_documentId_order`：POST /api/trade-documents/blank/:documentId/order
- `post_trade_documents_blank_by_documentId_preview`：POST /api/trade-documents/blank/:documentId/preview
- `post_trade_documents_by_orderId_by_type_export`：POST /api/trade-documents/:orderId/:type/export
- `post_trade_documents_by_orderId_by_type_preview`：POST /api/trade-documents/:orderId/:type/preview
- `post_trade_documents_by_orderId_by_type_sync`：POST /api/trade-documents/:orderId/:type/sync
- `post_trade_documents_by_orderId_by_type_versions_by_revision_restore`：POST /api/trade-documents/:orderId/:type/versions/:revision/restore
- `post_trade_documents_by_orderId_by_type_writeback_review`：POST /api/trade-documents/:orderId/:type/writeback/review
- `put_orders_by_id`：PUT /api/orders/:id
- `put_trade_documents_blank_by_documentId`：PUT /api/trade-documents/blank/:documentId
- `put_trade_documents_by_orderId_by_type`：PUT /api/trade-documents/:orderId/:type

验收情景编号：`capability:pi`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="order-detail"></a>
## 订单详情与附件

自然语言任务：请按当前权限完成“订单详情与附件”所需操作，并回读实际结果。业务步骤：

1. 从订单列表或客户时间线打开订单详情，先核对订单号、真实状态、客户、负责人、币种及商品快照；读取失败点击“重试”。
2. 按岗位进入付款凭证、照片/打包、面单、成本或报关资料页签；未出现的页签不代表数据不存在，也不能绕过角色限制。
3. 付款页阅读对应阶段金额与到账凭证，销售只处理本人订单，财务按授权只读；补录与月结确认使用各自操作入口。
4. 在打包或面单页检查箱规、商品绑定、毛重、单号和无面单发货标记；查看附件可预览或进入允许的文件工作台。
5. 需要PI、发票、装箱单等时进入单据工作台并读取该订单，不以当前产品目录替换历史快照。
6. 更新完成后回读该订单；保存已成功但刷新失败时只重新读取，返回客户或订单列表沿用原查询，不再次重复提交。

角色候选：BOSS、SALES、PACKER、ACCOUNTANT、SOCIAL_OPERATOR。前置对象：customer、product、payment-profile、draft-order、formal-order、receipt-image、linked-orders；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id`：DELETE /api/orders/:id
- `delete_orders_by_id_costs_by_entryId`：DELETE /api/orders/:id/costs/:entryId
- `delete_orders_by_id_unlink`：DELETE /api/orders/:id/unlink
- `get_orders`：GET /api/orders
- `get_orders_by_id`：GET /api/orders/:id
- `get_orders_by_id_costs`：GET /api/orders/:id/costs
- `get_orders_by_id_costs_attachments_by_assetId`：GET /api/orders/:id/costs/attachments/:assetId
- `get_orders_by_id_costs_history`：GET /api/orders/:id/costs/history
- `get_orders_by_id_pi`：GET /api/orders/:id/pi；外部前提候选：PI含需翻译字段时使用真实模型
- `get_orders_imports_operations_by_operationId`：GET /api/orders/imports/operations/:operationId
- `get_orders_stats_customer_sources`：GET /api/orders/stats/customer-sources
- `get_orders_stats_dashboard`：GET /api/orders/stats/dashboard
- `get_orders_stats_history`：GET /api/orders/stats/history
- `get_orders_stream`：GET /api/orders/stream（stream，使用原协议）
- `patch_orders_by_id_costs_by_entryId`：PATCH /api/orders/:id/costs/:entryId
- `post_orders`：POST /api/orders
- `post_orders_by_id_change_owner`：POST /api/orders/:id/change-owner
- `post_orders_by_id_confirm_balance`：POST /api/orders/:id/confirm-balance
- `post_orders_by_id_costs`：POST /api/orders/:id/costs
- `post_orders_by_id_costs_attachments`：POST /api/orders/:id/costs/attachments
- `post_orders_by_id_costs_completion`：POST /api/orders/:id/costs/completion
- `post_orders_by_id_credit_statement_settle`：POST /api/orders/:id/credit-statement/settle
- `post_orders_by_id_detail_share`：POST /api/orders/:id/detail-share
- `post_orders_by_id_shipping_labels`：POST /api/orders/:id/shipping-labels
- `post_orders_by_id_urge`：POST /api/orders/:id/urge；外部前提候选：外发或企业微信真实连接
- `post_orders_imports_confirm`：POST /api/orders/imports/confirm
- `post_orders_imports_parse`：POST /api/orders/imports/parse
- `post_orders_imports_review`：POST /api/orders/imports/review
- `post_orders_link`：POST /api/orders/link
- `post_orders_stats_goal`：POST /api/orders/stats/goal
- `post_orders_unlink_group`：POST /api/orders/unlink-group
- `put_orders_by_id`：PUT /api/orders/:id

验收情景编号：`capability:order-detail`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="order-payments"></a>
## 收款、尾款与月结

自然语言任务：请按当前权限完成“收款、尾款与月结”所需操作，并回读实际结果。业务步骤：

1. 老板或社媒运营从所有订单、销售从本人订单打开收款入口，核对币种、收款账户、付款方式及当前阶段；财务按授权只读查看凭证。
2. 全款或定金阶段按规则上传此次实际到账凭证，逐张核对金额；需要凭证时多张合计等于本阶段应收，不以OCR自动值直接确认。
3. 识别金额/币种被人工修正时填写依据并逐张确认，付款规则读取失败点击“重试付款规则”，先修正字段再提交。
4. PI点击“确认收款并转为正式订单”；赊账明确选择单笔或月结，月结填写账期和约定到期日，确认后进入正式订单而非宣称已到账。
5. 定金单收到尾款后打开“确认尾款到账”，上传本次尾款独立凭证并“确认已收尾款”，不能复用首款文件。
6. 单笔赊账到账后从本人可编辑订单详情补齐凭证；月结按同负责人、客户、币种、账户及账期查看归集后再确认到账。
7. 确认成功后回读订单、付款记录与月结状态；操作已保存但列表刷新失败只刷新列表，未知结果先核对原记录，不再次确认同一次付款。

角色候选：BOSS、SALES、SOCIAL_OPERATOR、ACCOUNTANT。前置对象：customer、product、payment-profile、draft-order、formal-order、receipt-image、linked-orders；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id`：DELETE /api/orders/:id
- `delete_system_payment_profiles_by_id_qr`：DELETE /api/system/payment-profiles/:id/qr
- `get_orders`：GET /api/orders
- `get_orders_by_id`：GET /api/orders/:id
- `get_system_order_config`：GET /api/system/order-config
- `get_system_payment_profiles`：GET /api/system/payment-profiles
- `post_orders`：POST /api/orders
- `post_orders_by_id_confirm_balance`：POST /api/orders/:id/confirm-balance
- `post_orders_by_id_credit_statement_settle`：POST /api/orders/:id/credit-statement/settle
- `post_system_payment_profiles_by_id_qr`：POST /api/system/payment-profiles/:id/qr
- `put_orders_by_id`：PUT /api/orders/:id
- `put_system_payment_profiles`：PUT /api/system/payment-profiles

验收情景编号：`capability:order-payments`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="order-links"></a>
## 订单关联与合并发货

自然语言任务：请按当前权限完成“订单关联与合并发货”所需操作，并回读实际结果。业务步骤：

1. 从所有订单或本人订单勾选至少两个不同订单，再选择订单关联动作；销售必须是选中及既有关联组全部订单的负责人。
2. 核对客户、订单号和物流对象，只有确实共用打包资料的订单才关联；已存装箱明细不同会被系统阻止，先处理差异再合并。
3. 阅读关联确认内容后提交，看到“已关联…个订单”再回查组内成员及共享打包资料。
4. 各单商品金额、运费、付款凭证、成本与订单号仍独立保留；关联不是金额合并或重写历史商品。
5. 需要移出单个订单、批量取消或解散组时使用对应取消关联动作，核对处理范围及完成数量后再检查组成员。
6. 显示关联未确认或仅部分取消成功时关闭弹窗、刷新列表，只重选仍需处理的订单；本弹窗不会重复提交未知关联请求。

角色候选：BOSS、SALES、SOCIAL_OPERATOR。前置对象：customer、product、payment-profile、draft-order、formal-order、receipt-image、linked-orders；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id`：DELETE /api/orders/:id
- `delete_orders_by_id_unlink`：DELETE /api/orders/:id/unlink
- `get_orders_by_id`：GET /api/orders/:id
- `post_orders_link`：POST /api/orders/link
- `post_orders_unlink_group`：POST /api/orders/unlink-group
- `put_orders_by_id`：PUT /api/orders/:id

验收情景编号：`capability:order-links`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
