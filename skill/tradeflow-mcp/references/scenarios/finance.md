# 经营、工资、报销、成本与周报

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

明确周期、在职员工、正式/实习类型、个人绩效基数、模板、汇率、佣金/订单来源、已审核报销及工资记录状态。

先核对统计口径和单人试算，再核算已完成评分员工。固定扣款逐项填数量与原因，临时扣款逐笔填项目/金额/原因；成本按来源/币种入账。确认/发送/撤销等动作取得明确授权。

抽查员工逐项金额、每项封顶、应发合计、月份快照、报销审核/成本流水；报告金额和订单数回来源核对。

各固定扣款按个人基数×本项比例独立封顶，额外扣款按独立金额上限。已确认/已发送记录保留当月快照，先撤销才修改。核算不等于发送，模型润色不制造业绩，实时汇率依赖供应商。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/finance.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="dashboard"></a>
## 业绩面板

自然语言任务：请按当前权限完成“业绩面板”所需操作，并回读实际结果。业务步骤：

1. 老板可选择业务员；业务员的 KPI 默认只看自己。销售走势和业务排行是团队对比视图，始终展示全部在职业务员。
2. 选择产品分类，再选择今天、本周、本月、今年或自定义日期。
3. 切换条件后页面进入刷新态，等待指标恢复清晰后再读数。
4. 产品销售额不含运费；运费收入继续由独立指标展示，避免重复卡片占用经营空间。
5. 有效订单下方分开显示待打包、待传单和已发货数量。
6. 预计佣金拆分基础、复购、报关与自定义构成，仍需以月度核算为准。
7. 卡片底部不使用没有独立口径的装饰色条；判断业务含义以主值和文字明细为准。
8. 销售走势按当前日期与产品分类展示公司合计和全部在职业务员，便于横向比较；个人筛选不会把团队曲线缩成单人。
9. 业务排行使用带动画的横向柱状图；每行左侧是圆形头像、下方姓名和名次，柱尾显示销售额，悬停可查看询盘回复次数。
10. 目标进度把销售额与订单量放进同一汽车仪表盘：销售额为外环、订单量为内环，旁边保留两项实际值、目标值和真实达成率。
11. 销售表现的三种视图使用统一分段控件和左右切换动画；销售表现与假期奖励卡在桌面同一行等高，手机端保持独立自然高度。
12. 订单活跃日历按周排列、纵向显示周日至周六，每个方格对应一个真实自然日，颜色越深表示当天创建订单越多。
13. 使用 12 周、26 周、52 周切换时间轴密度；长周期看季节性，短周期看连续活跃和断档。
14. 顶部同时显示订单总数、活跃天数、最长连续和当前连续；鼠标悬停或键盘聚焦方格可查看日期与订单数。
15. 日历固定读取截至当前筛选结束日的滚动 52 周，并继承业务员和产品分类口径；页面日期筛选继续控制其他经营指标。
16. 产品、国家和业务员排行用于继续钻取，不要只看单一总额。
17. 老板可继续查看库存卖出数量、成本与毛利。
18. 老板可按业务员和月份设置多个“达到销售额 X，奖励 Y 天”档位；只发放当月达到的最高档，未更新会沿用最近一期配置并明确标记来源月份。
19. 月末任务只处理在职业务员，并以月份和员工唯一键保证重复运行不重复发放；自动与人工奖励都会通知老板和员工。
20. 老板可切换业务员余额权限为“仅本人”或“查看全员”，服务端会同步裁剪返回数据，不只是前端隐藏。
21. 业务员选择开始日期、结束日期、使用天数并填写理由后提交；待审批天数会计入可用余额校验，老板批准后正式扣减，拒绝不扣减。
22. 网页与小程序读取同一余额、目标和审批数据；异常时不要线下改数字，先核对余额流水和申请状态。
23. 优先处理紧急与高风险项目，再查看普通提醒。
24. 点击可跳转的指标时，系统会尽量带上当前时间和人员口径。
25. 刷新失败时使用页面重试，不要把旧数据当成当前结论。

角色候选：BOSS、SALES。前置对象：sales-user、formal-order、payroll-template、evaluation、reimbursement、payroll-record、cost-entry、archive、report-job；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_leave_overview`：GET /api/leave/overview
- `get_leave_targets_by_userId_by_month`：GET /api/leave/targets/:userId/:month
- `get_management_activity_feed`：GET /api/management/activity-feed
- `get_management_business_timeline`：GET /api/management/business-timeline
- `get_management_overview`：GET /api/management/overview
- `get_management_risks`：GET /api/management/risks
- `put_leave_targets_by_userId_by_month`：PUT /api/leave/targets/:userId/:month
- `put_leave_visibility`：PUT /api/leave/visibility

验收情景编号：`capability:dashboard`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="payroll"></a>
## 薪资管理

自然语言任务：请按当前权限完成“薪资管理”所需操作，并回读实际结果。业务步骤：

1. 正式员工与实习生使用不同考核口径，先核对员工类型。
2. 在“员工设置”为每位员工设置绩效基数；默认 ¥500，不再由模板统一覆盖。
3. 模板可分别维护奖金项、每个固定扣款项的独立绩效基数比例上限、额外扣款金额上限与每月固定报销。
4. 确认当前核算月份和汇率，避免跨月取数。
5. 奖金项按员工个人绩效基数等比计算；自动项仍需核对原始业绩。
6. 固定扣款项填写未完成数量，有未完成时必须填写具体原因。
7. 老板临时扣款每笔都要填写项目、金额和原因，不能只写一个合计。
8. 带自动采集标识的销售数据来自业绩口径；异常时先回到订单核对。
9. 先单人试算，再批量核算已完成评分的员工。
10. 每个固定扣款项按“个人绩效基数 × 本项比例”独立封顶；额外扣款不占绩效比例，只受独立月度金额上限约束。
11. 逐项检查固定报销、已审核报销、其他报销、佣金、社保与请假扣款。
12. 下载业绩表后抽查至少一名员工的逐项金额。
13. 发送前确认员工、月份、各项金额和最终应发总额。
14. 已确认或已发送记录保留当月基数和调整快照；需要修改时先撤销，再重新核算。
15. 不要把“已核算”误认为“已发送”。

角色候选：BOSS。前置对象：sales-user、formal-order、payroll-template、evaluation、reimbursement、payroll-record、cost-entry、archive、report-job；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_payroll_me_reimbursements_by_id`：DELETE /api/payroll/me/reimbursements/:id
- `delete_payroll_records_by_id`：DELETE /api/payroll/records/:id
- `delete_payroll_templates_by_id`：DELETE /api/payroll/templates/:id
- `get_exchange_multiple`：GET /api/exchange/multiple；外部前提候选：公开汇率供应商可用性
- `get_exchange_rate_by_currency`：GET /api/exchange/rate/:currency；外部前提候选：公开汇率供应商可用性
- `get_exchange_rates`：GET /api/exchange/rates；外部前提候选：公开汇率供应商可用性
- `get_payroll_auto_data`：GET /api/payroll/auto-data
- `get_payroll_evaluations`：GET /api/payroll/evaluations
- `get_payroll_me_estimate`：GET /api/payroll/me/estimate
- `get_payroll_me_reimbursements`：GET /api/payroll/me/reimbursements
- `get_payroll_paydays`：GET /api/payroll/paydays
- `get_payroll_performance_report`：GET /api/payroll/performance-report
- `get_payroll_performance_report_jobs_by_jobId`：GET /api/payroll/performance-report/jobs/:jobId
- `get_payroll_performance_report_jobs_by_jobId_download`：GET /api/payroll/performance-report/jobs/:jobId/download
- `get_payroll_records`：GET /api/payroll/records
- `get_payroll_reimbursements`：GET /api/payroll/reimbursements
- `get_payroll_salary_report_jobs_by_jobId`：GET /api/payroll/salary-report/jobs/:jobId
- `get_payroll_salary_report_jobs_by_jobId_download`：GET /api/payroll/salary-report/jobs/:jobId/download
- `get_payroll_sales_users`：GET /api/payroll/sales-users
- `get_payroll_templates`：GET /api/payroll/templates
- `get_payroll_templates_by_id`：GET /api/payroll/templates/:id
- `post_payroll_batch_calculate`：POST /api/payroll/batch-calculate
- `post_payroll_batch_send`：POST /api/payroll/batch-send；外部前提候选：外发或企业微信真实连接
- `post_payroll_calculate`：POST /api/payroll/calculate
- `post_payroll_evaluations`：POST /api/payroll/evaluations
- `post_payroll_me_reimbursements`：POST /api/payroll/me/reimbursements
- `post_payroll_paydays_settle`：POST /api/payroll/paydays/settle
- `post_payroll_performance_report_jobs`：POST /api/payroll/performance-report/jobs
- `post_payroll_records_by_id_revoke`：POST /api/payroll/records/:id/revoke
- `post_payroll_records_by_id_send`：POST /api/payroll/records/:id/send；外部前提候选：外发或企业微信真实连接
- `post_payroll_salary_report_jobs`：POST /api/payroll/salary-report/jobs
- `post_payroll_templates`：POST /api/payroll/templates
- `put_payroll_records_by_id_confirm`：PUT /api/payroll/records/:id/confirm
- `put_payroll_reimbursements_by_id_review`：PUT /api/payroll/reimbursements/:id/review
- `put_payroll_templates_by_id`：PUT /api/payroll/templates/:id
- `put_payroll_users_by_id_employment_type`：PUT /api/payroll/users/:id/employment-type

验收情景编号：`capability:payroll`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="my-payroll"></a>
## 我的工资

自然语言任务：请按当前权限完成“我的工资”所需操作，并回读实际结果。业务步骤：

1. 先选择需要查看的年月。
2. 月份没有记录时联系负责人确认是否已核算。
3. 美元佣金会按当月核算汇率换算成人民币。
4. 绩效项可与目标和实际完成值交叉核对。
5. “报销与扣款凭据”会显示固定报销、每笔扣款原因、原始/实际金额和封顶公式。
6. 发现人员、月份或金额不符时不要自行推算，直接联系负责人。
7. 页面只展示本人授权数据。

角色候选：SALES。前置对象：sales-user、formal-order、payroll-template、evaluation、reimbursement、payroll-record、cost-entry、archive、report-job；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_payroll_me_reimbursements_by_id`：DELETE /api/payroll/me/reimbursements/:id
- `get_payroll_me_estimate`：GET /api/payroll/me/estimate
- `get_payroll_me_reimbursements`：GET /api/payroll/me/reimbursements
- `post_payroll_me_reimbursements`：POST /api/payroll/me/reimbursements

验收情景编号：`capability:my-payroll`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="history"></a>
## 业绩历史档案

自然语言任务：请按当前权限完成“业绩历史档案”所需操作，并回读实际结果。业务步骤：

1. 先选年份和月份，再选择业务员。
2. 历史快照与实时业绩面板口径不同。
3. 归档值用于历史追溯，不应被当前订单静默改写。
4. 异常时对照归档时间和来源记录。
5. 打开导出文件检查完整性。
6. 敏感业绩文件只在授权范围内流转。

角色候选：BOSS、SALES。前置对象：sales-user、formal-order、payroll-template、evaluation、reimbursement、payroll-record、cost-entry、archive、report-job；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_orders_stats_history`：GET /api/orders/stats/history

验收情景编号：`capability:history`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="weekly"></a>
## 周报

自然语言任务：请按当前权限完成“周报”所需操作，并回读实际结果。业务步骤：

1. 确认统计周期和当前用户。
2. 数据不完整时先修正订单或业务记录。
3. 先阅读标准内容，再决定是否 AI 生成。
4. 润色指令只改变表达，不应虚构业务事实。
5. 重要金额和订单数回到来源页面核对。
6. 复制或导出后检查格式。

角色候选：BOSS、SALES。前置对象：sales-user、formal-order、payroll-template、evaluation、reimbursement、payroll-record、cost-entry、archive、report-job；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_weekly_report`：GET /api/weekly-report
- `post_weekly_report_refine`：POST /api/weekly-report/refine；外部前提候选：真实付费模型、OCR或供应商

验收情景编号：`capability:weekly`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="order-costs"></a>
## 订单成本与利润

自然语言任务：请按当前权限完成“订单成本与利润”所需操作，并回读实际结果。业务步骤：

1. 进入“订单成本”，筛选产品/规格、客户、国家、供应商、成本名称、状态、凭证情况及人民币总成本范围，点击订单行“登记成本”。
2. 在目标商品点击“记成本”或在整单区域点击“记费用”，填写成本名称、发生日期和本笔人民币金额；按采购数量×人民币单价时另填独立采购数量与单位。
3. 展开“供应商、备注及费用归属”选择商品或整单费用；添加图片或PDF凭证，每份最多20MB，可后补。
4. 点击“保存成本”或新记录的“保存并继续”，检查产品成本、整单费用、合计及未附凭证数；遇到字段错误先修正，取消有修改时处理放弃确认。
5. 修正使用编辑、复制或“作废成本”；作废必须填写原因，原记录与凭证仍在“历史”的修改前/后中保留。
6. 已移除商品的历史成本仍计入合计，需要转归或作废后再“标记已记齐”；“刷新核对”回读最新结果，结果未知使用“重试确认保存”核对原请求。

角色候选：BOSS、SALES。前置对象：sales-user、formal-order、payroll-template、evaluation、reimbursement、payroll-record、cost-entry、archive、report-job；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id_costs_by_entryId`：DELETE /api/orders/:id/costs/:entryId
- `get_order_costs`：GET /api/order-costs
- `get_order_costs_export`：GET /api/order-costs/export
- `get_orders_by_id_costs`：GET /api/orders/:id/costs
- `get_orders_by_id_costs_attachments_by_assetId`：GET /api/orders/:id/costs/attachments/:assetId
- `get_orders_by_id_costs_history`：GET /api/orders/:id/costs/history
- `patch_orders_by_id_costs_by_entryId`：PATCH /api/orders/:id/costs/:entryId
- `post_orders_by_id_costs`：POST /api/orders/:id/costs
- `post_orders_by_id_costs_attachments`：POST /api/orders/:id/costs/attachments
- `post_orders_by_id_costs_completion`：POST /api/orders/:id/costs/completion

验收情景编号：`capability:order-costs`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="reimbursement"></a>
## 报销与工资明细

自然语言任务：请按当前权限完成“报销与工资明细”所需操作，并回读实际结果。业务步骤：

1. 进入“我的工资”，选择工资月份，查看工资明细与报销列表，点击“上报一笔报销”。
2. 每笔费用填写日期、类别、人民币金额和用途，上传对应凭证；每条最多3份，上传失败只重传失败文件。
3. 点击“确认上报”，看到“报销已归入…发薪日”或已登记提示后，在列表核对记录和状态。
4. 报销按提交时间归最近一次发薪日，与消费日期无关；是否审核按公司设置，默认不要求审核，未要求审核时显示待报销。
5. 是否计入工资按当前设置与工资快照核对，默认另行报销；“另行报销”不计入上方工资，已锁定工资保持原值，新增费用另行处理。
6. 待处理记录可撤回，先确认删除这笔待处理报销；已审核记录不能撤回。读取失败点“重试”，上报成功后的刷新失败只回读，不把登记或通知当成实际转账。

角色候选：BOSS、SALES。前置对象：sales-user、formal-order、payroll-template、evaluation、reimbursement、payroll-record、cost-entry、archive、report-job；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_payroll_me_reimbursements_by_id`：DELETE /api/payroll/me/reimbursements/:id
- `get_payroll_me_reimbursements`：GET /api/payroll/me/reimbursements
- `get_payroll_reimbursements`：GET /api/payroll/reimbursements
- `post_payroll_me_reimbursements`：POST /api/payroll/me/reimbursements
- `post_upload`：POST /api/upload
- `post_upload_abandon`：POST /api/upload/abandon
- `post_upload_base64`：POST /api/upload/base64
- `put_payroll_reimbursements_by_id_review`：PUT /api/payroll/reimbursements/:id/review

验收情景编号：`capability:reimbursement`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
