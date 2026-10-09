# Alibaba订单、商品与数据

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

读取公司店铺授权健康、应用配置状态、业务员官方身份绑定、本地平台快照与最后同步时间。

先查询已保存订单/商品/统计；来源充分才进行本地绑定、导入审核和确认。平台同步/物流报价/授权维护按原官方链执行并保留Request ID。

读取本地平台快照、明细覆盖率、映射、导入任务/回执、目标正式订单或PI；多币种分别核对。

缺少店铺/详情/归属/外部授权时应明确拒绝或待补资料，不用mock填官方事实；不得猜业务员或自动绑歧义订单。当前隔离验收无真实店铺/付费/外发授权，只验证前提与正确拒绝，不声称平台成功。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/alibaba.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="alibaba-orders"></a>
## Alibaba 订单

自然语言任务：请按当前权限完成“Alibaba 订单”所需操作，并回读实际结果。业务步骤：

1. 店铺授权、应用凭证和业务员身份映射相互独立；业务员不接触 App Secret 或 Token。
2. 未识别负责人的订单进入待分配队列，不按姓名猜测归属。
3. 页面信息不足时先检查店铺健康和同步结果，不把空字段当作 Alibaba 原始事实。
4. 付款、交易、物流等平台状态只能由后台同步更新，本页不得手工改写。
5. 需要执行打包、报关或收款时，人工确认后转换为正式订单或 PI 草稿，也可以绑定历史订单。
6. 搜索和筛选可组合使用；处理前核对店铺、外部订单号和最后同步时间。
7. 订单列表会以受控并发自动补全当前页详情；在“视图 / 列”中可按业务、财务和履约字段自定义显示、顺序、宽度与固定列。
8. 商品、付款、退款和分批物流是重复明细，列表提供独立摘要列，二级详情页保留每一行官方记录。
9. 转换前检查客户、币种、金额、产品、数量和负责人是否齐全。
10. 本地补充信息不能替代平台商品详情；缺少详情时只能绑定历史订单，不能安全转换。
11. 同步失败查看明确错误和 Request ID；页面不会把失败显示为已完成。
12. 新业务可以选择创建正式订单或 PI 草稿；系统会复用现有新建订单表单，最终仍由用户确认。
13. 历史业务选择“绑定已有订单”，只建立关联，不覆盖原订单历史。
14. 同一 Alibaba 订单使用幂等记录防止重复转换；操作完成后可从通知进入对应订单。

角色候选：SALES、BOSS。前置对象：empty-provider-config、synthetic-store、platform-order-snapshot、platform-product-snapshot、self-binding；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_integrations_alibaba_orders_by_orderId_bind`：DELETE /api/integrations/alibaba/orders/:orderId/bind
- `delete_integrations_alibaba_self_bindings_by_bindingId`：DELETE /api/integrations/alibaba/self-bindings/:bindingId
- `get_integrations_alibaba_accounts`：GET /api/integrations/alibaba/accounts
- `get_integrations_alibaba_authorization_gate`：GET /api/integrations/alibaba/authorization-gate
- `get_integrations_alibaba_configuration`：GET /api/integrations/alibaba/configuration
- `get_integrations_alibaba_logistics_orders`：GET /api/integrations/alibaba/logistics/orders
- `get_integrations_alibaba_logistics_orders_by_logisticsOrderId`：GET /api/integrations/alibaba/logistics/orders/:logisticsOrderId
- `get_integrations_alibaba_logistics_orders_by_logisticsOrderId_label`：GET /api/integrations/alibaba/logistics/orders/:logisticsOrderId/label；外部前提候选：Alibaba真实店铺授权或物流供应商
- `get_integrations_alibaba_logistics_quote_address_options`：GET /api/integrations/alibaba/logistics/quote/address-options；外部前提候选：Alibaba真实店铺授权或物流供应商
- `get_integrations_alibaba_logistics_quote_options`：GET /api/integrations/alibaba/logistics/quote/options
- `get_integrations_alibaba_logistics_shipments`：GET /api/integrations/alibaba/logistics/shipments
- `get_integrations_alibaba_order_accounts`：GET /api/integrations/alibaba/order-accounts
- `get_integrations_alibaba_orders`：GET /api/integrations/alibaba/orders
- `get_integrations_alibaba_orders_by_orderId`：GET /api/integrations/alibaba/orders/:orderId
- `get_integrations_alibaba_orders_by_orderId_conversion_draft`：GET /api/integrations/alibaba/orders/:orderId/conversion-draft
- `get_integrations_alibaba_self_bindings`：GET /api/integrations/alibaba/self-bindings
- `patch_integrations_alibaba_orders_by_orderId`：PATCH /api/integrations/alibaba/orders/:orderId
- `post_integrations_alibaba_accounts`：POST /api/integrations/alibaba/accounts
- `post_integrations_alibaba_accounts_by_accountId_authorization_gate_renew`：POST /api/integrations/alibaba/accounts/:accountId/authorization-gate/renew；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_accounts_by_accountId_authorization_url`：POST /api/integrations/alibaba/accounts/:accountId/authorization-url；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_accounts_by_accountId_health`：POST /api/integrations/alibaba/accounts/:accountId/health；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_accounts_by_accountId_orders_sync`：POST /api/integrations/alibaba/accounts/:accountId/orders/sync；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_accounts_by_accountId_self_binding_authorization_url`：POST /api/integrations/alibaba/accounts/:accountId/self-binding/authorization-url；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_logistics_orders_sync`：POST /api/integrations/alibaba/logistics/orders/sync；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_logistics_quote_calculate`：POST /api/integrations/alibaba/logistics/quote/calculate；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_logistics_quote_compare`：POST /api/integrations/alibaba/logistics/quote/compare；外部前提候选：Alibaba真实店铺授权或物流供应商
- `post_integrations_alibaba_orders_binding_analysis`：POST /api/integrations/alibaba/orders/binding-analysis
- `post_integrations_alibaba_orders_by_orderId_bind`：POST /api/integrations/alibaba/orders/:orderId/bind
- `post_integrations_alibaba_orders_by_orderId_convert`：POST /api/integrations/alibaba/orders/:orderId/convert
- `post_integrations_alibaba_orders_by_orderId_finalize_conversion`：POST /api/integrations/alibaba/orders/:orderId/finalize-conversion
- `put_integrations_alibaba_accounts_by_accountId`：PUT /api/integrations/alibaba/accounts/:accountId

验收情景编号：`capability:alibaba-orders`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="alibaba-data"></a>
## Alibaba 数据中心

自然语言任务：请按当前权限完成“Alibaba 数据中心”所需操作，并回读实际结果。业务步骤：

1. 老板可看全部授权店铺，业务员只看已绑定店铺和本人归属数据。
2. 多币种金额分开汇总，不使用猜测汇率强制合并。
3. 详情、资金和物流覆盖率用于发现后台补读队列缺口。
4. MyData、聚石塔或未核验能力不会用模拟数据填充。
5. 失败记录应结合接口 Request ID 与店铺健康继续排查。
6. 数据中心不提供平台写入操作。

角色候选：BOSS、SALES。前置对象：empty-provider-config、synthetic-store、platform-order-snapshot、platform-product-snapshot、self-binding；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_integrations_alibaba_capabilities`：GET /api/integrations/alibaba/capabilities
- `get_integrations_alibaba_data_center`：GET /api/integrations/alibaba/data-center
- `post_integrations_alibaba_accounts_by_accountId_health`：POST /api/integrations/alibaba/accounts/:accountId/health；外部前提候选：Alibaba真实店铺授权或物流供应商

验收情景编号：`capability:alibaba-data`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="alibaba-products"></a>
## Alibaba 商品与平台映射

自然语言任务：请按当前权限完成“Alibaba 商品与平台映射”所需操作，并回读实际结果。业务步骤：

1. 进入“Alibaba 商品”，选择可访问的店铺；店铺读取失败点击“重试”，没有授权时先完成店铺接入。
2. 按平台商品类型、展示状态、官方质量或镜像状态筛选，先核对最后同步情况，再打开商品查看型号、SKU和官方返回字段。
3. 需要本地关联时打开平台映射，选择正确产品及规格；类目映射在“类目映射”入口维护，产品映射不替代官方商品发布。
4. 执行自动映射先读预览中的健康绑定、待解绑或换绑建议，逐项勾选并确认保留目标；缺型号或候选不唯一的项目留待人工复核。
5. 确认处理后查看已应用、失败项目与映射结果；替换失败时原绑定保留，不修改历史订单商品或金额。
6. 平台字段缺失、镜像已失效或同步失败按页面提示处理；平台上架、审核与发布状态以官方回执为准，演示目录不证明真实发布。

角色候选：SALES、BOSS。前置对象：empty-provider-config、synthetic-store、platform-order-snapshot、platform-product-snapshot、self-binding；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_integrations_alibaba_capabilities`：GET /api/integrations/alibaba/capabilities
- `post_integrations_alibaba_accounts_by_accountId_health`：POST /api/integrations/alibaba/accounts/:accountId/health；外部前提候选：Alibaba真实店铺授权或物流供应商

验收情景编号：`capability:alibaba-products`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
