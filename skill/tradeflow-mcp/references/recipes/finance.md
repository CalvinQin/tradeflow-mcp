# 工资、报销、休假、业绩与周报的操作手册

本章对应真实网站接口。先读取实时操作合同；示例的员工、记录和任务编号必须替换为查询到的真实编号。测试证据见 `apps/server/tests/businessMcpFullsiteFinance.test.ts` 和发布包的验收报告：本章写完不代表全部场景已经通过。

## 每次工作的起点

1. `get_tradeflow_context` 确認当前公司、角色、权限与合同版本。通过 `list_business_operations` 查询 `payroll`、`leave`、`orders`、`weekly-report`，继续读取分页。
2. 对本次要用的每项操作调用 `get_business_operation_contract`。下面的参数是当前原网站字段，合同变更时以实时合同为准。
3. 老板先用 `get_payroll_sales_users` 查员工编号与类型，再做员工姓名匹配。多个同名结果不能自行合并。个人工资、报销和休假身份由登录用户决定，不传别人的 userId 冒充本人。
4. 写入使用一个稳定的 `operationId`。收到未知或进行中结果，先调用 `get_business_operation_result`，再回读对象；保留原请求，不换编号盲目重复。任何删除、审核或发送要求的 `prepare_business_action` 票据必须用于同一载荷。用户已明确授权这次动作时继续执行；真正缺少授权或商业事实时才询问。

## 员工上报交通费并撤回未审核报销

先 `get_payroll_me_reimbursements`，读取 `categories`、`policy`、`nextPayday`。费用日期使用实际发生日期，金额是人民币数值，附件先通过真实上传接口取得站内受允许的路径。

```json
{
  "operation": "post_payroll_me_reimbursements",
  "operationId": "本次上报的稳定唯一编号",
  "body": {
    "expenseDate": "2026-10-09",
    "category": "交通",
    "amount": 12.35,
    "description": "拜访客户交通费",
    "attachments": []
  }
}
```

服务端按员工的发薪设置决定归属月份和计划发放日。回读 `get_payroll_me_reimbursements`，确认返回的 id、amount、status 和归属本人。修改说明或金额要沿用网站当前支持的操作；当前撤回使用 `delete_payroll_me_reimbursements_by_id`，`params: {"id": 报销编号}`。已审核、已发放或已纳入锁定工资的报销会拒绝撤回，保留原记录并说明原因。附件路径不能替代真正上传。

## 老板审核报销、核对发薪并标记实际发放

1. `get_payroll_reimbursements`，`query: {"month":"2026-10","status":"pending","page":1,"limit":50}`。检查 `totalPages`，取完所需分页。核对员工、费用、票据与金额。
2. `put_payroll_reimbursements_by_id_review`，`params: {"id":报销编号}`，`body: {"decision":"approved","note":"票据已核实"}`。驳回用 `decision: "rejected"` 并填写实际理由。回读相应报销状态。审批是否启用由 policy 决定。
3. `get_payroll_paydays`，`query: {"date":"2026-10-09"}`。employees 的 `id` 是员工编号；claims 的 `id` 是报销编号。保存最新 `policyVersion` 和每项 `settlementVersion`，检查 `settlementState`；只有允许发放的记录才能继续。
4. 用户明确授权标记真实发放后，执行 `post_payroll_paydays_settle`：

```json
{
  "ids": [71],
  "method": "separate",
  "expected": {
    "policyVersion": "刚查询到的原值",
    "claims": [{"id":71,"version":"该报销刚查询到的settlementVersion原值"}]
  }
}
```

`method` 使用真实发放方式 `salary` 或 `separate`。这项操作登记发放结果，不发起银行转账。再次读取发薪清单和报销，检查 settled_at、settlement_method。409 表示政策、金额、版本或状态变化，重新读取并核实，不删去 expected 强行执行。历史待核对记录需要单项的明确历史核查、`reviewedHistorical: true` 与真实 `reviewReason`，不可混入普通批次。

## 老板创建、修改绩效模板并评分

先 `get_payroll_templates`；编辑指定模板前 `get_payroll_templates_by_id`，`params: {"id":模板编号}`。保留原 `rules`、项目顺序、制度标记和个人绩效基数。

新建用 `post_payroll_templates`，body 为 `{name, items, rules, total_score, is_active}`；编辑用 `put_payroll_templates_by_id`。项目字段包括 `kind`、`category`、`name`、`content`、`target`、`targetValue`、`unit`、`weight`、`amount`、`autoField`。扣款项另有 `deductionPerUnit`、`deductionCapRate`。以实时合同和真实已存在模板为参照；十月正式制度的固定项目不能自行改顺序或移除制度标记。

`get_payroll_evaluations`，query `{month, userId}` 后，使用 `post_payroll_evaluations`：

```json
{
  "userId":42,
  "month":"2026-09",
  "templateId":18,
  "scores":[{"itemIndex":0,"score":0.8,"note":"完成8次已核实回访"}],
  "status":"draft",
  "manualReimbursement":0,
  "extraDeductions":[],
  "sickLeaveDays":0,
  "casualLeaveDays":0
}
```

`score` 为 0–1 比例，不是百分制；有实际值的项目使用合同定义的 `actualValue`。扣款数量用 `missedCount`，发生扣款必须写原因；不能根据未核实的聊天记录替老板判罚。新版制度的 `policyInputs` 仅接受老板明确填写的跟进判定。回读评分与工资记录，确认 final_score 和逐笔扣款。已有评分引用的模板可能不能删除；改停用状态或向用户说明网站限制。

## 核算、锁定、撤销与查看工资

1. `get_payroll_auto_data` query `{month, userId}`，读取真实销售额、佣金、请假和达标资料；再读该月评分、`get_payroll_records` 与员工设置。保留已有人工字段。
2. `post_payroll_calculate` body 至少 `{userId, month}`。只有用户明确指定时填写 `baseSalary`、`socialInsurance`、`commission`、`exchangeRate`、`reimbursement`、`sickLeaveDays`、`casualLeaveDays`、`extraDeductions`、`notes`。commission 是美元佣金、exchangeRate 是折人民币的汇率；total_salary 由服务端核算，不能把自行算的总额作为事实。
3. 回读工资记录，逐项核对底薪、社保、绩效、报销是否计入工资、佣金、请假扣除、额外扣款及总额。核算生成 draft。
4. 用户授权确认后用 `put_payroll_records_by_id_confirm`，params `{id}`，body `{reason}`。回读 confirmed。政策或报销变化时先重新核算。
5. 用户授权撤销时用 `post_payroll_records_by_id_revoke`，params `{id}`，body `{reason}`。回读 uncalculated，并保留备注。兼容入口 `delete_payroll_records_by_id` 也执行撤销并保留记录，不能向用户说“永久删除了工资”。
6. 员工 `get_payroll_me_estimate` query `{month}` 查看本人：source 区分 live_estimate、draft_record、final_record，isFinal 表示已锁定；不得把预估说成已发放。

工资条发送 `post_payroll_records_by_id_send`，params `{id}`；批量 `post_payroll_batch_send` body `{month}` 只处理该月已确认记录。发送前核对收件人、锁定状态与当前已配置通知渠道。已获具体发送授权则准备票据并执行；回读发送结果、失败项和通知。`sent` 工资状态与站内通知已保存不代表微信送达：外部渠道缺配置时会跳过，真实发送API成功只报告“渠道已接受”，设备送达或已读还须相应真实回执。分别保留saved/skipped/failed/pending，不把待发算接受。重复调用沿用原 operationId，不能再次发送；未确认、已发送或不存在的工资分别按网站错误处理。

批量核算 `post_payroll_batch_calculate` body `{month, exchangeRate}`，其余可选核算字段以实时合同为准。它影响该月全体适用在职业务员，使用前确认用户任务确实覆盖全体；先查询员工清单和该月锁定记录。回读逐员工结果和该月记录，检查人数、金额及失败项。遇到锁定记录不擅自撤销，批次可能已有部分计算，查询原回执和逐条记录后再决定下一步。没有待发送的已确认记录时批量发送返回空数组，不能说已向全员发送。

员工类型更改使用 `put_payroll_users_by_id_employment_type`，params `{id}`，body `{"employmentType":"INTERN"}` 或 FULL_TIME，回读 `get_payroll_sales_users`。网站当前只允许老板管理薪资；会计角色并不自动拥有老板的工资操作权限。

## 导出工资表与薪资业绩 XLSX

工资表：`post_payroll_salary_report_jobs` body `{startMonth,endMonth,userIds}`。绩效业绩：`post_payroll_performance_report_jobs` body `{month}`。保存响应 `job.jobId`。

轮询 `get_payroll_salary_report_jobs_by_jobId` 或 `get_payroll_performance_report_jobs_by_jobId`，params `{jobId}`；completed 后调用对应 `_download` 操作。读取真实 bytes，检查 MIME、totalBytes、sha256 和 XLSX 的 ZIP 文件头；不能把 jobId 或“创建任务成功”当作导出文件。

首次导出取得 `file.responseId` 后，后续块使用 `read_business_response_file`，输入 `{responseId,offset:file.nextOffset,length:所需字节数}`。读取同一份原件，各段 sha256 一致，合并后检查 totalBytes 和整体 sha256。不重复消费 GET 下载任务，也不重新生成动态 XLSX 来拼接。POST 原件也可沿原 operationId 回读，不能重做写操作。任务由创建者拥有；错误、过期、他人任务要停止并解释。旧同步 `get_payroll_performance_report` 仍按合同支持；权限变化后原件续读也必须拒绝。

## 休假奖励、申请与审批

`get_leave_overview` 查看余额、可用余额、待审批预占、申请与账本。个人申请身份由服务端确定。

- 老板设置销售目标：先 `get_leave_targets_by_userId_by_month` params `{userId,month}`；再 `put_leave_targets_by_userId_by_month` body `{"tiers":[{"salesTargetUsd":1000,"rewardDays":1}]}`。填写真实美元目标，最多六档，回读 target。继承目标与销售达标奖励使用网站原业务规则。
- 老板人工奖励：`post_leave_manual_awards` body `{userId,days,reason}`，回读账本和余额。reason 写真实奖励依据。保留 operationId 防止重复奖励。
- 员工申请：`post_leave_requests` body `{startDate,endDate,days,leaveType,paidDays,reason}`。leaveType 为 HOLIDAY、SICK、PERSONAL；paidDays 是用奖励假期抵扣的部分。日期和总天数必须一致，先核对余额及重叠申请。回读 PENDING 与余额预占。
- 老板审批：`put_leave_requests_by_id_review` params `{id}`，body `{"decision":"APPROVED","reviewNote":"日期和余额已核实"}`，或 REJECTED。回读状态和账本。通过后的未抵扣病假/事假可能联动工资，核对受影响月份。
- 余额可见设置：`put_leave_visibility` body `{"visibility":"SELF_ONLY"}` 或 ALL_SALES。全员可见仍不等于工资与业绩权限开放，必须沿用原网站角色边界。

余额不足、重复审批、申请重叠都不能靠新请求编号绕过；报告具体原因并保留已保存申请。

## 业绩目标、统计与周报

老板 `post_orders_stats_goal` body `{userId,month,salesTarget,ordersTarget}`，回读 `get_orders_stats_history` query `{year,userId}` 验证月目标。salesTarget 是原有业绩口径的目标数值，ordersTarget 是非负整数。

`get_orders_stats_dashboard` query 支持 startDate、endDate、createdBy、category；`get_orders_stats_history` 的 year=0 表示全时段；`get_orders_stats_customer_sources` 读当前来源统计。业务员的统计范围由服务端强制本人，即使传 ALL 或别人名称也不扩大权限。

`get_weekly_report` 首次按真实资料读取；默认不请求付费 AI 总结。用返回 sources 核对订单数、销售额、询盘、跟进、风险和下周计划，说明统计时间范围。用户需要润色时 `post_weekly_report_refine` body `{summary,instruction}`，保持原事实。未配置模型或供应商失败时说明无法润色，并返回已取得的事实周报；不能自行编造供应商成功回执。

## 查询参考汇率

`get_exchange_rates` 返回全部可用参考汇率；`get_exchange_rate_by_currency` params `{currency:"USD"}` 查单币种；`get_exchange_multiple` query `{currencies:"USD,EUR,GBP"}` 查多币种。`rate` 口径是一单位外币折合的人民币，`change` 是已取得的前后数值变化百分比；`lastUpdate` 表示服务取数时间，不是客户同意的订单汇率或银行成交价。

服务缓存有有效数据时沿用真实缓存；刷新失败可能返回原缓存，因此核对取数时间。无有效缓存且供应商不可用返回503，不能把缺值当成0、使用猜测数值或说汇率已更新。查询参考汇率不会重算历史订单、工资或已锁定单据。用户授权新核算时才使用其指定或已核实的汇率，并回读核算结果。

给用户的完成说明用短句：例如“报销已上报，金额12.35元；老板还没审核。”或“9月工资已核算并锁定，6170元；工资条还没发送。”只报告已回读的事实。

## 记录订单采购、包装、运费成本并对账

成本是内部人民币账本，与原订单销售币种、销售金额、库存和佣金分开。先读取 `get_orders_by_id_costs`，params `{id:真实正式订单id}`，取得 revision、items 里的稳定 lineId、entries 和原单位。PI 草稿不能登记实际成本。老板可维护公司正式订单，业务员只能维护本人订单；会计、打包、社媒及平台管理标记不自动取得成本权限。

产品费用使用对应 lineId；整单运费等使用 `lineId: null`。创建 `post_orders_by_id_costs`，修改 `patch_orders_by_id_costs_by_entryId`（params 另有真实 entryId）。示例 body：

这四个写入合同的 `wireInput` 直接引用原网站成本校验，不共用一个混合模板：创建/编辑需要商品归属、费用名、计算方式、日期和附件列表；作废只使用revision/requestKey/reason；标记已记齐使用revision/requestKey/complete。空附件明确传[]，整单归属明确传null；不会因为另一个动作需要费用名，就给作废或完成动作添加无关字段。网站严格拒绝额外字段。

```json
{
  "revision": 0,
  "requestKey": "本次保存生成并保留的UUID",
  "lineId": "刚查询到的真实商品行lineId",
  "name": "采购",
  "calculation": "QUANTITY",
  "amountCny": "",
  "quantity": "7",
  "unitPriceCny": "4.9370",
  "unit": "个",
  "supplier": "凭采购资料核实的供应商",
  "occurredOn": "2026-10-09",
  "note": "真实采购说明",
  "attachmentIds": []
}
```

QUANTITY 的采购数量和人民币单价最多四位小数，服务端相乘后按人民币两位小数四舍五入；示例为34.56元。采购数量可以与订单数量不同，不据此改动销售数量。AMOUNT 则提交最多两位小数的非负 `amountCny`，不填写虚构的采购数量和单价；真正零成本主动登记0。单条最多8份凭证。

**保留两层重试标识**：MCP 的 operationId 和账本 requestKey（UUID）。网络未知先查原 operationId，再回读原账本；仍要重试时保留同一原载荷和 requestKey。同 requestKey 换金额或内容会409；revision 过期也会409。刷新账本，向用户说明其他人的实际改动，重新核对后才生成新的 requestKey 保存，不移除版本字段或强制覆盖。

修改必须填写真实 reason。作废用 `delete_orders_by_id_costs_by_entryId`，body `{revision,requestKey,reason}`；它保留 VOID 历史，作废金额不计入合计，不能宣称凭证和账本已永久删除。`get_orders_by_id_costs_history` params `{id}` 返回修改人、原因、前后摘要与凭证；下一页用返回 nextCursor，不拿 entryId 当 cursor。

`post_orders_by_id_costs_completion` body `{revision,requestKey,complete:true}` 标记已记齐；每个商品须登记成本，已移除商品的历史成本需先处理。无成本时仅打开详情不会创建账本，标记完成也会拒绝。缺凭证数和已记齐状态分别核对，已记齐不表示财务已付款。完成后成本或订单商品变化会进入 REVIEW，读取变更历史再重新核对。`complete:false` 撤回已记齐。

### 上传成本凭证与读取原件

`post_orders_by_id_costs_attachments` params `{id}`，files 中 field=`file`，filename 使用真实图片或PDF名、mimeType与base64保持实际字节一致；原网站每次一份，文件最多20MB，MCP单请求有自己的传输上限。超过实时合同限制用合同支持的原生上传，不伪造路径或上传结果。

上传取得 `{id,filename,mimeType,sizeBytes}` 后，将该 id 放入保存成本的 attachmentIds。上传未绑定时只属于上传者；绑定后由当前订单权限决定访问，老板不能读取业务员尚未绑定的私人暂存文件。成本详情和历史不会暴露存储目录。`get_orders_by_id_costs_attachments_by_assetId` params `{id,assetId}` 返回真实 file。

首次取得 file.responseId，后续使用 `read_business_response_file` 的 `{responseId,offset:file.nextOffset,length}` 读同一原件；每块最多256KiB，直到hasMore=false。校验totalBytes和整体sha256，不把图片路径或“上传成功”当作实际凭证内容。凭证、订单或角色权限改变后续读也会拒绝；不改用他人连接或公开路径绕过。

### 筛选与导出成本概览

`get_order_costs` query 支持 scope=`mine`/`all`、search、product、owner、customer、country、supplier、costName、orderStatus、proof=`MISSING`/`COMPLETE`、minCost/maxCost、status=`DRAFT`/`COMPLETE`/`REVIEW`、from/to、page/pageSize。概览只列已保存账本，未登记订单不会被当作0元账本；去正式订单详情开始登记。业务员传all或其他owner也仍只读本人。

minCost/maxCost 比较整单有效成本人民币合计，与订单销售币种无关；supplier/costName 匹配有效条目，VOID不参与费用、供应商和缺凭证筛选。日期填真实 YYYY-MM-DD，起止顺序要正确。保留已保存零成本和作废账本历史，不用删行方式修正。

`get_order_costs_export` 用相同 query 导出真实 XLSX；读取上面的原件分块，核对“订单汇总”与“成本明细”、合计及作废状态。最多10000个订单，超过时缩小范围或分批，不能只读取首屏却声称全量导出。权限变化或他人responseId的续读失败应明确说明。

## 查看经营总览、风险和业务时间线

`get_management_overview`、`get_management_risks`、`get_management_activity_feed` 的 query 支持 range=`DAY`/`WEEK`/`MONTH`/`YEAR`/`ALL`，或startDate/endDate自定义范围，另有 salesperson 与category。业务员传其他姓名不会扩大到他人的业务；老板可筛选真实员工。回读scope和metricDefinitions解释统计口径，不把不同币种销售额或未收尾款等同于银行实收。

动态 `get_management_activity_feed` 可传limit；时间线 `get_management_business_timeline` 用query `{orderId}`、`{inquiryId}`、`{email}` 或`{customerName}` 查相关订单、询盘、邮件、客户与库存。姓名相同不是同一客户的证明，查看具体关联来源后再作结论。无权订单会返回空关联，不据此说订单不存在，更不能替换成老板连接取得资料。

风险项保留type、severity、owner、source和原href，描述下一步可做的事。客户到跟进日期是待办提示，不等于已经超过24小时宽限期的逾期统计；复盘面板用客户跟进报告核实。老板订单链接应到 /all-orders，业务员到 /my-orders。统计、风险和时间线均为读取；需要修改订单、客户或收款状态，按相应真实操作流程单独保存并回读。
