# 休假、待办、通知和日程

执行规格：`apps/server/tests/businessMcpFullsiteSchedule.test.ts`。下列操作依据原网站源码；规格、章节和阶段测试存在均不能替代当前源码指纹的全站验收。

1. `get_leave_overview` 回读本人可用奖励、待审批预占、申请和台账。销售的请求/台账始终只含本人；`ALL_SALES`只扩大奖励余额成员可见范围，他人业绩和目标仍按网站投影隐藏。读取概览还会评估本月达标奖励，不能描述成完全没有业务副作用。老板通过 `put_leave_visibility` body `{visibility:"SELF_ONLY"|"ALL_SALES"}` 设置并回读。
2. 老板读取 `get_leave_targets_by_userId_by_month`，`params:{userId,month:"YYYY-MM"}`，保存 `put_leave_targets_by_userId_by_month` body `{tiers:[{salesTargetUsd,rewardDays}]}`。必须是在职业务员；1至6档，金额/天数按原网站两位小数，目标严格递增且奖励不下降。服务按目标排序，不把输入顺序当保存顺序。`post_leave_manual_awards` body `{userId,days,reason}` 给实际合成/授权业务员发奖励，0至60天且理由2至500字；回读台账和余额，保持同operationId避免重复发奖。
3. 仅销售可 `post_leave_requests`，body `{startDate:"YYYY-MM-DD",days,leaveType:"HOLIDAY"|"SICK"|"PERSONAL",paidDays?,reason}`。网站推导结束日期，部分天数仍占最后日；病假/事假不得跨月。HOLIDAY必须全部使用奖励，其余可部分抵扣，待审批会预占 paidDays。422奖励余额不足，400日期/天数无效，409与待审批/已批准日期重叠。
4. 老板审批 `put_leave_requests_by_id_review`，`params:{id}`，body `{decision:"APPROVED"|"REJECTED",reviewNote?}`；先prepare并保持具体用户授权。成功后回读申请状态、奖励扣减台账及相关工资：未抵扣病假/事假自动计入相应月草稿，锁定工资导致409并整体回滚，不能为了审批擅自撤销工资。全额抵扣不会改工资请假字段。重复审批409；同operationId回执重放不能重复扣奖。
5. `post_todos` body `{content}` 创建本人手工待办；`put_todos_by_id` body `{content?,is_completed?}` 修改，`delete_todos_by_id` prepare后删除。`get_todos` 的 automated 与客户管理共用 CRM task。`post_todos_followups_by_id_complete`，`params:{id}`，只完成本人普通任务并写跟进时间线；import_first 或有效Alibaba评估任务必须进入客户详情记录真实沟通结果，400不能绕过。完成后回读任务、客户最近联系和时间线，跨本人任务404。
6. `get_calendar_preferences` → `put_calendar_preferences` body `{countries,clocks:[{id,label,timeZone}],reminders:[{id,title,date,time,advanceMinutes,color}]}` 保存本人偏好；原网站规范化无效国家/时区/提醒，CN自动保留。用实际返回值回读，不能报告已保存被过滤的条目。`get_calendar_metadata` 返回国家/时区候选，`get_calendar_clocks` 采用服务器 ICU 与实际夏令时。`get_calendar_holidays` query `{year,countries:"CN,US"}` 年份2000至2100，节假日数据源以返回值为准，不伪造未来官方安排。

   “再加一条提醒／改一个时钟”先读完整偏好，只修改指定项，再提交保留其他国家、时钟和提醒的完整三组数组；PUT是整组替换，不是追加或局部补丁。编辑原提醒保留其id，新提醒生成独立id。提醒id为1–80位字母数字、下划线或连字符，date为真实YYYY-MM-DD，time为HH:mm；advanceMinutes仅0/5/15/30/60/1440，color仅blue/emerald/amber/rose。当前最多100提醒、4时钟、8国家；metadata提供国家/时钟候选，没有提供提醒枚举。用户指定不支持的提前量或超限时说明具体限制，核实替代选择，不静默删除旧项或改成别的时间。保存后回读本次id、标题、日期时间以及原有项；被过滤的条目没有保存，不能据200报成功。普通提醒保存沿用本次明确授权，不再索要同一保存确认。

7. `get_calendar_exhibitions` query `{from,to}` 日期范围最多62天；销售只看到自己是有效成员的展会。只返回窄日程字段，不能把它当目录/客户导出。非法旧时区以原网站UTC回退提示展示，不能自动修写旧展会。
8. 老板/平台管理员用 `get_calendar_wecom_preview` query `{from,to}` 先核对 authorization.required、local及wecom列表；授权缺失时返回空企微列表及原入口，不代表同步过。`post_calendar_wecom_export/import` body `{from?,to?,confirmed:true,reminderIds:[],todoIds:[]}` 最多20选项，范围最多31天；需要具体外部同步授权、prepare票据及原生 confirmed。原网站503缺授权产生MCP UNKNOWN时保留原operationId、查询回执并检查对象，不能换键自动重发。缺供应商授权的真实拒绝单列前提检查，不算同步成功。
9. `get_notifications` query `{unread?,type?,page?}` 返回本人历史和未读计数；`put_notifications_by_id_read` 标本人单条，`put_notifications_read_all` body `{throughId}` 仅处理此前列表的边界，不清掉后来通知。跨本人404；page从1开始，throughId必须正整数。

公告的保存/权限与平台管理共用原网站契约，见 `system.md`；企微广播属于对外发送，保存公告不等于广播成功。以上写操作固定operationId，COMPLETED后回读；REJECTED更正已知参数，UNKNOWN/PENDING查询原回执并查业务对象。
