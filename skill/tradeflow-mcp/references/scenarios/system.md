# 系统、用户、个人、移动端、演示与MCP

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

读取当前本人正式/演示工作区、岗位、平台管理权、公司设置和账号在职/绑定状态；密钥只看配置状态。

普通个人资料/密码操作按原身份验证；角色/在职/公司访问/系统默认值变更需准确授权与回退值。MCP由客户端完成注册/PKCE/本人登录/同意，五岗位只获得本人网站权限；移动端使用原认证协议。

查询本人、用户/审计、设置、绑定及凭证状态；离职/撤销后旧授权立即失效。演示数据和正式公司分离，密码修改后重新登录。

网站JWT不是MCP凭证；不能制造Client ID或向用户索要后台密码。DEMO禁止正式OAuth及真实外发/付费。后端共享契约通过不等于真机相册/扫码/打印验收；外部OAuth回调使用原协议。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/system.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

企微配置、原生回调及未连接边界见[企业微信操作配方](../recipes/wecom.md)。

<a id="wecom"></a>
## 企业微信

自然语言任务：请按当前权限完成“企业微信”所需操作，并回读实际结果。业务步骤：

1. 复制时核对完整 URL 和 IP。
2. 密钥只保存在受保护的服务端配置。
3. 确认账号、角色和在职状态。
4. 机器人权限不能超过绑定用户的业务权限。
5. 测试问答不执行不必要写操作。
6. 查看服务端日志时不要泄露 Token。

角色候选：PLATFORM_ADMIN。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_auth_wecom_binding`：DELETE /api/auth/wecom/binding
- `delete_system_wecom_bindings_by_userId`：DELETE /api/system/wecom/bindings/:userId
- `delete_system_wecom_bots_by_key`：DELETE /api/system/wecom/bots/:key
- `get_auth_wecom_binding`：GET /api/auth/wecom/binding
- `get_calendar_wecom_preview`：GET /api/calendar/wecom/preview
- `get_system_wecom`：GET /api/system/wecom
- `get_system_wecom_bindings`：GET /api/system/wecom/bindings
- `get_system_wecom_bot`：GET /api/system/wecom/bot
- `get_system_wecom_bots`：GET /api/system/wecom/bots
- `get_system_wecom_callback`：GET /api/system/wecom/callback（excluded，使用原协议）
- `get_system_wecom_cli`：GET /api/system/wecom/cli
- `get_system_wecom_join`：GET /api/system/wecom/join
- `post_auth_wecom_bind`：POST /api/auth/wecom/bind；外部前提候选：真实企业微信绑定授权
- `post_auth_wecom_login`：POST /api/auth/wecom/login（excluded，使用原协议）
- `post_calendar_wecom_export`：POST /api/calendar/wecom/export；外部前提候选：外发或企业微信真实连接
- `post_calendar_wecom_import`：POST /api/calendar/wecom/import；外部前提候选：外发或企业微信真实连接
- `post_system_announcement_wecom_broadcast`：POST /api/system/announcement/wecom-broadcast；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bot_reconnect`：POST /api/system/wecom/bot/reconnect；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots`：POST /api/system/wecom/bots
- `post_system_wecom_bots_by_key_connect_cli`：POST /api/system/wecom/bots/:key/connect-cli；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_customer_service_entry`：POST /api/system/wecom/bots/:key/customer-service-entry；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_reconnect`：POST /api/system/wecom/bots/:key/reconnect；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_test_customer_service`：POST /api/system/wecom/bots/:key/test-customer-service；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_callback`：POST /api/system/wecom/callback（excluded，使用原协议）
- `post_system_wecom_callback_credentials`：POST /api/system/wecom/callback-credentials
- `post_system_wecom_cli_authorize`：POST /api/system/wecom/cli/authorize；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_cli_import`：POST /api/system/wecom/cli/import；外部前提候选：真实企业微信CLI授权文件
- `post_system_wecom_cli_test`：POST /api/system/wecom/cli/test；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_join`：POST /api/system/wecom/join
- `post_system_wecom_test`：POST /api/system/wecom/test；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_test_message`：POST /api/system/wecom/test-message；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_workbench_sync`：POST /api/system/wecom/workbench/sync；外部前提候选：外发或企业微信真实连接
- `put_system_wecom`：PUT /api/system/wecom
- `put_system_wecom_bot`：PUT /api/system/wecom/bot
- `put_system_wecom_bots_by_key`：PUT /api/system/wecom/bots/:key
- `put_system_wecom_bots_by_key_default`：PUT /api/system/wecom/bots/:key/default
- `put_system_wecom_bots_mode`：PUT /api/system/wecom/bots/mode

验收情景编号：`capability:wecom`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="mini"></a>
## 微信小程序

自然语言任务：请按当前权限完成“微信小程序”所需操作，并回读实际结果。业务步骤：

1. 敏感密钥不会在前端明文显示。
2. 配置变更后需重新验证接口。
3. 扫码前确认版本和对应环境。
4. 下载后不要把测试码当作正式码传播。
5. 检查登录、订单、产品与角色权限。
6. 记录版本号和问题场景。

角色候选：BOSS、SALES、PACKER。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_auth_wechat_binding`：DELETE /api/auth/wechat/binding
- `delete_auth_wecom_binding`：DELETE /api/auth/wecom/binding
- `get_auth_me`：GET /api/auth/me
- `get_auth_wechat_binding`：GET /api/auth/wechat/binding
- `get_auth_wechat_binding_session`：GET /api/auth/wechat/binding-session
- `get_auth_wechat_web_login_session_by_sessionId`：GET /api/auth/wechat/web-login-session/:sessionId（excluded，使用原协议）
- `get_auth_wechat_website_callback`：GET /api/auth/wechat/website/callback（excluded，使用原协议）
- `get_auth_wecom_binding`：GET /api/auth/wecom/binding
- `get_system_mini_program`：GET /api/system/mini-program
- `post_auth_wechat_bind`：POST /api/auth/wechat/bind（excluded，使用原协议）
- `post_auth_wechat_binding_scene`：POST /api/auth/wechat/binding-scene
- `post_auth_wechat_binding_session`：POST /api/auth/wechat/binding-session；外部前提候选：真实微信小程序二维码配置
- `post_auth_wechat_content_security_text`：POST /api/auth/wechat/content-security/text；外部前提候选：真实微信内容安全授权配置
- `post_auth_wechat_login`：POST /api/auth/wechat/login（excluded，使用原协议）
- `post_auth_wechat_rebind_scene`：POST /api/auth/wechat/rebind-scene
- `post_auth_wechat_web_login_confirm`：POST /api/auth/wechat/web-login-confirm（excluded，使用原协议）
- `post_auth_wechat_web_login_session`：POST /api/auth/wechat/web-login-session（excluded，使用原协议）
- `post_auth_wechat_website_oauth_url`：POST /api/auth/wechat/website-oauth-url（excluded，使用原协议）
- `post_auth_wecom_bind`：POST /api/auth/wecom/bind；外部前提候选：真实企业微信绑定授权
- `post_auth_wecom_login`：POST /api/auth/wecom/login（excluded，使用原协议）
- `post_system_mini_program`：POST /api/system/mini-program
- `put_auth_update_avatar`：PUT /api/auth/update-avatar

验收情景编号：`capability:mini`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

本人OAuth与凭证生命周期见[原生MCP接入配方](../recipes/mcp-native.md)。

<a id="mcp"></a>
## MCP 接入与使用

自然语言任务：请按当前权限完成“MCP 接入与使用”所需操作，并回读实际结果。业务步骤：

1. 进入“系统 → MCP 接入与使用”，点击“复制地址”或“复制 MCP JSON 配置”，在支持 OAuth 的 Agent 中填入当前公司的连接地址。
2. 在 Agent 点击“去认证”，用本人网站账号登录并选择授权凭证；回到接入页检查是否为有效 OAuth，而不是等待连接、已过期或旧密钥。
3. 先读取 get_tradeflow_context，核对本人岗位、公司、scope 和契约指纹，再分页发现业务操作并读取 get_business_operation_contract 的必填字段。
4. 执行写入使用同一个稳定 operationId，先核对读取到的对象版本；删除、审批或外发先查看预览并取得对应授权。
5. 遇到 PENDING、UNKNOWN 或网络中断，查询原 operationId 的回执和业务对象；版本冲突先读取最新状态，不重新生成编号重复写入。
6. 在本页核对最近使用及权限。老板可维护授权名称与权限；本人可撤销或删除自己的授权，确认后停止访问，客户、订单与复盘历史保留。
7. 复制失败可手动选择配置文本；授权列表读取失败点击“重试”。连接成功不代表全部工具、外部平台或设备流程已经验收。

角色候选：BOSS、SALES、PACKER、ACCOUNTANT、SOCIAL_OPERATOR。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_mcp_consent_connections_by_id`：DELETE /api/mcp-consent/connections/:id（excluded，使用原协议）
- `delete_social_mcp_by_id`：DELETE /api/social/mcp/:id（excluded，使用原协议）
- `delete_system_mcp_clients_by_id`：DELETE /api/system/mcp-clients/:id
- `get_mcp_consent_by_id`：GET /api/mcp-consent/:id（excluded，使用原协议）
- `get_mcp_consent_clients`：GET /api/mcp-consent/clients（excluded，使用原协议）
- `get_mcp_consent_connections`：GET /api/mcp-consent/connections（excluded，使用原协议）
- `get_social_mcp`：GET /api/social/mcp（excluded，使用原协议）
- `get_system_agent_api_clients`：GET /api/system/agent-api-clients
- `get_system_mcp_clients`：GET /api/system/mcp-clients
- `get_system_mcp_clients_reviews`：GET /api/system/mcp-clients/reviews
- `post_mcp`：POST /api/mcp（excluded，使用原协议）
- `post_mcp_consent_by_id`：POST /api/mcp-consent/:id（excluded，使用原协议）
- `post_mcp_consent_clients`：POST /api/mcp-consent/clients（excluded，使用原协议）
- `post_mcp_consent_connections`：POST /api/mcp-consent/connections（excluded，使用原协议）
- `post_mcp_consent_connections_by_id_revoke`：POST /api/mcp-consent/connections/:id/revoke（excluded，使用原协议）
- `post_social_mcp`：POST /api/social/mcp（excluded，使用原协议）
- `post_social_mcp_by_id_by_action`：POST /api/social/mcp/:id/:action（excluded，使用原协议）
- `post_system_agent_api_clients`：POST /api/system/agent-api-clients
- `post_system_agent_api_clients_by_id_revoke`：POST /api/system/agent-api-clients/:id/revoke
- `post_system_mcp_clients`：POST /api/system/mcp-clients（deprecated，使用原协议）
- `post_system_mcp_clients_by_id_revoke`：POST /api/system/mcp-clients/:id/revoke
- `post_system_mcp_clients_by_id_rotate`：POST /api/system/mcp-clients/:id/rotate（deprecated，使用原协议）
- `post_system_mcp_clients_reviews_by_id_dismiss`：POST /api/system/mcp-clients/reviews/:id/dismiss
- `post_system_mcp_clients_reviews_by_id_resolve`：POST /api/system/mcp-clients/reviews/:id/resolve
- `put_system_mcp_clients_by_id_name`：PUT /api/system/mcp-clients/:id/name
- `put_system_mcp_clients_by_id_permissions`：PUT /api/system/mcp-clients/:id/permissions

验收情景编号：`capability:mcp`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="settings"></a>
## 全局设置

自然语言任务：请按当前权限完成“全局设置”所需操作，并回读实际结果。业务步骤：

1. 先阅读字段说明和当前值。
2. 业务默认值变更通常只影响新数据。
3. 付款、汇率和通知设置会影响多个页面。
4. 公司对外资料可分别上传 Logo 与公章；新导出的 PI、装箱单 PDF / XLSX 都读取当前设置，不再固定使用内置图片。
5. 系统已预置当前公章；点击恢复内置公章可清空自定义公章设置。演示公司使用独立的虚构 Logo 和 Demo 专用章。
6. 密钥字段留空通常表示保留既有值。
7. 回到对应业务页面检查显示与行为。
8. 高风险设置保留修改前值和回退方式。

角色候选：PLATFORM_ADMIN。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_system_company_access_requests_by_id`：DELETE /api/system/company-access-requests/:id
- `delete_system_logistics_address_presets_by_id`：DELETE /api/system/logistics-address-presets/:id
- `delete_system_mcp_clients_by_id`：DELETE /api/system/mcp-clients/:id
- `delete_system_payment_profiles_by_id_qr`：DELETE /api/system/payment-profiles/:id/qr
- `delete_system_product_update_notices`：DELETE /api/system/product-update-notices
- `delete_system_product_update_notices_by_noticeId`：DELETE /api/system/product-update-notices/:noticeId
- `delete_system_wecom_bindings_by_userId`：DELETE /api/system/wecom/bindings/:userId
- `delete_system_wecom_bots_by_key`：DELETE /api/system/wecom/bots/:key
- `get_system_agent_api_clients`：GET /api/system/agent-api-clients
- `get_system_announcement`：GET /api/system/announcement
- `get_system_categories`：GET /api/system/categories
- `get_system_company_access_requests`：GET /api/system/company-access-requests
- `get_system_company_profile`：GET /api/system/company-profile
- `get_system_jobs`：GET /api/system/jobs
- `get_system_logistics_address_presets`：GET /api/system/logistics-address-presets
- `get_system_logs_login`：GET /api/system/logs/login
- `get_system_logs_stats`：GET /api/system/logs/stats
- `get_system_mcp_clients`：GET /api/system/mcp-clients
- `get_system_mcp_clients_reviews`：GET /api/system/mcp-clients/reviews
- `get_system_mini_program`：GET /api/system/mini-program
- `get_system_order_config`：GET /api/system/order-config
- `get_system_payment_profiles`：GET /api/system/payment-profiles
- `get_system_price_adjustment_notice`：GET /api/system/price-adjustment-notice
- `get_system_product_update_notices`：GET /api/system/product-update-notices
- `get_system_settings`：GET /api/system/settings
- `get_system_settings_defaults`：GET /api/system/settings/defaults
- `get_system_table_views_by_scope`：GET /api/system/table-views/:scope
- `get_system_token`：GET /api/system/token
- `get_system_wecom`：GET /api/system/wecom
- `get_system_wecom_bindings`：GET /api/system/wecom/bindings
- `get_system_wecom_bot`：GET /api/system/wecom/bot
- `get_system_wecom_bots`：GET /api/system/wecom/bots
- `get_system_wecom_callback`：GET /api/system/wecom/callback（excluded，使用原协议）
- `get_system_wecom_cli`：GET /api/system/wecom/cli
- `get_system_wecom_join`：GET /api/system/wecom/join
- `post_system_agent_api_clients`：POST /api/system/agent-api-clients
- `post_system_agent_api_clients_by_id_revoke`：POST /api/system/agent-api-clients/:id/revoke
- `post_system_announcement`：POST /api/system/announcement
- `post_system_announcement_wecom_broadcast`：POST /api/system/announcement/wecom-broadcast；外部前提候选：外发或企业微信真实连接
- `post_system_categories`：POST /api/system/categories
- `post_system_company_access_requests`：POST /api/system/company-access-requests（excluded，使用原协议）
- `post_system_company_access_requests_by_id_demo_access`：POST /api/system/company-access-requests/:id/demo-access
- `post_system_demo_access_admin`：POST /api/system/demo-access/admin
- `post_system_demo_access_chat`：POST /api/system/demo-access/chat（excluded，使用原协议）
- `post_system_demo_access_verify`：POST /api/system/demo-access/verify（excluded，使用原协议）
- `post_system_logistics_address_presets`：POST /api/system/logistics-address-presets
- `post_system_mcp_clients`：POST /api/system/mcp-clients（deprecated，使用原协议）
- `post_system_mcp_clients_by_id_revoke`：POST /api/system/mcp-clients/:id/revoke
- `post_system_mcp_clients_by_id_rotate`：POST /api/system/mcp-clients/:id/rotate（deprecated，使用原协议）
- `post_system_mcp_clients_reviews_by_id_dismiss`：POST /api/system/mcp-clients/reviews/:id/dismiss
- `post_system_mcp_clients_reviews_by_id_resolve`：POST /api/system/mcp-clients/reviews/:id/resolve
- `post_system_mini_program`：POST /api/system/mini-program
- `post_system_notify_test`：POST /api/system/notify/test；外部前提候选：真实WxPusher通知授权配置
- `post_system_payment_profiles_by_id_qr`：POST /api/system/payment-profiles/:id/qr
- `post_system_price_adjustment_notice`：POST /api/system/price-adjustment-notice
- `post_system_pricing_mode`：POST /api/system/pricing-mode
- `post_system_settings`：POST /api/system/settings
- `post_system_token`：POST /api/system/token
- `post_system_wecom_bot_reconnect`：POST /api/system/wecom/bot/reconnect；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots`：POST /api/system/wecom/bots
- `post_system_wecom_bots_by_key_connect_cli`：POST /api/system/wecom/bots/:key/connect-cli；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_customer_service_entry`：POST /api/system/wecom/bots/:key/customer-service-entry；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_reconnect`：POST /api/system/wecom/bots/:key/reconnect；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_test_customer_service`：POST /api/system/wecom/bots/:key/test-customer-service；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_callback`：POST /api/system/wecom/callback（excluded，使用原协议）
- `post_system_wecom_callback_credentials`：POST /api/system/wecom/callback-credentials
- `post_system_wecom_cli_authorize`：POST /api/system/wecom/cli/authorize；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_cli_import`：POST /api/system/wecom/cli/import；外部前提候选：真实企业微信CLI授权文件
- `post_system_wecom_cli_test`：POST /api/system/wecom/cli/test；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_join`：POST /api/system/wecom/join
- `post_system_wecom_test`：POST /api/system/wecom/test；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_test_message`：POST /api/system/wecom/test-message；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_workbench_sync`：POST /api/system/wecom/workbench/sync；外部前提候选：外发或企业微信真实连接
- `put_system_company_access_requests_by_id`：PUT /api/system/company-access-requests/:id
- `put_system_logistics_address_presets_by_id`：PUT /api/system/logistics-address-presets/:id
- `put_system_mcp_clients_by_id_name`：PUT /api/system/mcp-clients/:id/name
- `put_system_mcp_clients_by_id_permissions`：PUT /api/system/mcp-clients/:id/permissions
- `put_system_payment_profiles`：PUT /api/system/payment-profiles
- `put_system_table_views_by_scope`：PUT /api/system/table-views/:scope
- `put_system_wecom`：PUT /api/system/wecom
- `put_system_wecom_bot`：PUT /api/system/wecom/bot
- `put_system_wecom_bots_by_key`：PUT /api/system/wecom/bots/:key
- `put_system_wecom_bots_by_key_default`：PUT /api/system/wecom/bots/:key/default
- `put_system_wecom_bots_mode`：PUT /api/system/wecom/bots/mode

验收情景编号：`capability:settings`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="users"></a>
## 用户管理

自然语言任务：请按当前权限完成“用户管理”所需操作，并回读实际结果。业务步骤：

1. 使用最小必要权限。
2. 离职用户应更新在职状态并检查绑定。
3. 老板、业务员、打包员和财务看到的页面不同。
4. 不要用管理员身份绕过业务授权。
5. 测试通知时确认目标用户。
6. 敏感操作后检查审计结果。

角色候选：BOSS。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_users_by_id`：DELETE /api/users/:id
- `delete_users_by_id_wechat_binding`：DELETE /api/users/:id/wechat-binding
- `get_users`：GET /api/users
- `get_users_email_config`：GET /api/users/email-config
- `get_users_me_exhibition_profile`：GET /api/users/me/exhibition-profile
- `post_users`：POST /api/users
- `post_users_test_email`：POST /api/users/test-email；外部前提候选：外发或企业微信真实连接
- `put_users_by_id`：PUT /api/users/:id
- `put_users_email_config`：PUT /api/users/email-config
- `put_users_me_exhibition_profile`：PUT /api/users/me/exhibition-profile

验收情景编号：`capability:users`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="personal"></a>
## 个人设置

自然语言任务：请按当前权限完成“个人设置”所需操作，并回读实际结果。业务步骤：

1. 保存后确认页面反馈。
2. 公开展示字段与内部字段要区分。
3. 确认绑定的是本人账号。
4. Alibaba 绑定会跳转官方登录页，只识别身份，不保存业务员密码或子账号 Token；店铺 Token 仍由老板统一维护。
5. 更换账号前先解除旧绑定。
6. 修改密码后重新登录验证。
7. 发现异常登录立即联系管理员。

角色候选：BOSS、SALES、PACKER、ACCOUNTANT、SOCIAL_OPERATOR。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_auth_wechat_binding`：DELETE /api/auth/wechat/binding
- `delete_auth_wecom_binding`：DELETE /api/auth/wecom/binding
- `delete_integrations_alibaba_self_bindings_by_bindingId`：DELETE /api/integrations/alibaba/self-bindings/:bindingId
- `get_auth_me`：GET /api/auth/me
- `get_auth_wechat_binding`：GET /api/auth/wechat/binding
- `get_auth_wechat_binding_session`：GET /api/auth/wechat/binding-session
- `get_auth_wechat_web_login_session_by_sessionId`：GET /api/auth/wechat/web-login-session/:sessionId（excluded，使用原协议）
- `get_auth_wechat_website_callback`：GET /api/auth/wechat/website/callback（excluded，使用原协议）
- `get_auth_wecom_binding`：GET /api/auth/wecom/binding
- `get_integrations_alibaba_self_bindings`：GET /api/integrations/alibaba/self-bindings
- `get_users_me_exhibition_profile`：GET /api/users/me/exhibition-profile
- `post_auth_change_password`：POST /api/auth/change-password
- `post_auth_demo_login`：POST /api/auth/demo/login（excluded，使用原协议）
- `post_auth_demo_personas`：POST /api/auth/demo/personas（excluded，使用原协议）
- `post_auth_forgot_password`：POST /api/auth/forgot-password（excluded，使用原协议）
- `post_auth_login`：POST /api/auth/login（excluded，使用原协议）
- `post_auth_verify_password`：POST /api/auth/verify-password
- `post_auth_wechat_bind`：POST /api/auth/wechat/bind（excluded，使用原协议）
- `post_auth_wechat_binding_scene`：POST /api/auth/wechat/binding-scene
- `post_auth_wechat_binding_session`：POST /api/auth/wechat/binding-session；外部前提候选：真实微信小程序二维码配置
- `post_auth_wechat_content_security_text`：POST /api/auth/wechat/content-security/text；外部前提候选：真实微信内容安全授权配置
- `post_auth_wechat_login`：POST /api/auth/wechat/login（excluded，使用原协议）
- `post_auth_wechat_rebind_scene`：POST /api/auth/wechat/rebind-scene
- `post_auth_wechat_web_login_confirm`：POST /api/auth/wechat/web-login-confirm（excluded，使用原协议）
- `post_auth_wechat_web_login_session`：POST /api/auth/wechat/web-login-session（excluded，使用原协议）
- `post_auth_wechat_website_oauth_url`：POST /api/auth/wechat/website-oauth-url（excluded，使用原协议）
- `post_auth_wecom_bind`：POST /api/auth/wecom/bind；外部前提候选：真实企业微信绑定授权
- `post_auth_wecom_login`：POST /api/auth/wecom/login（excluded，使用原协议）
- `post_integrations_alibaba_accounts_by_accountId_self_binding_authorization_url`：POST /api/integrations/alibaba/accounts/:accountId/self-binding/authorization-url；外部前提候选：Alibaba真实店铺授权或物流供应商
- `put_auth_update_avatar`：PUT /api/auth/update-avatar
- `put_users_me_exhibition_profile`：PUT /api/users/me/exhibition-profile

验收情景编号：`capability:personal`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="mobile-workbench"></a>
## 微信移动工作台

自然语言任务：请按当前权限完成“微信移动工作台”所需操作，并回读实际结果。业务步骤：

1. 打开当前环境的小程序，阅读并同意服务协议、隐私政策和微信隐私指引，使用本人账号登录；确认工作台姓名和岗位。
2. 从“常用功能”进入客户管理、展会客户、产品目录或订单；仓库、工资和请假入口按本人岗位显示，公开只读分享与内部身份分开。
3. 打开订单核对商品、金额和状态，使用允许的编辑、收款或打包动作；上传选择相册、拍照或微信文件后等待每个文件结果。
4. 部分上传失败保留已成功文件，只补失败图片；出现操作已保存但刷新失败时重新读取订单，不重新提交已保存动作。
5. 老板从工作台“待审批项目”核对请假/报销，员工在“我的工资”“请假与假期”读取本人记录；审批与付款分别确认。
6. 在订单详情打开“订单任务打印 / 导出”，保存图片到相册前允许微信相册权限；拒绝时进入系统设置后继续。真实打印、相机、分享和外部送达须在设备验证。

角色候选：BOSS、SALES、PACKER。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_auth_wechat_binding`：DELETE /api/auth/wechat/binding
- `delete_auth_wecom_binding`：DELETE /api/auth/wecom/binding
- `get_auth_me`：GET /api/auth/me
- `get_auth_wechat_binding`：GET /api/auth/wechat/binding
- `get_auth_wechat_binding_session`：GET /api/auth/wechat/binding-session
- `get_auth_wechat_web_login_session_by_sessionId`：GET /api/auth/wechat/web-login-session/:sessionId（excluded，使用原协议）
- `get_auth_wechat_website_callback`：GET /api/auth/wechat/website/callback（excluded，使用原协议）
- `get_auth_wecom_binding`：GET /api/auth/wecom/binding
- `get_system_mini_program`：GET /api/system/mini-program
- `post_auth_wechat_bind`：POST /api/auth/wechat/bind（excluded，使用原协议）
- `post_auth_wechat_binding_scene`：POST /api/auth/wechat/binding-scene
- `post_auth_wechat_binding_session`：POST /api/auth/wechat/binding-session；外部前提候选：真实微信小程序二维码配置
- `post_auth_wechat_content_security_text`：POST /api/auth/wechat/content-security/text；外部前提候选：真实微信内容安全授权配置
- `post_auth_wechat_login`：POST /api/auth/wechat/login（excluded，使用原协议）
- `post_auth_wechat_rebind_scene`：POST /api/auth/wechat/rebind-scene
- `post_auth_wechat_web_login_confirm`：POST /api/auth/wechat/web-login-confirm（excluded，使用原协议）
- `post_auth_wechat_web_login_session`：POST /api/auth/wechat/web-login-session（excluded，使用原协议）
- `post_auth_wechat_website_oauth_url`：POST /api/auth/wechat/website-oauth-url（excluded，使用原协议）
- `post_auth_wecom_bind`：POST /api/auth/wecom/bind；外部前提候选：真实企业微信绑定授权
- `post_auth_wecom_login`：POST /api/auth/wecom/login（excluded，使用原协议）
- `post_system_mini_program`：POST /api/system/mini-program
- `put_auth_update_avatar`：PUT /api/auth/update-avatar

验收情景编号：`capability:mobile-workbench`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="demo-workspace"></a>
## 隔离体验工作区

自然语言任务：请按当前权限完成“隔离体验工作区”所需操作，并回读实际结果。业务步骤：

1. 从官网体验入口申请访问码，在演示登录页输入“演示访问码”并点击“验证”；访问码不能用于正式公司登录。
2. 验证成功后查看有效期并在“选择体验身份”中选岗位，进入标注的独立演示实例；修改码后需重新验证再选身份。
3. 使用明确标注的虚构客户、产品、订单和样本文件体验流程，先核对岗位范围及当前数据，不使用真实客户或付款资料。
4. 报价和单据按样本实际USD/RMB币种选择匹配收款账户；录入前核对商品金额、运费与合计。
5. 演示模式限制外部授权、消息发送和付费模型；配置未接通时保留未配置/未验提示，不把虚构回执当成生产事实。
6. 验证码失效或验证失败按页面错误重新申请，选择身份失败先重新验证；退出后回到正确公司入口，演示资料与正式公司数据独立。

角色候选：PUBLIC。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_system_company_access_requests_by_id`：DELETE /api/system/company-access-requests/:id
- `get_system_company_access_requests`：GET /api/system/company-access-requests
- `post_auth_demo_login`：POST /api/auth/demo/login（excluded，使用原协议）
- `post_auth_demo_personas`：POST /api/auth/demo/personas（excluded，使用原协议）
- `post_system_company_access_requests`：POST /api/system/company-access-requests（excluded，使用原协议）
- `post_system_company_access_requests_by_id_demo_access`：POST /api/system/company-access-requests/:id/demo-access
- `post_system_demo_access_admin`：POST /api/system/demo-access/admin
- `post_system_demo_access_chat`：POST /api/system/demo-access/chat（excluded，使用原协议）
- `post_system_demo_access_verify`：POST /api/system/demo-access/verify（excluded，使用原协议）
- `put_system_company_access_requests_by_id`：PUT /api/system/company-access-requests/:id

验收情景编号：`capability:demo-workspace`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

企微配置、原生回调及未连接边界见[企业微信操作配方](../recipes/wecom.md)。

<a id="wecom-robot"></a>
## 企业微信业务机器人

自然语言任务：请按当前权限完成“企业微信业务机器人”所需操作，并回读实际结果。业务步骤：

1. 管理员进入“企业微信 → 机器人与客服渠道”，选择单机器人、多机器人或对应BotID渠道，核对名称、启用状态与当前连接。
2. 在现有渠道填写所需受保护配置并保存；Secret留空保持已有值，显式清除会停用连接，不公开机器人凭据。
3. 使用“重新连接”或“测试连接”核对机器人接入；需要消息与文档能力时在同一BotID渠道点击“连接办公能力/重新连接办公能力”，按官方流程确认，不另建替代机器人。
4. 员工在个人设置确认本人企业微信绑定，管理员核对成员与在职状态；机器人查询权限不能超过绑定用户，群聊仍按渠道限制处理。
5. 向机器人提出带订单号、客户或库存产品的具体问题，检查引用及允许访问的文件；知识库的“记住”或文件内容不能替代原业务事实。
6. 业务写入或文件外发先核对预览、对象与实际回执；连接/办公能力失败按当前渠道错误重新核对，配置截图不证明问答、文件递送或外发已通过。

角色候选：PLATFORM_ADMIN。前置对象：five-roles、platform-admin、company-settings、pending-demo-request、binding-session、oauth-client、credential、empty-wecom-config；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_auth_wecom_binding`：DELETE /api/auth/wecom/binding
- `delete_system_wecom_bindings_by_userId`：DELETE /api/system/wecom/bindings/:userId
- `delete_system_wecom_bots_by_key`：DELETE /api/system/wecom/bots/:key
- `get_auth_wecom_binding`：GET /api/auth/wecom/binding
- `get_calendar_wecom_preview`：GET /api/calendar/wecom/preview
- `get_system_wecom`：GET /api/system/wecom
- `get_system_wecom_bindings`：GET /api/system/wecom/bindings
- `get_system_wecom_bot`：GET /api/system/wecom/bot
- `get_system_wecom_bots`：GET /api/system/wecom/bots
- `get_system_wecom_callback`：GET /api/system/wecom/callback（excluded，使用原协议）
- `get_system_wecom_cli`：GET /api/system/wecom/cli
- `get_system_wecom_join`：GET /api/system/wecom/join
- `post_auth_wecom_bind`：POST /api/auth/wecom/bind；外部前提候选：真实企业微信绑定授权
- `post_auth_wecom_login`：POST /api/auth/wecom/login（excluded，使用原协议）
- `post_calendar_wecom_export`：POST /api/calendar/wecom/export；外部前提候选：外发或企业微信真实连接
- `post_calendar_wecom_import`：POST /api/calendar/wecom/import；外部前提候选：外发或企业微信真实连接
- `post_system_announcement_wecom_broadcast`：POST /api/system/announcement/wecom-broadcast；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bot_reconnect`：POST /api/system/wecom/bot/reconnect；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots`：POST /api/system/wecom/bots
- `post_system_wecom_bots_by_key_connect_cli`：POST /api/system/wecom/bots/:key/connect-cli；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_customer_service_entry`：POST /api/system/wecom/bots/:key/customer-service-entry；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_reconnect`：POST /api/system/wecom/bots/:key/reconnect；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_bots_by_key_test_customer_service`：POST /api/system/wecom/bots/:key/test-customer-service；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_callback`：POST /api/system/wecom/callback（excluded，使用原协议）
- `post_system_wecom_callback_credentials`：POST /api/system/wecom/callback-credentials
- `post_system_wecom_cli_authorize`：POST /api/system/wecom/cli/authorize；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_cli_import`：POST /api/system/wecom/cli/import；外部前提候选：真实企业微信CLI授权文件
- `post_system_wecom_cli_test`：POST /api/system/wecom/cli/test；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_join`：POST /api/system/wecom/join
- `post_system_wecom_test`：POST /api/system/wecom/test；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_test_message`：POST /api/system/wecom/test-message；外部前提候选：外发或企业微信真实连接
- `post_system_wecom_workbench_sync`：POST /api/system/wecom/workbench/sync；外部前提候选：外发或企业微信真实连接
- `put_system_wecom`：PUT /api/system/wecom
- `put_system_wecom_bot`：PUT /api/system/wecom/bot
- `put_system_wecom_bots_by_key`：PUT /api/system/wecom/bots/:key
- `put_system_wecom_bots_by_key_default`：PUT /api/system/wecom/bots/:key/default
- `put_system_wecom_bots_mode`：PUT /api/system/wecom/bots/mode

验收情景编号：`capability:wecom-robot`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
