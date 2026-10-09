# Alibaba 店铺、本地订单与物流操作配方

执行规格：`apps/server/tests/businessMcpFullsiteAlibaba.test.ts`。使用实时发现的 `integrations_alibaba` 操作契约和本人原站权限；JSON 保留原 `{success,data}`，列表分别为 `data.orders`、`data.shipments`、`data.accounts`。本地缓存和合成隔离资料不证明平台授权、官方同步、物流报价或投递成功。

## 店铺授权与当前可用范围

1. BOSS 用 `get_integrations_alibaba_configuration` 核对当前回调和配置，再用 `post_integrations_alibaba_accounts` body `{displayName,appKey,appSecret,orderReadStartDate}` 配置店铺。AppKey、AppSecret 必须来自已获授权的真实应用，不写入报告；回读 `get_integrations_alibaba_accounts` 不应返回密钥。配置保存后仍是 PENDING_AUTHORIZATION，不能改数据库状态冒充授权。`put_integrations_alibaba_accounts_by_accountId` 更换 AppKey 时需匹配 AppSecret；保留当前版本的其他店铺配置，不能覆盖无关对象。
2. `post_integrations_alibaba_accounts_by_accountId_authorization_url` 生成原签名授权 URL；同一 MCP operationId 重放原结果。URL/nonce 的创建只是本地授权发起，仍须由本人完成真实平台授权和原回调。`get_integrations_alibaba_capabilities` query `{accountId}` 只说明当前配置，不能把 enabled 或 URL 当授权完成。PACKER 无这些业务入口权限；SALES 不能管理老板店铺。
3. 未完成店铺授权时，原 health、orders sync、logistics sync、address options、quote calculate 返回 422；quote compare 返回 400，消息均为“Alibaba 店铺尚未完成授权”。它们是未就绪拒绝，没有成功同步、官方快照或报价。`get_integrations_alibaba_logistics_quote_options` 可返回 200 的本地可用性说明；必须检查两类 availability.available=false 和空路线，不称“官方选项已获取”。
4. 运费计算/比较须按实时完整契约提供 accountId、真实仓库/路线、目的地邮编、packages、cargo、sender、recipient，地址层级和联系人沿原网站字段。未知尺寸、重量、申报金额或路线不能补造。数据中心 `get_integrations_alibaba_data_center` 仍按当前本人可用店铺过滤；空数据是原结果，不能据此称官方抓取成功。

## 缓存订单、本地跟进与历史绑定

1. `get_integrations_alibaba_orders` 使用 accountId/search/日期/金额/分页等原筛选，按当前负责人范围读取。`get_integrations_alibaba_orders_by_orderId` 的 params 为 `{orderId}`；缓存读取不等于本次向官方同步。SALES 不能读取另一负责人订单，PACKER 无 Alibaba 订单权限。订单账号与发货列表分别通过 `get_integrations_alibaba_order_accounts`、`get_integrations_alibaba_logistics_shipments` 回读。
2. `patch_integrations_alibaba_orders_by_orderId` 只修改原 priority、workflowStatus、internalNotes、localOverrides 等人工跟进资料。SALES 不可指派负责人；平台原金额、状态、raw/normalized 原文不能由本地跟进覆盖。同一 operationId 回执及对象回读需一致，不能因缓存更新重算历史订单。
3. `post_integrations_alibaba_orders_binding_analysis` body `{direction:"alibaba_to_tradeflow",sourceId,candidateIds:[本人真实候选订单ID]}` 使用当前真实候选；其他方向沿实时契约。缺模型时可能返回原 deterministic fallback/review；这是人工复核候选，不是模型结论，也不能自动绑定。人工核对客户、订单号、币种和金额。
4. 手工绑定原历史单使用 `post_integrations_alibaba_orders_by_orderId_bind`，body `{tradeflowOrderId,correctOrderNumber}`。金额不符时原 409 `ALIBABA_BINDING_AMOUNT_MISMATCH` 的 details 保留 `confirmationToken,currency,alibabaTotal,tradeflowTotal,difference` 五字段。先向用户展示金额差异；具体确认后用原票据填 `amountMismatchConfirmation` 并发起新的已确认操作，禁止自行签票或补 true。同一拒绝 operationId 会重放拒绝；已确认操作保留其自身 operationId，不盲重试。
5. 绑定后回读外部单、原正式单和绑定状态。历史单的金额、付款凭证、尾款状态及商品保持原值；绑定或纠正订单号不等于收款或重算价格。解绑 `delete_integrations_alibaba_orders_by_orderId_bind` 仅 BOSS 且需具体授权、prepare 与 `{expectedTradeflowOrderId,reason}`；陈旧目标 409。成功保留 UNBOUND 历史和正式单，不删除历史账目。

## 转单、私有面单与本人绑定

1. `get_integrations_alibaba_orders_by_orderId_conversion_draft` 只预览，回读 `paymentProfile.locked` 和 `orderSeed` 的真实币种、行数量/价格/运费。未知规格或映射须人工核对；未映射商品沿原手工来源规则处理，不能擅自创建目录对应。付款档案沿原 Alibaba 锁定规则。
2. 明确创建正式单后，`post_integrations_alibaba_orders_by_orderId_finalize_conversion` body `{order:<核对后的原 orderSeed 与人工备注等>}`，或原 `post_integrations_alibaba_orders_by_orderId_convert` 使用其 `localOverrides` 契约。原事务检查当前源数据、权限和绑定；回读 CONVERTED、tradeflowOrderId、实际行和金额。同一 operationId 只创建一次，不能换 ID 绕过冲突。
3. `get_integrations_alibaba_logistics_orders` 列表与 `get_integrations_alibaba_logistics_orders_by_logisticsOrderId` 详情受当前关联外部订单负责人限制。`get_integrations_alibaba_logistics_orders_by_logisticsOrderId_label` 取得原 PDF；完整读取每段、核对 totalBytes 与 SHA256。续读沿 `read_business_response_file` 的 responseId/offset/length；负责人被撤后旧快照续读也拒绝。真实缓存 PDF 字节不证明这次官方取面单成功。
4. 本人 `get_integrations_alibaba_self_bindings` 只看自己的绑定。`post_integrations_alibaba_accounts_by_accountId_self_binding_authorization_url` 仍需老板先完成店铺授权；未就绪原 422“该 Alibaba 店铺尚未完成老板授权”，不会建立 PENDING_OAUTH。本人明确撤销后 `delete_integrations_alibaba_self_bindings_by_bindingId`，回读 REVOKED 与当前订单负责人解除，保留他人绑定和历史。
5. `get_integrations_alibaba_authorization_gate` 空 requirements/blocked=false 只是当前本地门禁结果。`post_integrations_alibaba_accounts_by_accountId_authorization_gate_renew` 需要真实原站允许续期的授权状态；403 是权限/续期政策拒绝，本轮不计外部前提通过。不能伪造过期授权或可续期状态。

本轮验证本地保存/读取/事务/ACL/原票据和真实缺授权拒绝；真实店铺授权、官方同步/报价、可续期授权与外部成功仍需独立实证。历史阶段记录不累计为当前全站通过。

## 授权续期的原生完整流程与状态回读

本节依据原生源码说明合法路径；尚无本流程真实供应商续期成功实证。以下步骤和状态说明不能计为场景通过，继续以独立实际证据为准。

1. 本人 BOSS 在正式运行时先读 `get_integrations_alibaba_authorization_gate`。从原 `data.requirements` 找到同一 accountId、kind="STORE_AUTHORIZATION" 且 canRenew=true，再决定是否执行 `post_integrations_alibaba_accounts_by_accountId_authorization_gate_renew`，params `{accountId}`，无额外业务 body。按实时契约保留 MCP operationId 和需要的 prepare/确认，并取得本次真实刷新外呼的明确授权。SALES、Demo 或 canRenew=false 时不能借其他入口绕过。
2. 原门禁检查本人绑定是否匹配店铺 main_member_id，且为 MAIN_ACCOUNT 或 is_admin；店铺须有可解密的原凭据，状态 ACTIVE/AUTH_EXPIRED、refreshState="VALID"，当前不可用且未被配置错误、人工重新授权状态或处理中标记阻止。店铺的 appKey、refreshToken、账号身份和有效期都必须来自原官方授权记录。正常可用店铺不会为了验收被强制过期；PENDING_AUTHORIZATION 配置不能改成虚构的 ACTIVE/已授权状态。
3. 原服务锁定并复核店铺后，先持久记录 RENEWAL_IN_PROGRESS，再向真实刷新端点发送请求。返回的新 access/refresh/expiry 必须完整且有效，主账号身份须匹配，原条件更新成功后才返回 status="RENEWED"。回读安全的 accessExpiresAt、refreshExpiresAt、restoredBindings，再读原门禁及本人绑定状态；不要输出旧、新令牌或密文。恢复的是以前已经核验的绑定，不能因此替陌生账号创建授权。
4. 逐项判断原结果：RENEWED 才是本次原服务确认续期；NOT_DUE 表示尚不需要；FEATURE_DISABLED/DEMO_BLOCKED 表示未执行；CONFIGURATION_ERROR/BACKOFF 需要先处理配置或等待；MANUAL_AUTHORIZATION_REQUIRED 要由本人经原官方授权页面处理；PROVIDER_REJECTED 与 RESULT_UNKNOWN 都不能称已续期。HTTP 200 或 MCP COMPLETED 不替代这些业务状态；原403只表示当前不允许续期。
5. RENEWAL_IN_PROGRESS 是持久处理中标记；RESULT_UNKNOWN 保留原操作、原凭据和当前状态，先用 `get_business_operation_result` 及原门禁回查。不要清 marker、换 operationId 盲重试或强改有效期。重新官方授权或再次刷新需要针对当前真实对象和影响的具体授权，不能用本地刷新候选声称取得平台新授权。

源码依据：仓库 `apps/server/services/alibabaAuthorizationGateService.ts` 的 `getAlibabaAuthorizationGate` / `renewAlibabaAuthorizationGateAccount`，`apps/server/services/alibabaIntegrationService.ts` 的 `getAccountAuthorizationGateMetadata` / `performAlibabaAuthorizationRenewal`，以及 `apps/server/routes/alibabaIntegrationRoutes.ts` 原续期路由。
