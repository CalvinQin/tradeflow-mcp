# 系统、用户与个人资料的业务配方

执行规格：`apps/server/tests/businessMcpFullsitePlatform.test.ts`。配方描述真实网站契约；验收状态以当前合同指纹对应的全站清单为准，不能因为文件存在就报告通过。

## 每次任务先做的事

1. 使用当前用户自己的 OAuth 连接，读 `get_tradeflow_context`，核对身份、正式/演示工作区、岗位和平台管理权。
2. 用 `list_business_operations` 定位业务操作，然后读 `get_business_operation_contract`。字段、作用范围、版本要求以实时契约为准；不要拼任意 URL 或访问数据库。
3. 普通修改在用户已明确目标和范围时连续完成。写入使用稳定 `operationId`；有敏感影响时先 `prepare_business_action` 并使用相同参数提交，保留网站的确认要求。用户已明确授权同一动作时不再重复问。
4. `COMPLETED` 后查 `get_business_operation_result`，再读实际对象核对。`UNKNOWN` 先查原操作，不能换 ID 重试。403 说明当前账号不能执行，不能改用老板或他人连接绕过。

## “把订单默认显示改为每页 25 条、按金额排序”

- 平台管理员读 `get_system_settings`，保存本次要改的原值。
- `post_system_settings` 的 body 是 `{settings:{order_page_size:"25",order_default_sort:"amount_desc"}}`，值是字符串。
- 只传明确修改的白名单键，不把读取到的整组配置原样覆盖。
- 回读 `get_system_settings`，核对保存值。普通成员只能读 `get_system_settings_defaults` 的成员白名单，不能读取管理配置。
- 当前支持的分页值为 `10/20/25/30/50`；排序为 `date_desc/date_asc/amount_desc`。实时契约有变化时按新值执行。
- 定价、提成汇率、付款档案有各自业务操作，不能塞进系统默认设置。无权或未知字段被拒绝时保留原值。

## “发布一条网站公告”

- 核对已授权的原文，执行 `post_system_announcement`，body `{announcement:"已确认的公告内容"}`。
- 回读 `get_system_announcement`。这一步仅更新网站公告。
- 企业微信群发是另一个外发动作 `post_system_announcement_wecom_broadcast`，需要明确收件范围和消息授权；网站公告保存成功不能报告为群发成功。

## “更新团队订单表格列和默认视图”

- 先读 `get_system_table_views_by_scope`，params `{scope:"当前页面使用的真实 scope"}`；未发布时 `view:null`。
- 老板执行 `put_system_table_views_by_scope`，body 包含 `activeViewId` 和 `snapshot`。
- snapshot 的字段为 `columnVisibility`、`columnOrder`、`columnSizing`、`columnPinning:{left:[],right:[]}`、`sorting:[{id,desc}]`、`density`。只使用当前页面真实列 ID；宽度须为正数，密度为 `compact/default/comfortable`。
- 回读同一 scope，核对 revision、发布者、activeViewId 和完整快照；这是共享布局，不能声称修改了订单金额。
- 平台管理员标记不会自动赋予老板专属的共享表格发布权限。本人列设置与团队发布分开处理。

## “新增业务员，再修改薪资和业绩目标”

- 老板先 `get_users` 查重，按用户已提供的信息执行 `post_users`，body 至少 `{username,password,role}`。
- 创建和修改账号都标记为权限管理，先准备同一请求再提交。实时合同的 `wireInput` 直接引用网站18个字段的校验：创建仅username/role/password必填，修改是局部字段。不能把目标用户ID、createdBy、服务器散列或响应方法名当作body字段。
- 密码通过受保护请求传入，不在聊天、日志或文档回显。接口仅回 `{success:true}`，用 `get_users` 的唯一用户名定位实际 id，不能猜 ID。
- 角色仅用当前契约中的 `SALES/BOSS/PACKER/ACCOUNTANT/SOCIAL_OPERATOR`。薪资、提成率、目标是商业值，缺失时不编造。
- 修改执行 `put_users_by_id`，params `{id}`，body 仅传目标字段，如 `{base_salary:4500.5,monthlySalesTarget:12345.67,monthlyOrderTarget:8}`。
- 回读用户及目标，核对具体数值。普通成员的用户列表没有薪资、提成、平台授权等敏感字段，不要求 MCP 补出网站没有给的字段。
- 平台管理授权只允许在职业务员 `isPlatformAdmin:true`；必须有明确授权，不能为了任务方便给自己提权。平台管理员也没有老板专属的用户管理权限。
- 用户改名会按网站事务同步历史 username 归属，不能用原名重新生成一套客户/订单。

## “停用离职业务员／解绑他的微信”

- `delete_users_by_id` 表示标记 `employment_status:LEFT`，保留账号和历史数据，撤销平台管理标记；不是物理删除历史业务。
- 老板账号不能通过该操作离职停用。回读用户状态和授权状态，不能把 403 当作成功。
- `delete_users_by_id_wechat_binding` 是独立解绑操作。`unbound:false` 说明原本没有绑定，不能报告成删除了一条绑定。
- 离职或撤销连接后的权限按网站当前数据重新判定；不可继续使用缓存权限执行操作。

## “更新我的联系方式和邮件签名”

- `get_users_me_exhibition_profile` 读取本人统一公开名片。
- `put_users_me_exhibition_profile` 用 `{nameEn,email,phone,wechat,whatsapp,wecomQrUrl,whatsappQrUrl}` 保存本人资料。当前接口是完整表单语义，先读当前值并保留未修改字段，不能漏传后无意清空。
- WhatsApp 使用包含国家码的 7–15 位数字，服务端规范为 `+数字`。二维码必须由本人上传到 `/uploads/user-exhibition-profiles/<本人ID>/`，不能引用别人的目录。
- 回读本人名片；邮箱、姓名与账号资料相同会使用账号默认值，后续账号更新自动同步。
- 邮箱配置用 `get_users_email_config` 和 `put_users_email_config`，body `{email_address,email_signature,email_password?}`。读取只给 `has_password`，不能读取原密码。留空密码保留原凭据。
- 改配置后 `email_verified:false` 是正常状态。`post_users_test_email` 真的连接 SMTP；缺邮箱/密码时返回“请先配置邮箱和密码”，此时不能报告测试成功或发出过邮件。

## “更新小程序码／企业微信加入码”

- 小程序 `get_system_mini_program` 返回 appId、当前 release version、qrCodeUrl。版本与独立小程序源码有同步守卫；源码版本号不代表已经上传或正式发布。
- 平台管理员用 `post_system_mini_program`，body `{qrCodeUrl}`，并回读原值；站内路径或 HTTPS，不能传脚本地址。
- 企业微信加入入口用 `get_system_wecom_join` / `post_system_wecom_join`，加入码须来自对应上传目录或 HTTPS。
- 这里保存的是入口资料，不能把保存成功当成扫码登录、企业绑定、微信审核或真机验收成功。

## 维护时怎样避免旧配方失效

业务路由、字段、角色、数据模型更新后，同时更新操作目录、wire schema、对应场景章节和实际测试。执行契约同步守卫；所有证据绑定当前合同、规格、配方和测试指纹。旧指纹的成功回执保留作为历史，不能计入当前版本的完成率。

## “修改我的密码和头像”

- 先用 `get_auth_me` 核对当前本人。头像更新、密码检查和修改均作用于本人，不能用 body 的用户 ID 修改别人。
- `put_auth_update_avatar` 的 body 为 `{avatar:"本人已上传的图片路径或有效图片 URL"}`。回读 `get_auth_me` 和本人资料；网址保存成功不代表已验证远程图片可加载。
- `post_auth_verify_password` 用 `{password}`，`valid:false` 表示密码不正确，即使 HTTP 200 也不能继续声称通过验证。
- `post_auth_change_password` 用 `{oldPassword,newPassword}`。用户已授权本人改密后先准备敏感操作、沿用原 `operationId` 执行；密码仅在受保护请求中传入，不回显到聊天或普通日志。
- 原密码错误返回 401，缺字段返回 400。修改后用新密码验证本人登录；不知道原密码时不能自行重置。管理员重置是另一个独立授权范围。
- 网站目前没有修改密码后自动撤销所有 OAuth 连接的承诺，不能把改密成功描述为已注销其他设备。本人连接撤销应使用接入中心的对应操作。

## “审核一家公司申请／签发体验码”

- `get_system_company_access_requests` 仅平台管理权限可读取申请，不代表已经创建独立服务器、数据库或正式账户。
- `put_system_company_access_requests_by_id` 的 params `{id}`、body `{status,reviewNote?}`。状态为 `PENDING/CONTACTED/APPROVED/REJECTED`，按实际审核结论填写，不编造联系人或批准依据。
- `PENDING` 会清空审核人和审核时间；其他状态记录本次审核人。管理员自助体验码 `source:ADMIN_DEMO` 不需要申请审核，不能硬改为申请流程。
- `post_system_company_access_requests_by_id_demo_access` 重新签发 24 小时体验码，旧码立即无效，使用计数重置。需明确授权后准备并提交，回读新码、到期时间和申请；码只交给授权接收者，不张贴到公开文档。
- `post_system_demo_access_admin` 领取当前管理员自己的体验码；存在未过期可读取的码时复用，不重复生成一堆申请。
- `delete_system_company_access_requests_by_id` 永久删除申请及该码关联记录，需要明确删除授权。这与客户回收站完全不同，不承诺 15 天找回。
- `get_system_company_profile` 只返回公开名称、地址和 Logo，私有印章、银行资料应通过具备权限的单据操作读取，不能从公开公司资料补猜。

## “查看登录统计和后台任务是否真的完成”

- 老板读 `get_system_logs_login`，query `{page,limit}`；页码正整数，limit 为 1–100。继续分页才能得到全量日志。
- 老板读 `get_system_logs_stats`，query `{days}`，按北京时间自然日统计，范围规范为 1–366 天。平台管理员标记不等于老板角色，不能绕过老板专属日志权限。
- 平台管理员读 `get_system_jobs`，返回持久化的任务状态及更新时间。`running` 尚未完成，`failed` 必须报告失败原因；状态列表不是启动任务接口。
- 找不到任务、没有记录或旧更新时间不能解释成已完成；根据任务关联的业务对象或导出 jobId 再回读实际结果。

## “配置通知服务，再测试通知”

- 平台管理员读 `get_system_token`，只检查 `configured/encrypted`；原 Token 不可读取。
- `post_system_token` 用 `{token}` 保存用户已提供的通知凭据，存储加密。空字符串表示保持不变，不能把空值保存解释为已清除凭据。
- `post_system_notify_test` 是外发动作，先核对目标 UID 或真实 userId、用户名和授权，再准备并提交，不能随便给全部员工发测试。
- 缺 UID 会返回 `success:false`；有 UID 但缺通知 Token 会返回 409，并且 `delivery.skipped:true`、`reason:not_configured`、`recipients:0`。这些都表示未送达，不能把有回执理解为成功。
- 配置已保存不等于通知已发出；供应商发送API返回真实成功且未跳过时，只报告“渠道已接受”，设备送达/已读须相应真实回执。站内saved、渠道skipped/failed和队列pending分别说明，不把记录或待发说成已送达。429 按 Retry-After 等待，未知结果查询原操作，不换 ID 重发。

## “访问官网体验系统和体验 AI”

- 官网申请、体验码验证、体验 AI 使用原生网页协议，是独立于正式 MCP 业务写入的路径。正式 MCP 不能绕过体验码签发来源门禁。
- 体验码由真实申请或管理员领取产生，24 小时到期，重新签发后旧码不能再验证。
- 体验 AI 只提供说明，不会创建正式订单或写正式客户。一次访问码最多 5 次，模型失败也可能已经消耗次数；以错误提示和剩余次数为准，不反复重试耗尽额度。
- 模型未配置或不可用应明确说明“现在 AI 暂时不能回答”；不会伪造演示模型回答、切换身份绕过额度，或把体验回答当成正式业务操作成功。

以上补充的实际规格为 `apps/server/tests/businessMcpFullsiteSystemActions.test.ts`；包含原生申请/验码/AI 门禁。新增配方与测试后应重新执行统一验收，历史测试回执不能直接计入当前规格。

## “给一个 Agent 改名、改为只读、撤销连接”

- Agent 连接时在 MCP 设置里填网站提供的地址，选择 OAuth，点击认证，登录本人账号并确认凭证。连接器负责回调和 PKCE，不要让业务 Agent 拼授权 URL、猜 Client ID，或把凭证编号当 Client ID。
- 新建本人待连接凭证、动态注册、授权和续期使用原 OAuth 协议；老板管理已有连接可通过以下 supported 原网站别名操作。不能把原生协议和业务管理混成一种接口。
- 老板读 `get_system_mcp_clients`，返回本人管理的 `clients`、`endpointPath` 和 `prompt`。`pending` 表示凭证已建立但尚未授权；`authorized` 才有连接记录，是否仍能操作还取决于当前账号、到期、撤销与授权范围。
- 改名用 `put_system_mcp_clients_by_id_name`，params `{id}`、body `{name}`，1–100 字。只能改名称，不能传负责人或把连接转给他人。
- 权限修改用 `put_system_mcp_clients_by_id_permissions`，body `{accessMode:"READ_ONLY"}` 或 `{accessMode:"READ_WRITE",allowCustomerDelete?,allowOrderDelete?,allowReviewDelete?,allowBusinessDelete?}`。先列出用户明确要求的范围，准备敏感操作，再提交完全相同参数。
- READ_ONLY 不允许任何删除勾选；READ_WRITE 本身不等于任意删除。`allowCustomerDelete` 授权客户专用删除，不等于 `allowBusinessDelete`，不能勾选全部作为任务捷径。网站角色与对象权限仍实时生效，老板的 OAuth 授权不赋予其他角色老板权限。
- 回读实际 scopes，再用原连接核对：只读仍可查询，新增/修改被拒绝。不要根据修改前缓存的权限继续写入。
- `post_system_mcp_clients_by_id_revoke` 撤销指定连接；`delete_system_mcp_clients_by_id` 删除该管理连接，均需明确对象授权和准备票据。回读 `revokedAt` 或列表，并核对旧 OAuth 已不能使用。
- 删除连接不删除客户、订单、复盘批次和审计；服务器保留不可再授权的墓碑与历史关联。不要说历史业务已经清空。其他人的连接按原网站隐藏或404，不能借平台管理标记跨人管理。
- 新建或轮换手工 MCP 密钥已经废弃，原网站返回410。正常 MCP 用 OAuth，无须恢复密钥登录。授权有效时由原连接器续期；撤销、离职、过期或客户端丢失刷新状态后才需重新认证，不能承诺永久有效。

## “查看旧 REST 只读接入，停用一个旧客户端”

- 这章的 REST_READ 与正常 MCP OAuth 是两种独立接入；不要让 Agent 拿 `tfa_live_` 密钥配置 MCP，也不要把 REST 的 scope 当 MCP scope。
- 平台管理权限读 `get_system_agent_api_clients`，核对 `clients` 和实时 `availableScopes`。仅含旧 REST_READ 客户端，不包含 MCP 连接。
- 如用户明确要求建立旧 REST 只读客户端，`post_system_agent_api_clients` 的 body 为 `{name,scopes,rateLimitPerMinute?,expiresAt?}`。scopes 从实时列表选择，例如 `catalog:read`；至少一个有效只读权限。默认速率60，原服务规范到10–600次/分钟；expiresAt 留空无到期限制，填写时必须是未来时间。
- 原服务会去掉重复/未知 scope、规范名称和速率。回读实际保存值，不把自己输入的值当最终权限。创建者由服务器固定为当前用户，调用方不能改写 createdBy 或负责人。
- 创建会改变接入配置，需要明确授权、准备敏感票据和稳定 operationId。MCP 返回的 apiKey 为 `[REDACTED]`；这不代表已拿到可用密钥或已连接。确需一次性取得旧 REST 密钥，应由授权用户使用原网站安全页面，不在聊天、Skill、日志保存密钥。
- 停用用 `post_system_agent_api_clients_by_id_revoke`，params `{id}`，回读 `active:false`/`revokedAt`。该接口拒绝 MCP 类型的 ID；不会顺便撤销正常 OAuth。
- SALES、PACKER、ACCOUNTANT、SOCIAL_OPERATOR 未获原网站平台管理权限时403。当前用户没有权限就说明限制，不能换老板连接绕过。

## “处理导入复核：有候选客户才核实合并，没有负责人绑定就跳过”

- 阿里复盘前读 `get_alibaba_crm_context`，用 Accio 独立读取的真实店铺身份核对主账号、子账号、业务员绑定；按实际接待账号归属写入。没有有效绑定的记录默认跳过并在结果列出，不改挂老板、他人或虚构账号，不反复向用户询问。
- 复盘写的是中文总结、真实背景、标签和后续建议：需求是什么、已经推进到哪、阻碍是什么、下一步怎么做。聊天原文只作为证据，不把逐条时间戳与买卖双方对白粘进 summary；未确认公司、金额、数量或订单状态继续留空。
- 待人工复核的记录由老板 `get_system_mcp_clients_reviews` 分页读取，query `{before?:正整数游标}`，沿用原页长100及 `nextCursor`，有下一游标时继续读取。返回当前老板导入批次中需要复核的 PENDING/FAILED 和已入库但仍有差异的记录、实际候选、sellerOwner 与原提交内容；不是整个团队全部客户列表。
- 确认一个真实候选后用 `post_system_mcp_clients_reviews_by_id_resolve`，params `{id}`、body `{customerId}`；明确新客户才传 `{createNew:true}`。两者不能同时传，客户必须仍在当前候选中，服务端还会检查原批次、接待账号绑定和对象归属。
- 无绑定时即使传 createNew，原服务仍可能返回 `PENDING`，没有新增客户。不要把HTTP200当入库，也不要反复重试或修改负责人硬凑匹配。
- `disposition:"暂缓观察"` 的资料不会自动入库；只有用户明确接受这条资料后才用 `{acceptObservation:true}`。这与E等级“暂不安排跟进/暂缓”是不同的流程。
- `post_system_mcp_clients_reviews_by_id_dismiss` 未入库时是跳过复核记录，回执 `SKIPPED`；已入库但有差异时只是确认保留客户现有资料、清除复核原因并留审计。两者都不是删除客户，核对实际回执和列表即可。
- resolve/dismiss 均保留稳定 operationId 和相同参数，完成后回读实际 accountId、负责人、背景、标签、活动 summary。不要只回报 UPDATED/CREATED 就说资料全部已补齐；原服务保留已有人工内容，未被修改的字段应如实说明。

## “重新绑定我自己的微信，并检查文本内容”

- `post_auth_wechat_rebind_scene` 仅为本人已绑定微信建立 REBIND 场景，body `{includeQrCode:false}` 可取得场景而不调用真实二维码供应商。没有原绑定返回409，岗位无权403；不能用于替别人重新绑定。
- 操作需明确本人重绑授权和敏感准备。新的场景会撤销本人旧未用场景；相同 operationId 回放同一场景。回读本人 `get_auth_wechat_binding_session`，query `{sessionId:scene}`；其他用户访问404。
- pending 只表示场景已建立，原微信身份尚未改变。真实小程序扫码、确认、交换身份是原微信流程，不能通过写数据库或伪造回调完成，不能把创建场景说成绑定成功。
- `post_auth_wechat_content_security_text` 的 body `{content,scene?}` 使用真实微信内容安全服务。空白文本400；服务未配置或不可用时，网站可能返回200但 `{checked:false,unavailable:true}`，必须说明“没有完成检查”，不能说内容已通过。
- 网站采用 fail-closed 时未配置返回503 `SERVICE_UNAVAILABLE`；该错误说明外部前提缺失，没有调用供应商、更没有供应商通过结果。不得在任务中改安全策略以制造成功。
- 不同scene、文本检查与重绑场景不互相替代。按原权限、当前本人微信绑定及实际配置执行；场景字符串只给授权用户，不公开传播。

上述进阶执行规格为 `apps/server/tests/businessMcpFullsiteSystemAdvanced.test.ts`。仅当前契约、配方、测试与实际原站/数据库证据一致才计入验收；外部配置前提核实不代表真实供应商业务成功。
