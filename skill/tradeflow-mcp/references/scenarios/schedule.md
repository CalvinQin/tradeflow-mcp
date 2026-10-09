# 日程、假期、待办、通知与公告

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

核对本人/团队可见范围、业务日期、时间区、请假余额与待审批天数、老板设置的奖励档位、通知筛选与高水位。

保存本人地区时钟和提醒；待办创建/完成独立本人对象，客户沟通须通过真实跟进结果。请假填日期/天数/理由，老板审批按余额流水；公告保存后回读，企业微信同步先预览所选项目。

查本人偏好、当天待办、请假状态/余额/流水、通知未读数与公告内容；有新通知时只把指定高水位范围标已读。

审批批准正式扣减，拒绝不扣减；月末奖励按月/员工唯一键不重复发放。浏览器提醒依赖网页运行/系统权限；企业微信同步/广播是外发前提，保存公告不等于已发送。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/schedule.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="announcements"></a>
## 公告中心

自然语言任务：请按当前权限完成“公告中心”所需操作，并回读实际结果。业务步骤：

1. 在公司公告阅读最新通知；没有公告时页面明确显示暂无公司公告。
2. 展开更新公告归档中的版本，核对功能说明与历史记录；此处不是普通公司公告的历史编辑列表。
3. 填写公告内容并保存，回到顶部核对滚动内容；不会在员工登录后自动弹窗。
4. 清除公告前确认当前内容无需继续展示；读取失败先重新加载，避免用空内容覆盖未知结果。
5. 在品能小助手全员消息分别填写消息标题与正文，先核对内容及员工范围。
6. 点击“确认发送”阅读内容预览，核对范围后点击“立即发送”；检查送达人数、部分送达或未送达回执，不使用小程序通知卡片。
7. 发送失败先核对实际回执与收件范围，不把滚动公告保存当成已发送企业微信。

角色候选：BOSS、SALES、PACKER、ACCOUNTANT、SOCIAL_OPERATOR。前置对象：leave-request、leave-target、holiday、manual-award、reminder、todo、notification、announcement；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_system_announcement`：GET /api/system/announcement
- `post_system_announcement`：POST /api/system/announcement
- `post_system_announcement_wecom_broadcast`：POST /api/system/announcement/wecom-broadcast；外部前提候选：外发或企业微信真实连接

验收情景编号：`capability:announcements`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="leave"></a>
## 请假与假期奖励

自然语言任务：请按当前权限完成“请假与假期奖励”所需操作，并回读实际结果。业务步骤：

1. 在日程查看已订阅法定假期与本人请假日期；具体申请从小程序“请假与假期”的“申请请假”进入。
2. 选择奖励假期、病假或事假，填写开始/结束日期、总天数与理由；病假/事假可另填使用奖励假期天数，不使用时填0。
3. 核对可用余额后提交，按字段下方错误修正日期、天数或理由；只有使用奖励假期的部分预占额度，不直接改余额总数。
4. 老板在工作台待审批或请假页查看申请，核对抵扣天数后批准或拒绝；批准按流水扣减，拒绝不扣减。
5. 核对奖励目标、已发放奖励与余额流水；月度奖励按达到的最高档，工资核算另行读取未抵扣的病假/事假影响。
6. 返回申请列表和Web日程查看状态；工资预估、审批通过与实际发放分别核对，提交失败保持原申请资料按提示处理。

角色候选：BOSS、SALES。前置对象：leave-request、leave-target、holiday、manual-award、reminder、todo、notification、announcement；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_calendar_holidays`：GET /api/calendar/holidays
- `get_calendar_metadata`：GET /api/calendar/metadata
- `get_leave_overview`：GET /api/leave/overview
- `get_leave_targets_by_userId_by_month`：GET /api/leave/targets/:userId/:month
- `post_leave_manual_awards`：POST /api/leave/manual-awards
- `post_leave_requests`：POST /api/leave/requests
- `put_leave_requests_by_id_review`：PUT /api/leave/requests/:id/review
- `put_leave_targets_by_userId_by_month`：PUT /api/leave/targets/:userId/:month
- `put_leave_visibility`：PUT /api/leave/visibility

验收情景编号：`capability:leave`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="todo"></a>
## 待办与跨时区日程

自然语言任务：请按当前权限完成“待办与跨时区日程”所需操作，并回读实际结果。业务步骤：

1. 进入“日程”，在月日历选择日期或切换“日历/安排与待办”，查看当天日程；世界时钟可搜索国家、城市或时区并“保存时钟”。
2. 点击“新建提醒”，填写标题、日期、时间及提前提醒量，核对业务日期后“保存提醒”；浏览器系统通知需要授权且网页保持打开。
3. 在待办页签创建或处理待办，核对任务负责人和截止信息；客户自动跟进任务应回到客户档案处理。
4. 节日日历使用“节日”订阅允许的国家/地区，超过数量按提示减少；中国订阅依页面规则保留。
5. 老板或平台管理员点击“企微同步”，选择同步方向，读取预览后逐项勾选日程/待办，再“确认同步到企微”或“确认同步到TradeFlow”。
6. 同步列表失败先刷新预览，实际写入失败按回执核对原对象；删除提醒先确认，可在撤回期间恢复，不把页面内提醒当成企微已同步。

角色候选：BOSS、SALES。前置对象：leave-request、leave-target、holiday、manual-award、reminder、todo、notification、announcement；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_todos_by_id`：DELETE /api/todos/:id
- `get_calendar_clocks`：GET /api/calendar/clocks
- `get_calendar_exhibitions`：GET /api/calendar/exhibitions
- `get_calendar_holidays`：GET /api/calendar/holidays
- `get_calendar_metadata`：GET /api/calendar/metadata
- `get_calendar_preferences`：GET /api/calendar/preferences
- `get_calendar_wecom_preview`：GET /api/calendar/wecom/preview
- `get_todos`：GET /api/todos
- `post_calendar_wecom_export`：POST /api/calendar/wecom/export；外部前提候选：外发或企业微信真实连接
- `post_calendar_wecom_import`：POST /api/calendar/wecom/import；外部前提候选：外发或企业微信真实连接
- `post_todos`：POST /api/todos
- `post_todos_followups_by_id_complete`：POST /api/todos/followups/:id/complete
- `put_calendar_preferences`：PUT /api/calendar/preferences
- `put_todos_by_id`：PUT /api/todos/:id

验收情景编号：`capability:todo`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="notifications"></a>
## 通知与身份协作

自然语言任务：请按当前权限完成“通知与身份协作”所需操作，并回读实际结果。业务步骤：

1. Web打开通知入口，小程序从工作台点击通知图标进入“消息中心”，按标题辨认客户、订单、工资或系统通知。
2. 点击“查看详情”进入对应业务对象，先核对当前账号和状态；对象权限撤销后按权限提示返回，通知本身不扩张访问范围。
3. 查看未读标记，逐条读取或点击“全部已读”；全部已读只是阅读标记，不等于业务任务已完成。
4. 在“个人设置”核对微信与企业微信绑定状态，必要时“刷新状态”；更换本人身份先解除旧绑定，再按官方入口绑定。
5. Alibaba身份待验证时保留旧的有效绑定，等待官方证据确认；身份绑定不替换老板店铺Token，也不读取本人密码。
6. 通知读取失败重新读取当前列表；链接失效时通过订单号或客户名称回到本人可访问的业务页面，不用其他账号绕过权限。

角色候选：BOSS、SALES、PACKER、ACCOUNTANT、SOCIAL_OPERATOR。前置对象：leave-request、leave-target、holiday、manual-award、reminder、todo、notification、announcement；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_auth_wechat_binding`：DELETE /api/auth/wechat/binding
- `delete_auth_wecom_binding`：DELETE /api/auth/wecom/binding
- `get_auth_wechat_binding`：GET /api/auth/wechat/binding
- `get_auth_wechat_binding_session`：GET /api/auth/wechat/binding-session
- `get_auth_wecom_binding`：GET /api/auth/wecom/binding
- `get_notifications`：GET /api/notifications
- `post_auth_wechat_binding_scene`：POST /api/auth/wechat/binding-scene
- `post_auth_wechat_binding_session`：POST /api/auth/wechat/binding-session；外部前提候选：真实微信小程序二维码配置
- `post_users_test_email`：POST /api/users/test-email；外部前提候选：外发或企业微信真实连接
- `put_notifications_by_id_read`：PUT /api/notifications/:id/read
- `put_notifications_read_all`：PUT /api/notifications/read-all

验收情景编号：`capability:notifications`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
