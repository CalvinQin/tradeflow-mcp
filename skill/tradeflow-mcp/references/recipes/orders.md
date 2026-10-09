# 订单版本、历史值和归属

执行规格：`apps/server/tests/businessMcpFullsiteOrders.test.ts`。当前具体规格覆盖创建/列表/详情/更新、关联、转交、删除和原生刷新事件；PI、收款、报关、装箱打印及表格导入需要各自实际证据，不能由基础CRUD通过代替。

1. 先读取本人客户、商品和有效付款档案及 `post_orders` 契约。body 必须含 `{id,customerName,status,currency:"USD"|"RMB",paymentMethodId,country,recipientAddress,items:[{productId,quantity,unitPrice}]}`；工厂自提可用原factoryPickup例外。商品/规格/选项与报价事实由已授权资料核实，未知商业值不补造。仅老板、销售和社交运营可创建，销售 createdBy 固定为当前本人。销售绑定他人CRM客户400，打包员/会计创建403。
2. 新单 totalPrice 由原网站行数量/单价/折扣/运费规则计算，不能依赖提交的totalPrice绕过金额规则。保存后用 `get_orders_by_id` `{params:{id}}` 核对 order.items、单价、单位、freight、totalPrice、createdBy、crmAccountId 和 editVersion。`get_orders` 保留网站日期/岗位/view、金额范围和分页；page1并非完整列表，他人销售草稿不能读。
3. `put_orders_by_id` 必须带最新 `body.editVersion`。备注等局部更新只传已明确修改的字段；旧订单未改变的单价/单位/金额保留，商品目录变更不自动重算它们。数量/单价或币种等财务字段变更由原网站计算，切币还需原 currencyChangeConfirmed，不能擅自补true。过期版本409说明本次未保存，重新读取并按原意核对，不覆盖别人的修改。打包员仅原仓库字段，会计只读。
4. `post_orders_link` body `{orderIds:[...至少2个不同ID]}` 关联。销售须负责全部选中及已有组成员；打包员/会计不能关联。不同装箱明细会409并保留旧资料，不能为关联删掉差异。回读所有 groupId 和 linkedOrders。`delete_orders_by_id_unlink` prepare后移出本人订单，`post_orders_unlink_group` body `{groupId}` 解散；关联解除保留各单已有商品、付款和装箱资料。
5. `post_orders_by_id_change_owner` 原生body `{ownerId,expectedOwner,requestId,transferCustomer:false}`，老板/社交运营才可用。订单转交不自动转CRM客户；transferCustomer:true还必须明确授权、当前本人客户以及expectedCustomerOwnerId/expectedCustomerId原事实。销售无转交权限，过期归属409，离职/非业务员接收人400。回读订单归属、客户归属、时间线和通知；operationId及原requestId保留，避免重复。
6. 删除 `delete_orders_by_id` 先prepare，明确对象及影响后执行。非老板只能删本人订单；已有成本历史会阻止直接删除。回读详情404、列表及关联行，目录商品保留。UNKNOWN/PENDING只查原operationId和对象，不换ID盲删。
7. `/api/orders/stream` 是原生认证SSE刷新协议，MCP普通执行目录不代理该流。原网站事件只带刷新类型/对象标识和操作者；收到事件后仍用本人详情接口取得可读字段，流事件不授权跨人读取。退出/取消时关闭流；原生开流取消证明不代表所有业务状态已验。

所有二进制首段取原件快照：file.operationId存在时使用原operationId（含会生成发票编号的get_orders_by_id_pi）；其它GET用responseId调用 `read_business_response_file`。按nextOffset续读、核对每段总长/sha256及合并后的完整hash，不重复生成不同原件来拼接。每次读取复核当前凭证/岗位/原对象ACL，快照7天过期。

## 付款档案、报关、导入与快递协作

1. 本人先用 `get_system_order_config` 读取有效付款档案。管理端 `get_system_payment_profiles` 和 `put_system_payment_profiles` 仅 BOSS/平台管理员可用：先载入完整 profiles 与 revision，再提交 `{profiles:[保留已有档案及本次修改],expectedRevision}`。409 时保留修改、重新读取并核对，不能覆盖他人新版本。已被历史订单引用的档案只能停用，不能移除。
2. QR_IMAGE 档案先以 enabled:false 保存，再由原管理员用 `post_upload_base64` 提交 `{image:"data:image/png;base64,...真实图片",filename,path:"system/payment-profiles/<id>"}`。上传结果是实际受管图片；用该 asset 的原目录 URL（去签名 query）调用 `post_system_payment_profiles_by_id_qr`，body `{qrUrl}`，回读档案和图像。跨档案目录400、无管理员权限403。`delete_system_payment_profiles_by_id_qr` 须 prepare/确认后清除图片并停用档案，保留历史付款快照。
3. 报关是原网站的业务协作池：业务员可查看与处理其他负责人的 needsCustoms 订单，普通订单详情仍遵守负责人权限。实际资料经 `post_upload` multipart 上传到 `customs_declaration_documents/<orderId>`，再调用 `post_orders_by_id_customs_documents` body `{documentUrls:[已上传原URL],customsRemark}`；`patch_orders_by_id_customs_status` 只允许 pending/processing/processed，BOSS/SALES/ACCOUNTANT 可标记。会计不能上传或删除资料；未开启报关400。删除资料使用 `delete_orders_by_id_customs_documents` body/query `{documentUrl}` 并 prepare；回读资料、状态与原商品/金额，删除资料不改商业快照。
4. 原 Excel 解析用 `post_orders_imports_parse` 的 files：`[{field:"file",filename:"...xls|xlsx",mimeType,base64:原文件字节}]`，单文件8MiB以内；不能传本机路径或已推测的表格内容。原工作簿 sheets/rows 解析成功后，以明确原件币种、运费、客户与付款档案调用 `post_orders_imports_review`：body `{operationId,crmAccountId,paymentMethodId,metadata:{currency,freight,recipientAddress,totalPrice},rows:[{sourceRow,model,quantity,unitPrice,amount,unit}]}`。已有订单另提供 targetId/expectedVersion/targetLineId。预览不写订单；errors 非空时 token=null，禁止继续确认。型号/规格唯一匹配，金额不一致须核对，不能模糊替换或静默重算原件。
5. 导入预览无错误后展示 differences/preview，取得明确确认，再调用 `post_orders_imports_confirm` body `{token,confirmed:true}`。原票据绑定本人、版本和15分钟期限；他人票据400，目标越权403，旧版本409。保留 MCP operationId 与 body 内原导入 operationId，重放须回读同一回执和同一订单，不能另造新导入。回读原件报价、行ID、单位和总金额。
6. 快递协作先读本人订单与状态；已保存打包资料的 WAITING_SHIPPING/待上传面单或已发货订单可附面单。用 `post_orders_by_id_logistics_share` 生成可上传的原链接；`post_orders_by_id_detail_share` 生成只读链接。原 BOSS/PACKER 可处理团队分享，SALES 只可分享本人订单，会计无分享权限。两条操作仅返回该 share.token 的 `tf_` 用途令牌，不是登录授权；分享15天到期，可上传分享在有效期复用。只读分享上传403。
7. 本站面单通过 `post_upload` 的 shipping_labels 上传后调用 `post_orders_by_id_shipping_labels` body `{labelUrls,markComplete,scanLabels,domesticShippingFeeCny}`。scanLabels:false 是原可选规则；实际 OCR 不可用不表示已识别到运单。国内代垫运费须非负并独立保存，不更改原订单总额/报价。回读真实面单与原打包状态；PI或尚未保存打包信息400，越权403。
8. 公开原协议 `/api/public/logistics-share/<tf_token>` 可读物流投影，不含付款和商品单价；上传 `/shipping-labels` 必须 multipart file，支持实际图片/PDF，并可带 uploaderName/complete/domesticShippingFeeCny。JSON及时400。原会话只能撤回自己上传且尚未锁定的面单，DELETE body `{url}`；员工或其他会话面单403，撤回进入原30天隔离流程。下载核对真实文件字节；PDF不产生付费OCR成功结论。
9. 撤销 `delete_orders_by_id_logistics_share_by_shareId` 先 prepare 并核对当前订单/shareId；完成后原公开分享403，独立只读分享仍有效。结果未知仅查原operationId与分享状态，不能据超时认为未发送或未撤销。
10. 尾款确认 `post_orders_by_id_confirm_balance` 遵守 hasDeposit、尾款待支付、本人负责人和当前付款档案的凭证要求；提交 balancePaymentProofs/balancePaymentProofDetails 时仍须原识别签名、逐张实际金额确认及必要核对依据。只有原档案明确不要求凭证时才走原可选路径，不能为收款确认停用凭证门禁。回读状态/日期/金额和原回执；此操作不证明银行已实际到账。
11. 客户月结 `post_orders_by_id_credit_statement_settle` 必须先取得真实付款凭证识别票并人工核对整个月结单金额，body `{proofs,proofDetails}`；不能只填应收金额、伪造 recognitionToken 或跳过识别。未配置 DeepSeek 时原识别入口返回明确配置错误，月结成功验收仍待真实前提，普通结算400不计作已收齐或供应商验收成功。
12. `post_orders_by_id_urge` 仅原老板/业务岗位催促当前可操作的待打包订单；他人订单、PACKER/ACCOUNTANT 和 PI 草稿仍拒绝。回读 `notification.status,skipped,saved,sent,failed,skippedChannels,pending,reason`：关闭事件为 skipped/event_disabled 且无新历史或发送队列；saved 只表示站内记录，pending 保留未分发和失败重试的队列；sent 只表示渠道接受，不能称人已收阅。消息如“催促提醒未发送”或“渠道发送结果待核对”须原样告知。保留同一 operationId 重放，不重复催促。执行规格 `businessMcpFullsiteNotifications.test.ts` 验证原关闭事件的真实无发送结果；实际外部接受/送达仍待验。

## 客户月结的 OPEN 准备、识别与整体收款

本节依据原生源码说明合法准备与收款流程；尚无本流程真实识别供应商成功及月结成功实证。原拒绝、历史阶段通过和以下书面流程不能作为实际完成，模型转录也不自动证明银行到账。

1. 用 `get_system_order_config` 读取有效付款档案，再按 `post_orders` 原完整契约创建正式订单。月结要求档案 enabled=true 且 requiresPaymentProof=true、hasDeposit=false、creditMode="MONTHLY"；账期 creditStatementPeriod 为 YYYY-MM、到期日 creditDueDate 为原合法 YYYY-MM-DD。商品、客户、币种和金额沿已授权事实，创建时不提交单笔收款凭证。PI草稿、定金订单和免凭证档案不能加入月结。
2. 原服务按负责人、标准化客户名称、币种、付款方式和账期归组为 OPEN statement。用 `get_orders_by_id` 核对 anchor 的 creditStatement、全部成员订单及每单金额/状态，再计算整个 statement 当前应收；不能只核对 anchor 金额或因名字相同自行认定客户主体。COLLECTED 的账期不能追加新单或再次确认收齐，成员/金额变化后须重新核对。
3. 沿原受管上传入口取得真实付款凭证图片 URL，再用 `post_ai_recognize_payment_proof` body `{url}`。原接口 `/api/ai/recognize-payment-proof` 允许 BOSS/SALES/ACCOUNTANT 识别，图片必须属于当前可访问受管资产、文件真实存在且可读取；已清理、缺失、隔离或无权图片会拒绝。会计可识别，不能执行月结收款确认。
4. 当前源码付款识别固定 DeepSeek provider，并要求所选付款识别 override 支持图片；不能默默换成活动文本模型。有效图片通过原校验后缺密钥返回原400 VALIDATION_ERROR，文案“请在智能指挥中心配置 DeepSeek 密钥，再识别付款凭证”；不是通用AI的503。配置和模型名称不证明厂商当前图片能力，须有真实可用模型及本次调用/费用授权。
5. 保留原识别返回的 amount/currency/confidence/evidence/recognitionToken，逐张展示并人工确认实际到账金额和币种后才设置 recognitionConfirmed=true。原票绑定图片路径、有效7日且必须由本运行时原服务签发；原成功缓存也复查图片权限、配置和字节。不得直接调用签票 helper、复制其他运行时票或用模型 mock 结果补证据。
6. 原模型不确定时可能返回 amount/currency=null、warning 和真实签票，仍需人工填写实际金额、币种及至少4字符的真实 recognitionReviewNote。人工修改已识别金额/币种也需要核对或换算依据；不自动填“已核对”类占位文字。人工模式仍须先取得原真实识别票，不能把缺配置400改成可跳过识别。
7. 在具体到账核对和收款确认后执行 `post_orders_by_id_credit_statement_settle`，params `{id:<原anchor订单ID>}`，body `{proofs:[原图片URL],proofDetails:[{url,amount,currency,kind:"MONTHLY",recognitionToken:<原识别票>,recognitionConfirmed:true,recognitionReviewNote?,confirmedExpectedAmount?}]}`。SALES仅本人月结，PACKER/ACCOUNTANT拒绝。原事务以全部成员当前金额为应收，逐张 URL/金额/币种/签票核验；不能少收。多收须人工核实差额后，每张 confirmedExpectedAmount 使用整个月结当前应收，不能自动填旧合计绕过。保持外层 MCP operationId 和需要的 prepare/确认。
8. 原 settle 不传 previousDetails 或 allowLegacyWithoutAmounts，不能凭旧未签详情跳过本次核验。成功回读原 `{success,statement,order}`：statement.status=COLLECTED、全部成员 balanceStatus="月结已收齐"、收款时间/操作者、凭证及不可变金额快照、受管媒体引用均核对；旧历史金额和商品不被重算。站内提醒/渠道结果与到账证据分别回读，不能据 HTTP 200 声称模型、渠道或银行自动确认。
9. 已完成的外层 MCP operationId 用 `get_business_operation_result` 及原对象回读恢复，保持同一请求内容。直接原 settle 第二次会拒绝“该客户月结单已经收齐”，该拒绝不能计第二次成功；没有实际原签票/到账核对时，无月结、缺票或普通金额400都不计外部前提通过。

源码依据：仓库 `apps/server/services/orderService.ts` 月结创建约束，`apps/server/services/customerCreditStatementService.ts` 的 `resolveOpenCustomerCreditStatement` / `settleCustomerCreditStatement`，`apps/server/services/paymentProofRecognitionService.ts` 的 `paymentProofVisionRuntime` / `recognizePaymentProof`，`apps/server/services/paymentProofRecognition.ts` 的 `verifyProofRecognition`，`apps/server/services/paymentProofService.ts` 的 `validatePaymentProofCollection`，以及 `apps/server/routes/aiRoutes.ts` / `apps/server/routes/orderRoutes.ts` 原路由。
