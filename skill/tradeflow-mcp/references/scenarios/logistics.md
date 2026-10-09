# 货代、物流与公开追踪

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

核对货代主体、联系方式/地址、重复候选、订单/发运记录、运单与分享访问策略。

普通维护按原字段保存。合并使用分析/准备结果，确认目标及订单引用后执行；物流分享由授权私有业务入口创建，再使用原公开协议读取/上传。

查货代列表、地址预设、订单发运与轨迹；公开页面只显示允许公开字段，撤销后原链接拒绝。

平台物流/报价/面单依赖真实供应商；本地维护成功不等于平台物流成功。公开访问不会扩张订单ACL，不公开后台凭证。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/logistics.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="forwarders"></a>
## 货代管理

自然语言任务：请按当前权限完成“货代管理”所需操作，并回读实际结果。业务步骤：

1. 相似名称不一定是同一主体。
2. 合并前检查联系方式和历史订单引用。
3. 联系方式变更时保留必要历史备注。
4. 不要在普通备注中保存密钥或密码。
5. 逐字段比较主体身份和引用数量。
6. 确认保留记录与被合并记录后再执行。

角色候选：BOSS、SALES。前置对象：forwarder、duplicate-forwarder、shipment、logistics-share；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_forwarders_by_id`：DELETE /api/forwarders/:id
- `delete_system_logistics_address_presets_by_id`：DELETE /api/system/logistics-address-presets/:id
- `get_forwarders`：GET /api/forwarders
- `get_system_logistics_address_presets`：GET /api/system/logistics-address-presets
- `post_forwarders`：POST /api/forwarders
- `post_forwarders_analyze_merge`：POST /api/forwarders/analyze-merge
- `post_forwarders_merge`：POST /api/forwarders/merge
- `post_forwarders_prepare_merge`：POST /api/forwarders/prepare-merge
- `post_forwarders_scan_duplicates`：POST /api/forwarders/scan-duplicates
- `post_system_logistics_address_presets`：POST /api/system/logistics-address-presets
- `put_forwarders_by_id`：PUT /api/forwarders/:id
- `put_system_logistics_address_presets_by_id`：PUT /api/system/logistics-address-presets/:id

验收情景编号：`capability:forwarders`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="tracking"></a>
## 物流中心

自然语言任务：请按当前权限完成“物流中心”所需操作，并回读实际结果。业务步骤：

1. 筛选由后端作用于全量结果，不只筛当前页。
2. 物流状态、服务商和单号来自 Alibaba 物流资源，未返回时明确留空。
3. 官方提供查询地址时可以直接打开。
4. 没有查询地址时不要拼接第三方承运商链接。
5. 恢复接口申请后，先完成权限核验和真实请求探测。
6. 只有官方返回的报价才能进入业务流程。

角色候选：BOSS、SALES、PACKER。前置对象：forwarder、duplicate-forwarder、shipment、logistics-share；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_integrations_alibaba_logistics_shipments`：GET /api/integrations/alibaba/logistics/shipments
- `get_integrations_alibaba_order_accounts`：GET /api/integrations/alibaba/order-accounts
- `get_integrations_alibaba_orders_by_orderId`：GET /api/integrations/alibaba/orders/:orderId
- `patch_integrations_alibaba_orders_by_orderId`：PATCH /api/integrations/alibaba/orders/:orderId

验收情景编号：`capability:tracking`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="public-logistics"></a>
## 物流分享与快递协作

自然语言任务：请按当前权限完成“物流分享与快递协作”所需操作，并回读实际结果。业务步骤：

1. 打开内部人员提供的快递协作链接，核对订单号、国家、状态及有效期；链接打不开时联系打包员重新发送。
2. 在“收件信息”核对地址、电话和收件人，可点击“复制”用于当前订单，不用于无关对象。
3. 允许上传时填写选填的“上传人/快递公司”和“国内快递代垫运费（人民币）”，选择必填的面单图片或PDF，一次最多8个。
4. 点击“上传面单”，等待“面单上传成功”，核对新增文件及识别单号；已发货订单也可在允许范围追加，不把上传等同于物流实际送达。
5. 需要撤回面单时仅在页面允许的条件下选择对应文件并确认；从订单移除后按30天文件回收规则处理，内部无面单发货状态仍由内部确认。
6. 上传关闭或超过文件数时按提示停止；刷新失败会保留当前内容，可点击“重试”。复制失败可人工复制，识别结果须由负责人再次核对。

角色候选：PUBLIC。前置对象：forwarder、duplicate-forwarder、shipment、logistics-share；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id_logistics_share_by_shareId`：DELETE /api/orders/:id/logistics-share/:shareId
- `delete_public_logistics_share_by_token_shipping_labels`：DELETE /api/public/logistics-share/:token/shipping-labels（excluded，使用原协议）
- `get_public_logistics_share_by_token`：GET /api/public/logistics-share/:token（excluded，使用原协议）
- `post_orders_by_id_logistics_share`：POST /api/orders/:id/logistics-share
- `post_public_logistics_share_by_token_shipping_labels`：POST /api/public/logistics-share/:token/shipping-labels（excluded，使用原协议）

验收情景编号：`capability:public-logistics`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
